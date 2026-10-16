'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // If on login page, render without admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.href = '/admin/login';
  };

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1.5" />
          <rect width="7" height="5" x="14" y="3" rx="1.5" />
          <rect width="7" height="9" x="14" y="12" rx="1.5" />
          <rect width="7" height="5" x="3" y="16" rx="1.5" />
        </svg>
      ),
    },
    {
      label: 'Data Presensi',
      href: '/admin/participants',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      ),
    },
    {
      label: 'Verifikasi Registrasi',
      href: '/admin/registrations',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      label: 'Presensi Gate Real-Time',
      href: '/admin/check-ins',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="6" height="6" x="3" y="3" rx="1" />
          <rect width="6" height="6" x="15" y="3" rx="1" />
          <rect width="6" height="6" x="3" y="15" rx="1" />
          <path d="M15 15h2v2h-2z" />
          <path d="M21 15v6h-6" />
          <path d="M21 21h-2v-2" />
        </svg>
      ),
    },
    {
      label: 'Lomba & QR Gate Generator',
      href: '/admin/competitions',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* ─── LOCKED TOP NAVBAR (Clean & Uncluttered on All Devices) ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between shadow-2xs">
        {/* Left Side: Hamburger Menu Button + PRIDE Logo + Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger Menu Toggle (Available on ALL screen sizes so data viewing is spacious) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-2xs group"
            aria-label="Buka menu navigasi admin"
          >
            <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="hidden sm:inline text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-wide">
              Menu
            </span>
          </button>

          {/* PRIDE 2026 Brand Logo */}
          <Link href="/admin" className="flex items-center gap-3 sm:gap-3.5 group">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="56px"
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 leading-none tracking-tight">
                PRIDE 2026
              </span>
              <span className="text-[10px] sm:text-xs text-blue-600 uppercase tracking-widest font-black mt-1">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Clean and minimal (The 3 cluttered buttons removed per user request) */}
        <div className="flex items-center gap-2" />
      </header>

      {/* ─── SLIDE-IN OFF-CANVAS DRAWER MENU (Unified on Web Desktop & Mobile) ─── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel: Smoothly Slides in from Left */}
          <aside
            className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-50 flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-left duration-200 border-r border-slate-200"
            aria-label="Menu Drawer Admin"
          >
            <div className="space-y-6">
              {/* Drawer Header with Logo & Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 flex-shrink-0">
                    <Image
                      src="/LOGO_PRIDE_INDUSTRI.png"
                      alt="PRIDE 2026"
                      fill
                      sizes="44px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-slate-900 leading-none">
                      PRIDE 2026
                    </span>
                    <span className="text-[10px] text-blue-600 uppercase tracking-widest font-black mt-1">
                      Admin Portal
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Tutup menu navigasi"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5" aria-label="Navigasi Menu Utama">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions (Live status, Buka Website, Keluar) */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              {/* Live Sync Badge inside menu */}
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Gateway
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Aktif</span>
              </div>

              {/* Buka Website Publik */}
              <Link
                href="/"
                target="_blank"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Buka Website Publik ↗</span>
              </Link>

              {/* Keluar (Sign Out) */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Keluar (Sign Out)</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ─── FULL-WIDTH MAIN CONTENT AREA (Spacious viewing for all data tables) ─── */}
      <main className="flex-1 w-full bg-slate-50 p-4 sm:p-6 md:p-8 lg:p-10 min-w-0">
        <div className="w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
