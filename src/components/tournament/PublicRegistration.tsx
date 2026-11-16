import React, { useState } from 'react';
import { Team, Player } from '../../types/cricket';
import { Shield, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface PublicRegistrationProps {
  onRegisterTeam: (team: Team) => void;
}

export const PublicRegistration: React.FC<PublicRegistrationProps> = ({ onRegisterTeam }) => {
  const [teamName, setTeamName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [logoUrl, setLogoUrl] = useState('');
  const [players, setPlayers] = useState<Array<{ name: string; role: Player['role']; jersey: number }>>([
    { name: '', role: 'BATTER', jersey: 7 },
    { name: '', role: 'BOWLER', jersey: 99 },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const addPlayerRow = () => {
    setPlayers([...players, { name: '', role: 'ALL_ROUNDER', jersey: players.length + 1 }]);
  };

  const removePlayerRow = (idx: number) => {
    setPlayers(players.filter((_, i) => i !== idx));
  };

  const updatePlayer = (idx: number, field: string, value: any) => {
    const updated = [...players];
    (updated[idx] as any)[field] = value;
    setPlayers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !shortCode) return;

    const squad: Player[] = players
      .filter((p) => p.name.trim().length > 0)
      .map((p, idx) => ({
        id: `pl_reg_${Date.now()}_${idx}`,
        name: p.name.trim(),
        jerseyNumber: p.jersey,
        role: p.role,
        battingStyle: 'RIGHT_HAND',
      }));

    const newTeam: Team = {
      id: `tm_reg_${Date.now()}`,
      name: teamName,
      shortCode: shortCode.toUpperCase(),
      logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop&q=80',
      primaryColor,
      status: 'PENDING', // Public registrations start in PENDING state
      registrationSource: 'PUBLIC_LINK',
      squad,
    };

    onRegisterTeam(newTeam);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-white max-w-lg mx-auto shadow-2xl">
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-white mb-2">Team Registration Submitted!</h3>
        <p className="text-slate-400 text-sm mb-6">
          Your squad for <strong>{teamName}</strong> ({shortCode}) has been submitted successfully and is now in <strong>Pending Verification</strong> status. The tournament director will review and approve your roster shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setTeamName('');
            setShortCode('');
            setLogoUrl('');
          }}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
        >
          Register Another Team
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl max-w-2xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <Shield className="w-6 h-6 text-blue-400" />
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider">Public Team Registration Portal</h3>
          <p className="text-xs text-slate-400">Submit your team identity and squad for tournament approval</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Team Full Name: *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Challengers"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Short Code (3-4 Letters): *
            </label>
            <input
              type="text"
              required
              maxLength={4}
              placeholder="e.g. RCB"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm uppercase font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Primary Kit Color:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-slate-800 border border-slate-700 p-0.5"
              />
              <span className="text-xs font-mono text-slate-400">{primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Team Logo URL:
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Squad Builder */}
        <div className="border-t border-slate-800 pt-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Squad Roster (Players):
            </label>
            <button
              type="button"
              onClick={addPlayerRow}
              className="flex items-center gap-1 text-xs text-blue-400 font-bold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Player
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {players.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-750">
                <input
                  type="text"
                  placeholder="Player Name"
                  required
                  value={p.name}
                  onChange={(e) => updatePlayer(idx, 'name', e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <select
                  value={p.role}
                  onChange={(e) => updatePlayer(idx, 'role', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300"
                >
                  <option value="BATTER">Batter</option>
                  <option value="BOWLER">Bowler</option>
                  <option value="ALL_ROUNDER">All-Rounder</option>
                  <option value="WICKET_KEEPER">Wicket-Keeper</option>
                </select>
                <input
                  type="number"
                  placeholder="No."
                  value={p.jersey}
                  onChange={(e) => updatePlayer(idx, 'jersey', parseInt(e.target.value) || 0)}
                  className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-white font-mono"
                />
                {players.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePlayerRow(idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition shadow-lg"
        >
          Submit Registration for Approval
        </button>
      </form>
    </div>
  );
};
