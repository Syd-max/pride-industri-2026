'use client';

import { useState } from 'react';

type VenueKey = 'braga' | 'papandayan';

interface VenueInfo {
  key: VenueKey;
  name: string;
  category: string;
  badge: string;
  badgeType: 'public' | 'invitation';
  role: string;
  address: string;
  schedule: string;
  coordinates: string;
  googleMapsUrl: string;
  directionsUrl: string;
  embedUrl: string;
  transitEtas: { label: string; time: string; type: 'car' | 'train' | 'walk' }[];
}

const VENUES: Record<VenueKey, VenueInfo> = {
  braga: {
    key: 'braga',
    name: 'Braga City Walk Bandung',
    category: 'Pusat Eksibisi Festival & Koridor Heritage',
    badge: 'Venue Utama Festival (27–28 Nov 2026)',
    badgeType: 'public',
    role: 'Pameran IKM Binaan (Fesyen, Kriya, Kuliner), Fashion Runway Desainer, Shooting Lomba Video 1 Menit, & Live Music Perkusi.',
    address: 'Jl. Braga No. 99–101, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111',
    schedule: 'Jumat–Sabtu, 27–28 Nov 2026 · 10:00 – 21:00 WIB',
    coordinates: '6°55\'00.8"S 107°36\'34.3"E',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Braga+City+Walk+Bandung',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Braga+City+Walk+Bandung',
    embedUrl: 'https://maps.google.com/maps?q=Braga+City+Walk+Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed',
    transitEtas: [
      { label: 'Stasiun KA Bandung', time: '5 mnt · 1.2 km', type: 'train' },
      { label: 'Gedung Sate / Dago', time: '10 mnt · 2.8 km', type: 'car' },
      { label: 'Alun-Alun Bandung', time: '8 mnt · 650 m', type: 'walk' },
    ],
  },
  papandayan: {
    key: 'papandayan',
    name: 'Ballroom Hotel The Papandayan',
    category: 'Malam Penganugerahan & Gala Dinner',
    badge: 'Malam Penganugerahan (28 Nov 2026 · 19:00 WIB)',
    badgeType: 'invitation',
    role: 'Penganugerahan kepatuhan pelaporan SIINAS bagi 200 pelaku industri, penyerahan sertifikasi jaminan mutu, serta pengumuman juara lomba.',
    address: 'Jl. Gatot Subroto No. 83, Malabar, Kec. Lengkong, Kota Bandung, Jawa Barat 40262',
    schedule: 'Sabtu, 28 Nov 2026 · 19:00 – 22:00 WIB (Khusus Undangan)',
    coordinates: '6°55\'43.3"S 107°37\'30.4"E',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Papandayan+Hotel+Bandung',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=The+Papandayan+Hotel+Bandung',
    embedUrl: 'https://maps.google.com/maps?q=The+Papandayan+Hotel+Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed',
    transitEtas: [
      { label: 'Simpang Lima Bandung', time: '4 mnt · 1.1 km', type: 'car' },
      { label: 'Exit Tol Buah Batu', time: '18 mnt · 6.4 km', type: 'car' },
      { label: 'Braga City Walk', time: '10 mnt · 2.5 km', type: 'car' },
    ],
  },
};

