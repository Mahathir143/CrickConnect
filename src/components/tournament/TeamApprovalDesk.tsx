import React, { useState } from 'react';
import { Team } from '../../types/cricket';
import { ShieldCheck, Check, X, Users, PlusCircle } from 'lucide-react';

interface TeamApprovalDeskProps {
  teams: Team[];
  onApproveTeam: (teamId: string) => void;
  onRejectTeam: (teamId: string) => void;
  onAddDirectTeam: (team: Team) => void;
}

export const TeamApprovalDesk: React.FC<TeamApprovalDeskProps> = ({
  teams,
  onApproveTeam,
  onRejectTeam,
  onAddDirectTeam,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [directName, setDirectName] = useState('');
  const [directCode, setDirectCode] = useState('');

  const filteredTeams = teams.filter((t) => {
    if (filter === 'PENDING') return t.status === 'PENDING';
    if (filter === 'APPROVED') return t.status === 'APPROVED';
    return true;
  });

  const handleAddDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName || !directCode) return;

    const directTeam: Team = {
      id: `tm_dir_${Date.now()}`,
      name: directName,
      shortCode: directCode.toUpperCase(),
      logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop&q=80',
      primaryColor: '#10b981',
      status: 'APPROVED', // Management direct additions are auto-approved
      registrationSource: 'MANAGEMENT',
      squad: [
        { id: `pl_1`, name: 'Captain A', jerseyNumber: 1, role: 'ALL_ROUNDER', battingStyle: 'RIGHT_HAND' },
        { id: `pl_2`, name: 'Bowler B', jerseyNumber: 2, role: 'BOWLER', battingStyle: 'RIGHT_HAND' },
      ],
    };

    onAddDirectTeam(directTeam);
    setDirectName('');
    setDirectCode('');
    setShowDirectModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Dual-Approval Team Desk</h3>
            <p className="text-xs text-slate-400">Review pending public registrations and manage tournament rosters</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'PENDING', 'APPROVED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDirectModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
          >
            <PlusCircle className="w-4 h-4" /> Add Team (Auto-Approve)
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-sm">
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      team.shortCode
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{team.name}</h4>
                    <span className="text-xs font-mono text-slate-400">Code: {team.shortCode}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                    team.status === 'APPROVED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : team.status === 'PENDING'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  {team.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 mb-3 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {team.squad.length} Players
                </span>
                <span>Source: <strong className="text-slate-300">{team.registrationSource}</strong></span>
              </div>
            </div>

            {/* Action Bar for Pending Teams */}
            {team.status === 'PENDING' && (
              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/60">
                <button
                  onClick={() => onApproveTeam(team.id)}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> Approve Roster
                </button>
                <button
                  onClick={() => onRejectTeam(team.id)}
                  className="py-1.5 px-3 bg-red-900/60 hover:bg-red-800 text-red-300 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Direct Add Modal */}
      {showDirectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
            <h3 className="text-lg font-black text-emerald-400 uppercase tracking-wider mb-4">
              Add Team (Direct Auto-Approval)
            </h3>
            <form onSubmit={handleAddDirect} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Team Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kolkata Riders"
                  value={directName}
                  onChange={(e) => setDirectName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Short Code:</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="e.g. KKR"
                  value={directCode}
                  onChange={(e) => setDirectCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm uppercase font-mono"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDirectModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                >
                  Save & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
