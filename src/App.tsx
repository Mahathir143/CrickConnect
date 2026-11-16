import { useState, useEffect } from 'react';
import { LiveMatchSnapshot, MatchBallEvent, Team, TournamentStanding } from './types/cricket';
import { createInitialSnapshot, applyBallEvent } from './core/cricketRules';
import { broadcastHub } from './realtime/broadcastHub';
import { LowerThirdScorebar } from './components/overlay/LowerThirdScorebar';
import { DynamicStinger } from './components/overlay/DynamicStinger';
import { BatterCard } from './components/overlay/BatterCard';
import { BowlerCard } from './components/overlay/BowlerCard';
import { ReviewGraphic } from './components/overlay/ReviewGraphic';
import { SponsorBug } from './components/overlay/SponsorBug';
import { FullScorecardModal } from './components/overlay/FullScorecardModal';
import { QuickScorePad } from './components/scorer/QuickScorePad';
import { GraphicsControlPad } from './components/director/GraphicsControlPad';
import { PublicRegistration } from './components/tournament/PublicRegistration';
import { TeamApprovalDesk } from './components/tournament/TeamApprovalDesk';
import { PointsTable } from './components/tournament/PointsTable';
import { LiveScoreHero } from './components/fan/LiveScoreHero';
import { InteractiveTestRunner } from './components/testrunner/InteractiveTestRunner';
import { Tv, ShieldCheck, Smartphone, CheckSquare, Layers, Copy, Check, Wifi, Globe } from 'lucide-react';

