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
      className="relative pt-20 sm:pt-28 pb-16 sm:pb-24 scroll-mt-24 sm:scroll-mt-28 overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-white/60 via-slate-50/80 to-white/90"
      aria-label="Partner dan Sponsor PRIDE Industri 2026"
    >
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header: Human Design Reference from Image 1 ─── */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          
          {/* Warm Peach/Terracotta Pill Tag (Clean, No Radar Dot) */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFF4ED] border border-[#FFE2D5] shadow-2xs">
            <span className="text-[11px] sm:text-xs font-bold text-[#B44C1D] tracking-wider uppercase">
              Kolaborasi <span className="title-amp text-[#B44C1D]">&amp;</span> Ekosistem
            </span>
          </div>

          {/* Clean Human Heading with Curved Blue & Ampersand */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
            Didukung <span className="title-amp">&amp;</span> Digerakkan oleh Sinergi Industri
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Apresiasi dan kehormatan bagi seluruh instansi, sponsor, mitra strategis, serta komunitas kreatif yang berkolaborasi mewujudkan panggung kemandirian IKM Kota Bandung.
          </p>
        </div>

        {/* ─── Logo Showcase Grid: Clean Categories & Cards ─── */}
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-12">
          {PARTNER_CATEGORIES.map((catInfo) => {
            const items = PARTNERS_DATA.filter((p) => p.category === catInfo.id);
            if (items.length === 0) return null;

            return (
              <div key={catInfo.id} className="space-y-4 sm:space-y-5">
                
                {/* Clean Category Header (No Radar Dot, No Sub-Badge, No Long Description) */}
                <div className="pb-2.5 border-b border-slate-200/70">
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
                    {catInfo.title}
                  </h3>
                </div>

                {/* Grid of Rounded Cards (Homage to Image 1) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {items.map((partner, index) => (
                    <PartnerCard key={partner.id} partner={partner} index={index} />
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
  // Alternating floating rhythm for organic feeling
  const floatClass = index % 2 === 0 ? 'logo-float-a' : 'logo-float-b';

  const cardContent = (
    <div
      className={`group relative w-full min-h-[92px] sm:min-h-[100px] px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(22,82,240,0.06)] hover:border-blue-400/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer ${floatClass}`}
    >
      {/* Sheen light reflex passing on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full logo-sheen-effect bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

      {/* Real Logo Image */}
      {partner.logoUrl ? (
        <div className="w-full flex flex-col items-center justify-center space-y-1.5">
          <div className="relative w-full h-10 sm:h-11 flex items-center justify-center px-1">
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain filter grayscale group-hover:grayscale-0 contrast-125 group-hover:scale-105 transition-all duration-300"
            />
          </div>
          {partner.tag && (
            <span className="text-[9px] font-semibold text-slate-400 group-hover:text-blue-600 bg-slate-50 group-hover:bg-blue-50 border border-slate-200/60 group-hover:border-blue-200/60 rounded px-1.5 py-0.5 transition-colors">
              {partner.tag}
            </span>
          )}
        </div>
      ) : (
        /* Human Design Placeholder Slot: Clean, balanced, 0 collision, No Radar Dot */
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          {partner.tag && (
            <span className="text-[9px] font-semibold text-slate-400 group-hover:text-blue-600 bg-slate-50 group-hover:bg-blue-50 border border-slate-200/60 group-hover:border-blue-200/60 rounded px-1.5 py-0.5 transition-colors">
              {partner.tag}
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 tracking-tight leading-snug transition-colors line-clamp-1">
            {partner.name}
          </span>
          <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-700 transition-colors line-clamp-1">
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
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return <div>{cardContent}</div>;
}
