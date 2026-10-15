'use client';

import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';

export default function LocationSection() {
  return (
    <section
      id="location"
      className="relative py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80"
      aria-label="Lokasi dan Informasi Pengunjung"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Lokasi & Venue
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dua Panggung Utama di Jantung Kota Bandung
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Menghadirkan perpaduan pesona historis art-deco Jalan Braga dengan kemewahan
            Malam Penganugerahan di Ballroom Hotel Papandayan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Venue 1 & Venue 2 Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Venue 1: Braga City Walk */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                  Venue Utama Festival (27–28 Nov 2026)
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Terbuka untuk Umum
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900">
                Braga City Walk Bandung
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pusat eksibisi pameran IKM binaan (Fesyen, Kriya, Kuliner), panggung Fashion Runway desainer, shooting lomba video 1 menit, dan pertunjukan live perkusi di koridor legendaris Braga.
              </p>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="text-lg">📍</span>
                <div>
                  <strong className="text-slate-800 block">Alamat Lengkap:</strong>
                  {EVENT_CONFIG.venue.address}
                </div>
              </div>

              <div>
                <a
                  href={EVENT_CONFIG.venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <span>Buka Petunjuk Arah di Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Venue 2: The Papandayan Hotel */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                  Malam Penganugerahan (28 Nov 2026 · 19:00 WIB)
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Khusus Undangan
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900">
                Ballroom Hotel The Papandayan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tempat penyelenggaraan malam penganugerahan kepatuhan pelaporan SIINAS bagi 200 pelaku industri, penyerahan sertifikasi jaminan mutu, serta pengumuman pemenang kompetisi resmi.
              </p>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="text-lg">🏛️</span>
                <div>
                  <strong className="text-slate-800 block">Alamat Ballroom:</strong>
                  Jl. Gatot Subroto No.83, Malabar, Kec. Lengkong, Kota Bandung, Jawa Barat 40262
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase from Proposal Venue Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Peta Koridor & Lokasi Acara
                </span>
                <span className="text-xs font-bold text-blue-600">
                  Kota Bandung
                </span>
              </div>

              {/* Proposal Venue Graphics */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100">
                <Image
                  src="/BRAGA_VENUE_PROPOSAL.png"
                  alt="Suasana Kawasan Braga Kota Bandung"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1 text-xs text-slate-700">
                <strong className="text-blue-900 font-bold block">
                  Akses & Transportasi Publik:
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Hanya 5 menit berkendara dari Stasiun Kereta Api Bandung, mudah dijangkau dengan taksi daring, angkutan umum, dan tersedia kantong parkir resmi di area Braga City Walk.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
