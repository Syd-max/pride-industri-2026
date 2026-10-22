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
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastScrolled = false;
    let ticking = false;
    let rafId: number | null = null;

    const onScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled;
            setScrolled(isScrolled);
          }
          ticking = false;
          rafId = null;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close menu on outside click (excluding the toggle button)
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  };

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3'
            : 'bg-slate-950/40 backdrop-blur-md border-b border-white/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            aria-label="PRIDE Industri 2026 — Beranda"
            className="flex items-center gap-2.5 sm:gap-3.5 group text-decoration-none min-w-0"
          >
            <div className="relative w-12 sm:w-20 md:w-[84px] h-9 sm:h-12 md:h-[50px] transition-transform duration-200 group-hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] shrink-0">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="Logo PRIDE Industri 2026"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 640px) 100px, 180px"
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span
                className={`font-black text-base sm:text-xl tracking-tight leading-none transition-colors truncate ${
                  scrolled ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-amber-300 drop-shadow-sm'
                }`}
              >
                PRIDE <span className="text-rose-500">INDUSTRI</span>
              </span>
              <span
                className={`text-[9.5px] sm:text-[11px] font-bold tracking-wide sm:tracking-widest uppercase mt-0.5 sm:mt-1 transition-colors truncate ${
                  scrolled ? 'text-slate-500' : 'text-slate-200 drop-shadow-sm'
                }`}
              >
                27-28 Nov 2026 · Braga Bandung
              </span>
            </div>
          </Link>

          {/* Desktop Navigation & Action */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <nav
              aria-label="Navigasi utama"
              className="flex items-center gap-6 lg:gap-7"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-semibold transition-colors cursor-pointer py-1.5 px-1 border-b-2 border-transparent ${
                    scrolled
                      ? 'text-slate-700 hover:text-blue-600 hover:border-blue-600'
                      : 'text-slate-200 hover:text-amber-300 hover:border-amber-300'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Vertical Divider */}
            <div
              className={`w-px h-5 ${
                scrolled ? 'bg-slate-300' : 'bg-white/25'
              }`}
            />

            {/* Scan Barcode Action Button */}
            <Link
              href="/check-in"
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all hover:-translate-y-0.5 shadow-sm ${
                scrolled
                  ? 'text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-sm'
                  : 'text-white bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md shadow-sm'
              }`}
            >
              <svg
                className={`w-4 h-4 ${scrolled ? 'text-blue-600' : 'text-emerald-300'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              <span>Scan Barcode</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            type="button"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-colors cursor-pointer ${
              scrolled
                ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            <span
              className={`w-5 h-0.5 transition-transform duration-200 ${
                scrolled ? 'bg-slate-800' : 'bg-white'
              } ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`w-5 h-0.5 transition-opacity duration-200 ${
                scrolled ? 'bg-slate-800' : 'bg-white'
              } ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`w-5 h-0.5 transition-transform duration-200 ${
                scrolled ? 'bg-slate-800' : 'bg-white'
              } ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu (Elegant, Creative, Anti-AI-Slop) */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!menuOpen}
        className={`fixed inset-x-0 top-[60px] sm:top-[68px] bottom-0 z-40 bg-white/98 backdrop-blur-2xl transition-all duration-300 md:hidden flex flex-col justify-between p-5 sm:p-6 overflow-y-auto overscroll-contain max-h-[calc(100dvh-60px)] shadow-2xl ${
          menuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        <div className="space-y-4">
          {/* Navigation Links with Clean Typography */}
          <div className="space-y-1">
            {NAV_LINKS.map((link, idx) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left min-h-[46px] py-2.5 px-3.5 rounded-xl text-base font-bold text-slate-800 hover:bg-slate-50 hover:text-blue-600 active:bg-slate-100 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-blue-600">
                    {`0${idx + 1}`}
                  </span>
                  <span>{link.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Link
            href="/check-in"
            onClick={() => setMenuOpen(false)}
            className="w-full min-h-[46px] py-3 px-4 text-center text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <svg
              className="w-4 h-4 text-emerald-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            <span>Scan Barcode Check-In</span>
          </Link>

          <div className="text-center text-[11px] text-slate-400">
            {EVENT_CONFIG.venue.name} · {EVENT_CONFIG.venue.city}
          </div>
        </div>
      </div>
    </>
  );
}
