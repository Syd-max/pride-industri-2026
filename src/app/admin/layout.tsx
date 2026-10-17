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
      iconColor: 'text-blue-600',
      activeClass: 'bg-white text-blue-900 shadow-[0_1px_2px_rgba(37,99,235,0.14)] font-semibold border-b-2 border-blue-600',
      hoverClass: 'hover:text-blue-700 hover:bg-white/60',
      drawerActive: 'bg-blue-600 text-white font-semibold shadow-xs',
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
      iconColor: 'text-emerald-600',
      activeClass: 'bg-white text-emerald-900 shadow-[0_1px_2px_rgba(16,185,129,0.14)] font-semibold border-b-2 border-emerald-600',
      hoverClass: 'hover:text-emerald-700 hover:bg-white/60',
      drawerActive: 'bg-emerald-600 text-white font-semibold shadow-xs',
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      ),
    },
    {
      label: 'Data Daftar Lomba',
      href: '/admin/registrations',
      iconColor: 'text-violet-600',
      activeClass: 'bg-white text-violet-900 shadow-[0_1px_2px_rgba(139,92,246,0.14)] font-semibold border-b-2 border-violet-600',
      hoverClass: 'hover:text-violet-700 hover:bg-white/60',
      drawerActive: 'bg-violet-600 text-white font-semibold shadow-xs',
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
      label: 'QR Code Generator',
      href: '/admin/qr-generator',
      iconColor: 'text-amber-600',
      activeClass: 'bg-white text-amber-900 shadow-[0_1px_2px_rgba(245,158,11,0.14)] font-semibold border-b-2 border-amber-500',
      hoverClass: 'hover:text-amber-700 hover:bg-white/60',
      drawerActive: 'bg-amber-600 text-white font-semibold shadow-xs',
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
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col antialiased">
      {/* ─── LOCKED TOP NAVBAR (With Subtle PRIDE Brand Accent) ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 h-16 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)] relative">
        {/* Subtle PRIDE 2026 Brand Top Gradient Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-emerald-500 via-amber-500 to-rose-500 pointer-events-none" />

        {/* Left Side: Hamburger Menu Button + PRIDE Logo + Desktop Nav */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger Menu Toggle (Mobile & Tablet) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/80 transition-colors flex items-center gap-2 cursor-pointer group"
            aria-label="Buka menu navigasi admin"
          >
            <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* PRIDE 2026 Brand Logo */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 transition-opacity group-hover:opacity-85">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="40px"
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-bold text-sm sm:text-base text-neutral-900 tracking-tight">
                  PRIDE
                </span>
                <span className="font-bold text-sm sm:text-base text-[#E51937] tracking-tight">
                  2026
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Admin Console
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Sistem Aktif" />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Tabs (Apple Segmented Style with Brand Color Accents) */}
          <nav className="hidden md:flex items-center gap-1 ml-4 lg:ml-6 bg-neutral-100/90 p-1 rounded-xl border border-neutral-200/70" aria-label="Navigasi Utama Admin">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? item.activeClass
                      : `text-neutral-600 ${item.hoverClass}`
                  }`}
                >
                  <span className={isActive ? item.iconColor : 'text-neutral-400 group-hover:text-neutral-600'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Quick Links & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 hover:text-blue-600 hover:bg-blue-50/70 border border-transparent hover:border-blue-200/60 transition-colors"
            title="Lihat Website Publik"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Web Publik</span>
            <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-700 hover:text-rose-600 hover:bg-rose-50/80 border border-neutral-200/80 hover:border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Keluar dari Admin Portal"
          >
            <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* ─── SLIDE-IN OFF-CANVAS DRAWER MENU (Apple Mobile Sheet Style) ─── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside
            className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-50 flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-left duration-200 border-r border-neutral-200/80"
            aria-label="Menu Drawer Admin"
          >
            <div className="space-y-6">
              {/* Drawer Header with Logo & Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src="/LOGO_PRIDE_INDUSTRI.png"
                      alt="PRIDE 2026"
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-neutral-900 leading-none">
                      PRIDE 2026
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium mt-1">
                      Admin Console
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="Tutup menu navigasi"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                        isActive
                          ? item.drawerActive
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : item.iconColor}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              {/* Calm Database Status */}
              <div className="px-3 py-2 rounded-xl bg-neutral-100/70 border border-neutral-200/60 flex items-center justify-between text-xs text-neutral-600 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Database
                </span>
                <span className="text-[11px] font-medium text-neutral-500">Terhubung</span>
              </div>

              {/* Buka Website Publik */}
              <Link
                href="/"
                target="_blank"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-700 bg-neutral-100/60 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200/60 transition-colors"
              >
                <span>Buka Website Publik</span>
                <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Link>

              {/* Keluar (Sign Out) */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50/70 border border-rose-200/60 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 w-full bg-[#f5f5f7] px-4 pb-8 sm:px-6 sm:pb-10 md:px-8 md:pb-12 pt-2 sm:pt-4 min-w-0">
        <div className="w-full max-w-[1360px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
