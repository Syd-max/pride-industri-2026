'use client';

import { useState } from 'react';
import { EVENT_CONFIG } from '@/config/event';

type VenueKey = 'braga' | 'papandayan';

interface VenueInfo {
  key: VenueKey;
  name: string;
  badge: string;
  badgeColor: string;
  role: string;
  address: string;
  schedule: string;
  coordinates: string;
  googleMapsUrl: string;
  embedUrl: string;
  transitNotes: string[];
}

const VENUES: Record<VenueKey, VenueInfo> = {
  braga: {
    key: 'braga',
    name: 'Braga City Walk Bandung',
    badge: 'Venue Utama Festival (27–28 Nov 2026)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    role: 'Pameran IKM, Panggung Runway, Lomba Video 1 Menit, & Live Performance',
    address: 'Jl. Braga No. 99–101, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111',
    schedule: 'Jumat–Sabtu, 27–28 Nov 2026 · 10:00 – 21:00 WIB',
    coordinates: '6°55\'00.8"S 107°36\'34.3"E',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Braga+City+Walk+Bandung',
    embedUrl: 'https://maps.google.com/maps?q=Braga+City+Walk+Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed',
    transitNotes: [
      '🚆 5 menit dari Stasiun KA Bandung (Pintu Selatan / Stasiun Hall)',
      '🚶 Koridor pedestrian heritage art-deco Jalan Braga',
      '🅿️ Kantong parkir resmi mobil & motor di Braga City Walk',
    ],
  },
  papandayan: {
    key: 'papandayan',
    name: 'Ballroom Hotel The Papandayan',
    badge: 'Malam Penganugerahan (28 Nov 2026)',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    role: 'Gala Dinner, Penganugerahan SIINAS, & Penyerahan Penghargaan Pemenang',
    address: 'Jl. Gatot Subroto No. 83, Malabar, Kec. Lengkong, Kota Bandung, Jawa Barat 40262',
    schedule: 'Sabtu, 28 Nov 2026 · 19:00 – 22:00 WIB (Khusus Undangan)',
    coordinates: '6°55\'43.3"S 107°37\'30.4"E',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Papandayan+Hotel+Bandung',
    embedUrl: 'https://maps.google.com/maps?q=The+Papandayan+Hotel+Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed',
    transitNotes: [
      '🚗 Akses cepat via Jl. Asia Afrika / Simpang Lima Kota Bandung',
      '🏨 Layanan Valet Parking & area parkir luas Ballroom Hotel',
      '🎟️ Registrasi tamu undangan mulai pukul 18:30 WIB di Foyer Ballroom',
    ],
  },
};

export default function LocationSection() {
  const [activeVenueKey, setActiveVenueKey] = useState<VenueKey>('braga');
  const currentVenue = VENUES[activeVenueKey];

  return (
    <section
      id="location"
      className="relative py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80"
      aria-label="Lokasi dan Informasi Pengunjung"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Lokasi &amp; Venue
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
          <div className="lg:col-span-6 space-y-6">
            
            {/* Venue 1: Braga City Walk */}
            <div
              onClick={() => setActiveVenueKey('braga')}
              className={`p-6 sm:p-7 rounded-3xl transition-all cursor-pointer border ${
                activeVenueKey === 'braga'
                  ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                  Venue Utama Festival (27–28 Nov 2026)
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Terbuka untuk Umum
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Braga City Walk Bandung
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Pusat eksibisi pameran IKM binaan (Fesyen, Kriya, Kuliner), panggung Fashion Runway desainer, shooting lomba video 1 menit, dan pertunjukan live perkusi di koridor legendaris Braga.
              </p>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-bold">Alamat Lengkap:</strong>
                  <span>{EVENT_CONFIG.venue.address}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={EVENT_CONFIG.venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span>Buka Petunjuk Arah di Google Maps</span>
                  <span>↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveVenueKey('braga')}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                    activeVenueKey === 'braga'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                  }`}
                >
                  Lihat di Peta Samping →
                </button>
              </div>
            </div>

            {/* Venue 2: The Papandayan Hotel */}
            <div
              onClick={() => setActiveVenueKey('papandayan')}
              className={`p-6 sm:p-7 rounded-3xl transition-all cursor-pointer border ${
                activeVenueKey === 'papandayan'
                  ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/10'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                  Malam Penganugerahan (28 Nov 2026 · 19:00 WIB)
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Khusus Undangan
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Ballroom Hotel The Papandayan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Tempat penyelenggaraan malam penganugerahan kepatuhan pelaporan SIINAS bagi 200 pelaku industri, penyerahan sertifikasi jaminan mutu, serta pengumuman pemenang kompetisi resmi.
              </p>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 22h16" />
                  <path d="M2 11h20" />
                  <path d="M12 2 2 7h20z" />
                  <path d="M6 11v7" />
                  <path d="M10 11v7" />
                  <path d="M14 11v7" />
                  <path d="M18 11v7" />
                </svg>
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-bold">Alamat Ballroom:</strong>
                  <span>Jl. Gatot Subroto No. 83, Malabar, Kec. Lengkong, Kota Bandung, Jawa Barat 40262</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={VENUES.papandayan.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span>Buka Google Maps Papandayan</span>
                  <span>↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveVenueKey('papandayan')}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
                    activeVenueKey === 'papandayan'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                  }`}
                >
                  Lihat di Peta Samping →
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Real-Time Google Maps Window */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col">
              
              {/* Map Header Toolbar with Venue Switcher Tabs */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      Peta Interaktif Lokasi Acara
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {currentVenue.coordinates}
                    </p>
                  </div>
                </div>

                {/* Venue Switch Buttons */}
                <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveVenueKey('braga')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeVenueKey === 'braga'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Braga City Walk
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVenueKey('papandayan')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      activeVenueKey === 'papandayan'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    The Papandayan
                  </button>
                </div>
              </div>

              {/* Real Map Frame (Google Maps Embed) */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-slate-100 overflow-hidden group">
                <iframe
                  key={currentVenue.key}
                  title={`Peta Lokasi ${currentVenue.name}`}
                  src={currentVenue.embedUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                {/* Direct Google Maps Floating Overlay Pill (Clickable Direct to GMaps) */}
                <a
                  href={currentVenue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black text-slate-900 bg-white/95 hover:bg-white shadow-lg border border-slate-200/90 backdrop-blur-sm transition-all hover:scale-105 group-hover:shadow-xl cursor-pointer"
                >
                  <svg className="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>Buka di Google Maps</span>
                  <span className="text-blue-600 font-bold">↗</span>
                </a>

                {/* Top Corner Current Venue Indicator */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-bold backdrop-blur-md shadow-md border border-slate-700/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {currentVenue.name}
                  </span>
                </div>
              </div>

              {/* Transit & Access Info Details Below Map */}
              <div className="p-5 space-y-3.5 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Akses &amp; Petunjuk Kedatangan:
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">
                    Kota Bandung, Jawa Barat
                  </span>
                </div>

                <div className="space-y-2">
                  {currentVenue.transitNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{note}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href={currentVenue.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span>Navigasi Langsung ke {currentVenue.name} di Google Maps</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
