'use client';

import Link from 'next/link';

export default function CompetitionSection() {
  const competitions = [
    {
      id: 'desain-kemasan',
      title: 'Lomba Desain Kemasan',
      badge: 'Kategori: Kuliner Lokal',
      theme: '“Inovasi Desain Kemasan Ramah Lingkungan untuk Produk Kuliner Berbahan Dasar Lokal”',
      tagline: 'Eksplorasi material ramah lingkungan untuk olahan pangan lokal (umbi-umbian, tahu, tempe, oncom, olahan khas Bandung).',
      prizeTotal: 'Rp 2.250.000',
      prizes: [
        { place: 'Juara I', amount: 'Rp 1.000.000' },
        { place: 'Juara II', amount: 'Rp 750.000' },
        { place: 'Juara III', amount: 'Rp 500.000' },
      ],
      dates: [
        { label: 'Pendaftaran Karya', date: '21 Okt – 21 Nov 2026' },
        { label: 'Pengumuman Finalis', date: '25 November 2026' },
        { label: 'Grand Final & Presentasi', date: '28 November 2026' },
      ],
      pdfUrl: '/syarat-desain-kemasan.pdf',
      registerUrl: '/competition/desain-kemasan',
      highlights: [
        'Terbuka untuk Umum WNI (Individu)',
        '100% Gratis / Tanpa Biaya Pendaftaran',
        'Format 1 PDF Maks. 10 MB (Konsep, Pola, Mockup)',
        'Wajib Melampirkan Pakta Integritas Resmi',
      ],
      themeColor: 'blue',
      cardBorder: 'border-blue-200 hover:border-blue-400',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      btnRegister: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
      prizeBox: 'bg-blue-50/60 border-blue-100 text-blue-900',
    },
    {
      id: 'video-lokal',
      title: 'Lomba Video 1 Menit (60 Detik)',
      badge: '4 Kategori Kreatif',
      theme: '“Karya Lokal, Cerita Lokal”',
      tagline: 'Abadikan keunikan dan denyut produk IKM Kota Bandung lewat video kreatif vertikal Reels / TikTok langsung di venue Braga.',
      prizeTotal: 'Rp 2.250.000',
      prizes: [
        { place: 'Juara I', amount: 'Rp 1.000.000' },
        { place: 'Juara II', amount: 'Rp 750.000' },
        { place: 'Juara III', amount: 'Rp 500.000' },
      ],
      dates: [
        { label: 'Shooting di Braga', date: '27–28 November 2026' },
        { label: 'Batas Upload Video', date: '28 Nov 2026 · 14:00 WIB' },
        { label: 'Penilaian Dewan Juri', date: '28 November 2026' },
      ],
      pdfUrl: '/syarat-video-lokal.pdf',
      registerUrl: '/competition/video-lokal',
      highlights: [
        'Kategori: Fesyen, Kuliner, Kriya, atau PRIDE 2026',
        'Durasi Maksimal 60 Detik (Format Reels Vertikal)',
        'Tagar: #disdaginkotabandung #kemilau #prideindustri2026',
        'Wajib Tag Akun Resmi @bdg.perdaganganindustri',
      ],
      themeColor: 'rose',
      cardBorder: 'border-rose-200 hover:border-rose-400',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      btnRegister: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
      prizeBox: 'bg-rose-50/60 border-rose-100 text-rose-900',
    },
  ];

  return (
    <section
      id="competitions"
      className="relative py-20 sm:py-28 bg-white border-t border-slate-200/80"
      aria-label="Kompetisi Resmi PRIDE Industri 2026"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Kompetisi Resmi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dua Ajang Kreasi & Inovasi Industri
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Daftarkan diri Anda sekarang! Tunjukkan karya desain kemasan ramah lingkungan
            terbaik atau video sinematik 60 detik untuk mengangkat produk IKM Kota Bandung.
          </p>
        </div>

        {/* Competition Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className={`rounded-3xl border-2 bg-white p-6 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all ${comp.cardBorder}`}
            >
              <div>
                {/* Header Top Badge & Prize Total */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span
                    className={`text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border ${comp.badgeClass}`}
                  >
                    {comp.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Total Hadiah
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {comp.prizeTotal}
                    </span>
                  </div>
                </div>

                {/* Title & Theme */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  {comp.title}
                </h3>
                <p className="text-sm font-bold text-slate-700 italic mb-3">
                  {comp.theme}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {comp.tagline}
                </p>

                {/* Prize Breakdown Grid */}
                <div className={`grid grid-cols-3 gap-2 p-3.5 rounded-2xl border mb-6 text-center ${comp.prizeBox}`}>
                  {comp.prizes.map((p, i) => (
                    <div key={i} className="border-r last:border-r-0 border-slate-200/60">
                      <div className="text-[10px] uppercase font-bold text-slate-500">
                        {p.place}
                      </div>
                      <div className="text-xs sm:text-sm font-black mt-0.5">
                        {p.amount}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Dates */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-extrabold tracking-wider uppercase text-slate-700 block">
                    Linimasa Pelaksanaan:
                  </span>
                  {comp.dates.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100"
                    >
                      <span className="text-slate-500">{d.label}</span>
                      <span className="font-bold text-slate-800">{d.date}</span>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="space-y-2 mb-8">
                  <span className="text-xs font-extrabold tracking-wider uppercase text-slate-700 block">
                    Ketentuan Utama:
                  </span>
                  <ul className="space-y-1.5">
                    {comp.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 flex items-start gap-2"
                      >
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons: Register & Download Guide */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Link
                  href={comp.registerUrl}
                  className={`w-full py-3.5 px-6 rounded-full text-sm font-extrabold text-center block shadow-md transition-all hover:-translate-y-0.5 ${comp.btnRegister}`}
                >
                  Daftar {comp.title} Sekarang
                </Link>

                <a
                  href={comp.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 18 15 15" />
                  </svg>
                  <span>Unduh Dokumen Syarat &amp; Ketentuan Lengkap (PDF)</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
