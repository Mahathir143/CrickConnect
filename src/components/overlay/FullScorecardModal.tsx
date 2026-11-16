import React from 'react';
import { LiveMatchSnapshot } from '../../types/cricket';
import { X, Trophy } from 'lucide-react';

interface FullScorecardModalProps {
  snapshot: LiveMatchSnapshot;
  onClose: () => void;
}

export const FullScorecardModal: React.FC<FullScorecardModalProps> = ({ snapshot, onClose }) => {
  const { battingTeam, striker, nonStriker, currentBowler } = snapshot;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-slide-in-up">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl w-full max-w-4xl p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <Trophy className="w-8 h-8 text-amber-400" />
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">{snapshot.tournamentName}</span>
            <h2 className="text-2xl font-black">{battingTeam.name} - Innings Scorecard</h2>
          </div>
          <div className="ml-auto text-right pr-12">
            <div className="text-3xl font-black text-white">{battingTeam.score}/{battingTeam.wickets}</div>
            <div className="text-xs text-slate-400 font-mono">({battingTeam.oversCompleted}.{battingTeam.ballsThisOver} ov, CRR: {snapshot.crr})</div>
          </div>
        </div>

        {/* Batting Card */}
        <div className="mb-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Batters</h4>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs">
                <th className="py-2">Batter</th>
                <th className="text-right">R</th>
                <th className="text-right">B</th>
                <th className="text-right">4s</th>
                <th className="text-right">6s</th>
                <th className="text-right">SR</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/60 font-semibold">
                <td className="py-2 text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono">★</span> {striker.name} (striker)
                </td>
                <td className="text-right font-mono text-white font-bold">{striker.runs}</td>
                <td className="text-right font-mono text-slate-400">{striker.balls}</td>
                <td className="text-right font-mono text-blue-400">{striker.fours}</td>
                <td className="text-right font-mono text-red-400">{striker.sixes}</td>
                <td className="text-right font-mono text-amber-400">
                  {striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.0'}
                </td>
              </tr>
              <tr className="border-b border-slate-800/60 font-semibold">
                <td className="py-2 text-slate-300">
                  {nonStriker.name} (non-striker)
                </td>
                <td className="text-right font-mono text-white font-bold">{nonStriker.runs}</td>
                <td className="text-right font-mono text-slate-400">{nonStriker.balls}</td>
                <td className="text-right font-mono text-blue-400">{nonStriker.fours}</td>
                <td className="text-right font-mono text-red-400">{nonStriker.sixes}</td>
                <td className="text-right font-mono text-amber-400">
                  {nonStriker.balls > 0 ? ((nonStriker.runs / nonStriker.balls) * 100).toFixed(1) : '0.0'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Current Bowler figures */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Current Bowling</h4>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs">
                <th className="py-2">Bowler</th>
                <th className="text-right">O</th>
                <th className="text-right">M</th>
                <th className="text-right">R</th>
                <th className="text-right">W</th>
                <th className="text-right">ECON</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/60 font-semibold">
                <td className="py-2 text-white">{currentBowler.name}</td>
                <td className="text-right font-mono text-slate-300">
                  {Math.floor(currentBowler.legalBalls / 6)}.{currentBowler.legalBalls % 6}
                </td>
                <td className="text-right font-mono text-slate-400">{currentBowler.maidens}</td>
                <td className="text-right font-mono text-amber-400">{currentBowler.runsConceded}</td>
                <td className="text-right font-mono text-red-400 font-bold">{currentBowler.wickets}</td>
                <td className="text-right font-mono text-cyan-400">
                  {currentBowler.legalBalls > 0 ? (currentBowler.runsConceded / (currentBowler.legalBalls / 6)).toFixed(2) : '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
