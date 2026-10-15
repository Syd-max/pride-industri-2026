'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EVENT_CONFIG } from '@/config/event';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#0A0A0A]"
      aria-label="Hero PRIDE Industri 2026"
    >
      {/* ─── LAYER 1: Braga Landscape Background (Parallax Base) ─── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0003})`,
          transition: 'transform 0.1s linear',
        }}
      >
        <Image
          src="/LANDING_BG.jpg"
          alt="Braga City Walk Landscape Bandung"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.72] contrast-[1.12]"
        />
        {/* Editorial Vignette & Color Grading Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A0A0A]/30 to-[#0A0A0A]/90" />
      </div>

      {/* ─── LAYER 2: Architectural Depth Effect & Background Typography ─── */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <span
          className="font-display font-black text-[18vw] leading-none uppercase tracking-tighter opacity-15 text-transparent whitespace-nowrap"
          style={{
            WebkitTextStroke: '2px rgba(200, 169, 110, 0.45)',
          }}
        >
          BRAGA 2026
        </span>
      </div>

      {/* ─── LAYER 3: Emergent Official Logo Composition ─── */}
      <div
        className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-12 text-center"
        style={{
          transform: `translateY(${scrollY * -0.08}px)`,
        }}
      >
        {/* Subtle Fashion Editorial Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[rgba(200,169,110,0.3)] bg-[#0A0A0A]/70 backdrop-blur-md mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#E85B26] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E4C584]">
            Official Festival Portal · Kota Bandung
          </span>
        </div>

        {/* Hero Logo Layer - Sitting within architectural depth */}
        <div className="relative w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 my-2 drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] filter">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(200,169,110,0.22)_0%,_transparent_70%)] blur-2xl" />
          <Image
            src="/LOGO_PRIDE_INDUSTRI.png"
            alt="Logo Resmi PRIDE Industri 2026"
            fill
            priority
            sizes="(max-width: 640px) 176px, (max-width: 768px) 240px, 288px"
            className="object-contain filter brightness-[1.08] contrast-[1.05]"
          />
        </div>

        {/* Editorial Subheading & Narrative Hook */}
        <div className="max-w-3xl mt-4">
          <h1 className="sr-only">
            PRIDE Industri 2026 — Pagelaran Ragam Inovasi dan Eksistensi
          </h1>
          <p className="font-display italic text-2xl sm:text-3xl md:text-4xl text-[#F5F0E8] font-normal tracking-wide">
            Pagelaran Ragam Inovasi dan Eksistensi
          </p>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-[#B8B0A4] max-w-xl mx-auto leading-relaxed tracking-wider uppercase font-medium">
            27–28 November 2026 · Braga City Walk, Kota Bandung
          </p>
        </div>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8 max-w-xl w-full">
          <Link
            href="/competition/desain-kemasan"
            className="btn btn-primary text-xs sm:text-sm px-6 py-3.5 tracking-wider uppercase shadow-[0_4px_20px_rgba(200,169,110,0.25)] flex-1 min-w-[200px]"
          >
            Lomba Desain Kemasan
          </Link>
          <Link
            href="/competition/video-lokal"
            className="btn btn-secondary text-xs sm:text-sm px-6 py-3.5 tracking-wider uppercase flex-1 min-w-[200px]"
          >
            Lomba Video 1 Menit
          </Link>
          <Link
            href="/check-in"
            className="btn btn-ghost text-xs sm:text-sm px-6 py-3.5 tracking-wider uppercase w-full sm:w-auto text-[#E4C584] border-[#C8A96E]/40"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Check-In Peserta (Kamera QR)
          </Link>
        </div>
      </div>

      {/* ─── LAYER 4: Editorial Bottom Meta Strip ─── */}
      <div className="relative z-20 border-t border-[rgba(255,255,255,0.08)] bg-[#0A0A0A]/85 backdrop-blur-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs tracking-widest uppercase text-[#8A8A8A]">
          <div className="flex items-center gap-3">
            <span className="text-[#C8A96E] font-semibold">Penyelenggara:</span>
            <span>PT Rahman Ramadhan Diandra (RRD Organizer)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E85B26] font-semibold">Venue:</span>
            <span>Braga City Walk · Sumur Bandung</span>
          </div>
          <div className="flex items-center gap-4">
            <span>#PRIDEIndustri2026</span>
            <span>#KaryaLokalCeritaLokal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
