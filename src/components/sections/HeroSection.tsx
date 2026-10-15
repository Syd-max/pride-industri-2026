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
    const timer = setTimeout(() => setIsLoaded(true), 150);

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
      className="relative w-full h-[100svh] min-h-[660px] max-h-[1080px] overflow-hidden flex flex-col justify-between select-none bg-slate-950"
      aria-label="Hero PRIDE Industri 2026 — iPhone Depth Experience"
    >
      {/* ─── LAYER 1: Background Scenery & Extended Sky (z-0) ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * 5}px, ${mousePos.y * 5 - scrollY * 0.12}px, 0)`,
          transition: 'transform 0.12s ease-out',
        }}
      >
        <Image
          src="/LANDING_BG_EXTENDED.jpg"
          alt="Braga City Walk Bandung Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom filter brightness-[0.94] contrast-[1.05]"
        />

        {/* Sunrise Ambient Glow in the Sky */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/45 pointer-events-none" />
        <div className="absolute top-1/6 left-1/4 w-96 h-96 rounded-full bg-amber-400/25 blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* ─── LAYER 2: Emergent PRIDE Logo (z-10) — In the open sky, lower edge behind building ─── */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none will-change-transform"
        style={{
          // Parallax depth: logo moves slightly faster than background, creating authentic 3D depth
          transform: `translate3d(${mousePos.x * 14}px, ${
            mousePos.y * 14 - scrollY * 0.32 + (isLoaded ? 0 : 70)
          }px, 0)`,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.2s ease-out, transform 0.16s ease-out',
        }}
      >
        {/* Floating Logo Composition positioned in the open Braga sky */}
        <div className="relative -mt-24 sm:-mt-32 md:-mt-40 w-[85vw] max-w-[440px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-[600px] aspect-[16/11] animate-float-slow">
          
          {/* Subtle colorful neon aura behind the logo */}
          <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,184,0,0.3)_0%,_rgba(229,25,55,0.2)_50%,_transparent_75%)] blur-2xl" />

          <Image
            src="/LOGO_PRIDE_INDUSTRI.png"
            alt="Logo PRIDE Industri 2026 — Pagelaran Ragam Inovasi dan Eksistensi"
            fill
            priority
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 500px, 600px"
            className="object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
          />
        </div>
      </div>

      {/* ─── LAYER 3: Foreground Building & Street (z-20) ─── */}
      {/* Sits right in front of the logo, gently occluding only the bottom edge like iOS 16 Lock Screen */}
      <div
        className="absolute inset-0 z-20 pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * 5}px, ${mousePos.y * 5 - scrollY * 0.12}px, 0)`,
          transition: 'transform 0.12s ease-out',
        }}
      >
        <Image
          src="/LANDING_FOREGROUND_EXTENDED.png"
          alt="Warenhuis De Vries & Braga Building Cutout"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom filter brightness-[0.94] contrast-[1.05]"
        />
      </div>

      {/* ─── LAYER 4: iOS Lockscreen UI Header Chrome (z-30) ─── */}
      <div className="relative z-30 pt-16 sm:pt-20 px-4 text-center space-y-2 pointer-events-auto">
        {/* Dynamic Island / Lockscreen Date Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-ios text-xs font-bold text-white tracking-wider uppercase shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Jum&apos;at, 27 November 2026 · Braga Bandung</span>
        </div>

        {/* Narrative Subtitle — Cleanly positioned above the logo with breathing room */}
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
      <div className="relative z-30 pb-6 sm:pb-8 px-4 max-w-3xl mx-auto w-full space-y-3 pointer-events-auto">
        
        {/* iOS Lockscreen Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/competition/desain-kemasan"
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold text-white bg-blue-600/90 hover:bg-blue-600 shadow-lg shadow-blue-500/30 border border-blue-400/40 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>📦</span>
            <span>Lomba Desain Kemasan</span>
          </Link>

          <Link
            href="/competition/video-lokal"
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold text-white bg-rose-600/90 hover:bg-rose-600 shadow-lg shadow-rose-500/30 border border-rose-400/40 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>🎬</span>
            <span>Lomba Video 1 Menit</span>
          </Link>

          <Link
            href="/check-in"
            className="px-4 py-3 rounded-full text-xs sm:text-sm font-bold text-white glass-ios hover:bg-white/30 transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
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
