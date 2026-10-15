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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex flex-col md:flex-row">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="w-full md:w-64 bg-[#111111] border-r border-[#1C1C1C] flex flex-col justify-between p-6 flex-shrink-0">
        <div className="space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#1C1C1C]">
            <div className="relative w-8 h-8">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#F5F0E8]">
                PRIDE 2026
              </div>
              <div className="text-[10px] text-[#C8A96E] uppercase tracking-widest font-semibold">
                Admin Panel
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'bg-[#C8A96E] text-[#0A0A0A] font-semibold shadow-md'
                      : 'text-[#8A8A8A] hover:bg-[#1A1A1A] hover:text-[#F5F0E8]'
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
        <div className="pt-6 border-t border-[#1C1C1C] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-[#8A8A8A] hover:text-[#C8A96E] transition-colors"
          >
            <span>🌐</span>
            <span>Buka Website Publik ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full btn btn-ghost text-xs py-2 px-3 text-[#F87171] hover:text-[#EF4444] border-[#7F1D1D]/30 justify-start"
          >
            <span>🚪</span>
            <span>Keluar (Sign Out)</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 min-w-0 bg-[#0E0E0E] p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
