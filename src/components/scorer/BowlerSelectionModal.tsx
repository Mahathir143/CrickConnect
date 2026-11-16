import React, { useState } from 'react';
import { LiveMatchSnapshot } from '../../types/cricket';
import { X, AlertCircle } from 'lucide-react';

interface BowlerSelectionModalProps {
  snapshot: LiveMatchSnapshot;
  onClose: () => void;
  onSelect: (bowlerName: string) => void;
}

const DEFAULT_SQUAD_BOWLERS = [
  'M. Shami',
  'J. Bumrah',
  'R. Ashwin',
  'R. Jadeja',
  'H. Pandya',
  'K. Yadav',
];

export const BowlerSelectionModal: React.FC<BowlerSelectionModalProps> = ({ snapshot, onClose, onSelect }) => {
  const [customName, setCustomName] = useState('');
  const lastBowler = snapshot.currentBowler.name;

  const handleSelect = (name: string) => {
    if (name === lastBowler) {
      alert(`Law 17.6 Violation: ${name} just bowled the previous over and cannot bowl consecutive overs!`);
      return;
    }
    onSelect(name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Select Bowler for Next Over</h3>
            <p className="text-xs text-slate-400">Previous over bowled by: <strong className="text-amber-400">{lastBowler}</strong></p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Available Bowlers (Squad):
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_SQUAD_BOWLERS.map((bowler) => {
              const isConsecutive = bowler === lastBowler;
              return (
                <button
                  key={bowler}
                  disabled={isConsecutive}
                  onClick={() => handleSelect(bowler)}
                  className={`p-3 rounded-xl border text-sm font-bold text-left transition flex items-center justify-between ${
                    isConsecutive
                      ? 'bg-slate-850 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-blue-400'
                  }`}
                >
                  <span>{bowler}</span>
                  {isConsecutive && (
                    <span title="Consecutive Over Barred">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Or Enter Other Bowler Name:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. S. Thakur"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              disabled={!customName.trim()}
              onClick={() => handleSelect(customName.trim())}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
