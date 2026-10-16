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
      <div className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Logo + Content */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            {/* Tactlink Logo Container */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex-shrink-0 p-1 flex items-center justify-center overflow-hidden">
              <Image
                src="/LOGO_TACTLINK_CROPPED.png"
                alt="Tactlink Logo"
                fill
                sizes="56px"
                className="object-contain p-0.5"
                priority
              />
            </div>

            {/* Headline, Tag & Description */}
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider border ${
                    isDark
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  SUPPORTED BY
                </span>
                <span className="text-xs font-black tracking-tight">
                  <span className="text-amber-500 font-extrabold">Tactlink</span> — Smart Digital Directory
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed max-w-xl ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Situs resmi didukung oleh Tactlink. Unduh aplikasinya untuk kartu nama digital &amp; jejaring bisnis cerdas.
              </p>
            </div>
          </div>

          {/* Right: Actions & Badges Compact */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 lg:pt-0">
            <a
              href="https://apps.apple.com/id/app/tactlink/id1469516661"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:scale-102 cursor-pointer shadow-2xs ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-950 text-white border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
              title="Unduh di App Store"
            >
              <svg className="w-3.5 h-3.5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>App Store</span>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.tactlink.app"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:scale-102 cursor-pointer shadow-2xs ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-950 text-white border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
              title="Unduh di Google Play"
            >
              <svg className="w-3.5 h-3.5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Google Play</span>
            </a>

            <a
              href="https://www.tactlink.com/id"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-bold text-xs transition-all hover:scale-102 shadow-2xs cursor-pointer ${
                isDark
                  ? 'border-white text-white hover:bg-white hover:text-slate-900'
                  : 'border-slate-900 text-white bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <span>Visit Tactlink</span>
              <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
