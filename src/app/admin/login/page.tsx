'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Autentikasi gagal.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <div className="relative w-16 h-16 mx-auto">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="Logo PRIDE 2026"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="font-display text-2xl font-bold text-[#F5F0E8]">
            Portal Panitia PRIDE 2026
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            Akses operasional tertutup untuk panitia RRD Organizer & verifikator.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-[#2D0F0A] border border-[#7F1D1D] text-xs text-[#FCA5A5] text-center"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="p-8 rounded-2xl bg-[#111111] border border-[#222222] shadow-2xl space-y-5"
        >
          <div className="form-field">
            <label htmlFor="admin_email" className="form-label form-label-required">
              Email Administrator
            </label>
            <input
              id="admin_email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@prideindustri.id"
              className="form-input text-sm"
            />
          </div>

          <div className="form-field">
            <label
              htmlFor="admin_password"
              className="form-label form-label-required"
            >
              Kata Sandi
            </label>
            <input
              id="admin_password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="form-input text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5 text-xs uppercase tracking-wider font-semibold justify-center"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard Operasional →'}
          </button>

          <div className="p-3 rounded-lg bg-[#161616] border border-[#222222] text-[11px] text-[#8A8A8A] text-center">
            Default akun panitia: <br />
            <span className="font-mono text-[#E4C584]">admin@prideindustri.id</span>{' '}
            / <span className="font-mono text-[#E4C584]">pride2026admin</span>
          </div>
        </form>

        <div className="text-center text-xs">
          <Link
            href="/"
            className="text-[#8A8A8A] hover:text-[#C8A96E] transition-colors"
          >
            ← Kembali ke Website Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