export function App() {
  const [snapshot, setSnapshot] = useState<LiveMatchSnapshot>(() => {
    const cached = broadcastHub.getLatestSnapshot();
    return cached || createInitialSnapshot();
  });

  const [ballEvents, setBallEvents] = useState<MatchBallEvent[]>(() => {
    return broadcastHub.getBallEvents();
  });

  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'CONNECTING' | 'OFFLINE'>('CONNECTING');
  const [activeTab, setActiveTab] = useState<'SCORER' | 'DIRECTOR' | 'TOURNAMENT' | 'FAN' | 'TESTS' | 'OVERLAY_FULL'>('SCORER');
  const [overCompletedPrompt, setOverCompletedPrompt] = useState(false);
  const [copiedOverlayLink, setCopiedOverlayLink] = useState(false);

  // Initialize demo teams
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 'tm_csk',
      name: 'Super Kings',
      shortCode: 'CSK',
      logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop&q=80',
      primaryColor: '#f59e0b',
      status: 'APPROVED',
      registrationSource: 'MANAGEMENT',
      squad: [
        { id: 'pl_01', name: 'R. Sharma', jerseyNumber: 45, role: 'BATTER', battingStyle: 'RIGHT_HAND' },
        { id: 'pl_02', name: 'V. Kohli', jerseyNumber: 18, role: 'BATTER', battingStyle: 'RIGHT_HAND' },
      ],
    },
    {
      id: 'tm_mi',
      name: 'Mumbai Champions',
      shortCode: 'MI',
      logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=128&auto=format&fit=crop&q=80',
      primaryColor: '#3b82f6',
      status: 'APPROVED',
      registrationSource: 'MANAGEMENT',
      squad: [
        { id: 'bw_01', name: 'M. Shami', jerseyNumber: 11, role: 'BOWLER', battingStyle: 'RIGHT_HAND' },
        { id: 'bw_02', name: 'J. Bumrah', jerseyNumber: 93, role: 'BOWLER', battingStyle: 'RIGHT_HAND' },
      ],
    },
    {
      id: 'tm_rcb_pending',
      name: 'Bangalore Blasters',
      shortCode: 'BLR',
      logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=128&auto=format&fit=crop&q=80',
      primaryColor: '#ef4444',
      status: 'PENDING',
      registrationSource: 'PUBLIC_LINK',
      squad: [
        { id: 'pl_blr_1', name: 'G. Maxwell', jerseyNumber: 32, role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND' },
        { id: 'pl_blr_2', name: 'M. Siraj', jerseyNumber: 73, role: 'BOWLER', battingStyle: 'RIGHT_HAND' },
      ],
    },
  ]);

  const [standings] = useState<TournamentStanding[]>([
    {
      teamId: 'tm_csk',
      teamName: 'Super Kings',
      shortCode: 'CSK',
      played: 3,
      won: 2,
      lost: 1,
      tied: 0,
      points: 4,
      runsScored: 540,
      oversFaced: 60,
      runsConceded: 510,
      oversBowled: 60,
      nrr: 0.500,
    },
    {
      teamId: 'tm_mi',
      teamName: 'Mumbai Champions',
      shortCode: 'MI',
      played: 3,
      won: 2,
      lost: 1,
      tied: 0,
      points: 4,
      runsScored: 525,
      oversFaced: 60,
      runsConceded: 512,
      oversBowled: 60,
      nrr: 0.217,
    },
  ]);

  // Check URL query parameters for overlay mode
  const isUrlOverlayMode = typeof window !== 'undefined' && window.location.search.includes('mode=overlay');

  useEffect(() => {
    // Listen for real-time broadcasts across multiple devices via MQTT WebSocket & BroadcastChannel
    const unsubscribeSync = broadcastHub.subscribe((updatedSnapshot) => {
      setSnapshot(updatedSnapshot);
      setBallEvents(broadcastHub.getBallEvents());
    });

    const unsubscribeConn = broadcastHub.onConnectionChange((status) => {
      setConnectionStatus(status);
    });

    return () => {
      unsubscribeSync();
      unsubscribeConn();
    };
  }, []);

  // Ensure 100% background transparency for OBS and stream layout views
  useEffect(() => {
    if (isUrlOverlayMode || activeTab === 'OVERLAY_FULL') {
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      document.body.style.background = 'transparent';
    } else {
      document.documentElement.style.backgroundColor = '#020617';
      document.body.style.backgroundColor = '#020617';
    }
  }, [isUrlOverlayMode, activeTab]);

  const handleRecordBall = (params: any) => {
    const { nextSnapshot, event, overCompleted } = applyBallEvent(snapshot, params);
    
    // Auto-fire animation stingers on boundaries or wickets
    if (params.batsmanRuns === 4) {
      nextSnapshot.overlayState.activeAlert = 'FOUR';
    } else if (params.batsmanRuns === 6) {
      nextSnapshot.overlayState.activeAlert = 'SIX';
    } else if (params.isWicket) {
      nextSnapshot.overlayState.activeAlert = 'WICKET';
    }

    setSnapshot(nextSnapshot);
    broadcastHub.publish(nextSnapshot, event);
    setBallEvents(broadcastHub.getBallEvents());

    if (overCompleted) {
      setOverCompletedPrompt(true);
    }
  };

  const handleUndo = () => {
    const lastEvent = broadcastHub.popLastBallEvent();
    if (!lastEvent) {
      alert('No previous deliveries in history to undo.');
      return;
    }

    const remainingEvents = broadcastHub.getBallEvents();
    let replayed = createInitialSnapshot();
    for (const ev of remainingEvents) {
      const res = applyBallEvent(replayed, {
        batsmanRuns: ev.batsmanRuns,
        extraType: ev.extraType,
        extraRuns: ev.extraRuns,
        isWicket: ev.isWicket,
        dismissalType: ev.dismissal?.type,
        dismissedPlayerId: ev.dismissal?.dismissedPlayerId,
      });
      replayed = res.nextSnapshot;
    }

    setSnapshot(replayed);
    broadcastHub.publish(replayed);
    setBallEvents(remainingEvents);
  };

  const handleSwapStrike = () => {
    const next: LiveMatchSnapshot = JSON.parse(JSON.stringify(snapshot));
    const temp = next.striker;
    next.striker = next.nonStriker;
    next.nonStriker = temp;
    setSnapshot(next);
    broadcastHub.publish(next);
  };

  const handleSelectBowler = (bowlerName: string) => {
    const next: LiveMatchSnapshot = JSON.parse(JSON.stringify(snapshot));
    next.currentBowler = {
      id: `bw_${Date.now()}`,
      name: bowlerName,
      legalBalls: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      extrasConceded: 0,
    };
    setSnapshot(next);
    broadcastHub.publish(next);
    setOverCompletedPrompt(false);
  };

  const handleUpdateOverlay = (updates: Partial<LiveMatchSnapshot['overlayState']>) => {
    const next: LiveMatchSnapshot = JSON.parse(JSON.stringify(snapshot));
    next.overlayState = { ...next.overlayState, ...updates };
    setSnapshot(next);
    broadcastHub.publish(next);
  };

  const getOverlayUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/?mode=overlay`;
  };

  const copyOverlayUrl = () => {
    const url = getOverlayUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedOverlayLink(true);
      setTimeout(() => setCopiedOverlayLink(false), 2500);
    }
  };

  // =========================================================================
  // STREAM OVERLAY VIEW: 100% Transparent Background + Docked Bottom Layout Only
  // Shows animations (FOUR, SIX, WICKET, etc.) only when triggered!
  // =========================================================================
  if (isUrlOverlayMode || activeTab === 'OVERLAY_FULL') {
    return (
      <div className="fixed inset-0 w-screen h-screen obs-transparent-root overflow-hidden select-none pointer-events-none">
        {/* Dynamic Center Animations (Only shows when alert triggered, then auto-hides) */}
        <DynamicStinger
          alertType={snapshot.overlayState.activeAlert}
          onComplete={() => handleUpdateOverlay({ activeAlert: 'NONE' })}
        />

        {/* DRS Third Umpire Graphic (Only shows when in progress or decided) */}
        <ReviewGraphic status={snapshot.overlayState.reviewBanner} />

        {/* Floating Detail Cards (Only visible if explicitly toggled in Director) */}
        {snapshot.overlayState.activeCard === 'BATTER' && (
          <BatterCard batter={snapshot.striker} visible={true} />
        )}
        {snapshot.overlayState.activeCard === 'BOWLER' && (
          <BowlerCard bowler={snapshot.currentBowler} visible={true} />
        )}
        {snapshot.overlayState.activeCard === 'FULL_SCORECARD' && (
          <FullScorecardModal
            snapshot={snapshot}
            onClose={() => handleUpdateOverlay({ activeCard: 'NONE' })}
          />
        )}

        {/* Optional Sponsor Watermark Bug */}
        <SponsorBug visible={snapshot.overlayState.sponsorBugVisible} />

        {/* Primary Bottom Scorebar (Default docked layout) */}
        <LowerThirdScorebar snapshot={snapshot} />

        {/* Exit preview button (Only when viewed inside tab preview, not when in OBS ?mode=overlay) */}
        {activeTab === 'OVERLAY_FULL' && !isUrlOverlayMode && (
          <button
            onClick={() => setActiveTab('SCORER')}
            className="fixed top-3 left-3 z-50 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg shadow-lg pointer-events-auto cursor-pointer"
          >
            ← Exit Stream Preview
          </button>
        )}
      </div>
    );
  }

  // =========================================================================
  // MASTER PORTAL UI (Scorer Desk, Graphics Director, Tournament, Fan Center)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
                CC
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  CrickConnect <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 font-bold border border-blue-500/30">PRO</span>
                </h1>
                <p className="text-[10px] text-slate-400">Live Stream Overlay & Real-Time Scoring</p>
              </div>
            </div>

            {/* Cloud Sync Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-bold">
              {connectionStatus === 'CONNECTED' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Live Cloud Synced
                  </span>
                </>
              ) : connectionStatus === 'CONNECTING' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-amber-400">Connecting Cloud...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-slate-400">Local Only</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-850 p-1 rounded-xl border border-slate-750 text-xs font-bold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('SCORER')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SCORER' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" /> Scorer Desk
            </button>

            <button
              onClick={() => setActiveTab('DIRECTOR')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'DIRECTOR' ? 'bg-cyan-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" /> Graphics Director
            </button>

            <button
              onClick={() => setActiveTab('TOURNAMENT')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'TOURNAMENT' ? 'bg-emerald-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Teams
            </button>

            <button
              onClick={() => setActiveTab('FAN')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'FAN' ? 'bg-purple-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Fan View
            </button>

            <button
              onClick={() => setActiveTab('TESTS')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'TESTS' ? 'bg-rose-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧪 Rules
            </button>

            <button
              onClick={() => setActiveTab('OVERLAY_FULL')}
              className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 border border-blue-600/60 text-blue-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Preview 100% Transparent Overlay"
            >
              <Layers className="w-3.5 h-3.5" /> Stream Overlay
            </button>
          </nav>
        </div>
      </header>

      {/* Cross-Device Mobile Setup Helper Box */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border-b border-blue-900/50 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-200 text-center sm:text-left">
            <Globe className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Stream on 2nd Mobile / OBS:</strong> Score from this device, open the overlay link on your other phone or streaming device!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <code className="text-amber-400 font-mono text-[11px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800 truncate max-w-[260px] sm:max-w-xs">
              {getOverlayUrl()}
            </code>
            <button
              onClick={copyOverlayUrl}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition flex items-center gap-1 text-[11px] shrink-0 cursor-pointer"
            >
              {copiedOverlayLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              {copiedOverlayLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'SCORER' && (
          <div className="space-y-6">
            {/* Live broadcast preview monitor strip */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <span className="text-xs uppercase text-slate-400 font-bold">On Air Live Score</span>
                  <div className="text-2xl font-black text-white font-mono">
                    {snapshot.battingTeam.shortCode}: {snapshot.battingTeam.score}/{snapshot.battingTeam.wickets}{' '}
                    <span className="text-sm text-slate-400 font-normal">
                      ({snapshot.battingTeam.oversCompleted}.{snapshot.battingTeam.ballsThisOver} ov)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-4">
                <span>Striker: <strong className="text-white">{snapshot.striker.name}</strong> ({snapshot.striker.runs}*)</span>
                <span>Bowler: <strong className="text-white">{snapshot.currentBowler.name}</strong> ({snapshot.currentBowler.wickets}/{snapshot.currentBowler.runsConceded})</span>
              </div>
            </div>

            <QuickScorePad
              snapshot={snapshot}
              onRecordBall={handleRecordBall}
              onUndo={handleUndo}
              onSwapStrike={handleSwapStrike}
              onSelectBowler={handleSelectBowler}
              overCompletedPrompt={overCompletedPrompt}
            />
          </div>
        )}

        {activeTab === 'DIRECTOR' && (
          <GraphicsControlPad
            snapshot={snapshot}
            onUpdateOverlay={handleUpdateOverlay}
          />
        )}

        {activeTab === 'TOURNAMENT' && (
          <div className="space-y-8">
            <TeamApprovalDesk
              teams={teams}
              onApproveTeam={(id) => setTeams(teams.map((t) => (t.id === id ? { ...t, status: 'APPROVED' } : t)))}
              onRejectTeam={(id) => setTeams(teams.map((t) => (t.id === id ? { ...t, status: 'REJECTED' } : t)))}
              onAddDirectTeam={(t) => setTeams([...teams, t])}
            />
            <PublicRegistration onRegisterTeam={(t) => setTeams([...teams, t])} />
            <PointsTable standings={standings} />
          </div>
        )}

        {activeTab === 'FAN' && (
          <LiveScoreHero
            snapshot={snapshot}
            events={ballEvents}
          />
        )}

        {activeTab === 'TESTS' && (
          <InteractiveTestRunner />
        )}
      </main>

      {/* Global Broadcast Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-3 bg-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Cross-Device Global Sync Engine: <strong>Active (Sub-100ms)</strong></span>
        </div>
        <div className="text-[11px] text-slate-400">
          Match Room: <strong className="text-amber-400 font-mono">mt_2026_csk_vs_mi</strong> • Global MQTT over WSS
        </div>
      </footer>
    </div>
  );
}

export default App;
