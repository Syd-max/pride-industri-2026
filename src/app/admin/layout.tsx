'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render without admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: '📊' },
    { label: 'Daftar Peserta', href: '/admin/participants', icon: '👥' },
    { label: 'Verifikasi Registrasi', href: '/admin/registrations', icon: '📝' },
    { label: 'Presensi Gate Real-Time', href: '/admin/check-ins', icon: '📱' },
    { label: 'Lomba & QR Gate Generator', href: '/admin/competitions', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 flex-shrink-0">
        <div className="space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="relative w-9 h-9">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 leading-tight">
                PRIDE 2026
              </div>
              <div className="text-[10px] text-blue-600 uppercase tracking-widest font-extrabold">
                Admin Portal
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Menu Admin">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span>🌐</span>
            <span>Buka Website Publik ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>Keluar (Sign Out)</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 min-w-0 bg-slate-50 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
