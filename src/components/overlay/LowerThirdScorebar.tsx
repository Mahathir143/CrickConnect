import React from 'react';
import { LiveMatchSnapshot, OverlayTheme } from '../../types/cricket';
import { Radio } from 'lucide-react';

interface LowerThirdProps {
  snapshot: LiveMatchSnapshot;
}

export const LowerThirdScorebar: React.FC<LowerThirdProps> = ({ snapshot }) => {
  const { battingTeam, bowlingTeam, striker, nonStriker, currentBowler, currentOverDeliveries, isFreeHit, overlayState, crr, rrr, target, runsNeeded, ballsRemaining } = snapshot;

  if (!overlayState.isLowerThirdVisible) {
    return null;
  }

  const themeClasses: Record<OverlayTheme, { bg: string; border: string; accent: string; highlight: string }> = {
    neon: {
      bg: 'bg-slate-950/95 backdrop-blur-md',
      border: 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      accent: 'text-amber-400',
      highlight: 'bg-amber-500 text-slate-950',
    },
    sky: {
      bg: 'bg-slate-900/95 backdrop-blur-md',
      border: 'border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      accent: 'text-cyan-400',
      highlight: 'bg-cyan-500 text-slate-950',
    },
    retro: {
      bg: 'bg-emerald-950/95 backdrop-blur-md',
      border: 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      accent: 'text-emerald-400',
      highlight: 'bg-emerald-500 text-slate-950',
    },
  };

  const currentTheme = themeClasses[overlayState.theme] || themeClasses.neon;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1450px] z-50 select-none animate-slide-in-up font-sans">
      {/* Free Hit Banner Alert */}
      {isFreeHit && (
        <div className="w-fit mx-auto mb-1 px-6 py-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-widest rounded-t-lg shadow-lg animate-pulse-glow flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          ⚡ FREE HIT ACTIVE ⚡
        </div>
      )}

      {/* Main Scorebar Container */}
      <div className={`rounded-xl border ${currentTheme.border} ${currentTheme.bg} text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch`}>
        
        {/* Section 1: Batting Team & Big Score */}
        <div className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-black/80 to-black/40 border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800 flex items-center justify-center shrink-0">
            {battingTeam.logoUrl ? (
              <img src={battingTeam.logoUrl} alt={battingTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-lg">{battingTeam.shortCode}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-wider">{battingTeam.shortCode}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold uppercase">Batting</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tight">{battingTeam.score}/{battingTeam.wickets}</span>
              <span className="text-lg font-bold text-slate-400">
                ({battingTeam.oversCompleted}.{battingTeam.ballsThisOver} ov)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Striker & Non-Striker */}
        <div className="flex-1 flex flex-col justify-center px-6 py-2 border-b md:border-b-0 md:border-r border-slate-800/80">
          {/* Striker */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" title="On Strike" />
              <span className="font-bold text-base text-white">{striker.name}</span>
              <span className="text-xs text-amber-400 font-mono">★</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-lg text-white font-mono">{striker.runs}*</span>
              <span className="text-xs text-slate-400 font-mono">({striker.balls}b, {striker.fours}x4, {striker.sixes}x6)</span>
            </div>
          </div>

          {/* Non-Striker */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 pl-4">
              <span className="font-semibold text-sm text-slate-300">{nonStriker.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-base text-slate-300 font-mono">{nonStriker.runs}</span>
              <span className="text-xs text-slate-400 font-mono">({nonStriker.balls}b, {nonStriker.fours}x4, {nonStriker.sixes}x6)</span>
            </div>
          </div>
        </div>

        {/* Section 3: Current Bowler Figures */}
        <div className="flex-1 flex flex-col justify-center px-6 py-2 border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              Bowler: <strong className="text-white ml-1 text-sm">{currentBowler.name}</strong>
            </span>
            <span>ECON: {currentBowler.legalBalls > 0 ? ((currentBowler.runsConceded / (currentBowler.legalBalls / 6))).toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-300">
              {Math.floor(currentBowler.legalBalls / 6)}.{currentBowler.legalBalls % 6} overs
            </span>
            <span className="font-mono font-bold text-lg text-white">
              <span className="text-red-400">{currentBowler.wickets}</span> - <span className="text-amber-400">{currentBowler.runsConceded}</span>
              <span className="text-xs text-slate-400 ml-1">({currentBowler.maidens}M)</span>
            </span>
          </div>
        </div>

        {/* Section 4: This Over Deliveries & Rates */}
        <div className="px-6 py-2 flex flex-col justify-center bg-black/40 min-w-[260px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Over</span>
            <span className="text-xs font-mono text-slate-300">
              CRR: <strong className={currentTheme.accent}>{crr}</strong>
              {rrr && <span className="ml-2 text-rose-400">REQ: <strong>{rrr}</strong></span>}
            </span>
          </div>

          {/* Ball-by-ball pill dots */}
          <div className="flex items-center gap-1.5">
            {currentOverDeliveries.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Starting new over...</span>
            ) : (
              currentOverDeliveries.map((ball, idx) => {
                let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                if (ball.isWicket) {
                  badgeColor = 'bg-red-600 text-white border-red-400 font-black animate-bounce';
                } else if (ball.badge === '4') {
                  badgeColor = 'bg-blue-600 text-white border-blue-400 font-bold';
                } else if (ball.badge === '6') {
                  badgeColor = 'bg-amber-500 text-slate-950 border-amber-300 font-black';
                } else if (ball.isExtra) {
                  badgeColor = 'bg-purple-700 text-purple-100 border-purple-500 text-[11px]';
                }

                return (
                  <span
                    key={idx}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border shadow-sm ${badgeColor}`}
                  >
                    {ball.badge}
                  </span>
                );
              })
            )}
          </div>

          {/* 2nd Innings Target Banner if applicable */}
          {target && runsNeeded !== undefined && ballsRemaining !== undefined && (
            <div className="text-[11px] font-semibold text-amber-300/90 mt-1 truncate">
              Target {target} • Need {runsNeeded} off {ballsRemaining}b
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