export default function LocationSection() {
  const [activeVenueKey, setActiveVenueKey] = useState<VenueKey>('braga');
  const [copied, setCopied] = useState(false);
  const currentVenue = VENUES[activeVenueKey];

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(currentVenue.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <section
      id="location"
      className="relative py-10 sm:py-14 lg:py-16 bg-slate-50/70 border-t border-slate-200/80"
      aria-label="Lokasi dan Informasi Pengunjung"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Lokasi &amp; Peta Venue
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dua Panggung Utama di Jantung Kota Bandung
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Menghadirkan perpaduan pesona historis art-deco Jalan Braga dengan kemewahan
            Malam Penganugerahan di Ballroom Hotel Papandayan.
          </p>

          {/* Apple Maps Segmented Venue Selector Pill */}
          <div className="mt-6 inline-flex p-1.5 rounded-full bg-slate-200/80 backdrop-blur-md border border-slate-300/80 shadow-inner max-w-full">
            <button
              type="button"
              onClick={() => setActiveVenueKey('braga')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeVenueKey === 'braga'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Braga City Walk</span>
              <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">(Festival)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVenueKey('papandayan')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeVenueKey === 'papandayan'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>The Papandayan</span>
              <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">(Malam Gala)</span>
            </button>
          </div>
        </div>

        {/* ─── Apple Maps Master Container ─── */}
        <div className="rounded-3xl sm:rounded-[32px] bg-white border border-slate-200/90 shadow-xl overflow-hidden relative">
          
          {/* Top Apple Maps Chrome Header Bar */}
          <div className="px-5 py-3.5 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
                {currentVenue.coordinates}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                LIVE GPS
              </span>
            </div>
          </div>

          {/* Interactive Map Viewport with Floating Apple Place Card */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] bg-slate-100 overflow-hidden">
            {/* Embedded Interactive Google Map */}
            <iframe
              key={currentVenue.key}
              title={`Peta Lokasi ${currentVenue.name}`}
              src={currentVenue.embedUrl}
              width="100%"
              height="100%"
              className="w-full h-full border-0 select-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Apple Maps Floating Controls (Top Right: Compass & Direct GMaps Trigger) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
              <a
                href={currentVenue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka Peta Penuh di Google Maps"
                className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 backdrop-blur-md cursor-pointer"
              >
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <a
                href={currentVenue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Navigasi Rute Langsung"
                className="w-9 h-9 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </a>
            </div>

            {/* Floating Apple Maps Place Card (Overlay on Desktop, Floating Snug on Map) */}
            <div className="hidden lg:block absolute top-4 left-4 z-20 w-[350px] max-w-[calc(100%-32px)] pointer-events-auto">
              <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl space-y-4">
                
                {/* Header Tag & Title */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        currentVenue.badgeType === 'public'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {currentVenue.badgeType === 'public' ? 'Terbuka untuk Umum' : 'Khusus Tamu Undangan'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif 2026
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {currentVenue.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {currentVenue.category}
                  </p>
                </div>

                {/* Address Snippet */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                    <span className="line-clamp-2">{currentVenue.address}</span>
                  </div>
                </div>

                {/* Primary Apple-style Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href={currentVenue.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span>Petunjuk Arah</span>
                  </a>

                  <a
                    href={currentVenue.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Maps</span>
                    <span className="text-blue-600 font-bold">↗</span>
                  </a>
                </div>

                {/* Quick ETA Badges */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="16" height="16" x="4" y="3" rx="2"/>
                      <path d="M4 11h16"/>
                      <path d="M12 3v8"/>
                      <path d="m8 19-2 3"/>
                      <path d="m18 22-2-3"/>
                      <circle cx="8" cy="15" r="1"/>
                      <circle cx="16" cy="15" r="1"/>
                    </svg>
                    <span>Stasiun KA: 5 mnt</span>
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="2"/>
                      <path d="M9 17h6"/>
                      <circle cx="17" cy="17" r="2"/>
                    </svg>
                    <span>Braga: 27–28 Nov</span>
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
                    </svg>
                    <span>Parkir Resmi</span>
                  </span>
                </div>

              </div>
            </div>

            {/* Direct Google Maps Floating Overlay Pill in Bottom Right */}
            <a
              href={currentVenue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black text-slate-900 bg-white/95 hover:bg-white shadow-lg border border-slate-200/90 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span>Buka di Google Maps</span>
              <span className="text-blue-600 font-bold">↗</span>
            </a>
          </div>

          {/* ─── Apple Maps Bottom Information Sheet (For All Devices) ─── */}
          <div className="p-5 sm:p-7 bg-white space-y-5 border-t border-slate-100">
            
            {/* Venue Headline & Quick Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      currentVenue.badgeType === 'public'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {currentVenue.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentVenue.schedule}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentVenue.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {currentVenue.role}
                </p>
              </div>

              {/* Action Buttons: Direct to Google Maps & Copy Address */}
              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0 w-full md:w-auto">
                <a
                  href={currentVenue.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span>Petunjuk Arah</span>
                  <span>↗</span>
                </a>

                <a
                  href={currentVenue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buka di Google Maps</span>
                  <span className="text-blue-600 font-bold">↗</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className={`w-full sm:w-auto py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Salin Alamat Lengkap"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Alamat Disalin!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Apple Transit Route Pills */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                Estimasi Waktu Tempuh &amp; Akses:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentVenue.transitEtas.map((eta, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <span className="inline-flex items-center gap-2 text-slate-700 font-medium">
                      {eta.type === 'train' && (
                        <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="16" height="16" x="4" y="3" rx="2"/>
                          <path d="M4 11h16"/>
                          <path d="M12 3v8"/>
                          <path d="m8 19-2 3"/>
                          <path d="m18 22-2-3"/>
                          <circle cx="8" cy="15" r="1"/>
                          <circle cx="16" cy="15" r="1"/>
                        </svg>
                      )}
                      {eta.type === 'car' && (
                        <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                          <circle cx="7" cy="17" r="2"/>
                          <path d="M9 17h6"/>
                          <circle cx="17" cy="17" r="2"/>
                        </svg>
                      )}
                      {eta.type === 'walk' && (
                        <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="13" cy="4" r="2"/>
                          <path d="M14.5 9h-3.2l-2 5 2.5 1 1.2-3 2 4 3-1"/>
                          <path d="m9.5 9-2 4"/>
                        </svg>
                      )}
                      <span>{eta.label}</span>
                    </span>
                    <span className="font-extrabold text-blue-700 font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {eta.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
