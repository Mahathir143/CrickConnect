import React, { useState } from 'react';
import { LiveMatchSnapshot, OverlayPopupType, ExtraType, DismissalType } from '../../types/cricket';
import { 
  Send, MonitorOff, ArrowLeftRight, RotateCcw, 
  Sparkles, Check, Tv, Palette, Save, Flame, ShieldAlert,
  Award, Layers, Eye
} from 'lucide-react';
import { BowlerSelectionModal } from './BowlerSelectionModal';

interface CricScorerManagementPadProps {
  snapshot: LiveMatchSnapshot;
  onRecordBall: (params: {
    batsmanRuns: number;
    extraType: ExtraType;
    extraRuns: number;
    isWicket: boolean;
    dismissalType?: DismissalType;
    dismissedPlayerId?: string;
    newBatterName?: string;
  }) => void;
  onUndo: () => void;
  onSwapStrike: () => void;
  onSelectBowler: (name: string) => void;
  onUpdateOverlay: (updates: Partial<LiveMatchSnapshot['overlayState']>) => void;
  onEmergencyAdjust: (adjustments: {
    inning1Runs?: number;
    inning1Wickets?: number;
    inning1Balls?: number;
    inning2Runs?: number;
    inning2Wickets?: number;
    inning2Balls?: number;
  }) => void;
  onRetireBatter?: () => void;
  overCompletedPrompt?: boolean;
}

