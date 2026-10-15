'use client';

import Image from 'next/image';
import Link from 'next/link';
import { EVENT_CONFIG } from '@/config/event';

export default function HeroSection() {
  return (
    <section
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50"
      aria-label="Hero PRIDE Industri 2026"
    >
      {/* ─── Colorful Decorative Geometric Shapes from Proposal ─── */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-bl-full bg-gradient-to-br from-blue-500/10 to-blue-600/20 pointer-events-none -z-0" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-gradient-to-tr from-amber-400/15 to-orange-500/10 blur-2xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-rose-500/10 to-red-500/10 blur-3xl pointer-events-none -z-0" />

      {/* Decorative Dot Matrix Accent */}
      <div className="absolute top-20 left-10 w-32 h-32 pattern-dots opacity-40 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-10 right-10 w-40 h-40 pattern-dots opacity-40 pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ─── LEFT COLUMN: Text, Narrative & Action CTAs ─── */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Official Badge Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Pemerintah Kota Bandung
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                Disdagin Kota Bandung
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                RRD Organizer
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                PRIDE{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-rose-600 to-amber-500">
                  INDUSTRI 2026
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-slate-700 tracking-tight">
                Pagelaran Ragam Inovasi dan Eksistensi
              </p>
            </div>

            {/* Description Narrative */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Perhelatan akbar perayaan inovasi, apresiasi karya, dan unjuk
              eksistensi ratusan pelaku Industri Kecil dan Menengah (IKM) binaan
              Kota Bandung — menghadirkan kurasi fesyen, kriya, dan kuliner
              terbaik di kawasan bersejarah Braga.
            </p>

            {/* Key Event Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tanggal
                </div>
                <div className="text-sm font-extrabold text-blue-700 mt-0.5">
                  27–28 Nov 2026
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lokasi Venue
                </div>
                <div className="text-sm font-extrabold text-rose-700 mt-0.5">
                  Braga City Walk
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-left col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pendaftaran Lomba
                </div>
                <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                  Gratis / Umum
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
              <Link
                href="/competition/desain-kemasan"
                className="px-6 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 flex-1 sm:flex-initial min-w-[200px] text-center"
              >
                Lomba Desain Kemasan
              </Link>
              <Link
                href="/competition/video-lokal"
                className="px-6 py-3.5 rounded-full text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/25 transition-all hover:-translate-y-0.5 flex-1 sm:flex-initial min-w-[200px] text-center"
              >
                Lomba Video 1 Menit
              </Link>
              <Link
                href="/check-in"
                className="px-6 py-3.5 rounded-full text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-300 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <svg
                  className="w-4 h-4 text-blue-600"
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
                <span>Check-In Peserta</span>
              </Link>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Creative Brand Visual & Poster Showcase ─── */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Colorful Underlay Frame */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 via-rose-500 to-amber-500 rounded-3xl opacity-20 blur-xl transform rotate-1 pointer-events-none" />

              {/* White Card Container */}
              <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-4 sm:p-6">
                
                {/* Hero Header with Logo */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="relative w-14 h-14">
                    <Image
                      src="/LOGO_PRIDE_INDUSTRI.png"
                      alt="Logo PRIDE Industri"
                      fill
                      className="object-contain"
                      sizes="56px"
                      priority
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Disdagin Kota Bandung
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      KEMILAU KOTA BANDUNG
                    </span>
                  </div>
                </div>

                {/* Proposal Poster Graphic */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden my-4 border border-slate-100">
                  <Image
                    src="/HERO_PROPOSAL_POSTER.png"
                    alt="Poster Resmi PRIDE Industri 2026"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                  />
                </div>

                {/* Highlights Bottom Strip */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                    <span className="text-xs font-extrabold text-blue-800 block">
                      Rp 4.500.000
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600 uppercase">
                      Total Hadiah Lomba
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-center">
                    <span className="text-xs font-extrabold text-rose-800 block">
                      200+ Pelaku IKM
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600 uppercase">
                      Fesyen · Kriya · Kuliner
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge */}
              <div className="absolute -bottom-4 -left-4 bg-amber-400 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce">
                <span>⭐</span>
                <span>Terbuka untuk Umum!</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
