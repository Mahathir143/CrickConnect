import { LiveMatchSnapshot, MatchBallEvent } from '../types/cricket';

const CHANNEL_NAME = 'crickconnect_sync_channel';
const STORAGE_KEY = 'crickconnect_live_snapshot';
const EVENTS_KEY = 'crickconnect_ball_events';

export class BroadcastHub {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<(snapshot: LiveMatchSnapshot) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'MATCH_UPDATE') {
            this.notifyListeners(event.data.snapshot);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported in this context, falling back to storage events', err);
      }
    }

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
  }

  public subscribe(callback: (snapshot: LiveMatchSnapshot) => void): () => void {
    this.listeners.push(callback);
    // Provide initial state if in localStorage
    const saved = this.getLatestSnapshot();
    if (saved) {
      callback(saved);
    }
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public publish(snapshot: LiveMatchSnapshot, event?: MatchBallEvent): void {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      if (event) {
        const events = this.getBallEvents();
        events.push(event);
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      }
    }

    // Broadcast across windows
    if (this.channel) {
      this.channel.postMessage({
        type: 'MATCH_UPDATE',
        snapshot,
        timestamp: Date.now(),
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
