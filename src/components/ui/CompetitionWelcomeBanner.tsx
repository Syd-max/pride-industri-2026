'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ─── PURE SVG ILLUSTRATED VECTOR ORNAMENTS ─────────────────────────────────
   100% coded in SVG vector paths — Zero image slices, zero clipping artifacts.
─────────────────────────────────────────────────────────────────────────────── */

function SewingMachineIcon() {
  return (
    <svg viewBox="0 0 100 90" fill="none" aria-hidden="true">
      <g transform="rotate(-8, 50, 45)">
        <path d="M 10,72 L 90,72 L 85,82 L 15,82 Z" fill="#000" />
        <path d="M 12,66 L 88,66 L 85,76 L 15,76 Z" fill="#E5A110" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
        <path d="M 65,66 V 26 C 65,16 45,16 28,26 V 46 H 42 V 34 H 53 V 66 Z" fill="#F5B922" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
        <line x1="28" y1="46" x2="28" y2="64" stroke="#000" strokeWidth="3" />
        <ellipse cx="75" cy="35" rx="6" ry="12" fill="#E5A110" stroke="#000" strokeWidth="3" />
        <rect x="48" y="12" width="8" height="8" fill="#FFF" stroke="#000" strokeWidth="2.5" rx="1" />
        <line x1="52" y1="10" x2="52" y2="20" stroke="#000" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function ChefHatIcon() {
  return (
    <svg viewBox="0 0 100 90" fill="none" aria-hidden="true">
      <g transform="rotate(8, 50, 45)">
        <path d="M 20,55 C 8,50 10,24 28,24 C 32,8 60,8 65,26 C 82,20 90,44 76,55 Z" fill="#000" transform="translate(0, 4)" />
        <path d="M 20,55 C 8,50 10,24 28,24 C 32,8 60,8 65,26 C 82,20 90,44 76,55 Z" fill="#FFC700" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
        <path d="M 33,26 C 36,40 38,52 38,55 M 50,22 C 50,38 50,48 50,55 M 63,28 C 61,40 59,50 59,55" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        <path d="M 24,55 H 74 V 68 H 24 Z" fill="#E5A110" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function BatagorIcon() {
  return (
    <svg viewBox="0 0 110 80" fill="none" aria-hidden="true">
      <g transform="rotate(4, 55, 40)">
        <ellipse cx="55" cy="48" rx="45" ry="22" fill="#15803D" stroke="#000" strokeWidth="3.5" />
        <polygon points="25,44 42,24 48,46" fill="#D97706" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="42,42 62,20 68,46" fill="#F59E0B" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="60,45 78,25 86,46" fill="#D97706" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="55" cy="44" rx="16" ry="8" fill="#92400E" stroke="#000" strokeWidth="2" />
        <circle cx="32" cy="48" r="7" fill="#84CC16" stroke="#000" strokeWidth="2" />
        <circle cx="32" cy="48" r="4" fill="#ECFCCB" stroke="#000" strokeWidth="1.5" />
        <ellipse cx="55" cy="62" rx="34" ry="12" fill="#0D131F" stroke="#000" strokeWidth="3" />
        <text x="55" y="66" textAnchor="middle" fill="#FFF" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="12" fontWeight="900" letterSpacing="1">BATAGOR</text>
      </g>
    </svg>
  );
}

function ShoeIcon() {
  return (
    <svg viewBox="0 0 120 70" fill="none" aria-hidden="true">
      <g transform="rotate(-6, 60, 35)">
        <path d="M 10,48 C 22,46 45,46 65,48 C 85,50 110,50 112,54 C 112,58 95,60 65,60 C 35,60 12,56 10,48 Z" fill="#000" />
        <path d="M 14,46 C 18,36 30,30 45,26 C 56,22 68,26 80,32 C 95,36 108,40 110,48 C 105,52 85,52 65,51 C 45,50 22,50 14,46 Z" fill="#B45309" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M 15,48 L 110,50 L 108,55 L 14,53 Z" fill="#451A03" stroke="#000" strokeWidth="2.5" />
        <path d="M 55,26 C 58,34 62,40 68,44 M 78,32 C 82,38 85,44 88,48" stroke="#78350F" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M 48,26 L 52,28 M 46,29 L 50,31 M 44,32 L 48,34" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */

export default function CompetitionWelcomeBanner() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const closeBanner = () => setIsOpen(false);

  return (
    <div
      className="cwb-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeBanner();
      }}
    >
      <section
        className="cwb-banner"
        role="dialog"
        aria-modal="true"
        aria-labelledby="competition-banner-title"
      >
        {/* Close button with circular outline */}
        <button
          type="button"
          className="cwb-close"
          onClick={closeBanner}
          aria-label="Tutup banner kompetisi"
          autoFocus
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        {/* 4 Corner Ornaments */}
        <div className="cwb-ornament cwb-ornament-sewing"><SewingMachineIcon /></div>
        <div className="cwb-ornament cwb-ornament-chef"><ChefHatIcon /></div>
        <div className="cwb-ornament cwb-ornament-batagor"><BatagorIcon /></div>
        <div className="cwb-ornament cwb-ornament-shoe"><ShoeIcon /></div>

        {/* Accessible Title for Screen Readers */}
        <h2 id="competition-banner-title" className="sr-only">
          Pilih Kompetisi PRIDE Industri 2026
        </h2>

        {/* Side-by-Side Action Cards (Pure Vector SVG Badges) */}
        <div className="cwb-actions">
          {/* Lomba Video Card */}
          <Link
            href="/competition/video-lokal#registration-form"
            className="cwb-card cwb-card-video"
            onClick={closeBanner}
            aria-label="Daftar Lomba Video - Daftar Sekarang!"
          >
            <span className="sr-only">Daftar Lomba Video - Daftar Sekarang!</span>
            <svg className="cwb-badge-svg" viewBox="0 0 250 205" fill="none" aria-hidden="true">
              {/* Shield Drop Shadow */}
              <path d="M 32,32 C 90,22 160,22 218,32 C 228,70 228,105 214,138 C 190,175 142,195 125,198 C 108,195 60,175 36,138 C 22,105 22,70 32,32 Z" fill="#000" transform="translate(0, 6)" />
              {/* Shield Outer Black Border */}
              <path d="M 32,32 C 90,22 160,22 218,32 C 228,70 228,105 214,138 C 190,175 142,195 125,198 C 108,195 60,175 36,138 C 22,105 22,70 32,32 Z" fill="#16558E" stroke="#000" strokeWidth="12" strokeLinejoin="round" />
              {/* Shield Inner Yellow Border */}
              <path d="M 35,35 C 90,26 160,26 215,35 C 223,70 223,103 210,134 C 187,170 142,189 125,192 C 108,189 63,170 40,134 C 27,103 27,70 35,35 Z" fill="#16558E" stroke="#FFC700" strokeWidth="6" strokeLinejoin="round" />

              {/* Retro Film Camera (Top Left of Shield) */}
              <g transform="translate(15, 12) rotate(-8, 30, 25)">
                <rect x="10" y="16" width="32" height="24" rx="4" fill="#000" transform="translate(0, 3)" />
                <circle cx="18" cy="11" r="8" fill="#334155" stroke="#000" strokeWidth="3" />
                <circle cx="18" cy="11" r="3" fill="#94A3B8" stroke="#000" strokeWidth="1.5" />
                <circle cx="32" cy="11" r="8" fill="#334155" stroke="#000" strokeWidth="3" />
                <circle cx="32" cy="11" r="3" fill="#94A3B8" stroke="#000" strokeWidth="1.5" />
                <rect x="8" y="16" width="34" height="24" rx="4" fill="#475569" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
                <polygon points="42,22 54,16 54,40 42,34" fill="#1E293B" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
              </g>

              {/* Clapperboard 1 (Bottom Left, Black & White) */}
              <g transform="translate(12, 126) rotate(-16, 25, 25)">
                <rect x="0" y="12" width="38" height="26" rx="2" fill="#1E293B" stroke="#000" strokeWidth="3" />
                <line x1="6" y1="20" x2="32" y2="20" stroke="#64748B" strokeWidth="2" />
                <line x1="6" y1="28" x2="24" y2="28" stroke="#64748B" strokeWidth="2" />
                <rect x="0" y="2" width="38" height="10" rx="1" fill="#FFF" stroke="#000" strokeWidth="3" />
                <polygon points="5,2 11,2 6,12 0,12" fill="#000" />
                <polygon points="15,2 21,2 16,12 10,12" fill="#000" />
                <polygon points="25,2 31,2 26,12 20,12" fill="#000" />
                <polygon points="35,2 38,2 36,12 30,12" fill="#000" />
              </g>

              {/* Clapperboard 2 (Bottom Right, Green & Yellow) */}
              <g transform="translate(195, 126) rotate(16, 25, 25)">
                <rect x="0" y="12" width="36" height="24" rx="2" fill="#15803D" stroke="#000" strokeWidth="3" />
                <rect x="0" y="2" width="36" height="10" rx="1" fill="#FEF08A" stroke="#000" strokeWidth="3" />
                <polygon points="4,2 10,2 6,12 0,12" fill="#166534" />
                <polygon points="14,2 20,2 16,12 10,12" fill="#166534" />
                <polygon points="24,2 30,2 26,12 20,12" fill="#166534" />
              </g>

              {/* Typography inside Shield */}
              <g textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontWeight="900">
                <text x="125" y="78" fontSize="24" fill="#FFF" stroke="#000" strokeWidth="4" strokeLinejoin="round">DAFTAR</text>
                <text x="125" y="78" fontSize="24" fill="#FFF">DAFTAR</text>

                <text x="125" y="110" fontSize="30" fill="#FFC700" stroke="#000" strokeWidth="5" strokeLinejoin="round">LOMBA</text>
                <text x="125" y="110" fontSize="30" fill="#FFC700">LOMBA</text>

                <text x="125" y="142" fontSize="32" fill="#FFC700" stroke="#000" strokeWidth="5" strokeLinejoin="round">VIDEO</text>
                <text x="125" y="142" fontSize="32" fill="#FFC700">VIDEO</text>
              </g>

              {/* Button Banner */}
              <g transform="translate(50, 154)">
                <rect x="0" y="3" width="150" height="24" rx="3" fill="#000" />
                <rect x="0" y="0" width="150" height="24" rx="3" fill="#FFC700" stroke="#000" strokeWidth="3" />
                <text x="75" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="#000" letterSpacing="0.5">DAFTAR SEKARANG!</text>
              </g>
            </svg>
          </Link>

          {/* Lomba Desain Kemasan Card */}
          <Link
            href="/competition/desain-kemasan#registration-form"
            className="cwb-card cwb-card-kemasan"
            onClick={closeBanner}
            aria-label="Daftar Lomba Desain Kemasan - Daftar Sekarang!"
          >
            <span className="sr-only">Daftar Lomba Desain Kemasan - Daftar Sekarang!</span>
            <svg className="cwb-badge-svg" viewBox="0 0 250 205" fill="none" aria-hidden="true">
              {/* 16-point Starburst Shadow */}
              <path d="M 125.0,9.0 L 140.6,28.5 L 162.5,16.5 L 169.4,40.5 L 194.3,37.7 L 191.5,62.6 L 215.5,69.5 L 203.5,91.4 L 223.0,107.0 L 203.5,122.6 L 215.5,144.5 L 191.5,151.4 L 194.3,176.3 L 169.4,173.5 L 162.5,197.5 L 140.6,185.5 L 125.0,205.0 L 109.4,185.5 L 87.5,197.5 L 80.6,173.5 L 55.7,176.3 L 58.5,151.4 L 34.5,144.5 L 46.5,122.6 L 27.0,107.0 L 46.5,91.4 L 34.5,69.5 L 58.5,62.6 L 55.7,37.7 L 80.6,40.5 L 87.5,16.5 L 109.4,28.5 Z" fill="#000" transform="translate(0, 6)" />
              {/* Outer Black Border */}
              <path d="M 125.0,9.0 L 140.6,28.5 L 162.5,16.5 L 169.4,40.5 L 194.3,37.7 L 191.5,62.6 L 215.5,69.5 L 203.5,91.4 L 223.0,107.0 L 203.5,122.6 L 215.5,144.5 L 191.5,151.4 L 194.3,176.3 L 169.4,173.5 L 162.5,197.5 L 140.6,185.5 L 125.0,205.0 L 109.4,185.5 L 87.5,197.5 L 80.6,173.5 L 55.7,176.3 L 58.5,151.4 L 34.5,144.5 L 46.5,122.6 L 27.0,107.0 L 46.5,91.4 L 34.5,69.5 L 58.5,62.6 L 55.7,37.7 L 80.6,40.5 L 87.5,16.5 L 109.4,28.5 Z" fill="#156836" stroke="#000" strokeWidth="12" strokeLinejoin="round" />
              {/* Inner Orange Border */}
              <path d="M 125.0,9.0 L 140.6,28.5 L 162.5,16.5 L 169.4,40.5 L 194.3,37.7 L 191.5,62.6 L 215.5,69.5 L 203.5,91.4 L 223.0,107.0 L 203.5,122.6 L 215.5,144.5 L 191.5,151.4 L 194.3,176.3 L 169.4,173.5 L 162.5,197.5 L 140.6,185.5 L 125.0,205.0 L 109.4,185.5 L 87.5,197.5 L 80.6,173.5 L 55.7,176.3 L 58.5,151.4 L 34.5,144.5 L 46.5,122.6 L 27.0,107.0 L 46.5,91.4 L 34.5,69.5 L 58.5,62.6 L 55.7,37.7 L 80.6,40.5 L 87.5,16.5 L 109.4,28.5 Z" fill="#156836" stroke="#F37A1F" strokeWidth="5" strokeLinejoin="round" />

              {/* Sparkle Stars */}
              <path d="M 52,65 Q 52,70 47,70 Q 52,70 52,75 Q 52,70 57,70 Q 52,70 52,65 Z" fill="#FFC700" />
              <path d="M 200,90 Q 200,94 196,94 Q 200,94 200,98 Q 200,94 204,94 Q 200,94 200,90 Z" fill="#FFC700" />
              <path d="M 50,115 Q 50,118 47,118 Q 50,118 50,121 Q 50,118 53,118 Q 50,118 50,115 Z" fill="#FFC700" />

              {/* Open Delivery Box (Top Right) */}
              <g transform="translate(185, 24) rotate(14, 20, 20)">
                <polygon points="12,18 28,12 40,20 24,28" fill="#FBBF24" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="12,18 24,28 24,42 12,32" fill="#D97706" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="24,28 40,20 40,34 24,42" fill="#B45309" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="12,18 4,14 16,10 24,14" fill="#FBBF24" stroke="#000" strokeWidth="2" />
                <polygon points="28,12 36,6 46,12 38,18" fill="#FDE68A" stroke="#000" strokeWidth="2" />
              </g>

              {/* Stacked Cardboard Boxes (Bottom Left) */}
              <g transform="translate(18, 120)">
                <rect x="0" y="16" width="28" height="24" fill="#D97706" stroke="#000" strokeWidth="2.5" rx="2" />
                <line x1="14" y1="16" x2="14" y2="40" stroke="#B45309" strokeWidth="3" />
                <rect x="24" y="22" width="22" height="20" fill="#B45309" stroke="#000" strokeWidth="2.5" rx="2" />
                <rect x="8" y="0" width="24" height="18" fill="#F59E0B" stroke="#000" strokeWidth="2.5" rx="2" />
                <line x1="20" y1="0" x2="20" y2="18" stroke="#D97706" strokeWidth="3" />
              </g>

              {/* Blue Scissors (Bottom Right) */}
              <g transform="translate(196, 130) rotate(-24, 15, 20)">
                <circle cx="10" cy="35" r="6" fill="none" stroke="#2563EB" strokeWidth="3.5" />
                <circle cx="24" cy="35" r="6" fill="none" stroke="#2563EB" strokeWidth="3.5" />
                <polygon points="8,30 16,8 18,8 14,30" fill="#E2E8F0" stroke="#000" strokeWidth="2" />
                <polygon points="22,30 16,8 14,8 18,30" fill="#CBD5E1" stroke="#000" strokeWidth="2" />
                <circle cx="16" cy="22" r="2" fill="#000" />
              </g>

              {/* Typography inside Starburst */}
              <g textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontWeight="900">
                <text x="125" y="75" fontSize="20" fill="#FFF" stroke="#000" strokeWidth="4" strokeLinejoin="round">DAFTAR LOMBA</text>
                <text x="125" y="75" fontSize="20" fill="#FFF">DAFTAR LOMBA</text>

                <text x="125" y="106" fontSize="29" fill="#FFC700" stroke="#000" strokeWidth="5" strokeLinejoin="round">DESAIN</text>
                <text x="125" y="106" fontSize="29" fill="#FFC700">DESAIN</text>

                <text x="125" y="137" fontSize="29" fill="#FFC700" stroke="#000" strokeWidth="5" strokeLinejoin="round">KEMASAN</text>
                <text x="125" y="137" fontSize="29" fill="#FFC700">KEMASAN</text>
              </g>

              {/* Button Banner */}
              <g transform="translate(50, 150)">
                <rect x="0" y="3" width="150" height="24" rx="3" fill="#000" />
                <rect x="0" y="0" width="150" height="24" rx="3" fill="#F37A1F" stroke="#000" strokeWidth="3" />
                <text x="75" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="#000" letterSpacing="0.5">DAFTAR SEKARANG!</text>
              </g>
            </svg>
          </Link>
        </div>

        {/* Bottom Home Arrow Ribbon */}
        <div className="cwb-home-container">
          <a
            href="#competitions"
            className="cwb-home-ribbon"
            onClick={closeBanner}
            aria-label="Kembali ke page utama"
          >
            <span className="sr-only">Kembali ke page utama</span>
            <svg className="cwb-home-svg" viewBox="0 0 240 48" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="cwbHomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFC700" />
                  <stop offset="100%" stopColor="#F37A1F" />
                </linearGradient>
              </defs>
              {/* Shadow */}
              <polygon points="12,8 198,8 226,24 198,40 12,40" fill="#000" transform="translate(0, 4)" />
              {/* Arrow Body */}
              <polygon points="12,8 198,8 226,24 198,40 12,40" fill="url(#cwbHomeGrad)" stroke="#000" strokeWidth="4" strokeLinejoin="round" />

              {/* Cursor Icon (Left) */}
              <g transform="translate(24, 14)">
                <polygon points="0,0 0,16 5,12 9,19 12,17 8,11 14,11" fill="#FFC700" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
              </g>

              {/* Center Text */}
              <text x="116" y="28" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="12" fontWeight="900" fill="#000" letterSpacing="0.8">KEMBALI KE PAGE UTAMA</text>

              {/* House Icon (Right) */}
              <g transform="translate(184, 16)">
                <polygon points="8,0 0,7 3,7 3,15 13,15 13,7 16,7" fill="#000" />
                <rect x="6" y="9" width="4" height="6" fill="#FFC700" />
              </g>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
