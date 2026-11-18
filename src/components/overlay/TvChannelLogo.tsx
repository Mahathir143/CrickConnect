import React from 'react';
import { OverlayState } from '../../types/cricket';
import { Radio } from 'lucide-react';

interface TvChannelLogoProps {
  tvLogo: OverlayState['tvLogo'];
}

export const TvChannelLogo: React.FC<TvChannelLogoProps> = ({ tvLogo }) => {
  if (!tvLogo || !tvLogo.enabled) return null;

  return (
    <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-40 select-none pointer-events-none animate-slide-in-up">
      <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-2xl text-white">
        {tvLogo.imageUrl ? (
          <img
            src={tvLogo.imageUrl}
            alt="Channel Logo"
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded"
          />
        ) : (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-md shrink-0">
            TV
          </div>
        )}

        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs sm:text-sm tracking-wider font-mono uppercase text-amber-400 drop-shadow">
              {tvLogo.text || 'CRICKCONNECT'}
            </span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-red-600/90 text-white font-black text-[9px] uppercase tracking-widest animate-pulse">
              <Radio className="w-2.5 h-2.5" />
              LIVE
            </span>
          </div>
          {tvLogo.subText && (
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wide">
              {tvLogo.subText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
