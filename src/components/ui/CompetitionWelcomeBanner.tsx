'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function VideoIcon() {
  return (
    <svg viewBox="0 0 88 90" aria-hidden="true">
      <circle cx="26" cy="18" r="12" />
      <circle cx="55" cy="18" r="12" />
      <rect x="13" y="30" width="55" height="39" rx="7" />
      <path d="m68 39 17-9v39L68 60Z" />
      <path d="M26 79h34M43 69v10" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 88 90" aria-hidden="true">
      <path d="m12 27 32-17 32 17-32 17Z" />
      <path d="M12 27v37l32 17 32-17V27M44 44v37" />
      <path d="m28 18 32 17" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 11 9-8 9 8v10h-6v-7H9v7H3Z" />
    </svg>
  );
}

function OrnamentIcon({ type }: { type: 'sewing' | 'chef' | 'food' | 'shoe' }) {
  const paths = {
    sewing: <><path d="M10 54h60v18H10zM21 54V21h35l8 16H42v17M27 29h25M15 72v8M65 72v8" /><circle cx="58" cy="45" r="5" /></>,
    chef: <><path d="M22 45C6 39 10 17 28 19 34 3 58 6 60 23c18-4 26 19 8 25v25H22Z" /><path d="M23 57h45M32 58v15M58 58v15" /></>,
    food: <><path d="M13 44h62c-2 22-14 33-31 33S15 66 13 44Z" /><path d="M20 44c4-17 44-17 49 0M27 32l5-14M43 30V13M58 33l7-13" /></>,
    shoe: <><path d="M9 58c14-1 22-9 29-25l13 9c7 5 15 7 27 9v18H15c-7 0-10-7-6-11Z" /><path d="M39 40l8 6M33 48l8 6M18 69h60" /></>,
  };

  return <svg viewBox="0 0 88 88" aria-hidden="true">{paths[type]}</svg>;
}

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

        <span className="cwb-ornament cwb-sewing"><OrnamentIcon type="sewing" /></span>
        <span className="cwb-ornament cwb-chef"><OrnamentIcon type="chef" /></span>
        <span className="cwb-ornament cwb-batagor"><OrnamentIcon type="food" /></span>
        <span className="cwb-ornament cwb-shoe"><OrnamentIcon type="shoe" /></span>

        <h2 id="competition-banner-title">
          Ikuti &amp; daftar
          <span>lombanya sekarang!</span>
        </h2>

        <div className="cwb-actions">
          <Link
            href="/competition/video-lokal#registration-form"
            className="cwb-entry cwb-entry-video"
            onClick={closeBanner}
          >
            <span className="cwb-entry-icon"><VideoIcon /></span>
            <span className="cwb-entry-copy">Daftar <strong>Lomba Video</strong></span>
            <span className="cwb-entry-button">Daftar sekarang!</span>
          </Link>

          <Link
            href="/competition/desain-kemasan#registration-form"
            className="cwb-entry cwb-entry-package"
            onClick={closeBanner}
          >
            <span className="cwb-entry-icon"><PackageIcon /></span>
            <span className="cwb-entry-copy">Daftar Lomba <strong>Desain Kemasan</strong></span>
            <span className="cwb-entry-button">Daftar sekarang!</span>
          </Link>
        </div>

        <a href="#competitions" className="cwb-home" onClick={closeBanner}>
          <span>Kembali ke<br />page utama</span>
          <HomeIcon />
        </a>
      </section>
    </div>
  );
}
