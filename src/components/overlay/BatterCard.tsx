import React from 'react';
import { BatterStats } from '../../types/cricket';
import { User } from 'lucide-react';

interface BatterCardProps {
  batter: BatterStats;
  visible: boolean;
}

export const BatterCard: React.FC<BatterCardProps> = ({ batter, visible }) => {
  if (!visible) return null;

  const sr = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0';

  return (
    <div className="fixed bottom-36 left-12 z-40 animate-slide-in-up">
      <div className="bg-slate-950/95 border-2 border-amber-500/80 rounded-xl p-5 shadow-[0_0_35px_rgba(245,158,11,0.3)] text-white w-80 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Batting Summary</span>
            <h3 className="text-xl font-black text-white">{batter.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Runs (Balls)</div>
            <div className="text-2xl font-black text-white font-mono">{batter.runs} <span className="text-sm text-slate-400">({batter.balls})</span></div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Strike Rate</div>
            <div className="text-2xl font-black text-amber-400 font-mono">{sr}</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Fours (4s)</div>
            <div className="text-2xl font-black text-blue-400 font-mono">{batter.fours}</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase">Sixes (6s)</div>
            <div className="text-2xl font-black text-red-400 font-mono">{batter.sixes}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
