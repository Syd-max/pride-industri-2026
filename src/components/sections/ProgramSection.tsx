'use client';

import { useState } from 'react';

export default function ProgramSection() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

  const scheduleDay1 = [
    {
      time: '13:30 — 14:30 WIB',
      title: 'Registrasi Undangan & Check-In Peserta',
      location: 'Gate Utama · Braga City Walk',
      desc: 'Penerimaan peserta pameran dan tamu undangan menggunakan verifikasi QR scanner mandiri melalui portal website ini.',
      tag: 'Registrasi',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      time: '14:30 — 15:30 WIB',
      title: 'Opening Ceremony PRIDE Industri 2026',
      location: 'Main Stage · Braga City Walk',
      desc: 'Pembukaan resmi festival, sambutan pimpinan Disdagin Kota Bandung & RRD Organizer, serta tur pembukaan kurasi produk.',
      tag: 'Seremonial',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      time: '15:30 — 17:30 WIB',
      title: 'Fashion Show Runway Karya Desainer Binaan',
      location: 'Main Runway · Braga City Walk',
      desc: 'Peragaan busana ready-to-wear kontemporer karya desainer fesyen binaan lokal Kota Bandung dengan konsep runway editorial.',
      tag: 'Fashion Runway',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      time: '17:30 — 19:00 WIB',
      title: 'Istirahat, Sholat & Networking IKM',
      location: 'Area Festival · Braga City Walk',
      desc: 'Jeda petang, eksplorasi kuliner lokal binaan di booth pameran, serta temu jejaring antar pelaku usaha.',
      tag: 'Networking',
      tagColor: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    {
      time: '19:00 — 21:00 WIB',
      title: 'Live Percussion Beat & DJ Performance',
      location: 'Main Stage · Braga City Walk',
      desc: 'Penampilan dinamis kolaborasi instrumen perkusi dengan irama elektronik kontemporer menyemarakkan malam koridor Braga.',
      tag: 'Musik & Seni',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
  ];

  const scheduleDay2 = [
    {
      time: '10:00 — 12:00 WIB',
      title: 'Showcase & Pameran Publik Produk IKM Binaan',
      location: 'Atrium & Koridor Braga City Walk',
      desc: 'Pameran terbuka produk fesyen, kriya, dan olahan kuliner unggulan binaan Kota Bandung untuk pengunjung umum.',
      tag: 'Pameran',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      time: '10:00 — 14:00 WIB',
      title: 'Shooting Lomba Video 1 Menit & Verifikasi',
      location: 'Seluruh Spot Braga City Walk',
      desc: 'Peserta lomba video berburu konten kreatif bertema “Karya Lokal, Cerita Lokal” untuk diunggah ke Reels / TikTok.',
      tag: 'Kompetisi Video',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      time: '14:00 — 16:30 WIB',
      title: 'Penyerahan Simbolis 100 Halal, 3 SNI & 100 Uji Mutu',
      location: 'Main Stage · Braga City Walk',
      desc: 'Penyerahan sertifikat jaminan mutu produk kepada perwakilan pelaku IKM binaan Kota Bandung oleh Disdagin.',
      tag: 'Sertifikasi Mutu',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      time: '16:30 — 18:30 WIB',
      title: 'Closing Showcase Braga & Transit ke Papandayan',
      location: 'Braga City Walk → Hotel Papandayan',
      desc: 'Penutupan area pameran publik di Braga dan persiapan delegasi tamu undangan menuju sesi Malam Penganugerahan.',
      tag: 'Transit',
      tagColor: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    {
      time: '19:00 — 21:00 WIB',
      title: 'Malam Penganugerahan SIINAS & Awarding Pemenang',
      location: 'Ballroom Hotel Papandayan',
      desc: 'Apresiasi kepatuhan pelaporan SIINAS bagi 200 pelaku IKM serta pengumuman pemenang Lomba Desain Kemasan dan Lomba Video.',
      tag: 'Malam Gala SIINAS',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  const currentSchedule = activeDay === 'day1' ? scheduleDay1 : scheduleDay2;

  return (
    <section
      id="program"
      className="relative py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80"
      aria-label="Rangkaian Program PRIDE Industri 2026"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Agenda Resmi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Rangkaian Jadwal Festival & Malam Gala
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Jadwal kegiatan terkonfirmasi 27–28 November 2026 di Braga City Walk
            dan Ballroom Hotel Papandayan.
          </p>

          {/* Day Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-white border border-slate-200 shadow-xs mt-8">
            <button
              onClick={() => setActiveDay('day1')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeDay === 'day1'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari 1 · Jum&apos;at, 27 Nov (13:30–21:00)
            </button>
            <button
              onClick={() => setActiveDay('day2')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeDay === 'day2'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari 2 · Sabtu, 28 Nov (10:00–21:00)
            </button>
          </div>
        </div>

        {/* Timeline Schedule Cards */}
        <div className="space-y-4">
          {currentSchedule.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {item.time}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 self-start sm:self-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{item.location}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
