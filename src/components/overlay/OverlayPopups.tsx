import React from 'react';
import { LiveMatchSnapshot, OverlayPopupType } from '../../types/cricket';
import { User, Target, Users, Trophy, Award, Zap, Flag, X } from 'lucide-react';

interface OverlayPopupsProps {
  snapshot: LiveMatchSnapshot;
  onClose?: () => void;
}

export const OverlayPopups: React.FC<OverlayPopupsProps> = ({ snapshot, onClose }) => {
  const { overlayState, striker, nonStriker, currentBowler, battingTeam, bowlingTeam, fallOfWickets } = snapshot;
  const activePopup: OverlayPopupType = overlayState.activePopup || 'NONE';

  // If no popup is active, render nothing (completely transparent!)
  if (activePopup === 'NONE') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-45 pointer-events-none flex items-center justify-center p-4">
      {/* =========================================================
          BATTER 1 (B1 - STRIKER) CARD
          ========================================================= */}
      {activePopup === 'B1' && (
        <div className="bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-5 shadow-[0_0_40px_rgba(245,158,11,0.4)] text-white w-full max-w-sm backdrop-blur-md animate-slide-in-up pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Striker Batter</span>
                <h3 className="text-lg font-black text-white">{striker.name}</h3>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Runs (Balls)</div>
              <div className="text-xl font-black text-white font-mono">{striker.runs}* <span className="text-xs text-slate-400 font-normal">({striker.balls}b)</span></div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Strike Rate</div>
              <div className="text-xl font-black text-amber-400 font-mono">
                {striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.0'}
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Fours (4s)</div>
              <div className="text-lg font-black text-blue-400 font-mono">{striker.fours}</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sixes (6s)</div>
              <div className="text-lg font-black text-red-400 font-mono">{striker.sixes}</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BATTER 2 (B2 - NON-STRIKER) CARD
          ========================================================= */}
      {activePopup === 'B2' && (
        <div className="bg-slate-950/95 border-2 border-cyan-500/80 rounded-2xl p-5 shadow-[0_0_40px_rgba(6,182,212,0.4)] text-white w-full max-w-sm backdrop-blur-md animate-slide-in-up pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Non-Striker Batter</span>
                <h3 className="text-lg font-black text-white">{nonStriker.name}</h3>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Runs (Balls)</div>
              <div className="text-xl font-black text-white font-mono">{nonStriker.runs} <span className="text-xs text-slate-400 font-normal">({nonStriker.balls}b)</span></div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Strike Rate</div>
              <div className="text-xl font-black text-cyan-400 font-mono">
                {nonStriker.balls > 0 ? ((nonStriker.runs / nonStriker.balls) * 100).toFixed(1) : '0.0'}
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Fours (4s)</div>
              <div className="text-lg font-black text-blue-400 font-mono">{nonStriker.fours}</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sixes (6s)</div>
              <div className="text-lg font-black text-red-400 font-mono">{nonStriker.sixes}</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BOWLER CARD
          ========================================================= */}
      {activePopup === 'BOWLER' && (
        <div className="bg-slate-950/95 border-2 border-indigo-500/80 rounded-2xl p-5 shadow-[0_0_40px_rgba(99,102,241,0.4)] text-white w-full max-w-sm backdrop-blur-md animate-slide-in-up pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Bowling Figures</span>
                <h3 className="text-lg font-black text-white">{currentBowler.name}</h3>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Overs Bowled</div>
              <div className="text-xl font-black text-white font-mono">
                {Math.floor(currentBowler.legalBalls / 6)}.{currentBowler.legalBalls % 6}
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Wickets</div>
              <div className="text-xl font-black text-red-400 font-mono">{currentBowler.wickets}</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Runs Conceded</div>
              <div className="text-xl font-black text-amber-400 font-mono">{currentBowler.runsConceded}</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Economy Rate</div>
              <div className="text-xl font-black text-indigo-400 font-mono">
                {currentBowler.legalBalls > 0 ? ((currentBowler.runsConceded / (currentBowler.legalBalls / 6))).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TARGET EQUATION CARD
          ========================================================= */}
      {activePopup === 'TARGET' && (
        <div className="bg-gradient-to-br from-amber-950/95 via-slate-950/95 to-slate-950/95 border-2 border-amber-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-white w-full max-w-md text-center animate-slide-in-up pointer-events-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">2nd Innings Target Equation</div>
          <div className="text-4xl font-black text-white font-mono mb-2">
            TARGET: {snapshot.target || (snapshot.battingTeam.score + 1)}
          </div>
          <div className="text-xl font-bold text-amber-300 mb-4">
            {snapshot.battingTeam.name} need {snapshot.runsNeeded ?? 1} runs from {snapshot.ballsRemaining ?? 8} balls
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800">
            <div>Current RR: <strong className="text-white text-sm">{snapshot.crr}</strong></div>
            <div>Req RR: <strong className="text-rose-400 text-sm">{snapshot.rrr || '0.00'}</strong></div>
          </div>
        </div>
      )}

      {/* =========================================================
          PARTNERSHIP CARD
          ========================================================= */}
      {activePopup === 'PARTNERSHIP' && (
        <div className="bg-slate-950/95 border-2 border-emerald-500/80 rounded-2xl p-5 shadow-[0_0_40px_rgba(16,185,129,0.4)] text-white w-full max-w-sm backdrop-blur-md animate-slide-in-up pointer-events-auto text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" /> Current Partnership
          </div>
          <div className="text-3xl font-black text-white font-mono mb-1">
            {snapshot.partnershipRuns} <span className="text-base text-slate-400 font-normal">runs ({snapshot.partnershipBalls} balls)</span>
          </div>
          <div className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800 flex justify-between px-4">
            <div>{striker.name}: <strong className="text-amber-400 font-mono">{striker.runs}*</strong></div>
            <div>{nonStriker.name}: <strong className="text-cyan-400 font-mono">{nonStriker.runs}</strong></div>
          </div>
        </div>
      )}

      {/* =========================================================
          FALL OF WICKETS (FOW) CARD
          ========================================================= */}
      {activePopup === 'FOW' && (
        <div className="bg-slate-950/95 border-2 border-red-500/80 rounded-2xl p-5 shadow-[0_0_40px_rgba(239,68,68,0.4)] text-white w-full max-w-md backdrop-blur-md animate-slide-in-up pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h4 className="text-sm font-bold uppercase text-red-400 tracking-wider flex items-center gap-2">
              <Flag className="w-4 h-4" /> Fall of Wickets - {battingTeam.shortCode}
            </h4>
            <span className="text-xs text-slate-400 font-mono">{battingTeam.score}/{battingTeam.wickets}</span>
          </div>
          <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto">
            {fallOfWickets && fallOfWickets.length > 0 ? (
              fallOfWickets.map((f, i) => (
                <div key={i} className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800 font-mono">
                  <span><strong>{f.wicketNumber}-</strong>{f.score} ({f.playerOut})</span>
                  <span className="text-slate-400">{f.over} ov</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 py-3 text-center italic">No wickets fallen yet in this innings.</div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          CUSTOM TEXT / BROADCAST BANNER
          ========================================================= */}
      {activePopup === 'CUSTOM_TEXT' && overlayState.customBannerText && (
        <div className="bg-slate-950/95 border-2 border-amber-400 rounded-2xl px-8 py-5 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-center animate-slide-in-up pointer-events-auto max-w-lg">
          <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
          {overlayState.customBannerText.split('-').map((line, idx) => (
            <div
              key={idx}
              className={`font-black uppercase tracking-wider ${
                idx === 0 ? 'text-2xl text-white' : 'text-base text-amber-300 mt-1 font-semibold'
              }`}
            >
              {line.trim()}
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          MAN OF THE MATCH (MOM) / MVP CARD
          ========================================================= */}
      {activePopup === 'MOM' && (
        <div className="bg-gradient-to-br from-yellow-950/95 via-slate-950/95 to-slate-950/95 border-2 border-yellow-400 rounded-2xl p-6 shadow-[0_0_50px_rgba(250,204,21,0.5)] text-white w-full max-w-sm text-center animate-slide-in-up pointer-events-auto">
          <Award className="w-12 h-12 text-yellow-300 mx-auto mb-2 animate-bounce" />
          <div className="text-xs font-bold uppercase tracking-widest text-yellow-400">Match Award</div>
          <div className="text-2xl font-black text-white mt-1 mb-1">{snapshot.momPlayer || striker.name}</div>
          <div className="text-xs text-yellow-200 font-semibold uppercase tracking-wider">Player of the Match / MVP</div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 font-mono">
            {striker.runs}* ({striker.balls}b) • 4s: {striker.fours} • 6s: {striker.sixes}
          </div>
        </div>
      )}

      {/* =========================================================
          TOURNAMENT BANNER CARD (TOUR NAME)
          ========================================================= */}
      {activePopup === 'TOUR_NAME' && (
        <div className="bg-slate-950/95 border-2 border-purple-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.5)] text-center animate-slide-in-up pointer-events-auto max-w-md">
          <Trophy className="w-10 h-10 text-purple-400 mx-auto mb-2" />
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400">Competition</div>
          <div className="text-2xl font-black text-white mt-1">{snapshot.tournamentName}</div>
          <div className="text-xs text-slate-400 mt-1">{snapshot.tossDetails || 'Live Cricket Broadcast'}</div>
        </div>
      )}

      {/* =========================================================
          SUMMARY / INNINGS SCORECARD
          ========================================================= */}
      {(activePopup === 'SUMMARY' || activePopup === 'I1BAT' || activePopup === 'I1BALL' || activePopup === 'I2BAT' || activePopup === 'I2BALL') && (
        <div className="bg-slate-950/95 border-2 border-blue-500/80 rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.4)] text-white w-full max-w-lg backdrop-blur-md animate-slide-in-up pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <span className="text-[10px] text-blue-400 font-bold uppercase">{snapshot.tournamentName}</span>
              <h3 className="text-xl font-black text-white">{battingTeam.name} - Innings Summary</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-400 font-mono">{battingTeam.score}/{battingTeam.wickets}</span>
              <div className="text-[11px] text-slate-400 font-mono">({battingTeam.oversCompleted}.{battingTeam.ballsThisOver} ov, CRR {snapshot.crr})</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-white font-bold">{striker.name} (striker)</span>
              <span className="font-mono text-amber-400 font-black">{striker.runs}* ({striker.balls}b)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 font-semibold">{nonStriker.name} (non-striker)</span>
              <span className="font-mono text-slate-300 font-bold">{nonStriker.runs} ({nonStriker.balls}b)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Bowler: {currentBowler.name}</span>
              <span className="font-mono text-white">{currentBowler.wickets}/{currentBowler.runsConceded} ({Math.floor(currentBowler.legalBalls / 6)}.{currentBowler.legalBalls % 6} ov)</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          POWERPLAY BADGE
          ========================================================= */}
      {activePopup === 'POWERPLAY' && (
        <div className="bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 text-slate-950 px-8 py-4 rounded-2xl border-2 border-white shadow-[0_0_50px_rgba(245,158,11,0.8)] font-black uppercase text-2xl tracking-widest animate-pulse-glow pointer-events-auto">
          ⚡ POWERPLAY IN PROGRESS ⚡
        </div>
      )}

      {/* =========================================================
          TEAMS PLAYERS / ROSTER
          ========================================================= */}
      {activePopup === 'TEAMS_PLAYERS' && (
        <div className="bg-slate-950/95 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl text-white w-full max-w-md animate-slide-in-up pointer-events-auto">
          <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Match Roster: {battingTeam.shortCode} vs {bowlingTeam.shortCode}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-bold text-amber-400 mb-2">{battingTeam.name}</div>
              <ul className="space-y-1 text-slate-300">
                <li>• {striker.name} (c)</li>
                <li>• {nonStriker.name}</li>
                <li>• D. Conway (wk)</li>
                <li>• S. Dube</li>
                <li>• A. Rahane</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-cyan-400 mb-2">{bowlingTeam.name}</div>
              <ul className="space-y-1 text-slate-300">
                <li>• {currentBowler.name}</li>
                <li>• J. Bumrah</li>
                <li>• R. Ashwin</li>
                <li>• H. Pandya</li>
                <li>• S. Yadav</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
