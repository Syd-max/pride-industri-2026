'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
        {/* Close button with high-contrast circular outline */}
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

        {/* 4 Corner Ornaments from Reference Artwork */}
        <div className="cwb-ornament cwb-ornament-sewing" aria-hidden="true">
          <Image
            src="/cwb/ornament-sewing.webp"
            alt=""
            width={118}
            height={122}
            priority
            className="cwb-ornament-img"
          />
        </div>

        <div className="cwb-ornament cwb-ornament-chef" aria-hidden="true">
          <Image
            src="/cwb/ornament-chef.webp"
            alt=""
            width={118}
            height={110}
            priority
            className="cwb-ornament-img"
          />
        </div>

        <div className="cwb-ornament cwb-ornament-batagor" aria-hidden="true">
          <Image
            src="/cwb/ornament-batagor.webp"
            alt=""
            width={91}
            height={62}
            priority
            className="cwb-ornament-img"
          />
        </div>

        <div className="cwb-ornament cwb-ornament-shoe" aria-hidden="true">
          <Image
            src="/cwb/ornament-shoe.webp"
            alt=""
            width={123}
            height={71}
            priority
            className="cwb-ornament-img"
          />
        </div>

        {/* Header Title */}
        <div className="cwb-title-wrap">
          <h2 id="competition-banner-title" className="sr-only">
            Ikuti &amp; Daftar Lombanya Sekarang!
          </h2>
          <Image
            src="/cwb/banner-title.webp"
            alt="Ikuti &amp; Daftar Lombanya Sekarang!"
            width={347}
            height={90}
            priority
            className="cwb-title-img"
          />
        </div>

        {/* Side-by-Side Competition Action Badges */}
        <div className="cwb-actions">
          {/* Lomba Video Card */}
          <Link
            href="/competition/video-lokal#registration-form"
            className="cwb-card cwb-card-video"
            onClick={closeBanner}
            aria-label="Daftar Lomba Video - Daftar Sekarang!"
          >
            <span className="sr-only">Daftar Lomba Video - Daftar Sekarang!</span>
            <Image
              src="/cwb/card-video.webp"
              alt="Daftar Lomba Video"
              width={255}
              height={205}
              priority
              className="cwb-card-img"
            />
          </Link>

          {/* Lomba Desain Kemasan Card */}
          <Link
            href="/competition/desain-kemasan#registration-form"
            className="cwb-card cwb-card-kemasan"
            onClick={closeBanner}
            aria-label="Daftar Lomba Desain Kemasan - Daftar Sekarang!"
          >
            <span className="sr-only">Daftar Lomba Desain Kemasan - Daftar Sekarang!</span>
            <Image
              src="/cwb/card-kemasan.webp"
              alt="Daftar Lomba Desain Kemasan"
              width={260}
              height={220}
              priority
              className="cwb-card-img"
            />
          </Link>
        </div>

        {/* Bottom Home Arrow Ribbon */}
        <div className="cwb-home-wrap">
          <a
            href="#competitions"
            className="cwb-home-ribbon"
            onClick={closeBanner}
            aria-label="Kembali ke page utama"
          >
            <span className="sr-only">Kembali ke page utama</span>
            <Image
              src="/cwb/banner-home.webp"
              alt="Kembali ke page utama"
              width={216}
              height={70}
              priority
              className="cwb-home-img"
            />
          </a>
        </div>
      </section>
    </div>
  );
}
