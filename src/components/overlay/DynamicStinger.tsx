import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, ShieldAlert, Award, Zap } from 'lucide-react';

interface StingerProps {
  alertType: 'NONE' | 'FOUR' | 'SIX' | 'WICKET' | 'FREE_HIT' | 'FIFTY' | 'CENTURY';
  onComplete?: () => void;
}

export const DynamicStinger: React.FC<StingerProps> = ({ alertType, onComplete }) => {
  useEffect(() => {
    if (alertType === 'NONE') return;

    if (alertType === 'SIX' || alertType === 'CENTURY') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981'],
        });
      } catch (e) {
        console.warn('Confetti trigger skipped', e);
      }
    }

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [alertType, onComplete]);

  if (alertType === 'NONE') return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {alertType === 'FOUR' && (
        <div className="animate-stinger bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-12 py-6 rounded-2xl border-4 border-blue-400 shadow-[0_0_80px_rgba(59,130,246,0.9)] flex items-center gap-4">
          <Zap className="w-16 h-16 text-yellow-300 animate-spin" />
          <div>
            <div className="text-6xl font-black italic tracking-tighter uppercase">FOUR!</div>
            <div className="text-blue-200 text-lg font-bold tracking-widest uppercase">Boundary Scored</div>
          </div>
        </div>
      )}

      {alertType === 'SIX' && (
        <div className="animate-stinger bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white px-14 py-7 rounded-2xl border-4 border-yellow-300 shadow-[0_0_100px_rgba(245,158,11,1)] flex items-center gap-5">
          <Flame className="w-20 h-20 text-yellow-200 animate-bounce" />
          <div>
            <div className="text-7xl font-black italic tracking-tighter uppercase drop-shadow-lg">MAXIMUM 6!</div>
            <div className="text-yellow-100 text-xl font-extrabold tracking-widest uppercase">Over the Ropes</div>
          </div>
        </div>
      )}

      {alertType === 'WICKET' && (
        <div className="animate-stinger bg-gradient-to-r from-red-700 via-rose-900 to-red-800 text-white px-14 py-7 rounded-2xl border-4 border-red-500 shadow-[0_0_100px_rgba(239,68,68,1)] flex items-center gap-5 animate-wicket-alert">
          <ShieldAlert className="w-20 h-20 text-red-300" />
          <div>
            <div className="text-7xl font-black italic tracking-tighter uppercase drop-shadow-md">WICKET!</div>
            <div className="text-red-200 text-xl font-bold tracking-widest uppercase">Batter Dismissed</div>
          </div>
        </div>
      )}

      {alertType === 'FREE_HIT' && (
        <div className="animate-stinger bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 px-12 py-6 rounded-2xl border-4 border-white shadow-[0_0_80px_rgba(245,158,11,0.9)] flex items-center gap-4">
          <Zap className="w-16 h-16 text-red-600 animate-pulse" />
          <div>
            <div className="text-6xl font-black tracking-tight uppercase">FREE HIT!</div>
            <div className="text-slate-900 text-lg font-bold uppercase tracking-wider">Next Ball Advantage</div>
          </div>
        </div>
      )}

      {(alertType === 'FIFTY' || alertType === 'CENTURY') && (
        <div className="animate-stinger bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 text-white px-14 py-7 rounded-2xl border-4 border-yellow-200 shadow-[0_0_90px_rgba(234,179,8,1)] flex items-center gap-5">
          <Award className="w-20 h-20 text-yellow-200" />
          <div>
            <div className="text-6xl font-black uppercase tracking-tight">{alertType === 'FIFTY' ? 'FIFTY (50*)' : 'CENTURY (100*)'}</div>
            <div className="text-yellow-100 text-lg font-semibold tracking-wider uppercase">Splendid Batting Milestone</div>
          </div>
        </div>
      )}
    </div>
  );
};
