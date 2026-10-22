'use client';

import { useState } from 'react';

interface ScheduleItem {
  id: string;
  step: string;
  title: string;
  location: string;
  venueKey: 'braga';
  desc: string;
  category: string;
  theme: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    dotColor: string;
    accentRing: string;
  };
  highlights: string[];
}

export default function ProgramSection() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2' | 'day3'>('day1');

  const scheduleDay1: ScheduleItem[] = [
    {
      id: 'd1-1',
      step: '01',
      category: 'Art Performance',
      title: 'Sunda Fusion',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Pertunjukan seni pembuka perpaduan harmoni musik etnik Sunda kontemporer dan instrumen modern menyemarakkan pembukaan resmi PRIDE Industri 2026.',
      theme: {
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200/80',
        dotColor: 'bg-rose-600',
        accentRing: 'ring-rose-100',
      },
      highlights: ['Sunda Fusion Etnik', 'Harmoni Rampak Kendang', 'Pembukaan Resmi'],
    },
    {
      id: 'd1-2',
      step: '02',
      category: 'Pride Appreciation',
      title: 'Penyerahan Sertifikat Kelulusan Program 2026',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Seremonial simbolis penyerahan sertifikat jaminan mutu dan kelulusan program Disdagin: 46 Sertifikat Uji Mutu, 25 Sertifikat Halal, dan 93 Sertifikat Kelas Online Program KEMILAU.',
      theme: {
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200/80',
        dotColor: 'bg-emerald-600',
        accentRing: 'ring-emerald-100',
      },
      highlights: ['46 Sertifikat Uji Mutu', '25 Sertifikat Halal', '93 Sertifikat Kelas Online KEMILAU'],
    },
    {
      id: 'd1-3',
      step: '03',
      category: 'Innovation Walk',
      title: 'Peninjauan Booth - Showcase Kemasan IKM',
      location: 'Atrium & Koridor Braga City Walk',
      venueKey: 'braga',
      desc: 'Peninjauan booth pameran showcase hasil pendampingan desain kemasan IKM binaan Disdagin Kota Bandung serta display produk inovasi lokal.',
      theme: {
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200/80',
        dotColor: 'bg-blue-600',
        accentRing: 'ring-blue-100',
      },
      highlights: ['Showcase Kemasan IKM Binaan', 'Pameran Produk Lokal', 'Inovasi Kemasan Ramah Lingkungan'],
    },
    {
      id: 'd1-4',
      step: '04',
      category: 'Innovation Walk',
      title: 'Peninjauan Booth - Workshop Industry Experience',
      location: 'Area Workshop & Booth · Braga City Walk',
      venueKey: 'braga',
      desc: 'Peninjauan booth interaktif workshop industry experience dan consultation corner bersama praktisi ahli dan mitra industri Kota Bandung.',
      theme: {
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-700',
        badgeBorder: 'border-teal-200/80',
        dotColor: 'bg-teal-600',
        accentRing: 'ring-teal-100',
      },
      highlights: ['Workshop Industry Experience', 'Consultation Corner', 'Pendampingan Praktis'],
    },
    {
      id: 'd1-5',
      step: '05',
      category: 'Pride Inspiration Stage',
      title: 'Talkshow Inovasi',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Talkshow pelaku industri bersama praktisi membahas dinamika perkembangan industri Kota Bandung serta strategi inovasi packaging & display (2 sesi).',
      theme: {
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200/80',
        dotColor: 'bg-purple-600',
        accentRing: 'ring-purple-100',
      },
      highlights: ['Perkembangan Industri Bandung', 'Packaging & Display (2 Sesi)', 'Narasumber & Praktisi Ahli'],
    },
    {
      id: 'd1-6',
      step: '06',
      category: 'Presentasi Finalis',
      title: 'Lomba Desain',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Presentasi langsung karya inovasi finalis Lomba Desain Kemasan dan pemutaran karya video kreatif di hadapan dewan juri ahli dan audiens festival.',
      theme: {
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200/80',
        dotColor: 'bg-amber-600',
        accentRing: 'ring-amber-100',
      },
      highlights: ['Presentasi Finalis Kemasan', 'Screening Video 1 Menit', 'Penjurian Terbuka'],
    },
  ];

  const scheduleDay2: ScheduleItem[] = [
    {
      id: 'd2-1',
      step: '01',
      category: 'Pride Innovation Challenge',
      title: 'Business Matching',
      location: 'Area Business Matching · Braga City Walk',
      venueKey: 'braga',
      desc: '20 IKM program KEMILAU terpilih dari 3 sektor industri (Fesyen, Kuliner, Kriya) melakukan pitching eksklusif di hadapan calon mitra bisnis, agregator, dan investor.',
      theme: {
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200/80',
        dotColor: 'bg-amber-600',
        accentRing: 'ring-amber-100',
      },
      highlights: ['20 IKM Kemilau Terpilih', 'Pitching 3 Sektor Industri', 'Calon Mitra & Investor'],
    },
    {
      id: 'd2-2',
      step: '02',
      category: 'Pride Inspiration Stage',
      title: 'Branding Produk',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Sesi inspirasi dan edukasi praktis mengenai strategi branding produk lokal, identitas visual merek, serta kesiapan menembus pasar ritel modern.',
      theme: {
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-700',
        badgeBorder: 'border-teal-200/80',
        dotColor: 'bg-teal-600',
        accentRing: 'ring-teal-100',
      },
      highlights: ['Strategi Branding Produk', 'Identitas Visual Merek', 'Kesiapan Pasar Ritel'],
    },
    {
      id: 'd2-3',
      step: '03',
      category: 'Pride Fashion Show',
      title: 'Pergelaran Karya Pelatihan Fashion Disdagin',
      location: 'Main Runway Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Peragaan busana spektakuler hasil karya peserta Pelatihan Desain Fashion Binaan Disdagin Kota Bandung: Kelas Intermediate (15 IKM) & Advance (18 IKM).',
      theme: {
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200/80',
        dotColor: 'bg-purple-600',
        accentRing: 'ring-purple-100',
      },
      highlights: ['Kelas Intermediate: 15 IKM', 'Kelas Advance: 18 IKM', 'Runway Desain Kontemporer'],
    },
    {
      id: 'd2-4',
      step: '04',
      category: 'Pride Inspiration Stage',
      title: 'Industry Experience',
      location: 'Main Stage & Exhibition Area · Braga City Walk',
      venueKey: 'braga',
      desc: 'Kegiatan interaktif ini menjadi salah satu daya tarik utama untuk memperkenalkan potensi dan ragam industri kreatif Kota Bandung kepada masyarakat luas.',
      theme: {
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200/80',
        dotColor: 'bg-blue-600',
        accentRing: 'ring-blue-100',
      },
      highlights: ['Potensi Industri Kreatif Bandung', 'Interaksi Praktis IKM', 'Koneksi Komunitas'],
    },
    {
      id: 'd2-5',
      step: '05',
      category: 'Closing Ceremony',
      title: 'Pengumuman Juara Desain, Pembagian Sertifikat',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Malam puncak penutupan PRIDE Industri 2026: pengumuman pemenang lomba desain, penyerahan apresiasi kejuaraan, pembagian sertifikat, serta selebrasi penutupan resmi.',
      theme: {
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200/80',
        dotColor: 'bg-emerald-600',
        accentRing: 'ring-emerald-100',
      },
      highlights: ['Pengumuman Juara Desain', 'Penyerahan Apresiasi', 'Pembagian Sertifikat'],
    },
  ];

  const currentSchedule = activeDay === 'day1' ? scheduleDay1 : activeDay === 'day2' ? scheduleDay2 : [];
  const filteredSchedule = currentSchedule;

  return (
    <section
      id="program"
      className="relative pt-6 pb-10 sm:py-14 lg:py-16 bg-[#f8fafc] border-t border-slate-200/80 overflow-hidden"
      aria-label="Rangkaian Program PRIDE Industri 2026"
    >
      <div id="agenda" className="absolute -top-20" />

      {/* Subtle Apple-style background gradient & mesh dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Minimalist & Display Typography */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200/90 shadow-2xs mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Rundown Resmi Festival</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Susunan Rangkaian Acara
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Susunan resmi agenda kegiatan festival selama 3 hari di Braga City Walk Bandung.
          </p>

          {/* Apple-style Segmented Day Switcher */}
          <div className="mt-5 sm:mt-8 grid grid-cols-3 p-1 sm:p-1.5 rounded-xl sm:rounded-full bg-slate-200/75 border border-slate-300/80 shadow-inner gap-1 w-full max-w-sm sm:max-w-none sm:w-auto sm:inline-flex sm:flex-row font-[family-name:var(--font-poppins)] mx-auto">
            {/* Day 1 Switcher */}
            <button
              type="button"
              onClick={() => setActiveDay('day1')}
              className={`px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-full text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                activeDay === 'day1'
                  ? 'bg-white text-slate-900 shadow-xs sm:shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-[10px] sm:text-sm font-extrabold tracking-wide uppercase">
                DAY 1
              </span>
              <span className="text-[9px] sm:text-xs font-medium tracking-tight text-slate-500 sm:text-slate-600 mt-0.5">
                Jumat, 27 Nov 2026
              </span>
            </button>

            {/* Day 2 Switcher */}
            <button
              type="button"
              onClick={() => setActiveDay('day2')}
              className={`px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-full text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                activeDay === 'day2'
                  ? 'bg-white text-slate-900 shadow-xs sm:shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-[10px] sm:text-sm font-extrabold tracking-wide uppercase">
                DAY 2
              </span>
              <span className="text-[9px] sm:text-xs font-medium tracking-tight text-slate-500 sm:text-slate-600 mt-0.5">
                Sabtu, 28 Nov 2026
              </span>
            </button>

            {/* Day 3 Switcher */}
            <button
              type="button"
              onClick={() => setActiveDay('day3')}
              className={`px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-full text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                activeDay === 'day3'
                  ? 'bg-white text-slate-900 shadow-xs sm:shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-[10px] sm:text-sm font-extrabold tracking-wide uppercase">
                DAY 3
              </span>
              <span className="text-[9px] sm:text-xs font-medium tracking-tight text-slate-500 sm:text-slate-600 mt-0.5">
                Minggu, 29 Nov 2026
              </span>
            </button>
          </div>
        </div>

        {/* ─── Apple-Inspired Visual Timeline Spine & Schedule Cards ─── */}
        <div className="relative space-y-2.5 sm:space-y-6">
          
          {/* Continuous vertical timeline connector (Desktop only) */}
          {activeDay !== 'day3' && (
            <div
              className="hidden sm:block absolute left-[106px] top-6 bottom-6 w-[2px] bg-slate-200/90 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {activeDay === 'day3' ? (
            <div className="text-center py-16 px-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)] max-w-xl mx-auto my-4 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Rundown Day 3 · Minggu, 29 Nov 2026</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                TO BE ANNOUNCE
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                Susunan rangkaian acara untuk hari ke-3 akan segera diumumkan oleh panitia pelaksana.
              </p>
            </div>
          ) : (
            filteredSchedule.map((item) => {
              return (
                <div
                  key={item.id}
                  className="relative flex flex-col sm:flex-row items-stretch sm:items-start sm:gap-7 group"
                >
                  {/* Desktop-only: Left Column Sequence Number */}
                  <div className="hidden sm:flex sm:w-[92px] flex-shrink-0 pt-1 flex-col items-end gap-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      SESI
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                      {item.step}
                    </div>
                  </div>

                  {/* Desktop-only: Center Timeline Node Bead */}
                  <div
                    className="hidden sm:flex items-center justify-center relative z-10 flex-shrink-0 pt-2"
                    aria-hidden="true"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white ring-4 ${item.theme.accentRing} ${item.theme.dotColor} shadow-xs transition-transform group-hover:scale-125`}
                    />
                  </div>

                  {/* Rundown Card (Mobile: compact integrated card; Desktop: spacious card) */}
                  <div className="flex-1 w-full bg-white rounded-xl sm:rounded-3xl p-3 sm:p-6 border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.03)] sm:shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:border-slate-300 hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.05)] transition-all">
                    <div className="flex items-center sm:items-start gap-3 sm:gap-4">
                      {/* Mobile-only: Compact SESI Badge */}
                      <div className="sm:hidden flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-slate-100/90 border border-slate-200/80 shrink-0 text-center">
                        <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-slate-400 leading-none">
                          SESI
                        </span>
                        <span className="text-base font-black font-mono text-slate-900 leading-tight mt-0.5 group-hover:text-blue-600 transition-colors">
                          {item.step}
                        </span>
                      </div>

                      {/* Content: Badge & Title */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-2">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-bold tracking-wide border ${item.theme.badgeBg} ${item.theme.badgeText} ${item.theme.badgeBorder}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.theme.dotColor}`} />
                            <span>{item.category}</span>
                          </span>
                        </div>

                        <h3 className="text-[13.5px] sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {activeDay !== 'day3' && filteredSchedule.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-8">
              <p className="text-xs sm:text-sm text-slate-500">
                Tidak ada agenda yang berlangsung di lokasi filter ini. Silakan pilih &ldquo;Semua Lokasi&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Helpful Note */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 text-[11px] sm:text-xs text-slate-500 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              Seluruh sesi pameran publik &amp; panggung di <strong>Braga City Walk</strong> terbuka gratis tanpa tiket masuk.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
