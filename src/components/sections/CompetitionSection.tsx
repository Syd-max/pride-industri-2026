'use client';

import Link from 'next/link';

export default function CompetitionSection() {
  const competitions = [
    {
      id: 'desain-kemasan',
      title: 'Lomba Desain Kemasan',
      badge: 'Kategori: Kuliner Lokal',
      theme: '“Inovasi Desain Kemasan Ramah Lingkungan untuk Produk Kuliner Berbahan Dasar Lokal”',
      tagline: 'Eksplorasi material ramah lingkungan untuk olahan pangan khas lokal (umbi-umbian, tahu, tempe, oncom, dll).',
      prizeTotal: 'Rp 2.250.000',
      prizes: [
        { place: 'Juara I', amount: 'Rp 1.000.000' },
        { place: 'Juara II', amount: 'Rp 750.000' },
        { place: 'Juara III', amount: 'Rp 500.000' },
      ],
      dates: [
        { label: 'Pendaftaran Karya', date: '21 Okt – 21 Nov 2026' },
        { label: 'Pengumuman Finalis', date: '25 November 2026' },
        { label: 'Grand Final & Penjurian', date: '28 November 2026' },
      ],
      pdfUrl: '/syarat-desain-kemasan.pdf',
      registerUrl: '/competition/desain-kemasan',
      highlights: [
        'Terbuka untuk Umum WNI (Individu)',
        'Gratis / Tanpa Biaya Pendaftaran',
        'Format 1 PDF Maksimal 10 MB (Konsep, Pola, Mockup)',
        'Wajib melampirkan Pakta Integritas & Surat Persetujuan',
      ],
      colorAccent: 'border-[rgba(232,91,38,0.4)]',
      glowAccent: 'hover:shadow-[0_0_40px_rgba(232,91,38,0.15)]',
      btnClass: 'btn-primary',
    },
    {
      id: 'video-lokal',
      title: 'Lomba Video 1 Menit (60 Detik)',
      badge: '4 Kategori Kreatif',
      theme: '“Karya Lokal, Cerita Lokal”',
      tagline: 'Ceritakan keunikan produk IKM Kota Bandung lewat format video kreatif vertikal Reels / TikTok.',
      prizeTotal: 'Rp 2.250.000',
      prizes: [
        { place: 'Juara I', amount: 'Rp 1.000.000' },
        { place: 'Juara II', amount: 'Rp 750.000' },
        { place: 'Juara III', amount: 'Rp 500.000' },
      ],
      dates: [
        { label: 'Shooting di Braga', date: '27–28 November 2026' },
        { label: 'Publikasi Karya', date: '27–28 November 2026' },
        { label: 'Penilaian Juri', date: '28 November 2026' },
      ],
      pdfUrl: '/syarat-video-lokal.pdf',
      registerUrl: '/competition/video-lokal',
      highlights: [
        'Kategori: Fesyen, Kuliner, Kriya, atau PRIDE 2026',
        'Durasi Maksimal 60 Detik (Format Reels Vertikal)',
        'Tagar: #disdaginkotabandung #kemilau #prideindustri2026',
        'Tag @bdg.perdaganganindustri / @disdagin.bandung',
      ],
      colorAccent: 'border-[rgba(200,169,110,0.4)]',
      glowAccent: 'hover:shadow-[0_0_40px_rgba(200,169,110,0.15)]',
      btnClass: 'btn-primary',
    },
  ];

  return (
    <section
      id="competitions"
      className="relative py-24 sm:py-32 bg-[#0A0A0A]"
      aria-label="Kompetisi Resmi PRIDE Industri 2026"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#C8A96E] mb-3">
            <span className="w-8 h-[1px] bg-[#C8A96E]" />
            Kompetisi Resmi
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5F0E8] font-bold">
            Dua Ajang Kreasi & Inovasi Industri
          </h2>
          <p className="mt-4 text-sm text-[#8A8A8A] leading-relaxed">
            Tunjukkan inovasi desain kemasan ramah lingkungan dan kemampuan
            storytelling audio-visual untuk mendukung produk IKM Kota Bandung.
            Total hadiah jutaan rupiah menanti Anda.
          </p>
        </div>

        {/* Competition Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className={`glass-card rounded-2xl border p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${comp.colorAccent} ${comp.glowAccent}`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded bg-[#1C1C1C] text-[#C8A96E] border border-[#2A2A2A]">
                    {comp.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block">
                      Total Hadiah
                    </span>
                    <span className="font-display font-bold text-lg text-[#E4C584]">
                      {comp.prizeTotal}
                    </span>
                  </div>
                </div>

                {/* Title & Theme */}
                <h3 className="font-display text-2xl sm:text-3xl text-[#F5F0E8] font-bold mb-3">
                  {comp.title}
                </h3>
                <p className="font-display italic text-sm sm:text-base text-[#C8A96E] mb-4">
                  {comp.theme}
                </p>
                <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed mb-6">
                  {comp.tagline}
                </p>

                {/* Prize Breakdown */}
                <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#141414] border border-[#222222] mb-6 text-center">
                  {comp.prizes.map((p, i) => (
                    <div key={i} className="border-r last:border-r-0 border-[#222222]">
                      <div className="text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                        {p.place}
                      </div>
                      <div className="font-display text-xs sm:text-sm font-semibold text-[#F5F0E8] mt-0.5">
                        {p.amount}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Dates */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B8B0A4] block">
                    Linimasa Pelaksanaan:
                  </span>
                  {comp.dates.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#1C1C1C]"
                    >
                      <span className="text-[#8A8A8A]">{d.label}</span>
                      <span className="font-medium text-[#F5F0E8]">{d.date}</span>
                    </div>
                  ))}
                </div>

                {/* Key Checklist */}
                <div className="space-y-2 mb-8">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B8B0A4] block">
                    Ketentuan Pokok:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#8A8A8A]">
                    {comp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#C8A96E] font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions: Download PDF + Register */}
              <div className="pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={comp.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost w-full sm:w-auto text-xs py-3 px-4 flex items-center justify-center gap-2 text-[#B8B0A4] hover:text-[#F5F0E8]"
                >
                  <svg
                    className="w-4 h-4 text-[#C8A96E]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Unduh Panduan PDF
                </a>
                <Link
                  href={comp.registerUrl}
                  className={`btn ${comp.btnClass} w-full sm:flex-1 text-xs py-3 tracking-wider uppercase justify-center`}
                >
                  Daftar Sekarang →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
