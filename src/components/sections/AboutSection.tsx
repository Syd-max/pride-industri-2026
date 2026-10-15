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
      icon: '👗',
      color: 'bg-rose-50 border-rose-200 text-rose-800',
    },
    {
      title: 'Apresiasi Industri',
      desc: 'Penganugerahan malam gala kepatuhan pelaporan SIINAS bagi pelaku usaha.',
      icon: '🏆',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
    },
    {
      title: 'Lomba Desain Kemasan',
      desc: 'Inovasi kemasan ramah lingkungan produk kuliner berbahan dasar lokal.',
      icon: '📦',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    {
      title: 'Lomba Video 1 Menit',
      desc: 'Kompetisi video vertikal kreatif Reels / TikTok bertema “Karya Lokal, Cerita Lokal”.',
      icon: '🎬',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
    },
    {
      title: 'Penyerahan Sertifikasi',
      desc: 'Seremonial 100 Sertifikat Halal, 3 SNI, dan 100 Uji Mutu produk IKM Kota Bandung.',
      icon: '📜',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
    {
      title: 'Live Percussion & DJ',
      desc: 'Pertunjukan musik perkusi dinamis dipadu beat DJ kontemporer di Main Stage Braga.',
      icon: '🥁',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
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
            Panggung Kehormatan Kreativitas & Industri Lokal Bandung
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
              className={`p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all ${item.accent}`}
            >
              <div className="text-3xl sm:text-4xl font-black mb-2">
                {item.number}
              </div>
              <div className="text-xs font-bold tracking-wider uppercase text-slate-900 mb-2">
                {item.label}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Showcase: Activities Proposal Collage + Grid of 6 Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          
          {/* Left Column: Real Proposal Photography Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-50">
              <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Dokumentasi & Ragam Kegiatan
                </span>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Resmi Proposal
                </span>
              </div>
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
                    <span className="text-xl">{act.icon}</span>
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
              <span className="text-2xl">🏛️</span>
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
