'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const INTRO_KEY = 'pride2026_intro_seen_v2';

export default function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<'focus' | 'shutter' | 'reveal'>('focus');

  useEffect(() => {
    // Respect reduced-motion — dismiss immediately
    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const alreadySeen = sessionStorage.getItem(INTRO_KEY) === '1';

    if (prefersReduced || alreadySeen) {
      setVisible(false);
      return;
    }

    // Sequence: focus -> shutter -> reveal -> remove
    const t1 = setTimeout(() => setPhase('shutter'), 700);
    const t2 = setTimeout(() => setPhase('reveal'), 1100);
    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(INTRO_KEY, '1');
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700 ease-out"
      style={{
        opacity: phase === 'reveal' ? 0 : 1,
      }}
      aria-hidden="true"
    >
      {/* Aperture Ring & Viewfinder */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Outer Circular Reticle */}
        <div
          className="absolute inset-0 rounded-full border border-[#C8A96E]/40 transition-transform duration-700 ease-out"
          style={{
            transform: phase === 'shutter' ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Inner Diamond Reticle */}
        <div
          className="absolute inset-10 rounded-full border border-[#E85B26]/30 transition-transform duration-700 ease-out"
          style={{
            transform: phase === 'shutter' ? 'rotate(45deg) scale(0.95)' : 'rotate(0deg) scale(1)',
          }}
        />

        {/* Viewfinder Target Corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#C8A96E]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C8A96E]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C8A96E]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#C8A96E]" />

        {/* Shutter Center Glow */}
        <div className="absolute inset-16 rounded-full bg-[radial-gradient(circle_at_center,_rgba(200,169,110,0.3)_0%,_transparent_70%)] blur-xl" />

        {/* Center Official Logo */}
        <div className="relative w-40 h-40">
          <Image
            src="/LOGO_PRIDE_INDUSTRI.png"
            alt="PRIDE Industri 2026"
            fill
            sizes="160px"
            className="object-contain filter brightness-110 drop-shadow-[0_0_20px_rgba(200,169,110,0.4)]"
            priority
          />
        </div>
      </div>

      {/* Shutter White Flash Burst */}
      <div
        className="fixed inset-0 bg-white transition-opacity duration-150 pointer-events-none"
        style={{
          opacity: phase === 'shutter' ? 0.75 : 0,
        }}
      />

      {/* Narrative Label */}
      <div className="mt-8 text-center space-y-1">
        <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#8A8A8A]">
          27–28 November 2026 · Bandung
        </div>
        <div className="font-display italic text-sm text-[#C8A96E]">
          Pagelaran Ragam Inovasi dan Eksistensi
        </div>
      </div>
    </div>
  );
}
