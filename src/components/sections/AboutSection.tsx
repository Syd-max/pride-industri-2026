import StatFolderCard from '@/components/ui/StatFolderCard';
import './about-folders.css';

export default function AboutSection() {
  const highlights = [
    {
      number: '200+',
      label: 'Pelaku IKM Binaan',
      desc: 'Pelaku Industri Kecil & Menengah sektor Fesyen, Kuliner, dan Kriya binaan Disdagin Kota Bandung.',
      theme: 'blue' as const,
      docBadge: 'ARSIP DISDAGIN KOTA BANDUNG',
      docTitle: 'Distribusi Sektor Unggulan IKM',
      docItems: [
        'IKM Sektor Fesyen Binaan',
        'IKM Kuliner & Pangan Lokal',
        'IKM Kriya & Kerajinan Seni',
      ],
    },
    {
      number: '167',
      label: 'Sertifikasi & Mutu IKM',
      desc: 'Penyerahan sertifikat jaminan mutu: 25 Sertifikat Halal, 46 Sertifikat Uji Mutu, dan 96 Sertifikat KEMILAU.',
      theme: 'green' as const,
      docBadge: 'LEGALITAS & STANDAR MUTU',
      docTitle: 'Daftar Sertifikat Dibagikan',
      docItems: [
        '25 Sertifikat Halal Resmi',
        '46 Sertifikat Uji Mutu',
        '96 Sertifikat Kelas KEMILAU',
      ],
    },
    {
      number: '4 Sasaran',
      label: 'Sasaran Target',
      desc: 'Pelaku industri, universitas, pelaku dunia usaha & investor, serta pemerintah dan pemangku kepentingan.',
      theme: 'amber' as const,
      docBadge: 'SASARAN & STAKEHOLDER',
      docTitle: 'Sasaran Target PRIDE 2026',
      docItems: [
        'Pelaku Industri & Peserta Pembinaan',
        'Universitas/Perguruan Tinggi',
        'Pelaku Dunia Usaha, Investor, dan Mitra Bisnis (Buyers)',
        'Pemerintah dan Pemangku Kepentingan',
      ],
    },
    {
      number: '3 HARI',
      label: 'Kurasi & Festival',
      desc: 'Pameran produk IKM, talkshow industri, fashion show desainer, dan awarding di Braga City Walk.',
      theme: 'red' as const,
      docBadge: 'AGENDA FESTIVAL BRAGA',
      docTitle: 'Waktu Kegiatan Braga City Walk',
      docItems: [
        'Jum\'at 27 Nov: 13:30 – 21:00 WIB',
        'Sabtu 28 Nov: 10:00 – 21:00 WIB',
        'Minggu 29 Nov: TBA',
        'Lokasi: Braga City Walk Bandung',
      ],
    },
  ];

  return (
    <section
      id="about"
      className="relative pt-0 pb-8 sm:pb-10 lg:pb-16 bg-white overflow-hidden"
      aria-label="Tentang PRIDE Industri 2026"
    >
      <div className="moon-blur-transition" aria-hidden="true">
        <div className="moon-transition-gradient" />
        <div className="moon-glow-cluster">
          <div className="moon-ambient-wash" />
          <div className="moon-blur-dome" />
          <div className="moon-diffuse-crescent" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 sm:pt-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 relative">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Panggung Kehormatan Kreativitas &amp; Industri Lokal Bandung
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Apresiasi dan perayaan karya inovasi, kreativitas, serta daya saing IKM Kota Bandung.
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
