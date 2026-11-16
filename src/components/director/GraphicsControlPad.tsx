import React from 'react';
import { LiveMatchSnapshot, OverlayTheme } from '../../types/cricket';
import { Tv, Sparkles, Eye, ShieldAlert, Award, Layers, Palette } from 'lucide-react';

interface GraphicsControlPadProps {
  snapshot: LiveMatchSnapshot;
  onUpdateOverlay: (updates: Partial<LiveMatchSnapshot['overlayState']>) => void;
}

export const GraphicsControlPad: React.FC<GraphicsControlPadProps> = ({ snapshot, onUpdateOverlay }) => {
  const { overlayState } = snapshot;

  const triggerAlert = (alertType: 'NONE' | 'FOUR' | 'SIX' | 'WICKET' | 'FREE_HIT' | 'FIFTY' | 'CENTURY') => {
    onUpdateOverlay({ activeAlert: alertType });
  };

  const triggerReview = (reviewStatus: 'NONE' | 'IN_PROGRESS' | 'OUT' | 'NOT_OUT') => {
    onUpdateOverlay({ reviewBanner: reviewStatus });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 text-cyan-400">
          <Tv className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Broadcaster Graphics Control Desk</h3>
        </div>
        <span className="text-xs px-2.5 py-1 bg-cyan-950/80 border border-cyan-800 text-cyan-300 rounded-full font-mono">
          OBS Mode Active
        </span>
      </div>

      {/* Row 1: Primary Toggles (Lower-Third, Sponsor Bug) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onUpdateOverlay({ isLowerThirdVisible: !overlayState.isLowerThirdVisible })}
          className={`py-3 px-4 rounded-xl border text-sm font-bold transition flex items-center justify-between cursor-pointer ${
            overlayState.isLowerThirdVisible
              ? 'bg-blue-600/80 border-blue-400 text-white shadow-md'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" /> Lower-Third Scorebar
          </span>
          <span className="text-xs font-mono">{overlayState.isLowerThirdVisible ? 'ON AIR' : 'OFF'}</span>
        </button>

        <button
          onClick={() => onUpdateOverlay({ sponsorBugVisible: !overlayState.sponsorBugVisible })}
          className={`py-3 px-4 rounded-xl border text-sm font-bold transition flex items-center justify-between cursor-pointer ${
            overlayState.sponsorBugVisible
              ? 'bg-amber-600/80 border-amber-400 text-white shadow-md'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span>Sponsor Watermark Bug</span>
          <span className="text-xs font-mono">{overlayState.sponsorBugVisible ? 'VISIBLE' : 'HIDDEN'}</span>
        </button>
      </div>

      {/* Row 2: Dynamic Broadcast Stingers */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Trigger Instant Broadcast Animations:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => triggerAlert('FOUR')}
            className="py-2.5 px-3 bg-blue-900/60 hover:bg-blue-800 border border-blue-500 text-blue-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> FOUR (4)
          </button>
          <button
            onClick={() => triggerAlert('SIX')}
            className="py-2.5 px-3 bg-amber-900/60 hover:bg-amber-800 border border-amber-500 text-amber-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> SIX (6)
          </button>
          <button
            onClick={() => triggerAlert('WICKET')}
            className="py-2.5 px-3 bg-red-900/60 hover:bg-red-800 border border-red-500 text-red-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> WICKET
          </button>
          <button
            onClick={() => triggerAlert('FREE_HIT')}
            className="py-2.5 px-3 bg-yellow-900/60 hover:bg-yellow-800 border border-yellow-500 text-yellow-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> FREE HIT
          </button>
        </div>
      </div>

      {/* Row 3: Milestones & Detail Cards */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Slide-in Graphic Cards:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onUpdateOverlay({ activeCard: overlayState.activeCard === 'BATTER' ? 'NONE' : 'BATTER' })}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
              overlayState.activeCard === 'BATTER'
                ? 'bg-amber-600 border-amber-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Batter Summary
          </button>

          <button
            onClick={() => onUpdateOverlay({ activeCard: overlayState.activeCard === 'BOWLER' ? 'NONE' : 'BOWLER' })}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
              overlayState.activeCard === 'BOWLER'
                ? 'bg-cyan-600 border-cyan-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Bowler Figures
          </button>

          <button
            onClick={() => triggerAlert('FIFTY')}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
          >
            <Award className="w-3.5 h-3.5" /> 50 Stinger
          </button>

          <button
            onClick={() => onUpdateOverlay({ activeCard: overlayState.activeCard === 'FULL_SCORECARD' ? 'NONE' : 'FULL_SCORECARD' })}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
              overlayState.activeCard === 'FULL_SCORECARD'
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Full Scorecard
          </button>
        </div>
      </div>

      {/* Row 4: Third Umpire / DRS Review Graphics */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          DRS / Third Umpire Decision Graphics:
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => triggerReview('IN_PROGRESS')}
            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition ${
              overlayState.reviewBanner === 'IN_PROGRESS'
                ? 'bg-amber-600 border-amber-300 text-white'
                : 'bg-slate-800 border-slate-700 text-amber-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5 mx-auto mb-1" />
            Reviewing
          </button>

          <button
            onClick={() => triggerReview('OUT')}
            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition ${
              overlayState.reviewBanner === 'OUT'
                ? 'bg-red-600 border-red-300 text-white'
                : 'bg-slate-800 border-slate-700 text-red-400'
            }`}
          >
            Decision: OUT
          </button>

          <button
            onClick={() => triggerReview('NOT_OUT')}
            className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition ${
              overlayState.reviewBanner === 'NOT_OUT'
                ? 'bg-emerald-600 border-emerald-300 text-white'
                : 'bg-slate-800 border-slate-700 text-emerald-400'
            }`}
          >
            Decision: NOT OUT
          </button>

          <button
            onClick={() => triggerReview('NONE')}
            className="py-2 px-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-400 text-xs font-bold rounded-lg transition"
          >
            Clear DRS
          </button>
        </div>
      </div>

      {/* Row 5: Theme Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-cyan-400" /> Broadcast Overlay Theme:
        </label>
        <div className="flex gap-2">
          {(['neon', 'sky', 'retro'] as OverlayTheme[]).map((thm) => (
            <button
              key={thm}
              onClick={() => onUpdateOverlay({ theme: thm })}
              className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold uppercase transition ${
                overlayState.theme === thm
                  ? 'bg-cyan-600 border-cyan-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {thm === 'neon' ? 'IPL Neon' : thm === 'sky' ? 'Sky Sports' : 'Classic Retro'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
