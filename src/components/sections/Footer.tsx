'use client';

import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';
import TactlinkBanner from '@/components/ui/TactlinkBanner';

export default function Footer() {
  return (
    <footer
      className="relative bg-slate-900 border-t border-slate-800 pt-10 sm:pt-12 pb-8 sm:pb-10 text-slate-400"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tactlink Official Partner Banner */}
        <div className="mb-8 sm:mb-10">
          <TactlinkBanner variant="light" />
        </div>

        {/* Main Grid: Clean 2-Column Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-8 sm:pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand & Official Identity (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Logo & Event Title */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image
                  src="/LOGO_PRIDE_INDUSTRI.png"
                  alt="PRIDE Industri 2026"
                  fill
                  sizes="44px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-tight">
                  PRIDE <span className="text-rose-500">INDUSTRI 2026</span>
                </span>
                <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                  Dinas Perdagangan dan Perindustrian Kota Bandung
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
              Pagelaran Ragam Inovasi dan Eksistensi (PRIDE) Industri 2026 merupakan festival perayaan kreativitas, inovasi, dan kemandirian Industri Kecil dan Menengah (IKM) binaan Kota Bandung.
            </p>
          </div>

          {/* Col 2: Sekretariat & Kanal Informasi Resmi (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Sekretariat <span className="title-amp text-blue-400">&amp;</span> Kontak Resmi
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Layanan informasi pameran, kepesertaan kompetisi, dan presensi festival.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Email */}
              <a
                href={`mailto:${EVENT_CONFIG.contact.email}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all text-xs group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Email Panitia Pelaksana
                  </span>
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors truncate block">
                    {EVENT_CONFIG.contact.email}
                  </span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/bdg.perdaganganindustri"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all text-xs group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Instagram Resmi Disdagin
                  </span>
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors truncate block">
                    @bdg.perdaganganindustri
                  </span>
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@disdagin.bandung"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all text-xs group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    TikTok Resmi Disdagin
                  </span>
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors truncate block">
                    @disdagin.bandung
                  </span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* ─── Supported By Section ─── */}
        <div className="py-4 sm:py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
              SUPPORT BY:
            </span>
          </div>

          {/* Partner Logos: Clean layer shadow layout without bulky boxes */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Braga Citywalk */}
            <a
              href="https://maps.google.com/?q=Braga+City+Walk+Bandung"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition-all hover:scale-105 group cursor-pointer filter drop-shadow-sm hover:drop-shadow-md"
              title="Braga Citywalk - Official Venue Partner"
            >
              <Image
                src="/LOGO_BRAGA_CITYWALK_LAYER.png"
                alt="Braga Citywalk"
                width={70}
                height={28}
                style={{ height: '28px', width: 'auto', maxHeight: '28px' }}
                className="object-contain"
              />
            </a>

            {/* RRD Organizer */}
            <div
              className="inline-flex items-center transition-all hover:scale-105 filter drop-shadow-sm hover:drop-shadow-md"
              title="PT Rahman Ramadhan Diandra (RRD Organizer)"
            >
              <Image
                src="/LOGO_RRD_ORGANIZER.png"
                alt="RRD Organizer"
                width={120}
                height={28}
                style={{ height: '28px', width: 'auto', maxHeight: '28px' }}
                className="object-contain"
              />
            </div>

            {/* NXG Institute */}
            <div
              className="inline-flex items-center transition-all hover:scale-105 filter drop-shadow-sm hover:drop-shadow-md"
              title="NXG Institute"
            >
              <Image
                src="/LOGO_NXG_INSTITUTE.png"
                alt="NXG Institute"
                width={120}
                height={28}
                style={{ height: '28px', width: 'auto', maxHeight: '28px' }}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer / Powered By Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Copyright */}
          <div className="text-center sm:text-left text-slate-500 text-[11px] sm:text-xs">
            © 2026 PRIDE Industri Kota Bandung · Disdagin Kota Bandung. Hak cipta dilindungi.
          </div>

          {/* Powered by Tactlink & Dev by Muhammad Irsyad Andika */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-xs">
            
            {/* Powered by Tactlink */}
            <a
              href="https://www.tactlink.com/id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group cursor-pointer"
              title="Kunjungi Situs Resmi Tactlink"
            >
              <span className="text-slate-400 font-medium">Powered by</span>
              <div className="relative w-4 h-4 flex-shrink-0">
                <Image
                  src="/LOGO_TACTLINK_CROPPED.png"
                  alt="Tactlink"
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-white group-hover:text-amber-400 transition-colors">
                Tactlink
              </span>
            </a>

            <span className="text-slate-700 hidden sm:inline">•</span>

            {/* Dev by Muhammad Irsyad Andika with direct LinkedIn redirect */}
            <div className="inline-flex items-center gap-1.5 text-slate-400">
              <span>Dev by</span>
              <a
                href="https://www.linkedin.com/in/irsyad-andika/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-200 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group cursor-pointer"
                title="Profil LinkedIn Muhammad Irsyad Andika"
              >
                <span className="underline decoration-slate-600 group-hover:decoration-blue-400 underline-offset-2">
                  Muhammad Irsyad Andika
                </span>
                <svg
                  className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0"
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

        </div>

      </div>
    </footer>
  );
}
