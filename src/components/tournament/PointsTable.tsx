import React from 'react';
import { TournamentStanding } from '../../types/cricket';
import { Trophy } from 'lucide-react';

interface PointsTableProps {
  standings: TournamentStanding[];
}

export const PointsTable: React.FC<PointsTableProps> = ({ standings }) => {
  // Sort by points desc, then NRR desc
  const sorted = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <Trophy className="w-6 h-6 text-amber-400" />
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider">Tournament Standings & Points Table</h3>
          <p className="text-xs text-slate-400">Automated ranking with Net Run Rate (NRR) algorithm</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-bold">
              <th className="py-3 px-3">Pos</th>
              <th className="py-3 px-3">Team</th>
              <th className="py-3 px-2 text-center">P</th>
              <th className="py-3 px-2 text-center">W</th>
              <th className="py-3 px-2 text-center">L</th>
              <th className="py-3 px-2 text-center">T</th>
              <th className="py-3 px-3 text-center">PTS</th>
              <th className="py-3 px-3 text-right">NRR</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, index) => {
              const isPlayoffSpot = index < 4;
              return (
                <tr
                  key={team.teamId}
                  className={`border-b border-slate-800/60 font-semibold transition hover:bg-slate-800/40 ${
                    isPlayoffSpot ? 'bg-blue-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <span
                      className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : isPlayoffSpot
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{team.teamName}</div>
                    <div className="text-xs text-slate-400 font-mono">{team.shortCode}</div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-slate-300">{team.played}</td>
                  <td className="py-3 px-2 text-center font-mono text-emerald-400">{team.won}</td>
                  <td className="py-3 px-2 text-center font-mono text-red-400">{team.lost}</td>
                  <td className="py-3 px-2 text-center font-mono text-slate-400">{team.tied}</td>
                  <td className="py-3 px-3 text-center font-mono font-black text-amber-400 text-base">
                    {team.points}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-cyan-400">
                    {team.nrr > 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
        <span>* Top 4 teams qualify for tournament playoffs</span>
        <span className="font-mono text-[11px]">Formula: NRR = (Runs/Overs) - (Runs_Conceded/Overs_Bowled)</span>
      </div>
    </div>
  );
};
