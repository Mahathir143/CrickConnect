import React from 'react';
import { LiveMatchSnapshot, OverlayTheme } from '../../types/cricket';
import { Radio } from 'lucide-react';

interface LowerThirdProps {
  snapshot: LiveMatchSnapshot;
}

export const LowerThirdScorebar: React.FC<LowerThirdProps> = ({ snapshot }) => {
  const { battingTeam, striker, nonStriker, currentBowler, currentOverDeliveries, isFreeHit, overlayState, crr, rrr, target, runsNeeded, ballsRemaining } = snapshot;

  const isEnabled = overlayState.isBottomScorebarEnabled ?? overlayState.isLowerThirdVisible ?? true;
  if (!isEnabled) {
    return null;
  }

  const themeClasses: Record<OverlayTheme, { bg: string; border: string; accent: string; highlight: string }> = {
    neon: {
      bg: 'bg-slate-950/95 backdrop-blur-md',
      border: 'border-amber-500/40 shadow-[0_-5px_25px_rgba(245,158,11,0.2)]',
      accent: 'text-amber-400',
      highlight: 'bg-amber-500 text-slate-950',
    },
    sky: {
      bg: 'bg-slate-900/95 backdrop-blur-md',
      border: 'border-cyan-500/40 shadow-[0_-5px_25px_rgba(6,182,212,0.2)]',
      accent: 'text-cyan-400',
      highlight: 'bg-cyan-500 text-slate-950',
    },
    retro: {
      bg: 'bg-emerald-950/95 backdrop-blur-md',
      border: 'border-emerald-500/40 shadow-[0_-5px_25px_rgba(16,185,129,0.2)]',
      accent: 'text-emerald-400',
      highlight: 'bg-emerald-500 text-slate-950',
    },
  };

  const currentTheme = themeClasses[overlayState.theme] || themeClasses.neon;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-40 select-none font-sans pointer-events-none">
      {/* Free Hit Mini Indicator (floats just above the bottom scorebar) */}
      {isFreeHit && (
        <div className="w-fit mx-auto mb-1 px-4 py-0.5 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-t-md shadow-lg animate-pulse-glow flex items-center gap-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          ⚡ FREE HIT ⚡
        </div>
      )}

      {/* ========================================================
          MOBILE / COMPACT VIEW (hidden on md and larger screens)
          Takes only ~60px at the bottom edge, leaving full video free!
          ======================================================== */}
      <div className={`md:hidden w-full border-t ${currentTheme.border} ${currentTheme.bg} text-white px-3 py-1.5 pointer-events-auto`}>
        {/* Row 1: Core Score, Striker, Bowler, CRR */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Team & Score */}
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="font-black text-sm text-white tracking-wider">{battingTeam.shortCode}</span>
            <span className="font-mono font-black text-base text-amber-400">{battingTeam.score}/{battingTeam.wickets}</span>
            <span className="text-[10px] text-slate-400 font-bold">({battingTeam.oversCompleted}.{battingTeam.ballsThisOver})</span>
          </div>

          {/* Active Striker */}
          <div className="flex items-center gap-1 truncate text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-white truncate max-w-[80px]">{striker.name}</span>
            <span className="font-mono font-bold text-amber-300">{striker.runs}*</span>
          </div>

          {/* Bowler figures */}
          <div className="flex items-center gap-1 text-[11px] shrink-0 text-slate-300">
            <span className="text-slate-400 truncate max-w-[70px]">{currentBowler.name}:</span>
            <span className="font-mono font-bold text-white">{currentBowler.wickets}/{currentBowler.runsConceded}</span>
          </div>
        </div>

        {/* Row 2: Over Dots & Rates */}
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-semibold uppercase text-[9px] mr-1">Ov:</span>
            {currentOverDeliveries.length === 0 ? (
              <span className="text-slate-500 italic">New over</span>
            ) : (
              currentOverDeliveries.map((b, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] border ${
                    b.isWicket
                      ? 'bg-red-600 text-white border-red-400'
                      : b.badge === '4'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : b.badge === '6'
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {b.badge}
                </span>
              ))
            )}
          </div>

          <div className="font-mono text-slate-400 text-[10px]">
            CRR: <strong className="text-white">{crr}</strong>
            {rrr && <span className="ml-1 text-rose-400">REQ: <strong>{rrr}</strong></span>}
          </div>
        </div>
      </div>

      {/* ========================================================
          DESKTOP / BROADCAST 1080p VIEW (shown on md screens and up)
          Sleek horizontal dock spanning the bottom edge
          ======================================================== */}
      <div className={`hidden md:flex w-full border-t ${currentTheme.border} ${currentTheme.bg} text-white shadow-2xl items-center justify-between px-6 py-2.5 pointer-events-auto`}>
        
        {/* Section 1: Batting Team & Big Score */}
        <div className="flex items-center gap-3.5 pr-6 border-r border-slate-800 shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center shrink-0">
            {battingTeam.logoUrl ? (
              <img src={battingTeam.logoUrl} alt={battingTeam.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-sm">{battingTeam.shortCode}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wider text-white">{battingTeam.shortCode}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold uppercase">Batting</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">{battingTeam.score}/{battingTeam.wickets}</span>
              <span className="text-sm font-bold text-slate-400">
                ({battingTeam.oversCompleted}.{battingTeam.ballsThisOver} ov)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Striker & Non-Striker */}
        <div className="flex-1 px-6 border-r border-slate-800/80 flex flex-col justify-center">
          {/* Striker */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-bold text-sm text-white">{striker.name}</span>
              <span className="text-xs text-amber-400 font-mono">★</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-black text-sm text-white">{striker.runs}*</span>
              <span className="text-slate-400">({striker.balls}b, {striker.fours}x4, {striker.sixes}x6)</span>
            </div>
          </div>

          {/* Non-Striker */}
          <div className="flex items-center justify-between py-0.5 text-xs text-slate-300">
            <span className="font-medium pl-3.5 text-slate-400">{nonStriker.name}</span>
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-slate-300">{nonStriker.runs}</span>
              <span className="text-slate-400">({nonStriker.balls}b)</span>
            </div>
          </div>
        </div>

        {/* Section 3: Bowler Figures */}
        <div className="px-6 border-r border-slate-800/80 flex flex-col justify-center shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-semibold mb-0.5">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Bowler:</span>
            <strong className="text-white text-xs">{currentBowler.name}</strong>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              {Math.floor(currentBowler.legalBalls / 6)}.{currentBowler.legalBalls % 6} ov
            </span>
            <span className="font-mono font-bold text-sm text-white">
              <span className="text-red-400">{currentBowler.wickets}</span> - <span className="text-amber-400">{currentBowler.runsConceded}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              (ECON {currentBowler.legalBalls > 0 ? (currentBowler.runsConceded / (currentBowler.legalBalls / 6)).toFixed(1) : '0.0'})
            </span>
          </div>
        </div>

        {/* Section 4: This Over Deliveries & Rates */}
        <div className="pl-6 flex flex-col justify-center shrink-0 min-w-[210px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">This Over</span>
            <span className="text-[11px] font-mono text-slate-300">
              CRR: <strong className={currentTheme.accent}>{crr}</strong>
              {rrr && <span className="ml-1.5 text-rose-400">REQ: <strong>{rrr}</strong></span>}
            </span>
          </div>

          {/* Ball pills */}
          <div className="flex items-center gap-1">
            {currentOverDeliveries.length === 0 ? (
              <span className="text-xs text-slate-500 italic">New over...</span>
            ) : (
              currentOverDeliveries.map((ball, idx) => (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono border shadow-sm ${
                    ball.isWicket
                      ? 'bg-red-600 text-white border-red-400 font-bold'
                      : ball.badge === '4'
                      ? 'bg-blue-600 text-white border-blue-400 font-bold'
                      : ball.badge === '6'
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {ball.badge}
                </span>
              ))
            )}
          </div>

          {target && runsNeeded !== undefined && ballsRemaining !== undefined && (
            <div className="text-[10px] font-semibold text-amber-300/90 mt-0.5">
              Need {runsNeeded} off {ballsRemaining}b
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
