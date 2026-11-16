import React, { useState } from 'react';
import { ExtraType } from '../../types/cricket';
import { X, Check } from 'lucide-react';

interface ExtrasModalProps {
  onClose: () => void;
  onSubmit: (params: {
    batsmanRuns: number;
    extraType: ExtraType;
    extraRuns: number;
    isWicket: boolean;
  }) => void;
}

export const ExtrasModal: React.FC<ExtrasModalProps> = ({ onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState<ExtraType>('WIDE');
  const [additionalRuns, setAdditionalRuns] = useState<number>(0);
  const [runsOffBat, setRunsOffBat] = useState<number>(0);

  const handleSubmit = () => {
    let extraRuns = 1;
    let batsmanRuns = 0;

    if (selectedType === 'WIDE') {
      // 1 base wide + additional overthrows
      extraRuns = 1 + additionalRuns;
      batsmanRuns = 0;
    } else if (selectedType === 'NO_BALL') {
      // 1 base no ball + runs off bat
      extraRuns = 1;
      batsmanRuns = runsOffBat;
    } else if (selectedType === 'BYE' || selectedType === 'LEG_BYE') {
      extraRuns = additionalRuns > 0 ? additionalRuns : 1;
      batsmanRuns = 0;
    } else if (selectedType === 'PENALTY') {
      extraRuns = 5;
      batsmanRuns = 0;
    }

    onSubmit({
      batsmanRuns,
      extraType: selectedType,
      extraRuns,
      isWicket: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-lg font-black text-purple-400 uppercase tracking-wider">Record Extras</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Extra Type Selector */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(['WIDE', 'NO_BALL', 'BYE', 'LEG_BYE', 'PENALTY'] as ExtraType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`py-3 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                selectedType === type
                  ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>{type.replace('_', ' ')}</span>
              {selectedType === type && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Dynamic Context Options */}
        {selectedType === 'WIDE' && (
          <div className="mb-5 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Additional Runs (Overthrows / Boundary on Wide):
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => setAdditionalRuns(r)}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-sm ${
                    additionalRuns === r ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  +{r}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-purple-300 font-semibold mt-2">
              Total Wide Runs: <strong>{1 + additionalRuns}</strong> (Does not consume legal ball)
            </div>
          </div>
        )}

        {selectedType === 'NO_BALL' && (
          <div className="mb-5 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Runs Scored off the Bat on No-Ball:
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 6].map((r) => (
                <button
                  key={r}
                  onClick={() => setRunsOffBat(r)}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-sm ${
                    runsOffBat === r ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-purple-300 font-semibold mt-2">
              Total Runs: <strong>{1 + runsOffBat}</strong> (1 Extra + {runsOffBat} to Batter, Triggers <strong>Free Hit</strong>)
            </div>
          </div>
        )}

        {(selectedType === 'BYE' || selectedType === 'LEG_BYE') && (
          <div className="mb-5 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Runs Completed:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => setAdditionalRuns(r)}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-sm ${
                    additionalRuns === r ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedType === 'PENALTY' && (
          <div className="mb-5 bg-purple-950/40 p-3 rounded-xl border border-purple-600/50 text-xs text-purple-200">
            Standard Penalty Award: <strong>+5 runs</strong> awarded to the batting team. (0 legal balls).
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition shadow-lg"
        >
          Confirm & Add Extra
        </button>
      </div>
    </div>
  );
};
