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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    return () => {
      document.body.style.overflow = '';
    };
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3'
            : 'bg-slate-950/40 backdrop-blur-md border-b border-white/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            aria-label="PRIDE Industri 2026 — Beranda"
            className="flex items-center gap-3 group text-decoration-none"
          >
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="Logo PRIDE Industri 2026"
                fill
                style={{ objectFit: 'contain' }}
                sizes="40px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-extrabold text-lg tracking-tight leading-none transition-colors ${
                  scrolled ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-amber-300'
                }`}
              >
                PRIDE <span className="text-rose-500">INDUSTRI</span>
              </span>
              <span
                className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${
                  scrolled ? 'text-slate-500' : 'text-slate-300'
                }`}
              >
                27–28 Nov 2026 · Braga Bandung
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-8"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-semibold transition-colors cursor-pointer py-1 border-b-2 border-transparent ${
                  scrolled
                    ? 'text-slate-600 hover:text-blue-600 hover:border-blue-600'
                    : 'text-slate-200 hover:text-amber-300 hover:border-amber-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/check-in"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full transition-all hover:-translate-y-0.5 ${
                scrolled
                  ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                  : 'text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md'
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
              <span>Scan QR Check-In</span>
            </Link>

            <Link
              href="/competition/desain-kemasan"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              Desain Kemasan
            </Link>

            <Link
              href="/competition/video-lokal"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-sm shadow-rose-500/20 transition-all hover:-translate-y-0.5"
            >
              Lomba Video
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-colors ${
              scrolled
                ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            <span
              className={`w-5 h-0.5 transition-transform ${
                scrolled ? 'bg-slate-800' : 'bg-white'
              } ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`w-5 h-0.5 transition-opacity ${
                scrolled ? 'bg-slate-800' : 'bg-white'
              } ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`w-5 h-0.5 transition-transform ${
                scrolled ? 'bg-slate-800' : 'bg-white'
              } ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!menuOpen}
        className={`fixed inset-x-0 top-[65px] bottom-0 z-40 bg-white/98 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col justify-between p-6 overflow-y-auto ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Menu Festival
          </div>
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="w-full text-left py-3 px-4 rounded-xl text-lg font-bold text-slate-800 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-between border-b border-slate-100"
            >
              <span>{link.label}</span>
              <span className="text-slate-400 text-sm">→</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Akses Peserta & Kompetisi
          </div>
          <Link
            href="/competition/desain-kemasan"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3.5 px-4 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl block shadow-sm"
          >
            Daftar Lomba Desain Kemasan
          </Link>
          <Link
            href="/competition/video-lokal"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3.5 px-4 text-center text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl block shadow-sm"
          >
            Daftar Lomba Video 1 Menit
          </Link>
          <Link
            href="/check-in"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3.5 px-4 text-center text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl block"
          >
            Kamera QR Check-In
          </Link>

          <div className="text-center text-xs text-slate-400 pt-4">
            {EVENT_CONFIG.venue.name} · {EVENT_CONFIG.venue.city}
          </div>
        </div>
      </div>
    </>
  );
}
