import React from 'react';
import { LiveMatchSnapshot, MatchBallEvent } from '../../types/cricket';
import { Radio, Users } from 'lucide-react';

interface LiveScoreHeroProps {
  snapshot: LiveMatchSnapshot;
  events: MatchBallEvent[];
}

export const LiveScoreHero: React.FC<LiveScoreHeroProps> = ({ snapshot, events }) => {
  const { battingTeam, bowlingTeam, striker, nonStriker, currentBowler, currentOverDeliveries, crr, rrr, target, runsNeeded, ballsRemaining } = snapshot;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Live Match Center</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{snapshot.tournamentName}</span>
        </div>

        {/* Team Matchup & Big Live Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-black text-amber-400">{battingTeam.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold uppercase">Batting</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white font-mono tracking-tight">
                {battingTeam.score}/{battingTeam.wickets}
              </span>
              <span className="text-xl font-bold text-slate-400">
                ({battingTeam.oversCompleted}.{battingTeam.ballsThisOver} / {snapshot.totalOvers} ov)
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-4">
              <span>CRR: <strong className="text-white">{crr}</strong></span>
              {rrr && <span>REQ: <strong className="text-rose-400">{rrr}</strong></span>}
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" /> Current Partnership
            </div>
            <div className="text-2xl font-black text-white font-mono mb-1">
              {snapshot.partnershipRuns} <span className="text-sm font-normal text-slate-400">runs ({snapshot.partnershipBalls} balls)</span>
            </div>
            <div className="text-xs text-slate-400 truncate">
              {striker.name}: {striker.runs}* • {nonStriker.name}: {nonStriker.runs}
            </div>
          </div>
        </div>

        {/* Target Chase Banner */}
        {target && (
          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-sm font-bold text-amber-300">
            {bowlingTeam.name} set a target of {target}. {battingTeam.name} needs {runsNeeded} runs from {ballsRemaining} balls.
          </div>
        )}

        {/* This Over Timeline */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-400 shrink-0">Current Over:</span>
          <div className="flex items-center gap-2 overflow-x-auto">
            {currentOverDeliveries.map((b, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
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
            ))}
          </div>
        </div>
      </div>

      {/* Batting & Bowling Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* At the crease */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">At the Crease</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-sm">{striker.name}</span>
                <span className="text-xs text-amber-400 font-mono">★</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-white text-base">{striker.runs}*</span>
                <span className="text-xs text-slate-400 ml-1">({striker.balls}b)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-750">
              <span className="font-medium text-slate-300 text-sm pl-4">{nonStriker.name}</span>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-300 text-base">{nonStriker.runs}</span>
                <span className="text-xs text-slate-400 ml-1">({nonStriker.balls}b)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Bowler */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Bowling</h4>
            <span className="text-xs text-slate-400 font-mono">
              ECON: {currentBowler.legalBalls > 0 ? (currentBowler.runsConceded / (currentBowler.legalBalls / 6)).toFixed(2) : '0.00'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-bold text-white text-base">{currentBowler.name}</span>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-lg text-white">
                <span className="text-red-400">{currentBowler.wickets}</span> - <span className="text-amber-400">{currentBowler.runsConceded}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {Math.floor(currentBowler.legalBalls / 6)}.{currentBowler.legalBalls % 6} overs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ball-by-ball Commentary Ticker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Ball-By-Ball Commentary</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {events.length === 0 ? (
            <div className="text-slate-500 text-sm text-center py-6 italic">No deliveries recorded yet.</div>
          ) : (
            [...events].reverse().map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-750 text-xs">
                <span className="font-mono font-bold px-2 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {ev.overIndex}.{ev.ballInOver}
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[11px] shrink-0 ${
                    ev.isWicket
                      ? 'bg-red-600 text-white'
                      : ev.batsmanRuns === 4
                      ? 'bg-blue-600 text-white'
                      : ev.batsmanRuns === 6
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {ev.displayBadge}
                </span>
                <div className="flex-1 text-slate-300 pt-0.5">
                  {ev.commentary}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
