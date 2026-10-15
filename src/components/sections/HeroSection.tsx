'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_CONFIG } from '@/config/event';
import type { CountdownTime } from '@/types';

// Real-time countdown helper
function getRemainingTime(): CountdownTime {
  const now = new Date();
  const start = EVENT_CONFIG.startDate;
  const diff = Math.max(0, start.getTime() - now.getTime());

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export default function HeroSection() {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCountdown(getRemainingTime());
    const interval = setInterval(() => {
      setCountdown(getRemainingTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById('competitions') || document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      aria-label="PRIDE Industri 2026 Hero"
      className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-4"
    >
      {/* ─── FULL BACKGROUND: 100% Fit Screen, Crisp, Unzoomed ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/LANDING_BG_HD.jpg"
          alt="Braga City Walk Bandung Landscape"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-[center_60%] filter brightness-[0.88] contrast-[1.04]"
        />

        {/* Ambient atmospheric gradients for contrast and editorial finish */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950/80 pointer-events-none" />
        
        {/* Soft Golden Hour Glow in Upper Center Sky */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ─── MAIN HERO CONTENT: Centered & Staggered Entrance ─── */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center flex-1 flex flex-col items-center justify-center my-auto">
        
        {/* 1. TOP PILL BADGE (Inspired by Dottaa's video header pill) */}
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 shadow-xl mb-5"
        >
          {/* Avatar / Icon Cluster */}
          <div className="flex -space-x-1.5 items-center">
            <span className="w-5 h-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[10px] shadow-sm">
              ✂️
            </span>
            <span className="w-5 h-5 rounded-full bg-orange-500 border border-white flex items-center justify-center text-[10px] shadow-sm">
              🍲
            </span>
            <span className="w-5 h-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[10px] shadow-sm">
              🎨
            </span>
          </div>

          <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
            Disdagin Kota Bandung · <span className="text-amber-300 font-bold">27–28 November 2026</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:inline-block" />
        </motion.div>

        {/* 2. OFFICIAL LOGO (FULL IN FRONT, CRISP & PROMINENT) */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] h-[160px] sm:h-[190px] md:h-[220px] mb-3"
        >
          {/* Subtle Ambient Radial Backlight behind Logo */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,184,0,0.3)_0%,_rgba(229,25,55,0.15)_50%,_transparent_70%)] blur-2xl pointer-events-none" />

          {/* Logo with Gentle Endless Float */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full h-full"
          >
            <Image
              src="/LOGO_PRIDE_INDUSTRI.png"
              alt="Logo Resmi PRIDE Industri 2026"
              fill
              priority
              sizes="(max-width: 640px) 340px, (max-width: 768px) 440px, 500px"
              className="object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)]"
            />
          </motion.div>

          {/* ─── COLORFUL BOUNCY FLOATING BADGES (Exact HelloDottaa Signature Style) ─── */}
          
          {/* Badge 1: Fesyen Binaan (Royal Blue) */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.65 }}
            className="absolute -top-3 sm:-top-4 -left-2 sm:-left-8 z-30 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-4, -2, -4] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] sm:text-xs shadow-lg shadow-blue-600/40 border border-blue-400 flex items-center gap-1.5 tracking-wide"
            >
              <span>👔</span>
              <span>Fesyen Binaan</span>
            </motion.div>
          </motion.div>

          {/* Badge 2: Kuliner Lokal (Vibrant Orange) */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.8 }}
            className="absolute -top-3 sm:-top-4 -right-2 sm:-right-8 z-30 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 5, 0], rotate: [5, 3, 5] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-orange-500 text-white font-extrabold text-[10px] sm:text-xs shadow-lg shadow-orange-500/40 border border-orange-300 flex items-center gap-1.5 tracking-wide"
            >
              <span>🍲</span>
              <span>Kuliner Lokal</span>
            </motion.div>
          </motion.div>

          {/* Badge 3: Video Kreatif (Bright Rose) */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.95 }}
            className="absolute -bottom-2 sm:-bottom-3 -left-1 sm:-left-6 z-30 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 4, 0], rotate: [-3, -5, -3] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-rose-500 text-white font-bold text-[9px] sm:text-[11px] shadow-lg shadow-rose-500/40 border border-rose-300 flex items-center gap-1.5 tracking-wide"
            >
              <span>🎬</span>
              <span>Lomba Video 1 Menit</span>
            </motion.div>
          </motion.div>

          {/* Badge 4: Desain Kemasan (Emerald Green) */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 1.1 }}
            className="absolute -bottom-2 sm:-bottom-3 -right-1 sm:-right-6 z-30 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [4, 2, 4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-emerald-500 text-white font-bold text-[9px] sm:text-[11px] shadow-lg shadow-emerald-500/40 border border-emerald-300 flex items-center gap-1.5 tracking-wide"
            >
              <span>📦</span>
              <span>Lomba Desain Kemasan</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 3. HEADLINE NARRATIVE & SUBTITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 max-w-2xl mx-auto mb-6"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Pagelaran Ragam Inovasi <span className="text-amber-300">&amp;</span> Eksistensi
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed drop-shadow-md max-w-xl mx-auto">
            Merayakan kebangkitan industri kreatif Kota Bandung: pameran produk fesyen &amp; kuliner binaan, panggung apresiasi seni, dan kompetisi bergengsi di Jalan Braga &amp; Hotel Papandayan.
          </p>
        </motion.div>

        {/* 4. CTA PILL BUTTONS (Matching Dottaa's video pill buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4"
        >
          {/* Primary Solid White Pill Button */}
          <Link
            href="#competitions"
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold text-slate-950 bg-white hover:bg-slate-100 shadow-xl shadow-black/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <span>Daftar Kompetisi</span>
            <span className="transition-transform group-hover:translate-x-1">🚀</span>
          </Link>

          {/* Secondary Frosted Glass Pill Button */}
          <Link
            href="#program"
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Jelajahi Agenda &amp; Peta</span>
            <span>📍</span>
          </Link>

          {/* Mobile Scanner Quick Pill */}
          <Link
            href="/check-in"
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span className="text-emerald-400">📷</span>
            <span>Check-In QR</span>
          </Link>
        </motion.div>
      </div>

      {/* ─── 5. BOTTOM PEEK WINDOW CARD (Directly from Dottaa's video frame 5s!) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.85 }}
        className="relative z-30 max-w-4xl mx-auto px-4 w-full pointer-events-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-t-2xl sm:rounded-t-3xl border-t border-x border-white/60 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] overflow-hidden transition-all">
          
          {/* Browser / App Header Chrome */}
          <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            {/* macOS Traffic Light Dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            </div>

            {/* Address Bar Pill */}
            <div className="flex-1 max-w-xs mx-auto text-center px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 truncate flex items-center justify-center gap-1.5 shadow-xs">
              <span className="text-slate-400">🔒</span>
              <span>prideindustri.bandung.go.id/agenda</span>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Pendaftaran Dibuka</span>
            </div>
          </div>

          {/* Quick Peek Dashboard Content */}
          <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center">
            
            {/* Box 1: Live Countdown */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Hitung Mundur Festival
                </span>
                <span className="text-[10px] font-bold text-blue-600">27 Nov 2026</span>
              </div>
              
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-white rounded-lg py-1 border border-slate-200 shadow-2xs">
                  <span className="text-sm sm:text-base font-black text-slate-900 block leading-tight">
                    {mounted ? countdown.days : '—'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">Hari</span>
                </div>
                <div className="bg-white rounded-lg py-1 border border-slate-200 shadow-2xs">
                  <span className="text-sm sm:text-base font-black text-blue-600 block leading-tight">
                    {mounted ? String(countdown.hours).padStart(2, '0') : '—'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">Jam</span>
                </div>
                <div className="bg-white rounded-lg py-1 border border-slate-200 shadow-2xs">
                  <span className="text-sm sm:text-base font-black text-amber-500 block leading-tight">
                    {mounted ? String(countdown.minutes).padStart(2, '0') : '—'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">Mnt</span>
                </div>
                <div className="bg-white rounded-lg py-1 border border-slate-200 shadow-2xs">
                  <span className="text-sm sm:text-base font-black text-rose-500 block leading-tight">
                    {mounted ? String(countdown.seconds).padStart(2, '0') : '—'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">Dtk</span>
                </div>
              </div>
            </div>

            {/* Box 2: Desain Kemasan Quick Track */}
            <Link
              href="/competition/desain-kemasan"
              className="group bg-blue-50/60 hover:bg-blue-50 rounded-xl p-3 border border-blue-200/80 transition-all hover:scale-[1.02] flex items-center justify-between gap-3 text-left"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                  <span>📦</span> Total Hadiah Rp 15 Juta
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-blue-600">
                  Lomba Desain Kemasan
                </h3>
                <p className="text-[10px] text-slate-500 truncate">
                  Inovasi Packaging IKM Pangan Unggulan
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>

            {/* Box 3: Video Lokal Quick Track */}
            <Link
              href="/competition/video-lokal"
              className="group bg-rose-50/60 hover:bg-rose-50 rounded-xl p-3 border border-rose-200/80 transition-all hover:scale-[1.02] flex items-center justify-between gap-3 text-left"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                  <span>🎬</span> Total Hadiah Rp 15 Juta
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-rose-600">
                  Lomba Video 1 Menit
                </h3>
                <p className="text-[10px] text-slate-500 truncate">
                  Eksplorasi Budaya Braga &amp; Industri Kreatif
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shrink-0 group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
