'use client';

import { useState, useEffect, useRef } from 'react';

const VENUE = {
  name: 'Braga City Walk Bandung',
  category: 'Pusat Seluruh Rangkaian Acara Festival & Expo',
  badge: 'Venue Resmi PRIDE Industri 2026',
  badgeType: 'public' as const,
  role: 'Pusat seluruh rangkaian kegiatan PRIDE Industri 2026: Pameran Produk & Kemasan IKM, Talkshow Pelaku Industri, Lomba Desain Kemasan & Video, Live Corner, Workshop & Consultation Corner, Penyerahan Sertifikat Mutu & Halal, Business Matching (Pitching), Fashion Show, & Industri Experience.',
  address: 'Jl. Braga No. 99–101, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111',
  schedule: 'Jum\'at, 27 Nov (13:30 – 21:00 WIB) · Sabtu, 28 Nov (10:00 – 21:00 WIB)',
  scheduleFriday: 'Jum\'at, 27 Nov 2026 · 13:30 – 21:00 WIB',
  scheduleSaturday: 'Sabtu, 28 Nov 2026 · 10:00 – 21:00 WIB',
  coordinates: '6°55\'00.8"S 107°36\'34.3"E',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Braga+City+Walk+Bandung',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Braga+City+Walk+Bandung',
  embedUrl: 'https://www.google.com/maps?q=-6.917464,107.609467&hl=id&z=17&output=embed',
};

