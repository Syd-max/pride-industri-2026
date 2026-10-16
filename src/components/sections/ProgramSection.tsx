'use client';

import { useState } from 'react';

interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  title: string;
  location: string;
  venueKey: 'braga' | 'papandayan';
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
  const [venueFilter, setVenueFilter] = useState<'all' | 'braga' | 'papandayan'>('all');

  const scheduleDay1: ScheduleItem[] = [
    {
      id: 'd1-1',
      startTime: '13:30',
      endTime: '14:30 WIB',
      duration: '60 Menit',
      title: 'Registrasi Undangan & Check-In Peserta Mandiri',
      location: 'Gate Utama · Braga City Walk',
      venueKey: 'braga',
      desc: 'Penerimaan peserta pameran dan tamu undangan menggunakan verifikasi QR scanner mandiri melalui portal website resmi.',
      category: 'Registrasi & Gate',
      theme: {
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200/80',
        dotColor: 'bg-blue-600',
        accentRing: 'ring-blue-100',
      },
      highlights: ['Scan QR Mandiri', 'Tamu VIP & Peserta Pameran', 'Helpdesk Panitia'],
    },
    {
      id: 'd1-2',
      startTime: '14:30',
      endTime: '15:30 WIB',
      duration: '60 Menit',
      title: 'Opening Ceremony PRIDE Industri 2026',
      location: 'Main Stage · Atrium Braga City Walk',
      venueKey: 'braga',
      desc: 'Pembukaan resmi festival, sambutan pimpinan Disdagin Kota Bandung & RRD Organizer, serta tur pembukaan kurasi stan produk IKM.',
      category: 'Seremonial Pembukaan',
      theme: {
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200/80',
        dotColor: 'bg-emerald-600',
        accentRing: 'ring-emerald-100',
      },
      highlights: ['Sambutan Disdagin', 'Simbolis Peresmian', 'Tur Booth IKM'],
    },
    {
      id: 'd1-3',
      startTime: '15:30',
      endTime: '17:30 WIB',
      duration: '120 Menit',
      title: 'Fashion Show Runway Karya 20+ Desainer Binaan',
      location: 'Main Runway Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Peragaan busana ready-to-wear kontemporer berpadu wastra lokal khas Bandung karya 20+ desainer fesyen binaan Disdagin dengan konsep runway editorial.',
      category: 'Fashion Runway',
      theme: {
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200/80',
        dotColor: 'bg-purple-600',
        accentRing: 'ring-purple-100',
      },
      highlights: ['20+ Desainer Binaan', 'Ready-to-Wear Wastra', 'Editorial Stage', 'Buyer Networking'],
    },
    {
      id: 'd1-4',
      startTime: '17:30',
      endTime: '19:00 WIB',
      duration: '90 Menit',
      title: 'Istirahat, Sholat & Networking Pelaku IKM',
      location: 'Area Pameran & Booth Kuliner · Braga City Walk',
      venueKey: 'braga',
      desc: 'Jeda petang untuk sholat Maghrib, eksplorasi kuliner lokal binaan di booth pameran, serta temu jejaring santai antar pelaku usaha.',
      category: 'Rehat & Networking',
      theme: {
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200/80',
        dotColor: 'bg-slate-500',
        accentRing: 'ring-slate-100',
      },
      highlights: ['Eksplorasi Kuliner Olahan', 'Temu Pelaku Usaha', 'Coffee Break'],
    },
    {
      id: 'd1-5',
      startTime: '19:00',
      endTime: '21:00 WIB',
      duration: '120 Menit',
      title: 'Live Percussion Beat & DJ Electronic Performance',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Kolaborasi dinamis instrumen perkusi etnik dengan aransemen beat elektronik kontemporer menyemarakkan malam festival di Jalan Braga.',
      category: 'Panggung Seni & Musik',
      theme: {
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200/80',
        dotColor: 'bg-rose-600',
        accentRing: 'ring-rose-100',
      },
      highlights: ['Perkusi Etnik Kontemporer', 'DJ Live Set', 'Malam Koridor Braga'],
    },
  ];

  const scheduleDay2: ScheduleItem[] = [
    {
      id: 'd2-1',
      startTime: '10:00',
      endTime: '12:00 WIB',
      duration: '120 Menit',
      title: 'Showcase & Pameran Publik Produk IKM Binaan',
      location: 'Atrium & Koridor Braga City Walk',
      venueKey: 'braga',
      desc: 'Pameran terbuka produk fesyen, kriya, dan olahan kuliner unggulan binaan Kota Bandung untuk masyarakat luas dan pengunjung umum.',
      category: 'Exhibition Expo',
      theme: {
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200/80',
        dotColor: 'bg-blue-600',
        accentRing: 'ring-blue-100',
      },
      highlights: ['Katalog Produk IKM', 'Beli Langsung di Booth', 'Terbuka untuk Umum'],
    },
    {
      id: 'd2-2',
      startTime: '10:00',
      endTime: '14:00 WIB',
      duration: '4 Jam',
      title: 'Shooting Lomba Video 1 Menit & Submission',
      location: 'Seluruh Spot Ikonik Braga City Walk',
      venueKey: 'braga',
      desc: 'Ratusan kreator visual berburu video vertikal bertema “Karya Lokal, Cerita Lokal” untuk diunggah ke Reels / TikTok sebelum batas 14:00 WIB.',
      category: 'Kompetisi Kreatif',
      theme: {
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-800',
        badgeBorder: 'border-amber-200/80',
        dotColor: 'bg-amber-600',
        accentRing: 'ring-amber-100',
      },
      highlights: ['Reels / TikTok 60 Detik', '4 Kategori Kreatif', 'Batas Upload 14:00 WIB'],
    },
    {
      id: 'd2-3',
      startTime: '14:00',
      endTime: '16:30 WIB',
      duration: '150 Menit',
      title: 'Penyerahan Simbolis 100 Halal, 3 SNI & 100 Uji Mutu',
      location: 'Main Stage · Braga City Walk',
      venueKey: 'braga',
      desc: 'Seremonial simbolis penyerahan sertifikat jaminan mutu resmi dari Disdagin kepada pelaku IKM binaan Kota Bandung secara cuma-cuma (gratis).',
      category: 'Sertifikasi Mutu',
      theme: {
        badgeBg: 'bg-teal-50',
        badgeText: 'text-teal-700',
        badgeBorder: 'border-teal-200/80',
        dotColor: 'bg-teal-600',
        accentRing: 'ring-teal-100',
      },
      highlights: ['100 Sertifikat Halal', '3 Sertifikat SNI', '100 Uji Lab Mutu Gratis'],
    },
    {
      id: 'd2-4',
      startTime: '16:30',
      endTime: '18:30 WIB',
      duration: '120 Menit',
      title: 'Closing Showcase Braga & Transit Delegasi VIP',
      location: 'Braga City Walk → The Papandayan Hotel',
      venueKey: 'braga',
      desc: 'Penutupan area pameran publik di Braga dan persiapan delegasi tamu undangan, juri, dan nominator menuju Ballroom The Papandayan Hotel.',
      category: 'Transit & Rehat',
      theme: {
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
        badgeBorder: 'border-slate-200/80',
        dotColor: 'bg-slate-500',
        accentRing: 'ring-slate-100',
      },
      highlights: ['Penutupan Pameran Braga', 'Transit Delegasi VIP', 'Persiapan Busana Gala'],
    },
    {
      id: 'd2-5',
      startTime: '19:00',
      endTime: '21:00 WIB',
      duration: '120 Menit',
      title: 'Malam Gala Apresiasi SIINAS & Awarding Pemenang',
      location: 'Grand Ballroom · The Papandayan Hotel',
      venueKey: 'papandayan',
      desc: 'Malam anugerah kehormatan kepatuhan pelaporan SIINAS bagi 200 pelaku industri berprestasi, gala dinner bersama Walikota Bandung, dan penyerahan hadiah pemenang lomba.',
      category: 'Malam Gala SIINAS',
      theme: {
        badgeBg: 'bg-amber-100/80',
        badgeText: 'text-amber-900',
        badgeBorder: 'border-amber-300/80',
        dotColor: 'bg-amber-600',
        accentRing: 'ring-amber-200',
      },
      highlights: ['Trofi 200 IKM SIINAS', 'Gala Dinner Walikota', 'Awarding Juara Lomba'],
    },
  ];

  const currentSchedule = activeDay === 'day1' ? scheduleDay1 : scheduleDay2;
  const filteredSchedule = currentSchedule.filter(
    (item) => venueFilter === 'all' || item.venueKey === venueFilter
  );

  const googleCalUrlDay1 =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=PRIDE+Industri+2026+-+Hari+1&dates=20261127T063000Z/20261127T140000Z&details=Hari+1+PRIDE+Industri+2026+di+Braga+City+Walk.+Opening,+Fashion+Runway,+Musik+Perkusi.&location=Braga+City+Walk,+Bandung';
  const googleCalUrlDay2 =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=PRIDE+Industri+2026+-+Hari+2&dates=20261128T030000Z/20261128T140000Z&details=Hari+2+PRIDE+Industri+2026.+Pameran+IKM,+Sertifikasi+Halal,+Malam+Gala+SIINAS+di+Hotel+Papandayan.&location=The+Papandayan+Hotel,+Bandung';

  return (
    <section
      id="program"
      className="relative py-10 sm:py-14 lg:py-16 bg-[#f8fafc] border-t border-slate-200/80 overflow-hidden"
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
            Panduan waktu lengkap per jam selama 2 hari festival di Braga City Walk dan Ballroom The Papandayan Hotel.
          </p>

          {/* Apple-style Segmented Day Switcher */}
          <div className="mt-8 sm:mt-10 inline-flex flex-col sm:flex-row p-1.5 rounded-2xl sm:rounded-full bg-slate-200/75 border border-slate-300/80 shadow-inner gap-1.5 w-full sm:w-auto">
            {/* Day 1 Switcher */}
            <button
              type="button"
              onClick={() => {
                setActiveDay('day1');
                setVenueFilter('all');
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
                setVenueFilter('all');
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
                  10:00 – 21:00 WIB · Braga &amp; Hotel Papandayan
                </span>
              </div>
              {activeDay === 'day2' && (
                <span className="sm:hidden w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          </div>

          {/* Quick Filter by Venue & Calendar Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-200/70 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Lokasi:</span>
              <button
                type="button"
                onClick={() => setVenueFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  venueFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Semua Lokasi ({currentSchedule.length})
              </button>

              <button
                type="button"
                onClick={() => setVenueFilter('braga')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  venueFilter === 'braga'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Braga City Walk ({currentSchedule.filter((s) => s.venueKey === 'braga').length})
              </button>

              {activeDay === 'day2' && (
                <button
                  type="button"
                  onClick={() => setVenueFilter('papandayan')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    venueFilter === 'papandayan'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Hotel Papandayan ({currentSchedule.filter((s) => s.venueKey === 'papandayan').length})
                </button>
              )}
            </div>

            <a
              href={activeDay === 'day1' ? googleCalUrlDay1 : googleCalUrlDay2}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors ml-auto"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>+ Simpan Jadwal ke Kalender</span>
            </a>
          </div>
        </div>

        {/* ─── Apple-Inspired Visual Timeline Spine & Schedule Cards ─── */}
        <div className="relative space-y-6 sm:space-y-8">
          
          {/* Continuous vertical timeline connector (Desktop only) */}
          <div
            className="hidden sm:block absolute left-[148px] top-6 bottom-6 w-[2px] bg-slate-200/90 pointer-events-none"
            aria-hidden="true"
          />

          {filteredSchedule.map((item) => (
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
              <div className="flex-1 w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(15,23,42,0.07)] hover:border-slate-300 transition-all">
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

                {/* Card Main Title */}
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight mt-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

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
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-lg"
                    >
                      <span className="text-blue-500 font-bold">✦</span>
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

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
