'use client';

import { useEffect, useRef } from 'react';
import './activities-deck.css';

export default function ActivitiesDeckSection() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = deckContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.activities-card'));
    cards.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

    const totalCards = cards.length; // 7 cards: Cover (0) + 6 Program Cards (1..6)

    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }

    function updateDeck(scrollProgress: number) {
      const isMobile = window.innerWidth <= 768;
      const PEEK_STEP_Y = isMobile ? 10 : 16;
      const SCALE_STEP = isMobile ? 0.024 : 0.032;

      // Calibration: 6 peel transitions for 7 cards across scroll window
      const peelableCount = totalCards - 1; // 6 transitions
      const t = clamp((scrollProgress - 0.04) / 0.92, 0, 1) * peelableCount;

      cards.forEach((card, i) => {
        // Z-Index order: Card 0 is 70, Card 1 is 60, ..., Card 6 is 10
        card.style.zIndex = String((totalCards - i) * 10);

        const isFinalCard = i === totalCards - 1;
        const depth = isFinalCard ? Math.max(0, i - t) : (i - t);

        if (depth < 0) {
          // Card has peeled off: slide UPWARD cleanly out of the stack
          const peelAmount = clamp(-depth, 0, 1);
          const easedPeel = peelAmount * (1.6 - 0.6 * peelAmount);
          const translateYPercent = -easedPeel * 112; // Slide fully up and off screen
          const scale = 1 - easedPeel * 0.04;
          const opacity = peelAmount >= 0.88 ? Math.max(0, 1 - (peelAmount - 0.88) / 0.12) : 1;

          card.style.transform = `translate3d(0, ${translateYPercent.toFixed(2)}%, 0) scale(${scale.toFixed(4)})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.pointerEvents = peelAmount > 0.1 ? 'none' : 'auto';
          card.style.visibility = peelAmount >= 0.99 ? 'hidden' : 'visible';
        } else {
          // Card is active or waiting behind in the stack
          const effectiveDepth = Math.min(depth, 4);
          const yOffset = effectiveDepth * PEEK_STEP_Y;
          const scale = 1 - effectiveDepth * SCALE_STEP;

          card.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
          card.style.opacity = '1';
          card.style.visibility = 'visible';
          card.style.pointerEvents = depth < 0.3 ? 'auto' : 'none';
        }
      });
    }

    function getScrollProgress(): number {
      const driver = scrollDriverRef.current;
      if (!driver) return 0;
      const rect = driver.getBoundingClientRect();
      const totalScroll = driver.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return 0;
      const current = -rect.top;
      return clamp(current / totalScroll, 0, 1);
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDeck(getScrollProgress());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial render call
    updateDeck(getScrollProgress());

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="activities-scroll-driver" id="programUnggulan" ref={scrollDriverRef}>
      <section className="activities-stage" aria-label="6 Program Unggulan PRIDE 2026">

        {/* 7-Card Stack Deck Container: Cover (0) + 6 Programs (1..6) */}
        <div className="activities-deck-container" ref={deckContainerRef}>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 6 (Card 6): PANGGUNG SENI BUDAYA & MUSIK ETNIK
              Theme: Creative Purple (#8B5CF6)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-purple" data-index="6">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">06 / 06</span>
                  <span className="deck-header-pill">SENI BUDAYA &amp; MUSIK ETNIK</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>27–28 Nov · Main Stage Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13"/>
                      <circle cx="6" cy="18" r="3"/>
                      <circle cx="18" cy="16" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Pesta Seni Budaya &amp; Harmoni Tradisi</span>
                    <h3 className="deck-card-title">Panggung Seni Budaya &amp; Pertunjukan Musik Etnik</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Rampak Kendang Sunda</span>
                  <span className="deck-tag-chip">✦ Perkusi Etnik Interaktif</span>
                  <span className="deck-tag-chip">✦ Musik Tradisi Kontemporer</span>
                  <span className="deck-tag-chip">✦ Apresiasi Talenta Bandung</span>
                </div>

                <p className="deck-card-desc">
                  Perayaan puncak kebudayaan khas Sunda yang menyatukan harmoni musik tradisi perkusi etnik Jawa Barat, atraksi rampak kendang, serta kolaborasi talenta seni muda Kota Bandung. Mengiringi kemeriahan eksibisi industri kreatif dan belanja sepanjang koridor heritage Jalan Braga.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>18:30 — 21:00 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Main Stage Braga City Walk</span>
                </div>
                <span className="deck-status-badge status-public">Terbuka untuk Umum</span>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 5 (Card 5): PENYERAHAN 100 SERTIFIKAT HALAL & SNI
              Theme: Royal Bandung Blue (#1652F0)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-blue" data-index="5">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">05 / 06</span>
                  <span className="deck-header-pill">STANDARISASI &amp; LEGALITAS</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>28 Nov · Main Stage Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Fasilitasi Legalitas &amp; Jaminan Mutu Usaha</span>
                    <h3 className="deck-card-title">Penyerahan 100 Sertifikat Halal &amp; 3 Standar Mutu SNI</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ 100 Sertifikat Halal Gratis</span>
                  <span className="deck-tag-chip">✦ 3 Standar SNI IKM</span>
                  <span className="deck-tag-chip">✦ 100 Uji Laboratorium Mutu</span>
                  <span className="deck-tag-chip">✦ Konsultasi Legalitas Usaha</span>
                </div>

                <p className="deck-card-desc">
                  Seremonial penyerahan simbolis 100 Sertifikat Halal gratis, 3 SNI, dan fasilitasi uji laboratorium mutu IKM dari Disdagin Kota Bandung. Peserta dan pengunjung juga dapat berkonsultasi langsung mengenai pengurusan NIB, izin edar BPOM, dan legalitas industri di booth pelayanan terpadu.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>14:00 — 17:30 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Main Stage Braga City Walk</span>
                </div>
                <span className="deck-status-badge status-public">Terbuka untuk Umum</span>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 4 (Card 4): MALAM GALA APRESIASI INDUSTRI SIINAS
              Theme: Golden Yellow (#FFB800)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-yellow" data-index="4">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">04 / 06</span>
                  <span className="deck-header-pill">MALAM PENGANUGERAHAN</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>28 Nov · The Papandayan</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                      <path d="M4 22h16"/>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Apresiasi Kepatuhan Industri Nasional</span>
                    <h3 className="deck-card-title">Malam Anugerah &amp; Temu Kemitraan SIINAS</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ 200 IKM Tertib SIINAS</span>
                  <span className="deck-tag-chip">✦ Dihadiri Walikota Bandung</span>
                  <span className="deck-tag-chip">✦ Gala Dinner Formal</span>
                  <span className="deck-tag-chip">✦ Temu Kemitraan Usaha</span>
                </div>

                <p className="deck-card-desc">
                  Malam gala kehormatan penganugerahan penghargaan bagi 200 pelaku industri dan IKM binaan Kota Bandung yang tertib dan berdedikasi dalam pelaporan Sistem Informasi Industri Nasional (SIINAS), dirangkai makan malam formal bersama jajaran pimpinan daerah dan asosiasi usaha.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>19:00 — 21:00 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Grand Ballroom Hotel Papandayan</span>
                </div>
                <span className="deck-status-badge status-vip">Khusus Undangan Resmi</span>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 3 (Card 3): LOMBA VIDEO 1 MENIT BRAGA
              Theme: Warm Orange (#F69321)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-orange" data-index="3">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">03 / 06</span>
                  <span className="deck-header-pill">KREATIVITAS VISUAL VERTIKAL</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>27–28 Nov · Braga City Walk</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                      <rect x="2" y="6" width="14" height="12" rx="2"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Kompetisi Kreator Reels &amp; TikTok</span>
                    <h3 className="deck-card-title">Hunting Konten &amp; Screening Video 1 Menit</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Video Vertikal 60 Detik</span>
                  <span className="deck-tag-chip">✦ Eksplorasi Koridor Braga</span>
                  <span className="deck-tag-chip">✦ Angkat Produk IKM Lokal</span>
                  <span className="deck-tag-chip">✦ Tayang di Videotron Utama</span>
                </div>

                <p className="deck-card-desc">
                  Ratusan kreator visual mengabadikan dinamika produk IKM, kearifan lokal, dan atmosfer festival di koridor bersejarah Jalan Braga dalam format video vertikal 60 detik. Karya-karya kurasi terbaik ditayangkan langsung di videotron panggung utama festival.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Screening 28 Nov · 16:00 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Videotron Braga City Walk</span>
                </div>
                <span className="deck-status-badge status-public">Terbuka untuk Umum</span>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 2 (Card 2): LOMBA DESAIN KEMASAN IKM
              Theme: Emerald Green (#009E49)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-green" data-index="2">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">02 / 06</span>
                  <span className="deck-header-pill">INOVASI ECO-PACKAGING IKM</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>28 Nov · Expo Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7.5 4.27 9 5.15"/>
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                      <path d="m3.3 7 8.7 5 8.7-5"/>
                      <path d="M12 22V12"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Standarisasi Kemasan Siap Ritel</span>
                    <h3 className="deck-card-title">Showcase &amp; Penjurian Terbuka Desain Kemasan</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Kemasan Ramah Lingkungan</span>
                  <span className="deck-tag-chip">✦ Olahan Pangan Lokal Bandung</span>
                  <span className="deck-tag-chip">✦ Kurasi Rumah Kemasan</span>
                  <span className="deck-tag-chip">✦ Standar Ritel &amp; Ekspor</span>
                </div>

                <p className="deck-card-desc">
                  Pameran fisik dan presentasi langsung karya mockup 3D kemasan ramah lingkungan produk kuliner olahan pangan lokal binaan Bandung. Finalis memaparkan konsep di hadapan dewan juri ahli serta kurator Rumah Kemasan untuk kesiapan pasar ritel modern dan ekspor.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>10:00 — 16:30 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Area Pameran Braga City Walk</span>
                </div>
                <span className="deck-status-badge status-public">Display Terbuka</span>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 1 (Card 1): FASHION SHOW RUNWAY
              Theme: Vibrant Red (#E51937)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-red" data-index="1">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">01 / 06</span>
                  <span className="deck-header-pill">FESYEN &amp; WASTRA NUSANTARA</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>27 Nov · Main Runway Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Panggung 20+ Desainer Binaan</span>
                    <h3 className="deck-card-title">Peragaan Busana Wastra Kontemporer</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Ready-to-Wear Wastra</span>
                  <span className="deck-tag-chip">✦ Motif Kain Khas Bandung</span>
                  <span className="deck-tag-chip">✦ 20+ Desainer Muda</span>
                  <span className="deck-tag-chip">✦ Business Matching Kurator</span>
                </div>

                <p className="deck-card-desc">
                  Peragaan busana siap pakai (ready-to-wear) karya 20+ desainer fesyen binaan Disdagin Kota Bandung. Menampilkan eksplorasi motif khas dan kain nusantara berstandar internasional, dilengkapi sesi temu bisnis langsung bersama kurator dan pembeli potensial.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>15:30 — 17:30 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Main Runway Stage Braga</span>
                </div>
                <span className="deck-status-badge status-public">Terbuka untuk Umum</span>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 0 (Frontmost): ELEGANT & AESTHETIC COVER CARD
              Simple, clean centerpiece: "6 PROGRAM UNGGULAN"
              ════════════════════════════════════════════════════════════════ */}
          <section className="activities-card deck-cover-card" data-index="0">
            {/* Playful Colorful Background Accents */}
            <div className="deck-cover-decorations" aria-hidden="true">
              <div className="decor-circle decor-red" />
              <div className="decor-circle decor-yellow" />
              <div className="decor-circle decor-blue" />
              <div className="decor-circle decor-green" />
              <div className="decor-circle decor-orange" />
            </div>

            {/* Top Bar: Clean & Balanced */}
            <div className="deck-cover-top">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>Rangkaian Acara Festival</span>
              </div>
              <div className="deck-cover-venue-pill">
                <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
                <span>Braga City Walk · 27–28 Nov 2026</span>
              </div>
            </div>

            {/* Center Focal Point: Pure & Bold "6 PROGRAM UNGGULAN" */}
            <div className="deck-cover-hero">
              <div className="deck-cover-badge-row">
                <span className="deck-cover-kicker">PRIDE INDUSTRI KOTA BANDUNG 2026</span>
              </div>

              <div className="deck-cover-title-group">
                <span className="deck-cover-large-number">6</span>
                <h2 className="deck-cover-main-title">
                  <span>PROGRAM</span>
                  <span className="deck-title-highlight">UNGGULAN</span>
                </h2>
              </div>

              <p className="deck-cover-subtitle">
                Eksplorasi panggung fesyen wastra, kompetisi kreatif, apresiasi kepatuhan industri, hingga fasilitasi legalitas halal dan pesta seni budaya.
              </p>

              {/* Playful Proposal Palette Indicator Pills */}
              <div className="deck-cover-palette-row" aria-label="6 Kategori Program Festival">
                <span className="palette-chip chip-red">✦ Fesyen</span>
                <span className="palette-chip chip-green">✦ Kemasan</span>
                <span className="palette-chip chip-orange">✦ Video 1 Menit</span>
                <span className="palette-chip chip-yellow">✦ Gala SIINAS</span>
                <span className="palette-chip chip-blue">✦ Halal &amp; SNI</span>
                <span className="palette-chip chip-purple">✦ Seni Budaya</span>
              </div>
            </div>

            {/* Footer Bar: Sleek Scroll Prompt */}
            <div className="deck-cover-footer">
              <div className="deck-cover-scroll-indicator">
                <span className="scroll-arrow-box">
                  <svg className="w-4 h-4 animate-bounce text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7"/>
                  </svg>
                </span>
                <span className="font-semibold text-slate-700 text-xs sm:text-sm">
                  Scroll ke bawah untuk membuka tumpukan kartu program ↓
                </span>
              </div>
            </div>
          </section>

        </div>

      </section>
    </div>
  );
}
