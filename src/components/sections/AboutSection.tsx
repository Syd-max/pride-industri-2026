'use client';

import Image from 'next/image';

export default function AboutSection() {
  const highlights = [
    {
      number: '200+',
      label: 'Pelaku IKM Binaan',
      desc: 'Pelaku Industri Kecil & Menengah sektor Fesyen, Kriya, dan Kuliner binaan Disdagin Kota Bandung.',
      accent: 'border-t-4 border-t-blue-600 bg-blue-50/30 text-blue-700',
    },
    {
      number: '100',
      label: 'Sertifikasi Halal & SNI',
      desc: 'Penyerahan simbolis 100 sertifikat Halal, 3 SNI, dan 100 fasilitasi Uji Mutu produk IKM.',
      accent: 'border-t-4 border-t-emerald-600 bg-emerald-50/30 text-emerald-700',
    },
    {
      number: 'SIINAS',
      label: 'Apresiasi Industri',
      desc: 'Penganugerahan apresiasi pelaku industri berbasis kepatuhan pelaporan SIINAS di Ballroom Papandayan.',
      accent: 'border-t-4 border-t-amber-500 bg-amber-50/30 text-amber-700',
    },
    {
      number: '2 HARI',
      label: 'Kurasi & Festival',
      desc: 'Runway fesyen desainer binaan, live percussion dinamis, DJ, serta pameran produk unggulan.',
      accent: 'border-t-4 border-t-rose-600 bg-rose-50/30 text-rose-700',
    },
  ];

  const activities = [
    {
      title: 'Fashion Show',
      desc: 'Peragaan busana ready-to-wear karya desainer binaan Disdagin Kota Bandung.',
      color: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: (
        <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
    {
      title: 'Apresiasi Industri',
      desc: 'Penganugerahan malam gala kepatuhan pelaporan SIINAS bagi pelaku usaha.',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: (
        <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
    },
    {
      title: 'Lomba Desain Kemasan',
      desc: 'Inovasi kemasan ramah lingkungan produk kuliner berbahan dasar lokal.',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: (
        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      title: 'Lomba Video 1 Menit',
      desc: 'Kompetisi video vertikal kreatif Reels / TikTok bertema “Karya Lokal, Cerita Lokal”.',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      icon: (
        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="3" />
        </svg>
      ),
    },
    {
      title: 'Penyerahan Sertifikasi',
      desc: 'Seremonial 100 Sertifikat Halal, 3 SNI, dan 100 Uji Mutu produk IKM Kota Bandung.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      ),
    },
    {
      title: 'Live Percussion & DJ',
      desc: 'Pertunjukan musik perkusi dinamis dipadu beat DJ kontemporer di Main Stage Braga.',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      icon: (
        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 bg-white overflow-hidden"
      aria-label="Tentang PRIDE Industri 2026"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Tentang Acara
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Panggung Kehormatan Kreativitas &amp; Industri Lokal Bandung
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            PRIDE Industri merupakan inisiatif prestisius yang digagas untuk merayakan
            kemandirian, inovasi teknologi, serta daya saing pelaku Industri Kecil dan
            Menengah di Kota Bandung.
          </p>
        </div>

        {/* 4 Key Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between ${item.accent} transition-transform hover:-translate-y-1`}
            >
              <div>
                <span className="text-3xl sm:text-4xl font-black tracking-tight block mb-2 font-mono">
                  {item.number}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-Column Deep Dive: Activities Grid & Proposal Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Card Showcase from Proposal Graphic */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Dokumentasi &amp; Konsep Acara
                </span>
                <span className="text-xs font-bold text-blue-600">
                  Disdagin Kota Bandung
                </span>
              </div>

              {/* Proposal Activity Snapshot Graphic */}
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/ACTIVITIES_PROPOSAL.png"
                  alt="Ragam Aktivitas PRIDE Industri Bandung"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>
          </div>

          {/* Right Column: 6 Activities Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                6 Program Unggulan
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Eksplorasi Rangkaian Kegiatan Interaktif
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activities.map((act, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${act.color}`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="flex-shrink-0">{act.icon}</span>
                    <h4 className="text-sm font-extrabold">{act.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Special Highlight Note for Papandayan Ballroom */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3.5">
              <svg className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16" />
                <path d="M2 11h20" />
                <path d="M12 2 2 7h20z" />
                <path d="M6 11v7" />
                <path d="M10 11v7" />
                <path d="M14 11v7" />
                <path d="M18 11v7" />
              </svg>
              <div className="text-xs leading-relaxed text-amber-900">
                <strong className="font-bold">Malam Penganugerahan Khusus:</strong> Diadakan
                secara eksklusif di <strong>Ballroom Hotel Papandayan</strong> pada Sabtu
                malam, 28 November 2026, khusus untuk 200 pelaku IKM binaan, juri, dan tamu
                undangan kehormatan.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
