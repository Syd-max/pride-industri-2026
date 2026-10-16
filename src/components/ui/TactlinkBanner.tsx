'use client';

import Image from 'next/image';

interface TactlinkBannerProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function TactlinkBanner({
  className = '',
  variant = 'light',
}: TactlinkBannerProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-3xl border transition-all relative overflow-hidden shadow-sm ${
        isDark
          ? 'bg-slate-800/90 border-slate-700/80 text-white'
          : 'bg-white border-slate-200/90 text-slate-900'
      } ${className}`}
      style={{
        borderTop: '4px solid #F5A623',
      }}
    >
      <div className="p-6 sm:p-7">
        {/* Top Tag: Website Supported By */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border ${
              isDark
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            WEBSITE SUPPORTED BY
          </span>
        </div>

        {/* Main Row: Logo, Info & Visit Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {/* Tactlink Logo Container */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex-shrink-0 p-1.5 flex items-center justify-center overflow-hidden">
              <Image
                src="/LOGO_TACTLINK_CROPPED.png"
                alt="Tactlink Logo"
                fill
                sizes="64px"
                className="object-contain p-1"
                priority
              />
            </div>

            {/* Headline & Description */}
            <div className="space-y-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Connect smarter with{' '}
                <span className="text-amber-500 font-extrabold">Tactlink</span>
              </h3>
              <p
                className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Situs resmi ini didukung oleh Tactlink. Unduh aplikasinya untuk pengalaman networking digital dan kartu nama digital yang lebih pintar.
              </p>
            </div>
          </div>

          {/* Visit Tactlink Button */}
          <div className="flex-shrink-0 pt-2 lg:pt-0">
            <a
              href="https://www.tactlink.com/id"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 font-bold text-xs sm:text-sm transition-all hover:scale-102 shadow-xs cursor-pointer ${
                isDark
                  ? 'border-white text-white hover:bg-white hover:text-slate-900'
                  : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span>Visit Tactlink</span>
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Dashed Divider Line */}
        <div
          className={`border-t border-dashed my-5 ${
            isDark ? 'border-slate-700/80' : 'border-slate-200'
          }`}
        />

        {/* Bottom Row: App Store, Google Play & Statistics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Download App Store & Play Store Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://apps.apple.com/id/app/tactlink/id1469516661"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer shadow-xs ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-950 text-white border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <svg
                className="w-4 h-4 text-current"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>App Store</span>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.tactlink.app"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer shadow-xs ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-950 text-white border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <svg
                className="w-4 h-4 text-current"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Google Play</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <span className="text-rose-600 font-extrabold tracking-tight">
              10.000+ kartu dibagikan
            </span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Tersedia di 8 negara
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
