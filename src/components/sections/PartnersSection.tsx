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
      className="relative pt-10 sm:pt-14 pb-10 sm:pb-14 scroll-mt-20 overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-white/70 via-slate-50/80 to-white/95"
      aria-label="Partner dan Sponsor PRIDE Industri 2026"
    >
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-100/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header: Human Design Compact ─── */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          
          {/* Warm Peach/Terracotta Pill Tag */}
          <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#FFF4ED] border border-[#FFE2D5] shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#B44C1D] tracking-wider uppercase">
              Kolaborasi <span className="title-amp text-[#B44C1D]">&amp;</span> Ekosistem
            </span>
          </div>

          {/* Clean Human Heading with Curved Blue & Ampersand */}
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Didukung <span className="title-amp">&amp;</span> Digerakkan oleh Sinergi Industri
          </h2>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
            Apresiasi bagi instansi penyelenggara, sponsor resmi, ekosistem pendukung, serta mitra strategis PRIDE Industri 2026.
          </p>
        </div>

        {/* ─── Logo Showcase Grid: Compact & Centered ─── */}
        <div className="mt-7 sm:mt-9 space-y-5 sm:space-y-6">
          {PARTNER_CATEGORIES.map((catInfo) => {
            const items = PARTNERS_DATA.filter((p) => p.category === catInfo.id);
            if (items.length === 0) return null;

            return (
              <div key={catInfo.id} className="space-y-2 sm:space-y-2.5 text-center">
                
                {/* Centered Category Title */}
                <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700">
                  {catInfo.title}
                </h3>

                {/* Centered Logo Cards (Compact Shape) */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
                  {items.map((partner, index) => (
                    <div
                      key={partner.id}
                      className={
                        items.length === 1
                          ? 'w-full max-w-[180px] sm:max-w-[200px]'
                          : 'w-[calc(50%-5px)] max-w-[165px] sm:max-w-[190px] sm:w-[190px]'
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

// ─── Individual Partner Card (Compact Human Design Shape) ────────────────────
function PartnerCard({ partner, index }: { partner: PartnerItem; index: number }) {
  const floatClass = index % 2 === 0 ? 'logo-float-a' : 'logo-float-b';

  const cardContent = (
    <div
      className={`group relative w-full h-[68px] sm:h-[74px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.08),0_3px_8px_-2px_rgba(22,82,240,0.06)] hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-center overflow-hidden cursor-pointer ${floatClass}`}
    >
      {/* Sheen light reflex passing on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full logo-sheen-effect bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

      {/* Real Logo Image */}
      <div className="relative w-full h-10 sm:h-11 flex items-center justify-center px-1">
        <Image
          src={partner.logoUrl}
          alt={partner.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-contain group-hover:scale-105 transition-all duration-300"
        />
      </div>
    </div>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        className="block w-full"
      >
        {cardContent}
      </a>
    );
  }

  return <div className="w-full">{cardContent}</div>;
}
