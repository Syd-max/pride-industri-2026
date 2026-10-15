'use client';

import { EVENT_CONFIG } from '@/config/event';

export default function LocationSection() {
  return (
    <section
      id="location"
      className="relative py-24 sm:py-32 bg-[#0E0E0E] border-t border-[rgba(255,255,255,0.06)]"
      aria-label="Lokasi dan Informasi Pengunjung"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Venue Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#C8A96E]">
              <span className="w-8 h-[1px] bg-[#C8A96E]" />
              Pusat Eksibisi
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F5F0E8] font-bold">
              Braga City Walk, Jantung Kreativitas Bandung
            </h2>

            <p className="text-sm text-[#B8B0A4] leading-relaxed">
              Jalan Braga merupakan ikon pariwisata dan warisan arsitektur
              art-deco Kota Bandung. Braga City Walk menjadi panggung ideal yang
              mengawinkan estetika sejarah dan denyut modern industri kreatif.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="w-8 h-8 rounded-lg bg-[#C8A96E]/10 flex items-center justify-center text-[#C8A96E] flex-shrink-0 mt-0.5">
                  📍
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#F5F0E8]">
                    Alamat Venue Utama
                  </div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5">
                    {EVENT_CONFIG.venue.address}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="w-8 h-8 rounded-lg bg-[#E85B26]/10 flex items-center justify-center text-[#E85B26] flex-shrink-0 mt-0.5">
                  🏛️
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#F5F0E8]">
                    Venue Malam Penghargaan (Awarding Gala)
                  </div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5">
                    Ballroom Hotel Papandayan · Khusus 200 Pelaku IKM Binaan &
                    Tamu Undangan
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="w-8 h-8 rounded-lg bg-[#C8A96E]/10 flex items-center justify-center text-[#C8A96E] flex-shrink-0 mt-0.5">
                  🚗
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#F5F0E8]">
                    Akses & Transportasi
                  </div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5">
                    Dapat diakses mudah dari Stasiun Bandung (± 5 menit), Bandara
                    Husein Sastranegara, maupun angkutan umum/taksi daring.
                    Tersedia area parkir di kawasan Braga City Walk.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={EVENT_CONFIG.venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-xs py-3 px-6 tracking-wider uppercase inline-flex items-center gap-2"
              >
                <span>Buka Petunjuk Arah di Google Maps</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Map / Venue Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#2A2A2A] bg-[#141414] shadow-2xl p-6 sm:p-8">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#222222] bg-[#0A0A0A] flex flex-col items-center justify-center text-center p-6">
                {/* Stylized Minimalist Map Graphic */}
                <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <div className="relative z-10 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center mx-auto text-2xl text-[#C8A96E] animate-bounce">
                    📍
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5F0E8]">
                    Braga City Walk
                  </h3>
                  <p className="text-xs text-[#8A8A8A] max-w-xs mx-auto">
                    Jl. Braga No. 99–101, Braga, Sumur Bandung, Kota Bandung
                  </p>
                  <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#E4C584] px-3 py-1 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/20">
                    Lat: -6.9175° S, Long: 107.6098° E
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-[#8A8A8A]">
                <span>Status: Terbuka untuk Umum</span>
                <span className="text-[#C8A96E] font-medium">
                  27–28 November 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
