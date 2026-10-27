'use client';

import Image from 'next/image';
import {
  PARTNER_CATEGORIES,
  PARTNERS_DATA,
  type PartnerItem,
} from '@/config/partners';

export default function PartnersSection() {
  return (
    <section
      id="partners"
      className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 scroll-mt-20 overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-white/70 via-slate-50/80 to-white/95"
      aria-label="Partner dan Sponsor PRIDE Industri 2026"
    >
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header: Human Design Compact ─── */}
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-2.5">
          
          {/* Warm Peach/Terracotta Pill Tag */}
          <div className="inline-flex items-center px-3.5 py-0.5 rounded-full bg-[#FFF4ED] border border-[#FFE2D5] shadow-2xs">
            <span className="text-[10.5px] sm:text-xs font-bold text-[#B44C1D] tracking-wider uppercase">
              Kolaborasi <span className="title-amp text-[#B44C1D]">&amp;</span> Ekosistem
            </span>
          </div>

          {/* Clean Human Heading with Curved Blue & Ampersand */}
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Didukung <span className="title-amp">&amp;</span> Digerakkan oleh Sinergi Industri
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Apresiasi bagi instansi pemerintah, sponsor, mitra venue, serta komunitas kolaborator PRIDE Industri 2026.
          </p>
        </div>

        {/* ─── Logo Showcase Grid: Compact & Centered ─── */}
        <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-7">
          {PARTNER_CATEGORIES.map((catInfo) => {
            const items = PARTNERS_DATA.filter((p) => p.category === catInfo.id);
            if (items.length === 0) return null;

            return (
              <div key={catInfo.id} className="space-y-2.5 sm:space-y-3 text-center">
                
                {/* Centered Category Title */}
                <h3 className="text-xs sm:text-xs font-black uppercase tracking-widest text-slate-700">
                  {catInfo.title}
                </h3>

                {/* Centered Logo Cards (1 logo, 2 logos, 3 logos, 2 logos) */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {items.map((partner, index) => (
                    <div
                      key={partner.id}
                      className={
                        items.length === 1
                          ? 'w-full max-w-[260px] sm:max-w-[280px]'
                          : 'w-[calc(50%-6px)] sm:w-[220px] md:w-[250px]'
                      }
                    >
                      <PartnerCard partner={partner} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// ─── Individual Partner Card with Lightweight Animations & Sheen ─────────────
function PartnerCard({ partner, index }: { partner: PartnerItem; index: number }) {
  const floatClass = index % 2 === 0 ? 'logo-float-a' : 'logo-float-b';

  const cardContent = (
    <div
      className={`group relative w-full min-h-[76px] sm:min-h-[82px] px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_24px_-4px_rgba(15,23,42,0.08),0_4px_10px_-2px_rgba(22,82,240,0.06)] hover:border-blue-400/50 hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-center text-center overflow-hidden cursor-pointer ${floatClass}`}
    >
      {/* Sheen light reflex passing on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full logo-sheen-effect bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

      {/* Real Logo Image */}
      {partner.logoUrl ? (
        <div className="relative w-full h-11 sm:h-12 flex items-center justify-center px-2">
          <Image
            src={partner.logoUrl}
            alt={partner.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain group-hover:scale-105 transition-all duration-300"
          />
        </div>
      ) : (
        /* Human Design Placeholder Slot: Clean, balanced typography */
        <div className="w-full flex flex-col items-center justify-center space-y-0.5">
          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 tracking-tight leading-snug transition-colors line-clamp-1">
            {partner.name}
          </span>
          <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors line-clamp-1">
            {partner.role}
          </span>
        </div>
      )}
    </div>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.name} - ${partner.role}`}
        className="block w-full"
      >
        {cardContent}
      </a>
    );
  }

  return <div className="w-full">{cardContent}</div>;
}
