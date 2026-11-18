import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, ShieldAlert, Award, Zap, Sparkles } from 'lucide-react';

interface StingerProps {
  alertType: 'NONE' | 'FOUR' | 'SIX' | 'WICKET' | 'FREE_HIT' | 'FIFTY' | 'CENTURY' | 'HAT_TRICK';
  onComplete?: () => void;
}

export const DynamicStinger: React.FC<StingerProps> = ({ alertType, onComplete }) => {
  useEffect(() => {
    if (alertType === 'NONE') return;

    if (alertType === 'SIX' || alertType === 'CENTURY' || alertType === 'HAT_TRICK') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899'],
        });
      } catch (e) {
        console.warn('Confetti trigger skipped', e);
      }
    }

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [alertType, onComplete]);

  if (alertType === 'NONE') return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 p-4">
      {alertType === 'FOUR' && (
        <div className="animate-stinger bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-6 py-4 sm:px-12 sm:py-6 rounded-2xl border-4 border-blue-400 shadow-[0_0_80px_rgba(59,130,246,0.9)] flex items-center gap-3 sm:gap-4 max-w-sm sm:max-w-none">
          <Zap className="w-10 h-10 sm:w-16 sm:h-16 text-yellow-300 animate-spin shrink-0" />
          <div>
            <div className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase">FOUR!</div>
            <div className="text-blue-200 text-xs sm:text-lg font-bold tracking-widest uppercase">Boundary Scored</div>
          </div>
        </div>
      )}

      {alertType === 'SIX' && (
        <div className="animate-stinger bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white px-6 py-4 sm:px-14 sm:py-7 rounded-2xl border-4 border-yellow-300 shadow-[0_0_100px_rgba(245,158,11,1)] flex items-center gap-3 sm:gap-5 max-w-sm sm:max-w-none">
          <Flame className="w-12 h-12 sm:w-20 sm:h-20 text-yellow-200 animate-bounce shrink-0" />
          <div>
            <div className="text-4xl sm:text-7xl font-black italic tracking-tighter uppercase drop-shadow-lg">MAXIMUM 6!</div>
            <div className="text-yellow-100 text-xs sm:text-xl font-extrabold tracking-widest uppercase">Over the Ropes</div>
          </div>
        </div>
      )}

      {alertType === 'WICKET' && (
        <div className="animate-stinger bg-gradient-to-r from-red-700 via-rose-900 to-red-800 text-white px-6 py-4 sm:px-14 sm:py-7 rounded-2xl border-4 border-red-500 shadow-[0_0_100px_rgba(239,68,68,1)] flex items-center gap-3 sm:gap-5 animate-wicket-alert max-w-sm sm:max-w-none">
          <ShieldAlert className="w-12 h-12 sm:w-20 sm:h-20 text-red-300 shrink-0" />
          <div>
            <div className="text-4xl sm:text-7xl font-black italic tracking-tighter uppercase drop-shadow-md">WICKET!</div>
            <div className="text-red-200 text-xs sm:text-xl font-bold tracking-widest uppercase">Batter Dismissed</div>
          </div>
        </div>
      )}

      {alertType === 'FREE_HIT' && (
        <div className="animate-stinger bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 px-6 py-4 sm:px-12 sm:py-6 rounded-2xl border-4 border-white shadow-[0_0_80px_rgba(245,158,11,0.9)] flex items-center gap-3 sm:gap-4 max-w-sm sm:max-w-none">
          <Zap className="w-10 h-10 sm:w-16 sm:h-16 text-red-600 animate-pulse shrink-0" />
          <div>
            <div className="text-4xl sm:text-6xl font-black tracking-tight uppercase">FREE HIT!</div>
            <div className="text-slate-900 text-xs sm:text-lg font-bold uppercase tracking-wider">Next Ball Advantage</div>
          </div>
        </div>
      )}

      {alertType === 'HAT_TRICK' && (
        <div className="animate-stinger bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-700 text-white px-6 py-4 sm:px-14 sm:py-7 rounded-2xl border-4 border-pink-300 shadow-[0_0_100px_rgba(236,72,153,1)] flex items-center gap-3 sm:gap-5 max-w-sm sm:max-w-none">
          <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 text-yellow-200 animate-spin shrink-0" />
          <div>
            <div className="text-3xl sm:text-6xl font-black uppercase tracking-tight">HAT-TRICK BALL!</div>
            <div className="text-pink-100 text-xs sm:text-lg font-semibold tracking-wider uppercase">3 Wickets in 3 Deliveries</div>
          </div>
        </div>
      )}

      {(alertType === 'FIFTY' || alertType === 'CENTURY') && (
        <div className="animate-stinger bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 text-white px-6 py-4 sm:px-14 sm:py-7 rounded-2xl border-4 border-yellow-200 shadow-[0_0_90px_rgba(234,179,8,1)] flex items-center gap-3 sm:gap-5 max-w-sm sm:max-w-none">
          <Award className="w-12 h-12 sm:w-20 sm:h-20 text-yellow-200 shrink-0" />
          <div>
            <div className="text-3xl sm:text-6xl font-black uppercase tracking-tight">{alertType === 'FIFTY' ? 'FIFTY (50*)' : 'CENTURY (100*)'}</div>
            <div className="text-yellow-100 text-xs sm:text-lg font-semibold tracking-wider uppercase">Splendid Batting Milestone</div>
          </div>
        </div>
      )}
    </div>
  );
};
