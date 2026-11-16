import React, { useState } from 'react';
import { LiveMatchSnapshot, DismissalType } from '../../types/cricket';
import { X, ShieldAlert, Check } from 'lucide-react';

interface DismissalModalProps {
  snapshot: LiveMatchSnapshot;
  onClose: () => void;
  onSubmit: (params: {
    batsmanRuns: number;
    extraType: 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY';
    extraRuns: number;
    isWicket: boolean;
    dismissalType: DismissalType;
    dismissedPlayerId: string;
    newBatterName: string;
  }) => void;
}

export const DismissalModal: React.FC<DismissalModalProps> = ({ snapshot, onClose, onSubmit }) => {
  const [selectedMode, setSelectedMode] = useState<DismissalType>('BOWLED');
  const [dismissedId, setDismissedId] = useState<string>(snapshot.striker.id);
  const [newBatterName, setNewBatterName] = useState<string>('');

  const dismissalModes: Array<{ type: DismissalType; label: string }> = [
    { type: 'BOWLED', label: 'Bowled' },
    { type: 'CAUGHT', label: 'Caught (ICC 2022 Strike)' },
    { type: 'LBW', label: 'LBW' },
    { type: 'RUN_OUT', label: 'Run Out' },
    { type: 'STUMPED', label: 'Stumped' },
    { type: 'HIT_WICKET', label: 'Hit Wicket' },
    { type: 'RETIRED_HURT', label: 'Retired Hurt' },
    { type: 'OBSTRUCTING_FIELD', label: 'Obstructing Field' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      batsmanRuns: 0,
      extraType: 'NONE',
      extraRuns: 0,
      isWicket: true,
      dismissalType: selectedMode,
      dismissedPlayerId: dismissedId,
      newBatterName: newBatterName.trim() || `Batter #${snapshot.battingTeam.wickets + 3}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-700/80 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-red-500">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="text-xl font-black uppercase tracking-wider">Record Wicket Dismissal</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Who is Out (especially critical for Run Out) */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Dismissed Batter:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDismissedId(snapshot.striker.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  dismissedId === snapshot.striker.id
                    ? 'bg-red-950 border-red-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-xs text-red-400 font-bold uppercase">Striker</div>
                <div className="font-bold">{snapshot.striker.name}</div>
                <div className="text-xs text-slate-400">{snapshot.striker.runs} ({snapshot.striker.balls})</div>
              </button>

              <button
                type="button"
                onClick={() => setDismissedId(snapshot.nonStriker.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  dismissedId === snapshot.nonStriker.id
                    ? 'bg-red-950 border-red-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-xs text-slate-400 font-bold uppercase">Non-Striker</div>
                <div className="font-bold">{snapshot.nonStriker.name}</div>
                <div className="text-xs text-slate-400">{snapshot.nonStriker.runs} ({snapshot.nonStriker.balls})</div>
              </button>
            </div>
          </div>

          {/* Dismissal Mode Selection */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Dismissal Method:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dismissalModes.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setSelectedMode(m.type)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-between ${
                    selectedMode === m.type
                      ? 'bg-red-700 border-red-400 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  {selectedMode === m.type && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* ICC Caught Rule Notice */}
          {selectedMode === 'CAUGHT' && (
            <div className="mb-4 p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl text-xs text-blue-200">
              ⚡ <strong>ICC Rule 18.11 Notice:</strong> Under modern ICC regulations, the incoming batter will automatically take strike at the striker's end.
            </div>
          )}

          {/* Incoming Batter Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Next Batter Name (Optional):
            </label>
            <input
              type="text"
              placeholder={`Batter #${snapshot.battingTeam.wickets + 3}`}
              value={newBatterName}
              onChange={(e) => setNewBatterName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition shadow-lg"
          >
            Confirm Dismissal & Update Overlay
          </button>
        </form>
      </div>
    </div>
  );
};
