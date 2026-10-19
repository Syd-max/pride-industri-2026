'use client';

import { useState } from 'react';

interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
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
      startTime: '13:30',
      endTime: '14:15 WIB',
      duration: '45 Menit',
      title: 'Art Performance — Sunda Fusion',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Pertunjukan seni pembuka perpaduan harmoni Sunda kontemporer dan musik etnik modern menyemarakkan pembukaan PRIDE Industri 2026.',
      category: 'Art Performance',
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
      startTime: '14:15',
      endTime: '15:15 WIB',
      duration: '60 Menit',
      title: 'Pride Appreciation — Penyerahan Sertifikat Kelulusan Program 2026',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Seremonial simbolis penyerahan sertifikat jaminan mutu dan kelulusan program Disdagin: 46 Sertifikat Uji Mutu, 25 Sertifikat Halal, dan 93 Sertifikat Kelas Online Program KEMILAU.',
      category: 'Pride Appreciation',
      theme: {
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200/80',
        dotColor: 'bg-emerald-600',
        accentRing: 'ring-emerald-100',
      },
      highlights: ['46 Sertifikat Uji Mutu', '25 Sertifikat Halal', '93 Sertifikat Online KEMILAU'],
    },
    {
      id: 'd1-3',
      startTime: '15:15',
      endTime: '16:30 WIB',
      duration: '75 Menit',
      title: 'Innovation Walk — Peninjauan Booth Showcase Kemasan IKM & Workshop',
      location: 'Atrium & Koridor Braga City Walk',
      venueKey: 'braga',
      desc: 'Kunjungan resmi peninjauan booth pameran showcase hasil pendampingan desain kemasan IKM binaan Disdagin, live corner interaktif penangkap momen, dan workshop practical industry experience.',
      category: 'Innovation Walk',
      theme: {
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200/80',
        dotColor: 'bg-blue-600',
        accentRing: 'ring-blue-100',
      },
      highlights: ['Showcase Kemasan IKM Binaan', 'Live Corner Interaktif', 'Workshop & Consultation Corner'],
    },
    {
      id: 'd1-4',
      startTime: '16:30',
      endTime: '18:00 WIB',
      duration: '90 Menit',
      title: 'Pride Inspiration Stage — Talkshow Pelaku Industri (2 Sesi)',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Talkshow inspiratif bersama praktisi dan pimpinan industri membahas dinamika perkembangan industri Kota Bandung serta strategi inovasi packaging & display produk IKM/UMKM.',
      category: 'Inspiration Stage',
      theme: {
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200/80',
        dotColor: 'bg-purple-600',
        accentRing: 'ring-purple-100',
      },
      highlights: ['Sesi 1: Perkembangan Industri', 'Sesi 2: Packaging & Display', 'Praktisi & Ahli Industri'],
    },
    {
      id: 'd1-5',
      startTime: '18:00',
      endTime: '19:00 WIB',
      duration: '60 Menit',
      title: 'Rehat Maghrib, Live Corner & Temu Jejaring IKM',
      location: 'Area Pameran & Booth Kuliner · Braga City Walk',
      venueKey: 'braga',
      desc: 'Jeda petang untuk sholat Maghrib, eksplorasi kuliner lokal binaan di booth pameran, serta temu jejaring santai antar pelaku usaha.',
      category: 'Rehat & Live Corner',
      theme: {
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200/80',
        dotColor: 'bg-slate-500',
        accentRing: 'ring-slate-100',
      },
      highlights: ['Eksplorasi Kuliner Olahan', 'Live Corner Momen Acara', 'Coffee Break & Jejaring'],
    },
    {
      id: 'd1-6',
      startTime: '19:00',
      endTime: '21:00 WIB',
      duration: '120 Menit',
      title: 'Presentasi Finalis — Lomba Desain Kemasan & Video Kreatif',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Pemutaran dan presentasi langsung karya finalis Lomba Desain Kemasan dan Lomba Video Kreatif di hadapan dewan juri ahli dan audiens publik.',
      category: 'Kompetisi Inovasi',
      theme: {
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200/80',
        dotColor: 'bg-amber-600',
        accentRing: 'ring-amber-100',
      },
      highlights: ['Presentasi Karya Finalis', 'Screening Video 1 Menit', 'Penjurian Terbuka'],
    },
  ];

  const scheduleDay2: ScheduleItem[] = [
    {
      id: 'd2-1',
      startTime: '10:00',
      endTime: '12:30 WIB',
      duration: '150 Menit',
      title: 'Pride Innovation Challenge — Business Matching (Pitching) Program KEMILAU',
      location: 'Area Business Matching · Braga City Walk',
      venueKey: 'braga',
      desc: '20 IKM program KEMILAU terpilih dari 3 sektor industri (Fesyen, Kuliner, Kriya) melakukan pitching eksklusif di hadapan calon mitra bisnis, agregator, dan investor.',
      category: 'Business Matching',
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
      startTime: '12:30',
      endTime: '13:30 WIB',
      duration: '60 Menit',
      title: 'Rehat Dzuhur, Live Corner & Showcase Pameran Produk',
      location: 'Atrium & Koridor Braga City Walk',
      venueKey: 'braga',
      desc: 'Istirahat sholat Dzuhur, interaksi Live Corner penangkap cerita event, serta kunjungan terbuka showcase pameran produk hasil pendampingan kemasan IKM.',
      category: 'Rehat & Pameran',
      theme: {
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200/80',
        dotColor: 'bg-slate-500',
        accentRing: 'ring-slate-100',
      },
      highlights: ['Pameran Produk Kemasan', 'Live Corner Momen Acara', 'Konsultasi Mitra'],
    },
    {
      id: 'd2-3',
      startTime: '13:30',
      endTime: '15:00 WIB',
      duration: '90 Menit',
      title: 'Pride Inspiration Stage — Branding Produk & Strategi Pasar Ritel',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Sesi edukasi praktis mengenai branding produk, diferensiasi kemasan siap ritel modern, dan strategi penetrasi pasar komersial bagi pelaku IKM.',
      category: 'Inspiration Stage',
      theme: {
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-700',
        badgeBorder: 'border-teal-200/80',
        dotColor: 'bg-teal-600',
        accentRing: 'ring-teal-100',
      },
      highlights: ['Branding Produk Lokal', 'Kesiapan Ritel Modern', 'Tanya Jawab Langsung'],
    },
    {
      id: 'd2-4',
      startTime: '15:00',
      endTime: '17:30 WIB',
      duration: '150 Menit',
      title: 'Pride Fashion Show — Pergelaran Karya Pelatihan Fashion Disdagin',
      location: 'Main Runway Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Peragaan busana spektakuler karya peserta Pelatihan Desain Fashion Binaan Disdagin Kota Bandung: Kelas Intermediate (15 IKM) & Advance (18 IKM).',
      category: 'Pride Fashion Show',
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
      id: 'd2-5',
      startTime: '17:30',
      endTime: '19:00 WIB',
      duration: '90 Menit',
      title: 'Pride Inspiration Stage — Industri Experience & Potensi Kreatif Bandung',
      location: 'Main Stage & Exhibition Area · Braga City Walk',
      venueKey: 'braga',
      desc: 'Program interaktif Industri Experience untuk memperkenalkan keunggulan serta daya saing ekosistem industri kreatif Kota Bandung kepada masyarakat luas.',
      category: 'Industri Experience',
      theme: {
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200/80',
        dotColor: 'bg-blue-600',
        accentRing: 'ring-blue-100',
      },
      highlights: ['Industri Experience Interaktif', 'Kreativitas Generasi Muda', 'Koneksi Komunitas'],
    },
    {
      id: 'd2-6',
      startTime: '19:00',
      endTime: '21:00 WIB',
      duration: '120 Menit',
      title: 'Closing Ceremony — Pengumuman Juara Desain & Pembagian Sertifikat',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Malam puncak penutupan PRIDE Industri 2026: pengumuman pemenang Lomba Desain Kemasan & Video Kreatif, penyerahan hadiah, pembagian sertifikat, serta selebrasi penutupan resmi.',
      category: 'Closing Ceremony',
      theme: {
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200/80',
        dotColor: 'bg-emerald-600',
        accentRing: 'ring-emerald-100',
      },
      highlights: ['Pengumuman Juara Lomba', 'Penyerahan Hadiah & Trofi', 'Selebrasi Penutupan Resmi'],
    },
  ];

  const currentSchedule = activeDay === 'day1' ? scheduleDay1 : scheduleDay2;
  const filteredSchedule = currentSchedule;

  const toggleItem = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const googleCalUrlDay1 =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=PRIDE+Industri+2026+-+Hari+1&dates=20261127T063000Z/20261127T140000Z&details=Hari+1+PRIDE+Industri+2026+di+Braga+City+Walk.+Opening,+Sunda+Fusion,+Fashion+Show,+Presentasi+Finalis.&location=Braga+City+Walk,+Bandung';
  const googleCalUrlDay2 =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=PRIDE+Industri+2026+-+Hari+2&dates=20261128T030000Z/20261128T140000Z&details=Hari+2+PRIDE+Industri+2026+di+Braga+City+Walk.+Business+Matching,+Fashion+Show,+Closing+Ceremony.&location=Braga+City+Walk,+Bandung';

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
            Jadwal Rangkaian Acara
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Panduan waktu lengkap per jam selama 2 hari festival di Braga City Walk Bandung.
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
                  13:30 – 21:00 WIB · Braga City Walk
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
                  10:00 – 21:00 WIB · Braga City Walk
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
            className="hidden sm:block absolute left-[148px] top-6 bottom-6 w-[2px] bg-slate-200/90 pointer-events-none"
            aria-hidden="true"
          />

          {filteredSchedule.map((item) => {
            const isExpanded = expandedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 group"
              >
                {/* Left Column: Prominent Large Time Anchor (Instant visual scan) */}
                <div className="w-full sm:w-[130px] flex-shrink-0 pt-1 flex flex-wrap sm:flex-col justify-between sm:justify-start items-baseline sm:items-end gap-1.5 border-b sm:border-b-0 pb-2 sm:pb-0 border-slate-200/60">
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                    {item.startTime}
                  </div>
                  <div className="text-[11px] font-mono font-medium text-slate-500 whitespace-nowrap">
                    s/d {item.endTime}
                  </div>
                  <div className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md mt-0.5 whitespace-nowrap">
                    <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{item.duration}</span>
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
