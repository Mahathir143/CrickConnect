import React from 'react';
import { BowlerStats } from '../../types/cricket';
import { Target } from 'lucide-react';

interface BowlerCardProps {
  bowler: BowlerStats;
  visible: boolean;
}

export const BowlerCard: React.FC<BowlerCardProps> = ({ bowler, visible }) => {
  if (!visible) return null;

  const overs = `${Math.floor(bowler.legalBalls / 6)}.${bowler.legalBalls % 6}`;
  const econ = bowler.legalBalls > 0 ? ((bowler.runsConceded / (bowler.legalBalls / 6))).toFixed(2) : '0.00';

  return (
    <div className="fixed bottom-36 right-12 z-40 animate-slide-in-up">
      <div className="bg-slate-950/95 border-2 border-cyan-500/80 rounded-xl p-5 shadow-[0_0_35px_rgba(6,182,212,0.3)] text-white w-80 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Bowling Figures</span>
            <h3 className="text-xl font-black text-white">{bowler.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Overs Bowled</div>
            <div className="text-2xl font-black text-white font-mono">{overs}</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Wickets</div>
            <div className="text-2xl font-black text-red-400 font-mono">{bowler.wickets}</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Runs Conceded</div>
            <div className="text-2xl font-black text-amber-400 font-mono">{bowler.runsConceded}</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Economy Rate</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">{econ}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
