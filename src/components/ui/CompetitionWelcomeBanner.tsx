'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const styles = {
  backdrop: 'cwb-backdrop',
  banner: 'cwb-banner',
  closeButton: 'cwb-close',
  artPanel: 'cwb-art',
  spark: 'cwb-spark',
  sparkOne: 'cwb-spark-one',
  sparkTwo: 'cwb-spark-two',
  browserSheet: 'cwb-sheet',
  browserBar: 'cwb-browser-bar',
  dotRed: 'cwb-dot-red',
  dotYellow: 'cwb-dot-yellow',
  dotGreen: 'cwb-dot-green',
  addressBar: 'cwb-address-bar',
  logoFrame: 'cwb-logo-frame',
  logo: 'cwb-logo',
  copyLines: 'cwb-copy-lines',
  videoCard: 'cwb-video-card',
  videoIcon: 'cwb-video-icon',
  packageCard: 'cwb-package-card',
  packageIcon: 'cwb-package-icon',
  noticeBadge: 'cwb-notice',
  content: 'cwb-content',
  kicker: 'cwb-kicker',
  description: 'cwb-description',
  note: 'cwb-note',
  actions: 'cwb-actions',
  action: 'cwb-action',
  videoAction: 'cwb-action-video',
  packageAction: 'cwb-action-package',
  detailAction: 'cwb-action-detail',
};

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
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeBanner();
      }}
    >
      <section
        className={styles.banner}
        role="dialog"
        aria-modal="true"
        aria-labelledby="competition-banner-title"
        aria-describedby="competition-banner-description"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeBanner}
          aria-label="Tutup banner kompetisi"
          autoFocus
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className={styles.artPanel} aria-hidden="true">
          <span className={`${styles.spark} ${styles.sparkOne}`} />
          <span className={`${styles.spark} ${styles.sparkTwo}`} />

          <div className={styles.browserSheet}>
            <div className={styles.browserBar}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
              <span className={styles.addressBar} />
            </div>
            <div className={styles.logoFrame}>
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt=""
                width={600}
                height={355}
                priority
                className={styles.logo}
              />
            </div>
            <div className={styles.copyLines}>
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={styles.videoCard}>
            <span className={styles.videoIcon}>
              <svg viewBox="0 0 24 24">
                <path d="m9 7 8 5-8 5V7Z" />
              </svg>
            </span>
            <span>Video 1 Menit</span>
          </div>

          <div className={styles.packageCard}>
            <span className={styles.packageIcon}>
              <svg viewBox="0 0 24 24">
                <path d="m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4m8-14v10l-8 4m0-10v10" />
              </svg>
            </span>
            <span>Desain Kemasan</span>
          </div>

          <div className={styles.noticeBadge}>
            <span>2</span>
            <small>lomba kreatif</small>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>Kompetisi PRIDE Industri 2026</p>
          <h2 id="competition-banner-title">
            Bawa karya terbaikmu ke Braga.
          </h2>
          <p id="competition-banner-description" className={styles.description}>
            Pilih Lomba Video 1 Menit atau Lomba Desain Kemasan, lalu isi formulir resminya.
          </p>
          <p className={styles.note}>Pendaftaran gratis untuk mahasiswa, siswa, dan umum.</p>

          <div className={styles.actions}>
            <Link
              href="/competition/video-lokal#registration-form"
              className={`${styles.action} ${styles.videoAction}`}
              onClick={closeBanner}
            >
              Daftar lomba video
            </Link>
            <Link
              href="/competition/desain-kemasan#registration-form"
              className={`${styles.action} ${styles.packageAction}`}
              onClick={closeBanner}
            >
              Daftar desain kemasan
            </Link>
            <a
              href="#competitions"
              className={`${styles.action} ${styles.detailAction}`}
              onClick={closeBanner}
            >
              Lihat detail kedua lomba
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
