'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';

const NAV_LINKS = [
  { label: 'Tentang', href: '#about' },
  { label: 'Program', href: '#program' },
  { label: 'Kompetisi', href: '#competitions' },
  { label: 'Lokasi', href: '#location' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
          background: scrolled
            ? 'rgba(10, 10, 10, 0.85)'
            : 'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, transparent 100%)',
          borderBottom: scrolled ? '1px solid var(--pride-border)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(1rem, 4vw, 2rem)',
            height: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="PRIDE Industri 2026 — beranda"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div style={{ position: 'relative', width: '2rem', height: '2rem' }}>
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt=""
                fill
                style={{ objectFit: 'contain' }}
                sizes="32px"
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--pride-text-primary)',
                letterSpacing: '0.02em',
              }}
            >
              PRIDE <span style={{ color: 'var(--pride-gold)' }}>2026</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navigasi utama"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="nav-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexShrink: 0,
            }}
            className="hidden-mobile"
          >
            <Link
              href="/competition/desain-kemasan"
              className="btn btn-ghost"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              Desain Kemasan
            </Link>
            <Link
              href="/competition/video-lokal"
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              Daftar Video
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="show-mobile"
            style={{
              background: 'none',
              border: '1px solid var(--pride-border)',
              borderRadius: '2px',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '1.125rem',
                  height: '1.5px',
                  background: 'var(--pride-text-primary)',
                  transition: 'all 0.3s ease',
                  transformOrigin: 'center',
                  transform: menuOpen
                    ? i === 0
                      ? 'rotate(45deg) translate(4.5px, 4.5px)'
                      : i === 1
                      ? 'scaleX(0)'
                      : 'rotate(-45deg) translate(4.5px, -4.5px)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: '4rem',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          background: 'rgba(10, 10, 10, 0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          gap: '0.5rem',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
        className="show-mobile"
      >
        {NAV_LINKS.map((link, i) => (
          <button
            key={link.href}
            onClick={() => handleNavClick(link.href)}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              padding: '1rem 0',
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--pride-text-primary)',
              borderBottom: '1px solid var(--pride-border)',
              cursor: 'pointer',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateX(0)' : 'translateX(2rem)',
              transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`,
              width: '100%',
            }}
          >
            {link.label}
          </button>
        ))}

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link
            href="/competition/desain-kemasan"
            className="btn btn-ghost"
            onClick={() => setMenuOpen(false)}
            style={{ justifyContent: 'center' }}
          >
            Daftar Desain Kemasan
          </Link>
          <Link
            href="/competition/video-lokal"
            className="btn btn-primary"
            onClick={() => setMenuOpen(false)}
            style={{ justifyContent: 'center' }}
          >
            Daftar Video Lokal
          </Link>
          <Link
            href="/check-in"
            className="btn btn-ghost"
            onClick={() => setMenuOpen(false)}
            style={{ justifyContent: 'center' }}
          >
            Check-In Peserta
          </Link>
        </div>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '2rem',
            fontSize: '0.8125rem',
            color: 'var(--pride-text-muted)',
            textAlign: 'center',
          }}
        >
          {EVENT_CONFIG.venue.name} · {EVENT_CONFIG.venue.city}
        </div>
      </div>

      {/* Responsive helpers */}
      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
