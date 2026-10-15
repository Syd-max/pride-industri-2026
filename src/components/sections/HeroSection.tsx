'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation on mount
    const timer = setTimeout(() => setIsLoaded(true), 120);

    const handleScroll = () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        setScrollY(window.scrollY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToContent = () => {
    const el = document.querySelector('#countdown') || document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[660px] max-h-[1080px] overflow-hidden flex flex-col justify-between select-none bg-[#18191c]"
      aria-label="Hero PRIDE Industri 2026 — iPhone Depth Experience"
    >
      {/* ─── AMBIENT ATMOSPHERE BACKDROP (Soft sunset blur for screen edges) ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <Image
          src="/LANDING_BG.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center filter blur-3xl scale-125 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/70" />
      </div>

      {/* ─── MAIN STAGE: Natural Aspect Ratio without Zooming (Crisp & Uncropped) ─── */}
      <div className="absolute inset-x-0 bottom-0 top-14 sm:top-16 z-0 flex items-end justify-center pointer-events-none">
        <div
          className="relative w-full max-w-[1240px] h-[74vh] sm:h-[78vh] md:h-[82vh] max-h-[750px] aspect-[1024/683] will-change-transform"
          style={{
            transform: `translate3d(${mousePos.x * 4}px, ${mousePos.y * 4 - scrollY * 0.08}px, 0)`,
            transition: 'transform 0.12s ease-out',
          }}
        >
          {/* LAYER 1: Background Photo (Unzoomed, 100% Crisp Native Aspect Ratio) */}
          <Image
            src="/LANDING_BG.jpg"
            alt="Braga City Walk Landscape"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1240px"
            className="object-contain object-bottom filter brightness-[1.02] contrast-[1.02]"
          />

          {/* Sunrise Ambient Glow in the Sky */}
          <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none animate-pulse-glow" />

          {/* LAYER 2: PRIDE Logo (In the open sky of the photo, lower right tucks behind roof) */}
          <div
            className="absolute z-10 will-change-transform flex items-center justify-center pointer-events-none"
            style={{
              // Positioned precisely in the open sky above the street (left of the main building)
              top: '4%',
              left: '12%',
              right: '28%',
              height: '52%',
              transform: `translate3d(${mousePos.x * 10}px, ${
                mousePos.y * 10 - scrollY * 0.22 + (isLoaded ? 0 : 40)
              }px, 0)`,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.9s ease-out, transform 0.16s ease-out',
            }}
          >
            <div className="relative w-full h-full max-w-[480px] max-h-[320px] animate-float-slow">
              {/* Subtle warm glow behind the logo */}
              <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,184,0,0.3)_0%,_rgba(229,25,55,0.15)_50%,_transparent_70%)] blur-2xl" />

              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="Logo PRIDE Industri 2026"
                fill
                priority
                sizes="(max-width: 640px) 85vw, 480px"
                className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>

          {/* LAYER 3: Foreground Building Cutout (Exact same object-contain, occludes lower-right of logo) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <Image
              src="/LANDING_FOREGROUND.png"
              alt="Warenhuis De Vries Foreground"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1240px"
              className="object-contain object-bottom filter brightness-[1.02] contrast-[1.02]"
            />
          </div>
        </div>
      </div>

      {/* ─── LAYER 4: iOS Lockscreen UI Header Chrome (z-30) ─── */}
      <div className="relative z-30 pt-16 sm:pt-20 px-4 text-center space-y-1.5 pointer-events-auto">
        {/* Dynamic Island / Lockscreen Date Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-ios text-xs font-bold text-white tracking-wider uppercase shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Jum&apos;at, 27 November 2026 · Braga Bandung</span>
        </div>

        {/* Narrative Subtitle */}
        <div className="space-y-0.5 max-w-xl mx-auto">
          <h2 className="text-xs sm:text-sm md:text-base font-extrabold text-amber-300 tracking-wider uppercase drop-shadow-md">
            Pagelaran Ragam Inovasi dan Eksistensi
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-300 font-semibold tracking-widest uppercase drop-shadow">
            Braga City Walk & Ballroom Papandayan · Disdagin Kota Bandung
          </p>
        </div>
      </div>

      {/* ─── LAYER 5: iOS Lockscreen Bottom Controls & Quick Actions (z-30) ─── */}
      <div className="relative z-30 pb-5 sm:pb-7 px-4 max-w-3xl mx-auto w-full space-y-3 pointer-events-auto">
        
        {/* iOS Lockscreen Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/competition/desain-kemasan"
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-blue-600/90 hover:bg-blue-600 shadow-lg shadow-blue-500/30 border border-blue-400/40 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>📦</span>
            <span>Lomba Desain Kemasan</span>
          </Link>

          <Link
            href="/competition/video-lokal"
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-rose-600/90 hover:bg-rose-600 shadow-lg shadow-rose-500/30 border border-rose-400/40 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>🎬</span>
            <span>Lomba Video 1 Menit</span>
          </Link>

          <Link
            href="/check-in"
            className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white glass-ios hover:bg-white/30 transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            <svg
              className="w-4 h-4 text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            <span>Kamera QR Check-In</span>
          </Link>
        </div>

        {/* iOS Home Bar & Swipe Down Indicator */}
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center justify-center gap-1 mx-auto text-slate-300 hover:text-white transition-colors cursor-pointer pt-1 group"
          aria-label="Gulir ke bawah untuk eksplorasi festival"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300 group-hover:text-white">
            Gulir untuk Jelajahi Festival
          </span>
          <div className="w-12 h-1 bg-white/40 group-hover:bg-white rounded-full transition-all" />
          <svg
            className="w-4 h-4 animate-bounce text-slate-300 group-hover:text-white mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

      </div>
    </section>
  );
}