export default function LocationSection() {
  const [copied, setCopied] = useState(false);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasScrolledIntoView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(VENUE.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <section
      id="location"
      ref={sectionRef}
      className="relative z-10 py-6 sm:py-8 lg:py-3.5 lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)] lg:min-h-[580px] lg:flex lg:flex-col lg:justify-between bg-slate-50/70 border-t border-slate-200/80 overflow-visible scroll-mt-16"
      aria-label="Lokasi dan Informasi Pengunjung"
    >
      {/* ─── Animated Exterior Road & Car Journey (Garis Berjalan & Mobil di Luar Map) ─── */}
      <div className="absolute inset-x-0 -top-16 bottom-0 pointer-events-none select-none z-0 overflow-visible" style={{ overflow: 'visible' }} aria-hidden="true">
        <svg
          className="w-full h-full overflow-visible"
          style={{ overflow: 'visible' }}
          viewBox="0 0 1200 950"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          <defs>
            {/* Soft Ambient Road Aura */}
            <filter id="exteriorRoadAura" x="-20%" y="-20%" width="140%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#2563eb" floodOpacity="0.25" />
            </filter>

            {/* Glowing Car Headlight Beam */}
            <linearGradient id="carHeadlightGlow" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#fef08a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>

            {/* GPS Radar Puck beneath car */}
            <radialGradient id="carRadarPuck" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Exterior Navigation Route Path (Starts behind Video Card at 320,-60 and ends behind Card 01 FAQ at 500,1150) */}
          <path
            id="exteriorCarJourneyPath"
            d="M 320 -60 C 330 0, 380 50, 460 55 C 560 60, 720 10, 830 45 C 910 70, 940 130, 890 165 C 820 185, 700 185, 540 185 C 380 185, 240 180, 140 195 C 80 215, 60 290, 55 420 C 50 580, 55 740, 65 880 C 75 980, 105 1060, 160 1110 C 220 1150, 340 1150, 500 1150"
            fill="none"
          />

          {/* 1. Road Aura Base Track */}
          <path
            d="M 320 -60 C 330 0, 380 50, 460 55 C 560 60, 720 10, 830 45 C 910 70, 940 130, 890 165 C 820 185, 700 185, 540 185 C 380 185, 240 180, 140 195 C 80 215, 60 290, 55 420 C 50 580, 55 740, 65 880 C 75 980, 105 1060, 160 1110 C 220 1150, 340 1150, 500 1150"
            stroke="#2563eb"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.14"
          />

          {/* 2. Main Sapphire Blue Highway Line */}
          <path
            d="M 320 -60 C 330 0, 380 50, 460 55 C 560 60, 720 10, 830 45 C 910 70, 940 130, 890 165 C 820 185, 700 185, 540 185 C 380 185, 240 180, 140 195 C 80 215, 60 290, 55 420 C 50 580, 55 740, 65 880 C 75 980, 105 1060, 160 1110 C 220 1150, 340 1150, 500 1150"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
            filter="url(#exteriorRoadAura)"
          />

          {/* 3. Animated Forward Moving Chevrons / Dashes (Garis Berjalan) */}
          <path
            d="M 320 -60 C 330 0, 380 50, 460 55 C 560 60, 720 10, 830 45 C 910 70, 940 130, 890 165 C 820 185, 700 185, 540 185 C 380 185, 240 180, 140 195 C 80 215, 60 290, 55 420 C 50 580, 55 740, 65 880 C 75 980, 105 1060, 160 1110 C 220 1150, 340 1150, 500 1150"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 12"
            className="map-road-animated-dash"
          />

          {/* Start Origin Marker behind Video Card */}
          <g transform="translate(320, -60)">
            <circle r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <circle r="11" fill="#2563eb" opacity="0.25" />
          </g>

          {/* Arrival Marker cleanly behind Card 01 FAQ (Apakah pendaftaran kompetisi dipungut biaya?) */}
          <g transform="translate(500, 1150)">
            <circle r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <circle r="14" fill="#2563eb" opacity="0.25" className="map-pin-pulse-effect" />
          </g>

          {/* 4. Animated Moving Car (Once when visible in viewport, 22s slow drive) */}
          <g className={hasScrolledIntoView ? 'exterior-car-drive-once' : 'opacity-0'}>
            {/* GPS Tracking Puck Aura */}
            <circle cx="0" cy="0" r="22" fill="url(#carRadarPuck)" />

            {/* Headlights Forward Beam Cone */}
            <polygon points="14,-5 54,-18 54,18 14,5" fill="url(#carHeadlightGlow)" opacity="0.9" />

            {/* Soft Drop Shadow */}
            <rect x="-16" y="-8.5" width="32" height="17" rx="7" fill="#0f172a" opacity="0.32" transform="translate(0, 2.5)" />

            {/* Car Body Shell (Sleek White & Sapphire Accent) */}
            <rect x="-15.5" y="-8" width="31" height="16" rx="6.5" fill="#ffffff" stroke="#2563eb" strokeWidth="1.2" />

            {/* Front Racing/Brand Stripe */}
            <line x1="7" y1="0" x2="14" y2="0" stroke="#2563eb" strokeWidth="1.6" />

            {/* Front Windshield */}
            <path d="M 3 -6 L 6.5 -4.5 L 6.5 4.5 L 3 6 Z" fill="#0f172a" />

            {/* Panoramic Glass Roof */}
            <rect x="-5.5" y="-4.5" width="8" height="9" rx="1.8" fill="#0f172a" />

            {/* Rear Window */}
            <path d="M -8 -5 L -11 -4 L -11 4 L -8 5 Z" fill="#0f172a" />

            {/* LED Headlights */}
            <rect x="14" y="-7" width="2" height="2.6" rx="0.6" fill="#fef08a" />
            <rect x="14" y="4.4" width="2" height="2.6" rx="0.6" fill="#fef08a" />

            {/* Red LED Taillights */}
            <rect x="-16" y="-6.5" width="1.6" height="2.2" rx="0.5" fill="#ef4444" />
            <rect x="-16" y="4.3" width="1.6" height="2.2" rx="0.5" fill="#ef4444" />

            {/* Side Mirrors */}
            <rect x="3" y="-9.6" width="2.6" height="1.5" rx="0.6" fill="#ffffff" stroke="#2563eb" strokeWidth="0.6" />
            <rect x="3" y="8.1" width="2.6" height="1.5" rx="0.6" fill="#ffffff" stroke="#2563eb" strokeWidth="0.6" />
          </g>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full lg:h-full lg:flex lg:flex-col lg:justify-between">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-3 sm:mb-4 lg:mb-2 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Lokasi Venue
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Braga City Walk Bandung
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Pusat seluruh rangkaian kegiatan festival PRIDE Industri 2026.
          </p>
        </div>

        {/* ─── Apple Maps Master Container ─── */}
        <div className="flex-1 min-h-0 flex flex-col rounded-3xl sm:rounded-[32px] bg-white border border-slate-200/90 shadow-xl overflow-hidden relative">
          
          {/* Top Apple Maps Chrome Header Bar */}
          <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
                {VENUE.coordinates}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                LIVE GPS
              </span>
            </div>
          </div>

          {/* Interactive Map Viewport with Floating Apple Place Card */}
          <div className="relative w-full flex-1 min-h-[320px] lg:min-h-0 bg-slate-100 overflow-hidden">
            {/* Embedded Interactive Google Map */}
            <iframe
              title={`Peta Lokasi ${VENUE.name}`}
              src={VENUE.embedUrl}
              style={{ width: '100%', height: '100%', minHeight: '100%', border: 0 }}
              className="w-full h-full block border-0 select-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Apple Maps Floating Controls (Top Right: Direct GMaps Trigger) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
              <a
                href={VENUE.googleMapsUrl}
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
                href={VENUE.directionsUrl}
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
            <div className="hidden lg:block absolute top-3 left-3 z-20 w-[330px] max-w-[calc(100%-24px)] pointer-events-auto">
              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl space-y-3">
                
                {/* Header Tag & Title */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                      Terbuka untuk Umum
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif 2026
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    {VENUE.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {VENUE.category}
                  </p>
                </div>

                {/* Address Snippet */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-[10px] text-slate-600 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <svg className="w-3 h-3 text-rose-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                    <span className="line-clamp-2">{VENUE.address}</span>
                  </div>
                </div>

                {/* Primary Apple-style Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href={VENUE.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span>Petunjuk Arah</span>
                  </a>

                  <a
                    href={VENUE.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Maps</span>
                  </a>
                </div>

              </div>
            </div>

            {/* Direct Google Maps Floating Overlay Pill in Bottom Right */}
            <a
              href={VENUE.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black text-slate-900 bg-white/95 hover:bg-white shadow-lg border border-slate-200/90 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span>Buka di Google Maps</span>
            </a>
          </div>

          {/* ─── Apple Maps Bottom Information Sheet (For All Devices) ─── */}
          <div className="p-3.5 sm:p-4 lg:py-2.5 lg:px-5 bg-white border-t border-slate-100 shrink-0">
            
            {/* Venue Headline & Quick Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {VENUE.name}
                </h3>
                <p className="text-xs text-slate-500 hidden md:block">
                  {VENUE.schedule}
                </p>
              </div>

              {/* Action Buttons: Direct to Google Maps & Copy Address */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0 w-full md:w-auto">
                <a
                  href={VENUE.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span>Petunjuk Arah</span>
                </a>

                <a
                  href={VENUE.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2 px-3.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buka di Google Maps</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className={`w-full sm:w-auto py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
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

          </div>

        </div>

      </div>
    </section>
  );
}
