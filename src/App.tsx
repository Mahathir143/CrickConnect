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
import { Tv, ShieldCheck, Smartphone, CheckSquare, Layers } from 'lucide-react';

export function App() {
  const [snapshot, setSnapshot] = useState<LiveMatchSnapshot>(() => {
    const cached = broadcastHub.getLatestSnapshot();
    return cached || createInitialSnapshot();
  });

  const [ballEvents, setBallEvents] = useState<MatchBallEvent[]>(() => {
    return broadcastHub.getBallEvents();
  });

  const [activeTab, setActiveTab] = useState<'SCORER' | 'DIRECTOR' | 'TOURNAMENT' | 'FAN' | 'TESTS' | 'OVERLAY_FULL'>('SCORER');
  const [overCompletedPrompt, setOverCompletedPrompt] = useState(false);

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
      status: 'PENDING', // Pending public registration demonstration
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
    {
      teamId: 'tm_kkr',
      teamName: 'Kolkata Knights',
      shortCode: 'KKR',
      played: 3,
      won: 1,
      lost: 2,
      tied: 0,
      points: 2,
      runsScored: 490,
      oversFaced: 60,
      runsConceded: 505,
      oversBowled: 60,
      nrr: -0.250,
    },
    {
      teamId: 'tm_dc',
      teamName: 'Delhi Capitals',
      shortCode: 'DC',
      played: 3,
      won: 1,
      lost: 2,
      tied: 0,
      points: 2,
      runsScored: 470,
      oversFaced: 60,
      runsConceded: 498,
      oversBowled: 60,
      nrr: -0.467,
    },
  ]);

  // Check URL parameters: if ?mode=overlay, auto-render pure overlay for OBS Browser Source!
  const isUrlOverlayMode = typeof window !== 'undefined' && window.location.search.includes('mode=overlay');

  useEffect(() => {
    // Listen for real-time broadcasts across windows/OBS
    const unsubscribe = broadcastHub.subscribe((updatedSnapshot) => {
      setSnapshot(updatedSnapshot);
      setBallEvents(broadcastHub.getBallEvents());
    });
    return () => unsubscribe();
  }, []);

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

    // Replay remaining events from scratch to guarantee pure restoration
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

  const handleRegisterTeam = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
  };

  const handleApproveTeam = (teamId: string) => {
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, status: 'APPROVED' } : t)));
  };

  const handleRejectTeam = (teamId: string) => {
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, status: 'REJECTED' } : t)));
  };

  // Pure OBS Browser Source Mode (Transparent full HD canvas)
  if (isUrlOverlayMode || activeTab === 'OVERLAY_FULL') {
    return (
      <div className="w-screen h-screen obs-transparent-root relative overflow-hidden select-none">
        <SponsorBug visible={snapshot.overlayState.sponsorBugVisible} />
        <DynamicStinger
          alertType={snapshot.overlayState.activeAlert}
          onComplete={() => handleUpdateOverlay({ activeAlert: 'NONE' })}
        />
        <ReviewGraphic status={snapshot.overlayState.reviewBanner} />
        <BatterCard
          batter={snapshot.striker}
          visible={snapshot.overlayState.activeCard === 'BATTER'}
        />
        <BowlerCard
          bowler={snapshot.currentBowler}
          visible={snapshot.overlayState.activeCard === 'BOWLER'}
        />
        {snapshot.overlayState.activeCard === 'FULL_SCORECARD' && (
          <FullScorecardModal
            snapshot={snapshot}
            onClose={() => handleUpdateOverlay({ activeCard: 'NONE' })}
          />
        )}
        <LowerThirdScorebar snapshot={snapshot} />

        {activeTab === 'OVERLAY_FULL' && (
          <button
            onClick={() => setActiveTab('SCORER')}
            className="fixed top-4 left-4 z-50 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg shadow-lg"
          >
            ← Exit Preview Mode
          </button>
        )}
      </div>
    );
  }

  // Master Portal UI
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center font-black text-slate-950 shadow-md">
              CC
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                CrickConnect <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-400 font-bold border border-blue-500/30">PRO BROADCAST</span>
              </h1>
              <p className="text-[11px] text-slate-400">Low-Latency Streaming Overlay & Tournament Hub</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-850 p-1 rounded-xl border border-slate-750 text-xs font-bold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('SCORER')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SCORER' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" /> Scorer Desk
            </button>

            <button
              onClick={() => setActiveTab('DIRECTOR')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'DIRECTOR' ? 'bg-cyan-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" /> Graphics Director
            </button>

            <button
              onClick={() => setActiveTab('TOURNAMENT')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'TOURNAMENT' ? 'bg-emerald-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Tournament & Teams
            </button>

            <button
              onClick={() => setActiveTab('FAN')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'FAN' ? 'bg-purple-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Fan Center
            </button>

            <button
              onClick={() => setActiveTab('TESTS')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'TESTS' ? 'bg-rose-600 text-white font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧪 Rule Verification
            </button>

            <button
              onClick={() => setActiveTab('OVERLAY_FULL')}
              className="px-3.5 py-2 rounded-lg bg-blue-900/60 hover:bg-blue-800 border border-blue-600/60 text-blue-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Full 1080p Transparent Overlay for OBS"
            >
              <Layers className="w-3.5 h-3.5" /> OBS View
            </button>
          </nav>
        </div>
      </header>

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
                    <span className="text-sm text-slate-400">
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
              onApproveTeam={handleApproveTeam}
              onRejectTeam={handleRejectTeam}
              onAddDirectTeam={(t) => setTeams([...teams, t])}
            />
            <PublicRegistration onRegisterTeam={handleRegisterTeam} />
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
      <footer className="border-t border-slate-800/80 px-6 py-4 bg-slate-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Real-time Broadcast Sync Engine: <strong>Active (Sub-150ms Latency)</strong></span>
        </div>
        <div>
          OBS Browser Source URL: <code className="text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">http://localhost:5173/?mode=overlay</code>
        </div>
      </footer>
    </div>
  );
}

export default App;