export const CricScorerManagementPad: React.FC<CricScorerManagementPadProps> = ({
  snapshot,
  onRecordBall,
  onUndo,
  onSwapStrike,
  onSelectBowler,
  onUpdateOverlay,
  onEmergencyAdjust,
  onRetireBatter,
  overCompletedPrompt,
}) => {
  const { battingTeam, bowlingTeam, striker, nonStriker, currentBowler, overlayState } = snapshot;

  // Local state for scoring checkboxes (Image 4 & 5)
  const [isWide, setIsWide] = useState(false);
  const [isNoBall, setIsNoBall] = useState(false);
  const [isByes, setIsByes] = useState(false);
  const [isLegByes, setIsLegByes] = useState(false);
  const [isWicketChecked, setIsWicketChecked] = useState(false);
  const [wicketType, setWicketType] = useState<DismissalType>('BOWLED');
  const [newBatterInput, setNewBatterInput] = useState('');

  // Custom Banner Text input (Image 6 & 7)
  const [customInputText, setCustomInputText] = useState(overlayState.customBannerText || '');

  // Emergency Adjustments inputs (Image 7)
  const [adjI1Runs, setAdjI1Runs] = useState(snapshot.innings1Total?.score ?? snapshot.battingTeam.score);
  const [adjI1Wickets, setAdjI1Wickets] = useState(snapshot.innings1Total?.wickets ?? 10);
  const [adjI1Balls, setAdjI1Balls] = useState(snapshot.innings1Total?.legalBalls ?? 84);
  const [adjI2Runs, setAdjI2Runs] = useState(snapshot.currentInnings === 2 ? snapshot.battingTeam.score : 0);
  const [adjI2Wickets, setAdjI2Wickets] = useState(snapshot.currentInnings === 2 ? snapshot.battingTeam.wickets : 0);
  const [adjI2Balls, setAdjI2Balls] = useState(
    snapshot.currentInnings === 2 ? snapshot.battingTeam.oversCompleted * 6 + snapshot.battingTeam.ballsThisOver : 0
  );

  // TV Logo Customization State
  const [tvLogoText, setTvLogoText] = useState(overlayState.tvLogo?.text || 'CRICKCONNECT');
  const [tvLogoSubText, setTvLogoSubText] = useState(overlayState.tvLogo?.subText || 'LIVE HD');
  const [showTvLogoConfig, setShowTvLogoConfig] = useState(false);

  // Modals
  const [showBowlerModal, setShowBowlerModal] = useState(false);

  // -------------------------------------------------------------
  // Ball Submission from Grid Buttons (0, 1, 2, 3, 4, 5, 6, 1D)
  // -------------------------------------------------------------
  const handleScoreBall = (runs: number) => {
    let extraType: ExtraType = 'NONE';
    let extraRuns = 0;
    let batsmanRuns = runs;

    if (isWide) {
      extraType = 'WIDE';
      extraRuns = 1 + runs;
      batsmanRuns = 0;
    } else if (isNoBall) {
      extraType = 'NO_BALL';
      extraRuns = 1;
      batsmanRuns = runs; // runs off bat credited to batter
    } else if (isByes) {
      extraType = 'BYE';
      extraRuns = runs > 0 ? runs : 1;
      batsmanRuns = 0;
    } else if (isLegByes) {
      extraType = 'LEG_BYE';
      extraRuns = runs > 0 ? runs : 1;
      batsmanRuns = 0;
    }

    const isDismissal = isWicketChecked;
    const dismissalMode = isDismissal ? wicketType : undefined;
    const dismissedId = dismissalMode === 'RUN_OUT_NON_STRIKER' || dismissalMode === 'MANKAD'
      ? nonStriker.id
      : striker.id;

    onRecordBall({
      batsmanRuns,
      extraType,
      extraRuns,
      isWicket: isDismissal,
      dismissalType: dismissalMode,
      dismissedPlayerId: isDismissal ? dismissedId : undefined,
      newBatterName: newBatterInput.trim() || undefined,
    });

    // Reset checkboxes after ball entry
    setIsWide(false);
    setIsNoBall(false);
    setIsByes(false);
    setIsLegByes(false);
    setIsWicketChecked(false);
    setNewBatterInput('');
  };

  // Quick Action Buttons (Bowled, LBW, Hit Wicket, Mankad, etc.)
  const handleQuickWicket = (type: DismissalType) => {
    onRecordBall({
      batsmanRuns: 0,
      extraType: 'NONE',
      extraRuns: 0,
      isWicket: true,
      dismissalType: type,
      dismissedPlayerId: type === 'MANKAD' ? nonStriker.id : striker.id,
      newBatterName: `Batter #${battingTeam.wickets + 2}`,
    });
  };

  const handleQuickExtra = (type: ExtraType) => {
    onRecordBall({
      batsmanRuns: 0,
      extraType: type,
      extraRuns: 1,
      isWicket: false,
    });
  };

  // Set single mutually exclusive popup (Rule: any new popup hides all others)
  const setPopup = (popup: OverlayPopupType) => {
    onUpdateOverlay({
      activePopup: popup,
      activeAlert: 'NONE', // Clear animation when card selected
    });
  };

  // Blank screen action
  const handleBlankScreen = () => {
    onUpdateOverlay({
      isBottomScorebarEnabled: false,
      isLowerThirdVisible: false,
      activePopup: 'NONE',
      activeAlert: 'NONE',
      reviewBanner: 'NONE',
    });
  };

  // Restore Default (Shows bottom scorebar, clears all popups)
  const handleDefaultScreen = () => {
    onUpdateOverlay({
      isBottomScorebarEnabled: true,
      isLowerThirdVisible: true,
      activePopup: 'NONE',
      activeAlert: 'NONE',
      reviewBanner: 'NONE',
    });
  };

  // Stop animations & clear popups
  const handleStop = () => {
    onUpdateOverlay({
      activeAlert: 'NONE',
      activePopup: 'NONE',
      reviewBanner: 'NONE',
    });
  };

  const handleSaveTvLogo = () => {
    onUpdateOverlay({
      tvLogo: {
        enabled: overlayState.tvLogo?.enabled ?? true,
        text: tvLogoText,
        subText: tvLogoSubText,
      },
    });
    setShowTvLogoConfig(false);
  };

  const isScorebarOn = overlayState.isBottomScorebarEnabled !== false && overlayState.isLowerThirdVisible !== false;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white shadow-2xl space-y-5 font-sans">
      
      {/* =========================================================================
          SECTION 1: MATCH PREVIEW BANNER (Inspire Image 3)
          ========================================================================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg">
        {/* Match Title & Target Chase equation */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm uppercase tracking-wider text-white">
              {battingTeam.shortCode} VS {bowlingTeam.shortCode}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              FOURS: <strong className="text-blue-400">{battingTeam.totalFours ?? 9}</strong> • SIXES: <strong className="text-amber-400">{battingTeam.totalSixes ?? 4}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {snapshot.target && (
              <span className="bg-amber-950/80 border border-amber-500/60 text-amber-300 font-bold px-2 py-0.5 rounded">
                TARGET - {snapshot.target}
              </span>
            )}
            <span className="text-rose-400 font-bold">
              NEED {snapshot.runsNeeded ?? 1} RUNS FROM {snapshot.ballsRemaining ?? 8} BALLS
            </span>
          </div>
        </div>

        {/* 3 Live Broadcast Blocks: Blue (Batters), Yellow (Score), Red (Bowler) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Blue Block: Batters */}
          <div className="bg-gradient-to-r from-blue-900/90 to-blue-800/90 border border-blue-600/50 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs py-0.5">
              <span className="flex items-center gap-1 font-bold text-white truncate">
                <span className="text-amber-300 text-xs">▶</span> {striker.name}
              </span>
              <span className="font-mono font-black text-sm text-white">{striker.runs} <span className="text-xs text-blue-200 font-normal">{striker.balls}</span></span>
            </div>
            <div className="flex items-center justify-between text-xs py-0.5 border-t border-blue-700/50 text-blue-200">
              <span className="truncate pl-3 font-medium">{nonStriker.name}</span>
              <span className="font-mono font-bold">{nonStriker.runs} <span className="text-xs text-blue-300 font-normal">{nonStriker.balls}</span></span>
            </div>
          </div>

          {/* Yellow Block: Team Score */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 rounded-xl p-3 flex flex-col items-center justify-center shadow-md">
            <div className="text-3xl font-black font-mono leading-none tracking-tight">
              {battingTeam.score} - {battingTeam.wickets}
            </div>
            <div className="text-xs font-black uppercase tracking-wider mt-1 text-slate-900">
              {battingTeam.oversCompleted}.{battingTeam.ballsThisOver} / {snapshot.totalOvers} OVR
            </div>
          </div>

          {/* Red Block: Bowler Figures & Timeline */}
          <div className="bg-gradient-to-r from-red-950/90 to-rose-900/90 border border-red-700/50 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white truncate">{currentBowler.name}</span>
              <span className="font-mono font-bold text-white">
                {currentBowler.wickets} - {currentBowler.runsConceded} <span className="text-xs text-red-200 font-normal">({Math.floor(currentBowler.legalBalls / 6)}.{currentBowler.legalBalls % 6})</span>
              </span>
            </div>

            {/* Ball Dots */}
            <div className="flex items-center gap-1 mt-2">
              {snapshot.currentOverDeliveries.map((b, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] border ${
                    b.isWicket
                      ? 'bg-red-600 text-white border-red-400'
                      : b.badge === '4'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : b.badge === '6'
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-black/60 text-slate-300 border-slate-700'
                  }`}
                >
                  {b.badge}
                </span>
              ))}
              {Array.from({ length: Math.max(0, 6 - snapshot.currentOverDeliveries.length) }).map((_, i) => (
                <span key={i} className="w-4 h-4 rounded-full bg-black/40 border border-slate-800 inline-block" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: SCORE CONTROLLER TOP ACTION ROW (Inspire Image 3)
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            ⚡ SCORE CONTROLLER
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateOverlay({ isBottomScorebarEnabled: !isScorebarOn, isLowerThirdVisible: !isScorebarOn })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                isScorebarOn
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="Toggle Bottom Scoreboard on/off in layout"
            >
              <Layers className="w-3.5 h-3.5" />
              Bottom Scoreboard: {isScorebarOn ? 'ENABLED' : 'REMOVED'}
            </button>
            <button
              onClick={handleDefaultScreen}
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> SEND
            </button>
            <button
              onClick={handleBlankScreen}
              className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <MonitorOff className="w-3.5 h-3.5" /> Blank screen
            </button>
          </div>
        </div>

        {/* Row 1 Control Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5 mb-1.5 text-xs font-bold">
          <button
            onClick={onSwapStrike}
            className="py-2 px-2 bg-sky-700 hover:bg-sky-600 rounded-lg flex items-center justify-center gap-1 transition"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> SWAP
          </button>
          <button
            onClick={() => onRetireBatter && onRetireBatter()}
            className="py-2 px-2 bg-rose-700 hover:bg-rose-600 rounded-lg flex items-center justify-center gap-1 transition"
          >
            RETIRE
          </button>
          <button
            onClick={() => setShowBowlerModal(true)}
            className="py-2 px-2 bg-teal-700 hover:bg-teal-600 rounded-lg flex items-center justify-center gap-1 transition"
          >
            BOWLER
          </button>
          <button
            onClick={handleDefaultScreen}
            className="py-2 px-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black rounded-lg transition"
          >
            DEFAULT
          </button>
          <button
            onClick={() => setPopup('MINI_SCORE')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'MINI_SCORE' ? 'bg-blue-500 ring-2 ring-white' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            MINI-SCORE
          </button>
          <button
            onClick={() => setPopup('TARGET')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'TARGET' ? 'bg-amber-500 ring-2 ring-white text-slate-950' : 'bg-amber-600 hover:bg-amber-500'}`}
          >
            TARGET
          </button>
          <button
            onClick={() => setPopup('TOUR_NAME')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'TOUR_NAME' ? 'bg-purple-500 ring-2 ring-white' : 'bg-purple-700 hover:bg-purple-600'}`}
          >
            TOUR NAME
          </button>
          <button
            onClick={() => setPopup('B1')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'B1' ? 'bg-teal-400 ring-2 ring-white text-slate-950 font-black' : 'bg-teal-700 hover:bg-teal-600'}`}
          >
            B1
          </button>
          <button
            onClick={() => setPopup('B2')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'B2' ? 'bg-teal-400 ring-2 ring-white text-slate-950 font-black' : 'bg-teal-700 hover:bg-teal-600'}`}
          >
            B2
          </button>
          <button
            onClick={() => setPopup('BOWLER')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'BOWLER' ? 'bg-indigo-400 ring-2 ring-white text-slate-950 font-black' : 'bg-indigo-700 hover:bg-indigo-600'}`}
          >
            BOWLER
          </button>
        </div>

        {/* Row 2 Control Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setPopup('I1BAT')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'I1BAT' ? 'bg-emerald-500 ring-2 ring-white' : 'bg-emerald-700 hover:bg-emerald-600'}`}
          >
            👥 BATTING
          </button>
          <button
            onClick={() => setPopup('I1BALL')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'I1BALL' ? 'bg-blue-500 ring-2 ring-white' : 'bg-blue-700 hover:bg-blue-600'}`}
          >
            🎯 BOWLING
          </button>
          <button
            onClick={() => setPopup('POWERPLAY')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'POWERPLAY' ? 'bg-yellow-400 ring-2 ring-white text-slate-950' : 'bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-black'}`}
          >
            ⚡ PP+
          </button>
          <button
            onClick={() => setPopup('SUMMARY')}
            className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'SUMMARY' ? 'bg-rose-500 ring-2 ring-white' : 'bg-rose-700 hover:bg-rose-600'}`}
          >
            🏁 SUMMARY
          </button>
          <button
            onClick={onUndo}
            className="py-2 px-2 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center gap-1 font-black transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> UNDO
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: BALL SCORING PAD (Inspire Images 4 & 5)
          ========================================================================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg">
        {/* Checkbox Options: Wide, No Ball, Byes, Leg Byes, Wicket */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800 text-xs font-bold">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isWide}
              onChange={(e) => {
                setIsWide(e.target.checked);
                if (e.target.checked) { setIsNoBall(false); setIsByes(false); setIsLegByes(false); }
              }}
              className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700"
            />
            <span className={isWide ? 'text-purple-400' : 'text-slate-300'}>Wide</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isNoBall}
              onChange={(e) => {
                setIsNoBall(e.target.checked);
                if (e.target.checked) { setIsWide(false); setIsByes(false); setIsLegByes(false); }
              }}
              className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
            />
            <span className={isNoBall ? 'text-amber-400' : 'text-slate-300'}>No Ball</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isByes}
              onChange={(e) => {
                setIsByes(e.target.checked);
                if (e.target.checked) { setIsWide(false); setIsNoBall(false); setIsLegByes(false); }
              }}
              className="w-4 h-4 rounded text-blue-500 bg-slate-800 border-slate-700"
            />
            <span className={isByes ? 'text-blue-400' : 'text-slate-300'}>Byes</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isLegByes}
              onChange={(e) => {
                setIsLegByes(e.target.checked);
                if (e.target.checked) { setIsWide(false); setIsNoBall(false); setIsByes(false); }
              }}
              className="w-4 h-4 rounded text-blue-500 bg-slate-800 border-slate-700"
            />
            <span className={isLegByes ? 'text-blue-400' : 'text-slate-300'}>Leg Byes</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-700/60">
            <input
              type="checkbox"
              checked={isWicketChecked}
              onChange={(e) => setIsWicketChecked(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 bg-slate-800 border-slate-700"
            />
            <span className="text-red-400 flex items-center gap-1">Wicket ℹ️</span>
          </label>
        </div>

        {/* Dynamic Wicket Dropdown if Wicket is checked (Image 4) */}
        {isWicketChecked && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-700/60 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-red-300">How wicket fell?</label>
              <select
                value={wicketType}
                onChange={(e) => setWicketType(e.target.value as DismissalType)}
                className="bg-slate-900 border border-red-600 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
              >
                <option value="BOWLED">Bowled</option>
                <option value="CAUGHT">Catch out</option>
                <option value="RUN_OUT_STRIKER">Run out at striker end</option>
                <option value="RUN_OUT_NON_STRIKER">Run out at non-striker end</option>
                <option value="STUMPED">Stumping</option>
                <option value="LBW">LBW</option>
                <option value="HIT_WICKET">Hit wicket</option>
                <option value="MANKAD">Mankad (Ball not count)</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Next Batter Name (Optional)"
              value={newBatterInput}
              onChange={(e) => setNewBatterInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
        )}

        {/* Circular Scoring Buttons Grid (Image 5) */}
        <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto py-2">
          {[0, 1, 2, 3].map((r) => (
            <button
              key={r}
              onClick={() => handleScoreBall(r)}
              className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full border-2 border-slate-600 hover:border-amber-400 bg-slate-900 hover:bg-slate-800 text-white font-mono font-black text-xl flex items-center justify-center transition shadow active:scale-95 cursor-pointer"
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => handleScoreBall(1)}
            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full border-2 border-blue-500 bg-blue-950/80 text-blue-200 font-mono font-bold text-sm flex items-center justify-center transition shadow active:scale-95 cursor-pointer"
            title="1 Dot / Single"
          >
            1D
          </button>

          {[4, 5, 6].map((r) => (
            <button
              key={r}
              onClick={() => handleScoreBall(r)}
              className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full border-2 font-mono font-black text-xl flex items-center justify-center transition shadow active:scale-95 cursor-pointer ${
                r === 4
                  ? 'border-blue-400 bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : r === 6
                  ? 'border-amber-400 bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  : 'border-slate-600 bg-slate-900 text-white'
              }`}
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => {
              const custom = prompt('Enter custom runs (e.g. 5, 7):', '5');
              if (custom) handleScoreBall(parseInt(custom) || 0);
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full border-2 border-slate-600 bg-slate-900 text-slate-300 font-mono font-bold text-xl flex items-center justify-center transition shadow active:scale-95 cursor-pointer"
          >
            ?
          </button>
          <button
            onClick={() => setShowBowlerModal(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full border-2 border-slate-600 bg-slate-900 text-slate-300 font-mono font-bold text-xl flex items-center justify-center transition shadow active:scale-95 cursor-pointer"
          >
            ...
          </button>
        </div>

        {/* Quick Dismissals & Extras Buttons Row (Image 4 & 5) */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> QUICK ACTION BUTTONS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-xs font-bold">
            <button
              onClick={() => handleQuickWicket('BOWLED')}
              className="py-2 px-2 bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 rounded-lg transition truncate"
            >
              🎯 Bowled
            </button>
            <button
              onClick={() => handleQuickWicket('LBW')}
              className="py-2 px-2 bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 rounded-lg transition truncate"
            >
              🛡️ LBW
            </button>
            <button
              onClick={() => handleQuickWicket('HIT_WICKET')}
              className="py-2 px-2 bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 rounded-lg transition truncate"
            >
              ⚡ Hit Wicket
            </button>
            <button
              onClick={() => handleQuickExtra('WIDE')}
              className="py-2 px-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-600 text-amber-200 rounded-lg transition truncate"
            >
              ↔️ Wide
            </button>
            <button
              onClick={() => handleQuickExtra('NO_BALL')}
              className="py-2 px-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-600 text-amber-200 rounded-lg transition truncate"
            >
              🏳️ No Ball
            </button>
            <button
              onClick={() => handleQuickExtra('BYE')}
              className="py-2 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-200 rounded-lg transition truncate"
            >
              🏃 Bye
            </button>
            <button
              onClick={() => handleQuickExtra('LEG_BYE')}
              className="py-2 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-200 rounded-lg transition truncate"
            >
              👟 Leg Bye
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: ANIMATIONS & DISPLAY CONTROLLER (Inspire Image 6)
          ========================================================================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        {/* Animations Trigger Bar (Image 6) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-1">
              ⚡ ANIMATIONS
            </span>
            <button
              onClick={() => onUpdateOverlay({ autoAnimationEnabled: !overlayState.autoAnimationEnabled })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                overlayState.autoAnimationEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Auto Animation: {overlayState.autoAnimationEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-xs font-bold">
            <button
              onClick={() => onUpdateOverlay({ activeAlert: 'FREE_HIT' })}
              className="py-2 px-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition"
            >
              FREE HIT
            </button>
            <button
              onClick={() => onUpdateOverlay({ activeAlert: 'HAT_TRICK' })}
              className="py-2 px-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition"
            >
              HAT-TRICK BALL
            </button>
            <button
              onClick={() => onUpdateOverlay({ activeAlert: 'FOUR' })}
              className="py-2 px-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg transition"
            >
              FOUR
            </button>
            <button
              onClick={() => onUpdateOverlay({ activeAlert: 'SIX' })}
              className="py-2 px-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition flex items-center justify-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-300" /> SIX
            </button>
            <button
              onClick={() => onUpdateOverlay({ activeAlert: 'WICKET' })}
              className="py-2 px-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> WICKET
            </button>
            <button
              onClick={() => onUpdateOverlay({ activeAlert: 'FIFTY' })}
              className="py-2 px-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
            >
              MILESTONE 50/100
            </button>
            <button
              onClick={handleStop}
              className="py-2 px-2 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-black rounded-lg transition"
            >
              STOP
            </button>
          </div>
        </div>

        {/* Display Controller Buttons Row (Image 6 & 7) */}
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 block mb-2">
            📺 DISPLAY CONTROLLER (MUTUALLY EXCLUSIVE POPUPS)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-1.5 text-xs font-bold mb-3">
            <button
              onClick={handleDefaultScreen}
              className="py-2 px-2 bg-lime-500 text-slate-950 font-black rounded-lg"
            >
              DEFAULT
            </button>
            <button onClick={() => setPopup('I1BAT')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'I1BAT' ? 'bg-rose-500 ring-2 ring-white' : 'bg-rose-700'}`}>
              I1BAT
            </button>
            <button onClick={() => setPopup('I1BALL')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'I1BALL' ? 'bg-rose-500 ring-2 ring-white' : 'bg-rose-700'}`}>
              I1BALL
            </button>
            <button onClick={() => setPopup('I2BAT')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'I2BAT' ? 'bg-blue-500 ring-2 ring-white' : 'bg-blue-700'}`}>
              I2BAT
            </button>
            <button onClick={() => setPopup('I2BALL')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'I2BALL' ? 'bg-blue-500 ring-2 ring-white' : 'bg-blue-700'}`}>
              I2BALL
            </button>
            <button onClick={() => setPopup('SUMMARY')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'SUMMARY' ? 'bg-purple-500 ring-2 ring-white' : 'bg-purple-700'}`}>
              SUMMARY
            </button>
            <button onClick={() => setPopup('FOW')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'FOW' ? 'bg-cyan-500 ring-2 ring-white text-slate-950' : 'bg-cyan-700'}`}>
              FOW
            </button>
            <button onClick={() => setPopup('B1')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'B1' ? 'bg-pink-500 ring-2 ring-white' : 'bg-pink-700'}`}>
              B1 (Striker)
            </button>
            <button onClick={() => setPopup('B2')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'B2' ? 'bg-pink-500 ring-2 ring-white' : 'bg-pink-700'}`}>
              B2 (Non-Str)
            </button>
            <button onClick={() => setPopup('BOWLER')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'BOWLER' ? 'bg-pink-500 ring-2 ring-white' : 'bg-pink-700'}`}>
              BOWLER
            </button>
            <button onClick={() => setPopup('TARGET')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'TARGET' ? 'bg-blue-500 ring-2 ring-white' : 'bg-blue-700'}`}>
              TARGET
            </button>
            <button onClick={() => setPopup('PARTNERSHIP')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'PARTNERSHIP' ? 'bg-amber-500 ring-2 ring-white text-slate-950' : 'bg-amber-600'}`}>
              PARTNERSHIP
            </button>
            <button onClick={() => setPopup('TEAMS_PLAYERS')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'TEAMS_PLAYERS' ? 'bg-orange-500 ring-2 ring-white' : 'bg-orange-600'}`}>
              TEAMS
            </button>
            <button onClick={() => setPopup('MOM')} className={`py-2 px-2 rounded-lg transition ${overlayState.activePopup === 'MOM' ? 'bg-yellow-400 ring-2 ring-white text-slate-950' : 'bg-yellow-600 text-slate-950 font-black'}`}>
              MOM / MVP
            </button>
          </div>

          {/* Decision & Custom Input Row (Image 6) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            {/* DRS Decisions */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Decision:</span>
              <button
                onClick={() => onUpdateOverlay({ reviewBanner: 'IN_PROGRESS' })}
                className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition"
              >
                PENDING
              </button>
              <button
                onClick={() => onUpdateOverlay({ reviewBanner: 'OUT' })}
                className="py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-lg transition"
              >
                OUT
              </button>
              <button
                onClick={() => onUpdateOverlay({ reviewBanner: 'NOT_OUT' })}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg transition"
              >
                NOT OUT
              </button>
              <button
                onClick={() => onUpdateOverlay({ reviewBanner: 'NONE' })}
                className="py-1.5 px-2 bg-slate-800 text-slate-400 text-xs rounded-lg transition hover:text-white"
              >
                Clear
              </button>
            </div>

            {/* Custom Input Banner with "-" for line split */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Custom Input (use - for split text to next line)"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => {
                  if (customInputText.trim()) {
                    onUpdateOverlay({
                      customBannerText: customInputText,
                      activePopup: 'CUSTOM_TEXT',
                    });
                  }
                }}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shrink-0 cursor-pointer"
              >
                Display Input
              </button>
              <button
                onClick={() => {
                  setCustomInputText('');
                  onUpdateOverlay({ customBannerText: '', activePopup: 'NONE' });
                }}
                className="py-1.5 px-2 bg-slate-800 text-slate-400 text-xs rounded-lg hover:text-white shrink-0"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: TV CHANNEL LOGO CONFIGURATION (User Request)
          ========================================================================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xs">
            TV
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>Top-Right TV Channel Logo:</span>
              <strong className="text-amber-400 font-mono">{overlayState.tvLogo?.text || 'CRICKCONNECT'}</strong>
              <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-bold text-[9px]">
                {overlayState.tvLogo?.enabled !== false ? 'VISIBLE' : 'HIDDEN'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Positioned in the top right corner of your stream like professional TV broadcasts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateOverlay({ tvLogo: { ...overlayState.tvLogo, enabled: !overlayState.tvLogo?.enabled } })}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              overlayState.tvLogo?.enabled !== false ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {overlayState.tvLogo?.enabled !== false ? 'Disable Logo' : 'Enable Logo'}
          </button>
          <button
            onClick={() => setShowTvLogoConfig(!showTvLogoConfig)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition"
          >
            Edit Channel Name
          </button>
        </div>
      </div>

      {/* TV Logo Edit Modal */}
      {showTvLogoConfig && (
        <div className="p-4 bg-slate-850 border border-slate-700 rounded-xl space-y-3 text-xs animate-slide-in-up">
          <div className="font-bold text-white">Customize TV Broadcast Channel Brand:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Channel Name (Top Right):</label>
              <input
                type="text"
                value={tvLogoText}
                onChange={(e) => setTvLogoText(e.target.value)}
                placeholder="e.g. CRICKCONNECT TV"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Subtext / Badge:</label>
              <input
                type="text"
                value={tvLogoSubText}
                onChange={(e) => setTvLogoSubText(e.target.value)}
                placeholder="e.g. LIVE HD"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowTvLogoConfig(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTvLogo}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Save Brand Logo
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: EMERGENCY MATCH ADJUSTMENTS (Inspire Image 7)
          ========================================================================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-3">
          🛠️ EMERGENCY MATCH ADJUSTMENTS (DIRECT SCORE & OVERS OVERRIDE)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {/* Card 1: Change Inning 1 Runs */}
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <label className="text-[10px] text-slate-400 leading-tight block mb-1">
              Change Inning 1 Runs (+1 run added to Target):
            </label>
            <input
              type="number"
              value={adjI1Runs}
              onChange={(e) => setAdjI1Runs(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white mb-2"
            />
            <button
              onClick={() => onEmergencyAdjust({ inning1Runs: adjI1Runs })}
              className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase rounded transition"
            >
              SAVE
            </button>
          </div>

          {/* Card 2: Change Inning 1 Wickets */}
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <label className="text-[10px] text-slate-400 leading-tight block mb-1">
              Change Inning 1 Wickets:
            </label>
            <input
              type="number"
              value={adjI1Wickets}
              onChange={(e) => setAdjI1Wickets(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white mb-2"
            />
            <button
              onClick={() => onEmergencyAdjust({ inning1Wickets: adjI1Wickets })}
              className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase rounded transition"
            >
              SAVE
            </button>
          </div>

          {/* Card 3: Change Inning 2 Runs */}
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <label className="text-[10px] text-slate-400 leading-tight block mb-1">
              Change Inning 2 Runs:
            </label>
            <input
              type="number"
              value={adjI2Runs}
              onChange={(e) => setAdjI2Runs(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white mb-2"
            />
            <button
              onClick={() => onEmergencyAdjust({ inning2Runs: adjI2Runs })}
              className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase rounded transition"
            >
              SAVE
            </button>
          </div>

          {/* Card 4: Change Inning 2 Wickets */}
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <label className="text-[10px] text-slate-400 leading-tight block mb-1">
              Change Inning 2 Wickets:
            </label>
            <input
              type="number"
              value={adjI2Wickets}
              onChange={(e) => setAdjI2Wickets(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white mb-2"
            />
            <button
              onClick={() => onEmergencyAdjust({ inning2Wickets: adjI2Wickets })}
              className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase rounded transition"
            >
              SAVE
            </button>
          </div>

          {/* Card 5: Change Inning 1 Overs (balls) */}
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <label className="text-[10px] text-slate-400 leading-tight block mb-1">
              Change Inning 1 Overs (balls):
            </label>
            <input
              type="number"
              value={adjI1Balls}
              onChange={(e) => setAdjI1Balls(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white mb-2"
            />
            <button
              onClick={() => onEmergencyAdjust({ inning1Balls: adjI1Balls })}
              className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase rounded transition"
            >
              SAVE
            </button>
          </div>

          {/* Card 6: Change Inning 2 Overs (balls) */}
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <label className="text-[10px] text-slate-400 leading-tight block mb-1">
              Change Inning 2 Overs (balls):
            </label>
            <input
              type="number"
              value={adjI2Balls}
              onChange={(e) => setAdjI2Balls(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white mb-2"
            />
            <button
              onClick={() => onEmergencyAdjust({ inning2Balls: adjI2Balls })}
              className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase rounded transition"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>

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
