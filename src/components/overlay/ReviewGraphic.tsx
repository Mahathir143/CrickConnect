import React from 'react';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';

interface ReviewGraphicProps {
  status: 'NONE' | 'IN_PROGRESS' | 'OUT' | 'NOT_OUT';
}

export const ReviewGraphic: React.FC<ReviewGraphicProps> = ({ status }) => {
  if (status === 'NONE') return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {status === 'IN_PROGRESS' && (
        <div className="bg-slate-950/95 border-4 border-amber-500 rounded-3xl p-8 shadow-[0_0_90px_rgba(245,158,11,0.8)] text-center animate-pulse-glow max-w-lg">
          <Eye className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
          <div className="text-4xl font-black text-amber-400 uppercase tracking-wider mb-2">DRS REVIEW</div>
          <div className="text-xl font-bold text-white tracking-widest uppercase">Third Umpire Checking...</div>
        </div>
      )}

      {status === 'OUT' && (
        <div className="bg-red-950/95 border-4 border-red-500 rounded-3xl p-8 shadow-[0_0_90px_rgba(239,68,68,0.9)] text-center animate-wicket-alert max-w-lg">
          <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <div className="text-6xl font-black text-white uppercase tracking-tighter mb-2">OUT</div>
          <div className="text-xl font-bold text-red-200 tracking-widest uppercase">Decision Confirmed</div>
        </div>
      )}

      {status === 'NOT_OUT' && (
        <div className="bg-emerald-950/95 border-4 border-emerald-500 rounded-3xl p-8 shadow-[0_0_90px_rgba(16,185,129,0.9)] text-center animate-bounce max-w-lg">
          <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
          <div className="text-6xl font-black text-white uppercase tracking-tighter mb-2">NOT OUT</div>
          <div className="text-xl font-bold text-emerald-200 tracking-widest uppercase">Batter Remains At Crease</div>
        </div>
      )}
    </div>
  );
};
