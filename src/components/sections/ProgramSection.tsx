'use client';

import { useState } from 'react';

export default function ProgramSection() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

  const scheduleDay1 = [
    {
      time: '09:00 — 10:30 WIB',
      title: 'Opening Ceremony PRIDE Industri 2026',
      location: 'Main Stage · Braga City Walk',
      desc: 'Pembukaan resmi festival, sambutan pimpinan Disdagin Kota Bandung & RRD Organizer, serta pengenalan program kurasi IKM.',
      tag: 'Seremonial',
    },
    {
      time: '10:30 — 21:00 WIB',
      title: 'Showcase Produk IKM: Fesyen, Kriya & Kuliner',
      location: 'Atrium & Koridor Braga City Walk',
      desc: 'Pameran interaktif produk-produk unggulan IKM binaan Kota Bandung. Eksplorasi cita rasa kuliner olahan lokal dan ragam kriya inovatif.',
      tag: 'Pameran',
    },
    {
      time: '11:00 — 18:00 WIB',
      title: 'Sesi Pengambilan Gambar Lomba Video 1 Menit',
      location: 'Area Festival Braga City Walk',
      desc: 'Peserta lomba video berburu konten kreatif berdurasi maksimal 60 detik bertema “Karya Lokal, Cerita Lokal” di seluruh spot festival.',
      tag: 'Kompetisi',
    },
    {
      time: '15:30 — 17:30 WIB',
      title: 'Fashion Show: Karya Desainer Binaan',
      location: 'Main Runway · Braga City Walk',
      desc: 'Peragaan busana ready-to-wear kontemporer karya desainer fesyen binaan lokal Kota Bandung dengan konsep runway editorial.',
      tag: 'Fashion Runway',
    },
    {
      time: '19:00 — 21:00 WIB',
      title: 'Live Percussion Beat & DJ Performance',
      location: 'Main Stage · Braga City Walk',
      desc: 'Penampilan energi perkusi dinamis dipadukan dengan irama elektronik kontemporer menyemarakkan malam festival di koridor Braga.',
      tag: 'Musik & Seni',
    },
  ];

  const scheduleDay2 = [
    {
      time: '09:00 — 12:00 WIB',
      title: 'Grand Final & Presentasi Lomba Desain Kemasan',
      location: 'Creative Stage · Braga City Walk',
      desc: 'Sesi presentasi konsep, technical pack, dan mockup desain kemasan ramah lingkungan produk kuliner lokal di hadapan dewan juri ahli.',
      tag: 'Grand Final',
    },
    {
      time: '10:00 — 21:00 WIB',
      title: 'Showcase & Public Exhibition Day 2',
      location: 'Atrium & Koridor Braga City Walk',
      desc: 'Lanjutan pameran produk IKM binaan Kota Bandung terbuka untuk masyarakat umum dan pembeli potensial.',
      tag: 'Pameran',
    },
    {
      time: '13:00 — 16:00 WIB',
      title: 'Penjurian Lomba Video 1 Menit & Verifikasi',
      location: 'Digital Hub Room',
      desc: 'Penilaian orisinalitas, storytelling, dan kualitas visual karya video Reels/TikTok yang telah diunggah dengan tagar resmi.',
      tag: 'Penjurian',
    },
    {
      time: '16:30 — 18:30 WIB',
      title: 'Penyerahan Sertifikat Halal, SNI & Uji Mutu',
      location: 'Main Stage · Braga City Walk',
      desc: 'Penyerahan simbolis 100 Sertifikat Halal, 3 Sertifikat SNI, dan 100 Uji Mutu kepada perwakilan IKM binaan.',
      tag: 'Sertifikasi',
    },
    {
      time: '19:00 — 21:30 WIB',
      title: 'Malam Penghargaan SIINAS & Penganugerahan Pemenang',
      location: 'Ballroom Hotel Papandayan',
      desc: 'Apresiasi tertinggi bagi 200 pelaku IKM atas kepatuhan pelaporan SIINAS serta pengumuman pemenang Lomba Desain Kemasan dan Video 1 Menit.',
      tag: 'Awarding Gala',
    },
  ];

  const currentSchedule = activeDay === 'day1' ? scheduleDay1 : scheduleDay2;

  return (
    <section
      id="program"
      className="relative py-24 sm:py-32 bg-[#0E0E0E] border-t border-[rgba(255,255,255,0.06)]"
      aria-label="Rangkaian Program PRIDE Industri 2026"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#E85B26] mb-3">
            <span className="w-6 h-[1px] bg-[#E85B26]" />
            Rangkaian Acara
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#F5F0E8] font-bold">
            Agenda Festival & Penganugerahan
          </h2>
          <p className="mt-3 text-sm text-[#8A8A8A]">
            Jadwal kegiatan terkonfirmasi 27–28 November 2026 di Braga City Walk
            dan Ballroom Hotel Papandayan.
          </p>

          {/* Day Switcher */}
          <div className="inline-flex p-1.5 rounded-full bg-[#171717] border border-[rgba(255,255,255,0.08)] mt-8">
            <button
              onClick={() => setActiveDay('day1')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeDay === 'day1'
                  ? 'bg-[#C8A96E] text-[#0A0A0A] shadow-md'
                  : 'text-[#8A8A8A] hover:text-[#F5F0E8]'
              }`}
            >
              Hari 1 · 27 Nov 2026
            </button>
            <button
              onClick={() => setActiveDay('day2')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeDay === 'day2'
                  ? 'bg-[#C8A96E] text-[#0A0A0A] shadow-md'
                  : 'text-[#8A8A8A] hover:text-[#F5F0E8]'
              }`}
            >
              Hari 2 · 28 Nov 2026
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-[rgba(200,169,110,0.2)] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
          {currentSchedule.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0A0A0A] border-2 border-[#C8A96E] group-hover:bg-[#C8A96E] transition-colors" />

              <div className="glass-card p-6 rounded-xl border border-[rgba(255,255,255,0.06)] hover:border-[rgba(200,169,110,0.3)] transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-[#E4C584]">
                    {item.time}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[#B8B0A4] border border-[rgba(255,255,255,0.08)]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl text-[#F5F0E8] font-semibold mb-1">
                  {item.title}
                </h3>

                <div className="text-xs text-[#E85B26] font-medium mb-3">
                  📍 {item.location}
                </div>

                <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note on detailed updates */}
        <p className="text-center text-xs text-[#6B6560] italic mt-12">
          * Catatan: Rincian jam teknis dapat diperbarui oleh panitia
          penyelenggara menjelang hari pelaksanaan.
        </p>
      </div>
    </section>
  );
}
