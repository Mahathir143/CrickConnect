import { LiveMatchSnapshot, MatchBallEvent } from '../types/cricket';
import mqtt, { MqttClient } from 'mqtt';

const CHANNEL_NAME = 'crickconnect_sync_channel';
const STORAGE_KEY = 'crickconnect_live_snapshot';
const EVENTS_KEY = 'crickconnect_ball_events';

// Public secure WebSocket MQTT brokers (Zero setup, global cross-device real-time sync)
const BROKER_URLS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
];

export class BroadcastHub {
  private channel: BroadcastChannel | null = null;
  private mqttClient: MqttClient | null = null;
  private listeners: Array<(snapshot: LiveMatchSnapshot) => void> = [];
  private connectionListeners: Array<(status: 'CONNECTED' | 'CONNECTING' | 'OFFLINE') => void> = [];
  private currentMatchId: string = 'mt_2026_csk_vs_mi';
  private connectionStatus: 'CONNECTED' | 'CONNECTING' | 'OFFLINE' = 'CONNECTING';

  constructor() {
    // 1. Local BroadcastChannel for zero-latency same-device tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'MATCH_UPDATE') {
            this.notifyListeners(event.data.snapshot);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported', err);
      }
    }

    // 2. Local storage listener for same-device fallback
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyListeners(parsed);
          } catch (err) {
            console.error('Failed to parse storage snapshot', err);
          }
        }
      });
    }

    // 3. Connect to Cross-Device Global Cloud MQTT WebSocket Broker
    this.initMqtt();
  }

  private initMqtt(brokerIndex = 0): void {
    if (typeof window === 'undefined') return;

    const brokerUrl = BROKER_URLS[brokerIndex % BROKER_URLS.length];
    this.setConnectionStatus('CONNECTING');

    try {
      const clientId = `crick_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      
      this.mqttClient = mqtt.connect(brokerUrl, {
        clientId,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000,
      });

      this.mqttClient.on('connect', () => {
        this.setConnectionStatus('CONNECTED');
        const topic = `crickconnect/v1/match/${this.currentMatchId}`;
        this.mqttClient?.subscribe(topic, { qos: 1 });
      });

      this.mqttClient.on('message', (topic, payload) => {
        try {
          const parsed = JSON.parse(payload.toString());
          if (parsed && parsed.snapshot) {
            // Update local storage cache
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.snapshot));
              if (parsed.events) {
                localStorage.setItem(EVENTS_KEY, JSON.stringify(parsed.events));
              }
            }
            this.notifyListeners(parsed.snapshot);
          }
        } catch (err) {
          console.error('Failed to parse remote MQTT payload', err);
        }
      });

      this.mqttClient.on('error', (err) => {
        console.warn('MQTT connection error, trying next broker:', err);
        this.setConnectionStatus('OFFLINE');
      });

      this.mqttClient.on('close', () => {
        this.setConnectionStatus('OFFLINE');
      });
    } catch (err) {
      console.warn('Failed to initialize MQTT client', err);
      this.setConnectionStatus('OFFLINE');
    }
  }

  public setMatchId(matchId: string): void {
    if (this.currentMatchId === matchId) return;
    
    // Unsubscribe from previous topic
    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.unsubscribe(`crickconnect/v1/match/${this.currentMatchId}`);
    }

    this.currentMatchId = matchId;

    // Subscribe to new topic
    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.subscribe(`crickconnect/v1/match/${this.currentMatchId}`, { qos: 1 });
    }
  }

  public getMatchId(): string {
    return this.currentMatchId;
  }

  public onConnectionChange(callback: (status: 'CONNECTED' | 'CONNECTING' | 'OFFLINE') => void): () => void {
    this.connectionListeners.push(callback);
    callback(this.connectionStatus);
    return () => {
      this.connectionListeners = this.connectionListeners.filter((cb) => cb !== callback);
    };
  }

  private setConnectionStatus(status: 'CONNECTED' | 'CONNECTING' | 'OFFLINE'): void {
    this.connectionStatus = status;
    for (const listener of this.connectionListeners) {
      listener(status);
    }
  }

  public subscribe(callback: (snapshot: LiveMatchSnapshot) => void): () => void {
    this.listeners.push(callback);
    const saved = this.getLatestSnapshot();
    if (saved) {
      callback(saved);
    }
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public publish(snapshot: LiveMatchSnapshot, event?: MatchBallEvent): void {
    // 1. Save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      if (event) {
        const events = this.getBallEvents();
        events.push(event);
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      }
    }

    // 2. Broadcast on local machine tabs
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'MATCH_UPDATE',
          snapshot,
          timestamp: Date.now(),
        });
      } catch (e) {
        console.warn('Local broadcast error', e);
      }
    }

    // 3. Publish to Global Cross-Device Cloud MQTT Broker (with retain=true so new mobile clients get it immediately)
    if (this.mqttClient && this.mqttClient.connected) {
      const topic = `crickconnect/v1/match/${this.currentMatchId}`;
      const payload = JSON.stringify({
        snapshot,
        events: this.getBallEvents(),
        timestamp: Date.now(),
      });

      this.mqttClient.publish(topic, payload, { qos: 1, retain: true }, (err) => {
        if (err) console.warn('Failed to publish MQTT message', err);
      });
    }

    this.notifyListeners(snapshot);
  }

  public getLatestSnapshot(): LiveMatchSnapshot | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public getBallEvents(): MatchBallEvent[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public popLastBallEvent(): MatchBallEvent | null {
    const events = this.getBallEvents();
    if (events.length === 0) return null;
    const popped = events.pop();
    if (typeof window !== 'undefined') {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
    return popped || null;
  }

  private notifyListeners(snapshot: LiveMatchSnapshot): void {
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

export const broadcastHub = new BroadcastHub();
