'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ─── PURE SVG ILLUSTRATED VECTOR ORNAMENTS ─────────────────────────────────
   100% coded in SVG vector paths — Zero image slices, zero clipping artifacts.
   Ultra-crisp HD vector rendering with pure geometric precision.
─────────────────────────────────────────────────────────────────────────────── */

function SewingMachineIcon() {
  return (
    <svg viewBox="0 0 100 85" fill="none" aria-hidden="true">
      <g transform="rotate(-4, 50, 42)">
        {/* Vector Shadow Plate */}
        <path d="M 8,72 L 92,72 L 88,80 L 12,80 Z" fill="#000" opacity="0.4" />
        {/* Base Plate */}
        <path d="M 10,64 L 90,64 C 91,64 92,65 91,67 L 88,74 C 87,76 86,76 84,76 L 16,76 C 14,76 13,76 12,74 L 9,67 C 8,65 9,64 10,64 Z" fill="#E5A110" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        {/* Silver Needle Plate */}
        <rect x="22" y="64" width="20" height="3" fill="#E2E8F0" stroke="#000" strokeWidth="1.5" />
        {/* Machine Body C-Frame */}
        <path d="M 64,64 V 30 C 64,24 60,20 54,20 H 30 C 24,20 20,24 20,30 V 42 C 20,44 22,46 24,46 H 32 C 34,46 36,44 36,42 V 34 C 36,32 38,30 40,30 H 52 C 54,30 56,32 56,34 V 64 Z" fill="#FFC700" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        {/* Needle Bar & Needle */}
        <rect x="26" y="44" width="3" height="15" fill="#CBD5E1" stroke="#000" strokeWidth="1.5" />
        <line x1="27.5" y1="59" x2="27.5" y2="64" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        {/* Presser Foot */}
        <path d="M 24,61 H 31 V 63 H 24 Z" fill="#94A3B8" stroke="#000" strokeWidth="1.5" />
        {/* Handwheel on right */}
        <path d="M 64,32 C 68,32 72,34 72,40 V 52 C 72,58 68,60 64,60 Z" fill="#E5A110" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="68" cy="46" rx="2.5" ry="8" fill="#F59E0B" stroke="#000" strokeWidth="1.5" />
        {/* Spool Pin & Thread Spool */}
        <line x1="48" y1="20" x2="48" y2="10" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="43" y="11" width="10" height="9" rx="1.5" fill="#38BDF8" stroke="#000" strokeWidth="2" />
        <line x1="43" y1="15.5" x2="53" y2="15.5" stroke="#FFF" strokeWidth="1.5" />
        {/* Tension Dial */}
        <circle cx="36" cy="28" r="3.5" fill="#E2E8F0" stroke="#000" strokeWidth="2" />
      </g>
    </svg>
  );
}

