'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Autentikasi gagal. Periksa kembali email dan kata sandi.');
        setLoading(false);
        return;
      }

      window.location.href = '/admin';
    } catch {
      setError('Koneksi ke server gagal. Silakan periksa jaringan Anda.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center items-center px-4 py-12 antialiased">
      <div className="w-full max-w-sm">
        {/* Apple Style Clean White Card */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-neutral-200/80 p-8 space-y-6">
          
          {/* Header Section */}
          <div className="text-center space-y-2.5">
            <div className="relative w-12 h-12 mx-auto">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Portal Panitia Resmi
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              PRIDE 2026 Admin
            </h1>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto font-normal">
              Akses operasional tertutup panitia Braga City Walk.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200/70 text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
            >
              <svg className="w-4 h-4 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="admin_email"
                className="block text-xs font-medium text-neutral-700"
              >
                Email Administrator
              </label>
              <div className="relative">
                <input
                  id="admin_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@prideindustri.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50/70 border border-neutral-200/80 text-neutral-900 placeholder:text-neutral-400 font-normal text-xs focus:bg-white focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="admin_password"
                className="block text-xs font-medium text-neutral-700"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="admin_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-neutral-50/70 border border-neutral-200/80 text-neutral-900 placeholder:text-neutral-400 font-normal text-xs focus:bg-white focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Konsol Admin</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
