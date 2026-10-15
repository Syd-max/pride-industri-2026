'use client';

export default function AboutSection() {
  const highlights = [
    {
      number: '200+',
      label: 'Pelaku IKM Binaan',
      desc: 'Pelaku Industri Kecil dan Menengah sektor Fesyen, Kriya, dan Kuliner Kota Bandung.',
    },
    {
      number: '100',
      label: 'Sertifikasi Halal',
      desc: 'Penyerahan simbolis 100 sertifikat Halal, 3 SNI, dan 100 Uji Mutu produk IKM.',
    },
    {
      number: 'SIINAS',
      label: 'Apresiasi Industri',
      desc: 'Penganugerahan apresiasi pelaku industri berbasis kepatuhan pelaporan SIINAS.',
    },
    {
      number: '2 HARI',
      label: 'Kurasi & Festival',
      desc: 'Runway fesyen desainer binaan, live percussion & DJ, dan showcase produk unggulan.',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden"
      aria-label="Tentang PRIDE Industri 2026"
    >
      {/* Decorative Editorial Watermark */}
      <div className="absolute top-12 -right-24 text-[14vw] font-display font-black text-[#141414] select-none pointer-events-none opacity-60 leading-none">
        INNOVATION
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#C8A96E]">
              <span className="w-8 h-[1px] bg-[#C8A96E]" />
              Tentang Festival
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5F0E8] font-bold leading-tight">
              Panggung Kehormatan Kreativitas & Industri Lokal Bandung
            </h2>

            <p className="font-display italic text-lg sm:text-xl text-[#C8A96E] leading-relaxed">
              “Pagelaran Ragam Inovasi dan Eksistensi — merayakan dedikasi IKM dalam merajut kemandirian ekonomi.”
            </p>

            <div className="pt-2 text-sm text-[#B8B0A4] leading-relaxed space-y-4">
              <p>
                PRIDE Industri 2026 diselenggarakan oleh{' '}
                <strong className="text-[#F5F0E8] font-semibold">
                  PT Rahman Ramadhan Diandra (RRD Organizer)
                </strong>{' '}
                bekerja sama dengan mitra strategis untuk mengangkat potensi
                Industri Kecil dan Menengah (IKM) binaan di Kota Bandung.
              </p>
              <p>
                Mengambil latar ikonik koridor bersejarah{' '}
                <strong className="text-[#F5F0E8] font-semibold">
                  Braga City Walk
                </strong>
                , festival ini mempertemukan desainer busana lokal, perajin kriya
                inovatif, dan produsen kuliner unggulan dalam balutan kurasi
                kontemporer yang ekspresif.
              </p>
            </div>
          </div>

          {/* Right Column: Key Pillars & Metrics */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 sm:p-8 rounded-xl border border-[rgba(255,255,255,0.06)] hover:border-[rgba(200,169,110,0.3)] transition-all duration-300 group"
                >
                  <div className="font-display text-3xl sm:text-4xl font-bold text-[#E4C584] mb-2 group-hover:scale-105 transition-transform duration-300">
                    {item.number}
                  </div>
                  <div className="text-xs font-semibold tracking-wider uppercase text-[#F5F0E8] mb-2">
                    {item.label}
                  </div>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Special Highlight Box: SIINAS & Papandayan Ballroom */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(232,91,38,0.25)] bg-gradient-to-r from-[#171210] to-[#141414] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E85B26]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded bg-[#E85B26]/20 text-[#FF6B35] inline-block mb-3">
                  Puncak Malam Penganugerahan
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-[#F5F0E8] font-semibold mb-2">
                  Penghargaan Pelaku Industri & Sertifikasi Mutu
                </h3>
                <p className="text-xs sm:text-sm text-[#B8B0A4] leading-relaxed">
                  Rangkaian apresiasi khusus bagi 200 pelaku IKM dan tamu
                  undangan di <strong>Ballroom Hotel Papandayan</strong>, atas
                  kepatuhan pelaporan SIINAS serta penyerahan sertifikasi Halal,
                  SNI, dan Uji Mutu sebagai fondasi daya saing nasional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
