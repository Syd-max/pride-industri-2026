'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ─── PURE SVG ILLUSTRATED VECTOR ORNAMENTS ─────────────────────────────────
   100% coded in SVG vector paths — Zero image slices, zero clipping artifacts.
   Balanced, clean, bright, and legible framing elements.
─────────────────────────────────────────────────────────────────────────────── */

function SewingMachineIcon() {
  return (
    <svg viewBox="0 0 100 90" fill="none" aria-hidden="true">
      <g transform="rotate(-6, 50, 45)">
        {/* Shadow */}
        <path d="M 10,74 L 90,74 L 85,84 L 15,84 Z" fill="#000" opacity="0.4" />
        {/* Base */}
        <path d="M 12,66 L 88,66 L 85,76 L 15,76 Z" fill="#E5A110" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
        {/* Machine Body */}
        <path d="M 66,66 V 26 C 66,16 45,16 26,26 V 46 H 42 V 34 H 54 V 66 Z" fill="#FFC700" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
        {/* Needle */}
        <line x1="26" y1="46" x2="26" y2="64" stroke="#000" strokeWidth="3" />
        {/* Hand Wheel */}
        <ellipse cx="76" cy="35" rx="6" ry="12" fill="#E5A110" stroke="#000" strokeWidth="3" />
        {/* Thread Spool */}
        <rect x="48" y="11" width="10" height="9" fill="#FFFFFF" stroke="#000" strokeWidth="2.5" rx="1" />
        <line x1="53" y1="9" x2="53" y2="21" stroke="#000" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function ChefHatIcon() {
  return (
    <svg viewBox="0 0 100 90" fill="none" aria-hidden="true">
      <g transform="rotate(6, 50, 45)">
        {/* Shadow */}
        <path d="M 20,58 C 8,53 10,27 28,27 C 32,11 60,11 65,29 C 82,23 90,47 76,58 Z" fill="#000" opacity="0.4" />
        {/* Hat Puffs */}
        <path d="M 20,55 C 8,50 10,24 28,24 C 32,8 60,8 65,26 C 82,20 90,44 76,55 Z" fill="#FFC700" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
        {/* Folds */}
        <path d="M 33,26 C 36,40 38,52 38,55 M 50,22 C 50,38 50,48 50,55 M 63,28 C 61,40 59,50 59,55" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        {/* Band */}
        <path d="M 24,55 H 74 V 68 H 24 Z" fill="#F59E0B" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function BatagorIcon() {
  return (
    <svg viewBox="0 0 110 80" fill="none" aria-hidden="true">
      <g transform="rotate(2, 55, 40)">
        {/* Drop shadow */}
        <ellipse cx="55" cy="54" rx="46" ry="18" fill="#000" opacity="0.4" />
        {/* Ceramic Plate */}
        <ellipse cx="55" cy="46" rx="45" ry="20" fill="#F8FAFC" stroke="#000" strokeWidth="3.5" />
        <ellipse cx="55" cy="46" rx="36" ry="14" fill="#E2E8F0" />
        {/* Peanut Sauce */}
        <ellipse cx="55" cy="45" rx="26" ry="10" fill="#92400E" stroke="#000" strokeWidth="1.5" />
        {/* Crispy Fried Wonton / Batagor Triangles */}
        <polygon points="26,42 42,22 48,44" fill="#F59E0B" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="40,40 60,18 68,44" fill="#FBBF24" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="58,43 76,23 84,44" fill="#F59E0B" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Kecap drizzle */}
        <path d="M 38,42 Q 52,38 66,42 Q 74,40 78,44" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        {/* Fresh Limau Slice */}
        <circle cx="32" cy="47" r="7" fill="#84CC16" stroke="#000" strokeWidth="2" />
        <circle cx="32" cy="47" r="4" fill="#ECFCCB" stroke="#000" strokeWidth="1.5" />
        {/* Pill Label: BATAGOR */}
        <rect x="24" y="55" width="62" height="18" rx="9" fill="#0F172A" stroke="#FFC700" strokeWidth="2" />
        <text x="55" y="68" textAnchor="middle" fill="#FFC700" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="11" fontWeight="900" letterSpacing="1">
          BATAGOR
        </text>
      </g>
    </svg>
  );
}

function ShoeIcon() {
  return (
    <svg viewBox="0 0 120 70" fill="none" aria-hidden="true">
      <g transform="rotate(-4, 60, 35)">
        {/* Drop shadow */}
        <ellipse cx="60" cy="58" rx="46" ry="8" fill="#000" opacity="0.4" />
        {/* Thick White Rubber Outsole */}
        <path
          d="M 12,48 C 16,48 40,49 65,49 C 90,49 106,47 110,42 C 110,48 102,54 84,55 C 60,56 22,56 12,53 Z"
          fill="#FFFFFF"
          stroke="#000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Sole Tread Line */}
        <path d="M 16,51 L 104,50" stroke="#000" strokeWidth="2" />
        {/* Upper Body (Bright Cibaduyut Red / Orange) */}
        <path
          d="M 12,48 C 14,35 26,24 44,20 C 54,18 64,24 72,28 C 84,32 98,35 108,42 C 105,48 85,49 65,49 C 40,49 16,48 12,48 Z"
          fill="#EA580C"
          stroke="#000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* White Toe Cap */}
        <path
          d="M 90,34 C 98,35 106,39 108,42 C 103,45 94,46 88,45 C 86,40 88,36 90,34 Z"
          fill="#FFFFFF"
          stroke="#000"
          strokeWidth="2.5"
        />
        {/* White Classic Wave Stripe */}
        <path d="M 34,25 C 46,33 66,39 88,41" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        {/* White Shoelaces */}
        <line x1="50" y1="23" x2="56" y2="28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="26" x2="64" y2="31" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="66" y1="29" x2="72" y2="34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pill Label: SEPATU */}
        <rect x="30" y="53" width="56" height="15" rx="7.5" fill="#0F172A" stroke="#FFC700" strokeWidth="1.5" />
        <text x="58" y="64" textAnchor="middle" fill="#FFC700" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="9" fontWeight="900" letterSpacing="0.8">
          SEPATU
        </text>
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
        {/* Close button with clean outline */}
        <button
          type="button"
          className="cwb-close"
          onClick={closeBanner}
          aria-label="Tutup banner kompetisi"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        {/* 4 Corner Framing Ornaments */}
        <div className="cwb-ornament cwb-ornament-sewing"><SewingMachineIcon /></div>
        <div className="cwb-ornament cwb-ornament-chef"><ChefHatIcon /></div>
        <div className="cwb-ornament cwb-ornament-batagor"><BatagorIcon /></div>
        <div className="cwb-ornament cwb-ornament-shoe"><ShoeIcon /></div>

        {/* Accessible Title for Screen Readers */}
        <h2 id="competition-banner-title" className="sr-only">
          Pilih Kompetisi PRIDE Industri 2026: Lomba Video 1 Menit atau Desain Kemasan
        </h2>

        {/* Side-by-Side Action Cards (Pure Vector SVG Badges) */}
        <div className="cwb-actions">
          {/* Lomba Video 1 Menit Card (Gambar 2) */}
          <Link
            href="/competition/video-lokal#registration-form"
            className="cwb-card cwb-card-video"
            onClick={closeBanner}
            aria-label="Daftar Lomba Video 1 Menit - Daftar Sekarang!"
          >
            <span className="sr-only">Daftar Lomba Video 1 Menit - Daftar Sekarang!</span>
            <svg className="cwb-badge-svg" viewBox="0 0 250 205" fill="none" aria-hidden="true">
              {/* Shield Drop Shadow */}
              <path
                d="M 32,32 C 90,22 160,22 218,32 C 228,70 228,105 214,138 C 190,175 142,195 125,198 C 108,195 60,175 36,138 C 22,105 22,70 32,32 Z"
                fill="#000"
                transform="translate(0, 5)"
              />
              {/* Shield Outer Black Border */}
              <path
                d="M 32,32 C 90,22 160,22 218,32 C 228,70 228,105 214,138 C 190,175 142,195 125,198 C 108,195 60,175 36,138 C 22,105 22,70 32,32 Z"
                fill="#16558E"
                stroke="#000"
                strokeWidth="10"
                strokeLinejoin="round"
              />
              {/* Shield Inner Yellow Border */}
              <path
                d="M 36,36 C 90,27 160,27 214,36 C 222,70 222,103 209,134 C 186,170 142,189 125,192 C 108,189 64,170 41,134 C 28,103 28,70 36,36 Z"
                fill="#16558E"
                stroke="#FFD000"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Retro Film Camera (Top Left of Shield) */}
              <g transform="translate(14, 14) rotate(-6, 25, 20)">
                <rect x="8" y="16" width="34" height="24" rx="4" fill="#000" transform="translate(0, 3)" />
                <circle cx="16" cy="10" r="8" fill="#475569" stroke="#000" strokeWidth="2.5" />
                <circle cx="16" cy="10" r="3" fill="#94A3B8" />
                <circle cx="32" cy="10" r="8" fill="#475569" stroke="#000" strokeWidth="2.5" />
                <circle cx="32" cy="10" r="3" fill="#94A3B8" />
                <rect x="6" y="15" width="36" height="24" rx="4" fill="#334155" stroke="#000" strokeWidth="2.5" />
                <rect x="10" y="19" width="14" height="10" rx="2" fill="#64748B" />
                <polygon points="42,21 52,16 52,38 42,33" fill="#1E293B" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
                <ellipse cx="52" cy="27" rx="2" ry="8" fill="#38BDF8" stroke="#000" strokeWidth="1.5" />
              </g>

              {/* Clapperboard (Bottom Left, Chevron) */}
              <g transform="translate(14, 124) rotate(-14, 20, 20)">
                <rect x="0" y="12" width="38" height="26" rx="2" fill="#1E293B" stroke="#000" strokeWidth="3" />
                <line x1="6" y1="20" x2="32" y2="20" stroke="#64748B" strokeWidth="2" />
                <line x1="6" y1="28" x2="24" y2="28" stroke="#64748B" strokeWidth="2" />
                <rect x="0" y="2" width="38" height="10" rx="1" fill="#FFF" stroke="#000" strokeWidth="3" />
                <polygon points="5,2 11,2 6,12 0,12" fill="#000" />
                <polygon points="15,2 21,2 16,12 10,12" fill="#000" />
                <polygon points="25,2 31,2 26,12 20,12" fill="#000" />
                <polygon points="35,2 38,2 36,12 30,12" fill="#000" />
              </g>

              {/* Typography: Video 1 Menit (Ultra Crisp & Legible) */}
              <g textAnchor="middle" fontFamily="Impact, 'Arial Black', -apple-system, sans-serif" fontWeight="900" letterSpacing="1">
                <text
                  x="125"
                  y="86"
                  fontSize="35"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="5.5"
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke fill', filter: 'drop-shadow(0 3px 0 #000)' }}
                >
                  VIDEO
                </text>
                <text
                  x="125"
                  y="124"
                  fontSize="31"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="5.5"
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke fill', filter: 'drop-shadow(0 3px 0 #000)' }}
                >
                  1 MENIT
                </text>
              </g>

              {/* Button Banner: DAFTAR SEKARANG! */}
              <g transform="translate(45, 146)">
                <rect x="0" y="3" width="160" height="28" rx="4" fill="#000" />
                <rect x="0" y="0" width="160" height="28" rx="4" fill="#FFD000" stroke="#000" strokeWidth="2.5" />
                <text x="80" y="19" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="12" fontWeight="900" fill="#000" letterSpacing="0.8">
                  DAFTAR SEKARANG!
                </text>
              </g>
            </svg>
          </Link>

          {/* Lomba Desain Kemasan Card (Gambar 3) */}
          <Link
            href="/competition/desain-kemasan#registration-form"
            className="cwb-card cwb-card-kemasan"
            onClick={closeBanner}
            aria-label="Daftar Lomba Desain Kemasan - Daftar Sekarang!"
          >
            <span className="sr-only">Daftar Lomba Desain Kemasan - Daftar Sekarang!</span>
            <svg className="cwb-badge-svg" viewBox="0 0 250 205" fill="none" aria-hidden="true">
              {/* 16-point Symmetrical Starburst Shadow */}
              <path
                d="M 125.0,9.0 L 140.6,26.5 L 161.7,16.3 L 169.4,38.5 L 192.9,37.1 L 191.5,60.6 L 213.7,68.3 L 203.5,89.4 L 221.0,105.0 L 203.5,120.6 L 213.7,141.7 L 191.5,149.4 L 192.9,172.9 L 169.4,171.5 L 161.7,193.7 L 140.6,183.5 L 125.0,201.0 L 109.4,183.5 L 88.3,193.7 L 80.6,171.5 L 57.1,172.9 L 58.5,149.4 L 36.3,141.7 L 46.5,120.6 L 29.0,105.0 L 46.5,89.4 L 36.3,68.3 L 58.5,60.6 L 57.1,37.1 L 80.6,38.5 L 88.3,16.3 L 109.4,26.5 Z"
                fill="#000"
                transform="translate(0, 5)"
              />
              {/* Outer Black Border */}
              <path
                d="M 125.0,9.0 L 140.6,26.5 L 161.7,16.3 L 169.4,38.5 L 192.9,37.1 L 191.5,60.6 L 213.7,68.3 L 203.5,89.4 L 221.0,105.0 L 203.5,120.6 L 213.7,141.7 L 191.5,149.4 L 192.9,172.9 L 169.4,171.5 L 161.7,193.7 L 140.6,183.5 L 125.0,201.0 L 109.4,183.5 L 88.3,193.7 L 80.6,171.5 L 57.1,172.9 L 58.5,149.4 L 36.3,141.7 L 46.5,120.6 L 29.0,105.0 L 46.5,89.4 L 36.3,68.3 L 58.5,60.6 L 57.1,37.1 L 80.6,38.5 L 88.3,16.3 L 109.4,26.5 Z"
                fill="#156836"
                stroke="#000"
                strokeWidth="10"
                strokeLinejoin="round"
              />
              {/* Inner Orange Border */}
              <path
                d="M 125.0,9.0 L 140.6,26.5 L 161.7,16.3 L 169.4,38.5 L 192.9,37.1 L 191.5,60.6 L 213.7,68.3 L 203.5,89.4 L 221.0,105.0 L 203.5,120.6 L 213.7,141.7 L 191.5,149.4 L 192.9,172.9 L 169.4,171.5 L 161.7,193.7 L 140.6,183.5 L 125.0,201.0 L 109.4,183.5 L 88.3,193.7 L 80.6,171.5 L 57.1,172.9 L 58.5,149.4 L 36.3,141.7 L 46.5,120.6 L 29.0,105.0 L 46.5,89.4 L 36.3,68.3 L 58.5,60.6 L 57.1,37.1 L 80.6,38.5 L 88.3,16.3 L 109.4,26.5 Z"
                fill="#156836"
                stroke="#F97316"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Sparkle Stars */}
              <path d="M 52,65 Q 52,70 47,70 Q 52,70 52,75 Q 52,70 57,70 Q 52,70 52,65 Z" fill="#FFD000" />
              <path d="M 198,88 Q 198,92 194,92 Q 198,92 198,96 Q 198,92 202,92 Q 198,92 198,88 Z" fill="#FFD000" />

              {/* Open Delivery Box (Top Right) */}
              <g transform="translate(186, 20) rotate(14, 20, 20)">
                <polygon points="12,18 28,12 40,20 24,28" fill="#FBBF24" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="12,18 24,28 24,42 12,32" fill="#D97706" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="24,28 40,20 40,34 24,42" fill="#B45309" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="12,18 4,14 16,10 24,14" fill="#FBBF24" stroke="#000" strokeWidth="2" />
                <polygon points="28,12 36,6 46,12 38,18" fill="#FDE68A" stroke="#000" strokeWidth="2" />
              </g>

              {/* Gift Box (Bottom Left Outer Corner) */}
              <g transform="translate(20, 122)">
                <rect x="0" y="8" width="26" height="22" fill="#F59E0B" stroke="#000" strokeWidth="2.5" rx="2" />
                <line x1="13" y1="8" x2="13" y2="30" stroke="#B45309" strokeWidth="3" />
                <rect x="6" y="0" width="14" height="8" fill="#EF4444" stroke="#000" strokeWidth="2" rx="1" />
              </g>

              {/* Blue Scissors (Bottom Right) */}
              <g transform="translate(188, 126) rotate(-22, 15, 15)">
                <circle cx="10" cy="35" r="6" fill="none" stroke="#2563EB" strokeWidth="3.5" />
                <circle cx="24" cy="35" r="6" fill="none" stroke="#2563EB" strokeWidth="3.5" />
                <polygon points="8,30 16,8 18,8 14,30" fill="#E2E8F0" stroke="#000" strokeWidth="2" />
                <polygon points="22,30 16,8 14,8 18,30" fill="#CBD5E1" stroke="#000" strokeWidth="2" />
                <circle cx="16" cy="22" r="2" fill="#000" />
              </g>

              {/* Typography: Desain Kemasan (Ultra Crisp & Legible) */}
              <g textAnchor="middle" fontFamily="Impact, 'Arial Black', -apple-system, sans-serif" fontWeight="900" letterSpacing="1">
                <text
                  x="125"
                  y="86"
                  fontSize="35"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="5.5"
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke fill', filter: 'drop-shadow(0 3px 0 #000)' }}
                >
                  DESAIN
                </text>
                <text
                  x="125"
                  y="124"
                  fontSize="31"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="5.5"
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke fill', filter: 'drop-shadow(0 3px 0 #000)' }}
                >
                  KEMASAN
                </text>
              </g>

              {/* Button Banner: DAFTAR SEKARANG! */}
              <g transform="translate(45, 146)">
                <rect x="0" y="3" width="160" height="28" rx="4" fill="#000" />
                <rect x="0" y="0" width="160" height="28" rx="4" fill="#F97316" stroke="#000" strokeWidth="2.5" />
                <text x="80" y="19" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="12" fontWeight="900" fill="#000" letterSpacing="0.8">
                  DAFTAR SEKARANG!
                </text>
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
                  <stop offset="0%" stopColor="#FFD000" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
              {/* Shadow */}
              <polygon points="12,8 198,8 226,24 198,40 12,40" fill="#000" transform="translate(0, 4)" />
              {/* Arrow Body */}
              <polygon points="12,8 198,8 226,24 198,40 12,40" fill="url(#cwbHomeGrad)" stroke="#000" strokeWidth="4" strokeLinejoin="round" />

              {/* Cursor Icon (Left) */}
              <g transform="translate(24, 14)">
                <polygon points="0,0 0,16 5,12 9,19 12,17 8,11 14,11" fill="#FFD000" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
              </g>

              {/* Center Text */}
              <text x="116" y="28" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="12" fontWeight="900" fill="#000" letterSpacing="0.8">
                KEMBALI KE PAGE UTAMA
              </text>

              {/* House Icon (Right) */}
              <g transform="translate(184, 16)">
                <polygon points="8,0 0,7 3,7 3,15 13,15 13,7 16,7" fill="#000" />
                <rect x="6" y="9" width="4" height="6" fill="#FFD000" />
              </g>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
