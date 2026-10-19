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
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

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

  const currentSchedule = activeDay === 'day1' ? scheduleDay1 : scheduleDay2;
  const filteredSchedule = currentSchedule;

  const toggleItem = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
            Susunan resmi agenda kegiatan festival selama 2 hari di Braga City Walk Bandung.
          </p>

          {/* Apple-style Segmented Day Switcher */}
          <div className="mt-8 sm:mt-10 inline-flex flex-col sm:flex-row p-1.5 rounded-2xl sm:rounded-full bg-slate-200/75 border border-slate-300/80 shadow-inner gap-1.5 w-full sm:w-auto">
            {/* Day 1 Switcher */}
            <button
              type="button"
              onClick={() => {
                setActiveDay('day1');
                setExpandedIds([]);
              }}
              className={`px-5 py-3 rounded-xl sm:rounded-full text-left sm:text-center transition-all cursor-pointer flex items-center justify-between sm:justify-center gap-3 ${
                activeDay === 'day1'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="flex flex-col sm:items-center">
                <span className="text-xs sm:text-sm tracking-tight">
                  Hari 1 · Jum&apos;at, 27 Nov 2026
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">
                  Braga City Walk Bandung
                </span>
              </div>
              {activeDay === 'day1' && (
                <span className="sm:hidden w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Day 2 Switcher */}
            <button
              type="button"
              onClick={() => {
                setActiveDay('day2');
                setExpandedIds([]);
              }}
              className={`px-5 py-3 rounded-xl sm:rounded-full text-left sm:text-center transition-all cursor-pointer flex items-center justify-between sm:justify-center gap-3 ${
                activeDay === 'day2'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="flex flex-col sm:items-center">
                <span className="text-xs sm:text-sm tracking-tight">
                  Hari 2 · Sabtu, 28 Nov 2026
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">
                  Braga City Walk Bandung
                </span>
              </div>
              {activeDay === 'day2' && (
                <span className="sm:hidden w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* ─── Apple-Inspired Visual Timeline Spine & Schedule Cards ─── */}
        <div className="relative space-y-6 sm:space-y-8">
          
          {/* Continuous vertical timeline connector (Desktop only) */}
          <div
            className="hidden sm:block absolute left-[106px] top-6 bottom-6 w-[2px] bg-slate-200/90 pointer-events-none"
            aria-hidden="true"
          />

          {filteredSchedule.map((item) => {
            const isExpanded = expandedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-7 group"
              >
                {/* Left Column: Sequence Number (Tanpa Jam, Murni Susunan Acara) */}
                <div className="w-full sm:w-[92px] flex-shrink-0 pt-1 flex items-center sm:items-end justify-between sm:justify-start sm:flex-col gap-0.5 border-b sm:border-b-0 pb-2 sm:pb-0 border-slate-200/60">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    SESI
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                    {item.step}
                  </div>
                </div>

                {/* Center Timeline Node Bead (Desktop only) */}
                <div
                  className="hidden sm:flex items-center justify-center relative z-10 flex-shrink-0 pt-2"
                  aria-hidden="true"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white ring-4 ${item.theme.accentRing} ${item.theme.dotColor} shadow-xs transition-transform group-hover:scale-125`}
                  />
                </div>

                {/* Right Column: Apple-Style Refined Card */}
                <div className={`flex-1 w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border transition-all ${
                  isExpanded
                    ? 'border-blue-200 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.08)] ring-1 ring-blue-100'
                    : 'border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:border-slate-300 hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.05)]'
                }`}>
                  {/* Card Top Metadata: Category Pill + Location Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${item.theme.badgeBg} ${item.theme.badgeText} ${item.theme.badgeBorder}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.theme.dotColor}`} />
                        <span>{item.category}</span>
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/70">
                      <svg className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {/* Card Main Title + Accordion Toggle Header */}
                  <div
                    onClick={() => toggleItem(item.id)}
                    className="flex items-start sm:items-center justify-between gap-3 mt-3 cursor-pointer group/title select-none"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(item.id);
                      }
                    }}
                    aria-expanded={isExpanded}
                  >
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight group-hover/title:text-blue-600 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Chevron Toggle Button with Down/Up > < Arrow */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItem(item.id);
                      }}
                      aria-label={isExpanded ? `Tutup detail ${item.title}` : `Buka detail ${item.title}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isExpanded
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/90 shadow-2xs hover:bg-blue-100'
                          : 'bg-slate-100/90 text-slate-700 border border-slate-200/90 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                        {isExpanded ? 'Tutup' : 'Buka'}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-blue-600' : 'rotate-0 text-slate-500'
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>

                  {/* Accordion Detail: Only shown when opened (isExpanded = true) */}
                  {isExpanded && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {/* Card Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                        {item.desc}
                      </p>

                      {/* Highlight Checkpoints Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                          Sorotan:
                        </span>
                        {item.highlights.map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-lg"
                          >
                            <svg className="w-2.5 h-2.5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                            </svg>
                            <span>{h}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSchedule.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-8">
              <p className="text-xs sm:text-sm text-slate-500">
                Tidak ada agenda yang berlangsung di lokasi filter ini. Silakan pilih &ldquo;Semua Lokasi&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Helpful Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 p-3 sm:px-6 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-500 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Seluruh sesi pameran publik &amp; panggung di <strong>Braga City Walk</strong> terbuka gratis tanpa tiket masuk.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
