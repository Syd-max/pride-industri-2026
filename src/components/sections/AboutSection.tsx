import StatFolderCard from '@/components/ui/StatFolderCard';
import './about-folders.css';

export default function AboutSection() {
  const highlights = [
    {
      number: '200+',
      label: 'Pelaku IKM Binaan',
      desc: 'Pelaku Industri Kecil & Menengah sektor Fesyen, Kriya, dan Kuliner binaan Disdagin Kota Bandung.',
      theme: 'blue' as const,
      docBadge: 'ARSIP DISDAGIN KOTA BANDUNG',
      docTitle: 'Distribusi Sektor Unggulan IKM',
      docItems: [
        '85 IKM Sektor Fesyen & Tekstil',
        '75 IKM Kuliner & Olahan Pangan',
        '40+ IKM Kriya & Kerajinan Seni',
      ],
    },
    {
      number: '100',
      label: 'Sertifikasi Halal & SNI',
      desc: 'Penyerahan simbolis 100 sertifikat Halal, 3 SNI, dan 100 fasilitasi Uji Mutu produk IKM.',
      theme: 'green' as const,
      docBadge: 'LEGALITAS & STANDAR MUTU',
      docTitle: 'Penyerahan Fasilitasi Sertifikasi',
      docItems: [
        '100 Sertifikat Halal MUI / BPJPH',
        '3 Sertifikat Standar Nasional SNI',
        '100 Fasilitasi Uji Mutu Laboratorium',
      ],
    },
    {
      number: 'SIINAS',
      label: 'Apresiasi Industri',
      desc: 'Penganugerahan apresiasi pelaku industri berbasis kepatuhan pelaporan SIINAS di Ballroom Papandayan.',
      theme: 'amber' as const,
      docBadge: 'MALAM ANUGERAH PRESTASI',
      docTitle: 'Kepatuhan Pelaporan SIINAS',
      docItems: [
        '100% Kepatuhan Industri Binaan',
        '5 Kategori Penghargaan Terbaik',
        'Malam Penganugerahan Hotel Papandayan',
      ],
    },
    {
      number: '2 HARI',
      label: 'Kurasi & Festival',
      desc: 'Runway fesyen desainer binaan, live percussion dinamis, DJ, serta pameran produk unggulan.',
      theme: 'red' as const,
      docBadge: 'AGENDA FESTIVAL BRAGA',
      docTitle: 'Jadwal Panggung Utama Braga',
      docItems: [
        'Jumat 27 Nov: Runway & Kurasi Busana',
        'Sabtu 28 Nov: Awarding & Expo Akbar',
        '10.00 – 22.00 WIB · Braga City Walk',
      ],
    },
  ];

  return (
    <section
      id="about"
      className="relative pt-10 pb-3 sm:py-14 lg:py-16 bg-white overflow-hidden"
      aria-label="Tentang PRIDE Industri 2026"
    >
      {/* Background Architectural Accent: Subtle Blueprint Dot Grid & Ambient Warm Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, black 15%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, black 15%, transparent 75%)'
        }} 
      />
      
      {/* Soft Ambient Horizon Bleed */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50/80 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 relative">
          
          {/* Apple Style Frosted Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Tentang Acara</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Panggung Kehormatan Kreativitas{' '}
            <span className="font-serif italic font-normal text-blue-600 px-1">&amp;</span>{' '}
            Industri Lokal Bandung
          </h2>

          {/* Elegant Heritage Braga Hairline Accent */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-slate-300 to-slate-400" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase font-medium">
              KORIDOR BRAGA · 27–28 NOV 2026
            </span>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent via-slate-300 to-slate-400" />
          </div>

          <p className="mt-2 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            PRIDE Industri merupakan inisiatif prestisius yang digagas untuk merayakan
            kemandirian, inovasi teknologi, serta daya saing pelaku Industri Kecil dan
            Menengah di Kota Bandung.
          </p>
        </div>

        {/* 4 Key Pillars Interactive Archive Folders (Apple-Style Dossier Folders) */}
        <div className="about-folders-grid">
          {highlights.map((item, idx) => (
            <StatFolderCard
              key={idx}
              number={item.number}
              label={item.label}
              desc={item.desc}
              theme={item.theme}
              docBadge={item.docBadge}
              docTitle={item.docTitle}
              docItems={item.docItems}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
