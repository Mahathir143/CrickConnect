import React, { useState } from 'react';
import { LiveMatchSnapshot } from '../../types/cricket';
import { RotateCcw, AlertTriangle, ArrowLeftRight, ShieldAlert, Sparkles } from 'lucide-react';
import { ExtrasModal } from './ExtrasModal';
import { DismissalModal } from './DismissalModal';
import { BowlerSelectionModal } from './BowlerSelectionModal';

interface QuickScorePadProps {
  snapshot: LiveMatchSnapshot;
  onRecordBall: (params: {
    batsmanRuns: number;
    extraType: 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY';
    extraRuns: number;
    isWicket: boolean;
    dismissalType?: any;
    dismissedPlayerId?: string;
    newBatterName?: string;
  }) => void;
  onUndo: () => void;
  onSwapStrike: () => void;
  onSelectBowler: (bowlerName: string) => void;
  overCompletedPrompt: boolean;
}

export const QuickScorePad: React.FC<QuickScorePadProps> = ({
  snapshot,
  onRecordBall,
  onUndo,
  onSwapStrike,
  onSelectBowler,
  overCompletedPrompt,
}) => {
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showDismissalModal, setShowDismissalModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);

  const handleRunClick = (runs: number) => {
    onRecordBall({
      batsmanRuns: runs,
      extraType: 'NONE',
      extraRuns: 0,
      isWicket: false,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Match Scorer Desk</span>
          {snapshot.isFreeHit && (
            <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Free Hit
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwapStrike}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition"
            title="Swap Striker and Non-Striker ends"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" /> Swap Strike
          </button>
          <button
            onClick={onUndo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold rounded-lg transition"
            title="Rollback last ball"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" /> Undo
          </button>
        </div>
      </div>

      {/* Primary Ball Scoring Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {[0, 1, 2, 3, 4, 6].map((run) => {
          let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700';
          if (run === 4) btnStyle = 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
          if (run === 6) btnStyle = 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-black';

          return (
            <button
              key={run}
              onClick={() => handleRunClick(run)}
              className={`h-20 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 cursor-pointer ${btnStyle}`}
            >
              <span className="text-3xl font-black font-mono">{run}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80">
                {run === 0 ? 'Dot Ball' : run === 4 ? 'Boundary' : run === 6 ? 'Maximum' : `${run} Run${run > 1 ? 's' : ''}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Special Buttons: Extras, Dismissal, Next Bowler */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setShowExtrasModal(true)}
          className="h-14 bg-purple-950/70 hover:bg-purple-900 border border-purple-600/60 text-purple-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 text-purple-400" />
          Extras (Wd, Nb, B, Lb)
        </button>

        <button
          onClick={() => setShowDismissalModal(true)}
          className="h-14 bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-200 font-black text-sm rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <ShieldAlert className="w-5 h-5 text-red-400" />
          OUT / Wicket
        </button>

        <button
          onClick={() => setShowBowlerModal(true)}
          className="h-14 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
        >
          Change Bowler
        </button>
      </div>

      {/* Extras Modal */}
      {showExtrasModal && (
        <ExtrasModal
          onClose={() => setShowExtrasModal(false)}
          onSubmit={(params) => {
            onRecordBall(params);
            setShowExtrasModal(false);
          }}
        />
      )}

      {/* Dismissal Modal */}
      {showDismissalModal && (
        <DismissalModal
          snapshot={snapshot}
          onClose={() => setShowDismissalModal(false)}
          onSubmit={(params) => {
            onRecordBall(params);
            setShowDismissalModal(false);
          }}
        />
      )}

      {/* Bowler Selection Modal */}
      {(showBowlerModal || overCompletedPrompt) && (
        <BowlerSelectionModal
          snapshot={snapshot}
          onClose={() => setShowBowlerModal(false)}
          onSelect={(name) => {
            onSelectBowler(name);
            setShowBowlerModal(false);
          }}
        />
      )}
    </div>
  );
};
