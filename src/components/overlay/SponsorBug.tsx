import React, { useState, useEffect } from 'react';

const SPONSORS = [
  { name: 'CrickConnect Pro', tagline: 'Official Stream Engine', logoText: '⚡ CRICKCONNECT' },
  { name: 'Apex Sports Tech', tagline: 'Broadcasting Partner', logoText: '🏆 APEX SPORTS' },
  { name: 'Vortex Energy', tagline: 'Hydration Partner', logoText: '🔥 VORTEX ENERGY' },
];

export const SponsorBug: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SPONSORS.length);
    }, 15000); // cycle every 15s
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const current = SPONSORS[index];

  return (
    <div className="fixed top-6 right-8 z-40 animate-slide-in-up">
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2 text-white shadow-xl flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <div>
          <div className="text-xs font-black tracking-widest text-amber-400 uppercase font-mono">
            {current.logoText}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">{current.tagline}</div>
        </div>
      </div>
    </div>
  );
};