function ChefHatIcon() {
  return (
    <svg viewBox="0 0 100 90" fill="none" aria-hidden="true">
      <g transform="rotate(6, 50, 45)">
        {/* Vector Shadow Plate */}
        <path d="M 20,58 C 8,53 10,27 28,27 C 32,11 60,11 65,29 C 82,23 90,47 76,58 Z" fill="#000" />
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

        {/* Top Framing Ornaments */}
        <div className="cwb-ornament cwb-ornament-sewing"><SewingMachineIcon /></div>
        <div className="cwb-ornament cwb-ornament-chef"><ChefHatIcon /></div>

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
              <g transform="translate(12, 20) rotate(-6, 25, 20)">
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

              {/* Video 1 Menit Typography (Clean Poppins 900 — Open, Legible, Not Mepet, NO Black Shadow) */}
              <g
                textAnchor="middle"
                fontFamily="var(--font-poppins), 'Poppins', var(--font-plus-jakarta), system-ui, sans-serif"
                fontWeight="900"
              >
                <text
                  x="125"
                  y="87"
                  fontSize="33"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                  letterSpacing="1"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  VIDEO
                </text>
                <text
                  x="125"
                  y="125"
                  fontSize="27"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                  letterSpacing="0.8"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  1 MENIT
                </text>
              </g>

              {/* Button Banner: DAFTAR SEKARANG! */}
              <g transform="translate(45, 146)">
                <rect x="0" y="3" width="160" height="28" rx="4" fill="#000" />
                <rect x="0" y="0" width="160" height="28" rx="4" fill="#FFD000" stroke="#000" strokeWidth="2.5" />
                <text
                  x="80"
                  y="19"
                  textAnchor="middle"
                  fontFamily="var(--font-poppins), 'Poppins', system-ui, sans-serif"
                  fontSize="11.5"
                  fontWeight="900"
                  fill="#000"
                  letterSpacing="0.5"
                >
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

              {/* 3D Open Shipping Parcel Box (Top Right) */}
              <g transform="translate(182, 14) rotate(10, 25, 25)">
                {/* Inside Dark Cavity */}
                <polygon points="12,18 24,12 36,18 24,24" fill="#451A03" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Back-Left Flap */}
                <polygon points="12,18 24,12 21,5 9,10" fill="#D97706" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Back-Right Flap */}
                <polygon points="24,12 36,18 39,10 27,5" fill="#B45309" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Front-Left Face */}
                <polygon points="12,18 24,24 24,38 12,32" fill="#F59E0B" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Front-Right Face */}
                <polygon points="24,24 36,18 36,32 24,38" fill="#D97706" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Front-Left Flap */}
                <polygon points="12,18 24,24 21,30 9,23" fill="#FBBF24" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Front-Right Flap */}
                <polygon points="24,24 36,18 39,23 27,30" fill="#F59E0B" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Barcode Shipping Label */}
                <polygon points="14.5,23 19,25 19,30 14.5,27.5" fill="#FFF" stroke="#000" strokeWidth="0.8" />
                <line x1="16" y1="24.5" x2="16" y2="28" stroke="#000" strokeWidth="0.7" />
                <line x1="17.5" y1="25.5" x2="17.5" y2="29" stroke="#000" strokeWidth="0.9" />
              </g>

              {/* 3D Gift Packaging Box with Bow (Bottom Left) */}
              <g transform="translate(18, 118) rotate(-4, 18, 18)">
                {/* Left Face */}
                <polygon points="5,15 18,21 18,33 5,26" fill="#F59E0B" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
                {/* Right Face */}
                <polygon points="18,21 32,15 32,26 18,33" fill="#D97706" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
                {/* Top Face */}
                <polygon points="18,9 32,15 18,21 5,15" fill="#FBBF24" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
                {/* Red Ribbon Bands */}
                <polygon points="10.5,17.5 13,18.5 13,29.5 10.5,28.5" fill="#DC2626" />
                <polygon points="23.5,18.5 26,17.5 26,28.5 23.5,29.5" fill="#B91C1C" />
                <polygon points="10.5,11.5 13,12.5 26,17.5 23.5,16.5" fill="#EF4444" />
                <polygon points="23.5,11.5 26,12.5 13,17.5 10.5,16.5" fill="#EF4444" />
                {/* Ribbon Bow on Top */}
                <path d="M 18,9 C 14,5 12,8 17,10 Z" fill="#EF4444" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M 18,9 C 22,5 24,8 19,10 Z" fill="#EF4444" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
                <circle cx="18" cy="9" r="2" fill="#DC2626" stroke="#000" strokeWidth="1.2" />
              </g>

              {/* Refined Craft Scissors (Bottom Right) */}
              <g transform="translate(186, 122) rotate(-18, 20, 20)">
                {/* Upper Blade */}
                <path d="M 16,19 L 36,8 C 34,13 28,18 20,22 Z" fill="#E2E8F0" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Lower Blade */}
                <path d="M 16,21 L 36,30 C 33,26 26,22 20,19 Z" fill="#CBD5E1" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
                {/* Pivot Screw */}
                <circle cx="18" cy="20.5" r="2" fill="#475569" stroke="#000" strokeWidth="1.2" />
                <circle cx="18" cy="20.5" r="0.7" fill="#FFF" />
                {/* Upper Handle Ring */}
                <path d="M 16,18 C 12,16 6,12 4,17 C 2,22 8,24 14,21 Z" fill="#2563EB" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
                <ellipse cx="8.5" cy="18.5" rx="3" ry="2.5" fill="none" stroke="#000" strokeWidth="1.5" />
                {/* Lower Handle Ring */}
                <path d="M 15,22 C 12,24 6,27 5,32 C 4,37 10,38 14,31 Z" fill="#2563EB" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
                <ellipse cx="9" cy="31.5" rx="3" ry="3" fill="none" stroke="#000" strokeWidth="1.5" />
              </g>

              {/* Desain Kemasan Typography (Clean Poppins 900 — Open, Legible, Not Mepet, NO Black Shadow) */}
              <g
                textAnchor="middle"
                fontFamily="var(--font-poppins), 'Poppins', var(--font-plus-jakarta), system-ui, sans-serif"
                fontWeight="900"
              >
                <text
                  x="125"
                  y="87"
                  fontSize="31"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                  letterSpacing="1"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  DESAIN
                </text>
                <text
                  x="125"
                  y="125"
                  fontSize="27"
                  fill="#FFD000"
                  stroke="#000"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                  letterSpacing="0.8"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  KEMASAN
                </text>
              </g>

              {/* Button Banner: DAFTAR SEKARANG! */}
              <g transform="translate(45, 146)">
                <rect x="0" y="3" width="160" height="28" rx="4" fill="#000" />
                <rect x="0" y="0" width="160" height="28" rx="4" fill="#F97316" stroke="#000" strokeWidth="2.5" />
                <text
                  x="80"
                  y="19"
                  textAnchor="middle"
                  fontFamily="var(--font-poppins), 'Poppins', system-ui, sans-serif"
                  fontSize="11.5"
                  fontWeight="900"
                  fill="#000"
                  letterSpacing="0.5"
                >
                  DAFTAR SEKARANG!
                </text>
              </g>
            </svg>
          </Link>
        </div>

        {/* Bottom Home Arrow Ribbon: Clean, Taller & Proportional "Page Utama" */}
        <div className="cwb-home-container">
          <Link
            href="/"
            className="cwb-home-ribbon"
            onClick={closeBanner}
            aria-label="Page Utama"
          >
            <span className="sr-only">Page Utama</span>
            <svg className="cwb-home-svg" viewBox="0 0 210 52" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="cwbHomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFD500" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
              {/* Drop Shadow */}
              <polygon points="10,4 176,4 202,25 176,46 10,46" fill="#000" transform="translate(0, 3)" />
              {/* Arrow Ribbon Base (Taller shape, crisp border) */}
              <polygon points="10,4 176,4 202,25 176,46 10,46" fill="url(#cwbHomeGrad)" stroke="#000" strokeWidth="3.2" strokeLinejoin="round" />

              {/* Center Text: "Page Utama" (Bold Poppins 800, Tall & Clear, Not Bantet) */}
              <text
                x="98"
                y="25"
                dominantBaseline="central"
                textAnchor="middle"
                fontFamily="var(--font-poppins), 'Poppins', system-ui, sans-serif"
                fontSize="16.5"
                fontWeight="800"
                fill="#000000"
                letterSpacing="0.8"
              >
                Page Utama
              </text>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
