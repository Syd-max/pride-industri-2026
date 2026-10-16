'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PrideRegistration } from '@/types';

export default function AdminOverviewPage() {
  const [registrations, setRegistrations] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 15 seconds for live attendance monitoring
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const total = registrations.length;
  const desainKemasanCount = registrations.filter(
    (r) => r.competition_id === 'desain-kemasan'
  ).length;
  const videoLokalCount = registrations.filter(
    (r) => r.competition_id === 'video-lokal'
  ).length;
  const checkedInCount = registrations.filter(
    (r) => r.check_in_status === 'checked_in'
  ).length;
  const notCheckedInCount = total - checkedInCount;
  const attendanceRate = total > 0 ? Math.round((checkedInCount / total) * 100) : 0;
  const dkPercent = total > 0 ? Math.round((desainKemasanCount / total) * 100) : 0;
  const vlPercent = total > 0 ? Math.round((videoLokalCount / total) * 100) : 0;

  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const finalistCount = registrations.filter((r) => r.status === 'finalist').length;
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  const withSubmissionCount = registrations.filter(
    (r) => (r.video_url && r.video_url.trim() !== '') || (r.brand_name && r.brand_name.trim() !== '')
  ).length;
  const submissionRate = total > 0 ? Math.round((withSubmissionCount / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Rekapitulasi Data
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Ringkasan total pendaftaran, distribusi kategori lomba, dan status kehadiran peserta di Braga City Walk.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>Segarkan Data</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Primary Metrics Row (Jumlah & Angka Utama) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Peserta */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <span className="admin-stat-label">Total Peserta Terdaftar</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[11px] font-bold">
              100%
            </span>
          </div>
          <div className="admin-stat-value mt-2 text-blue-600">
            {loading ? '...' : total}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
            <span className="text-emerald-600 font-bold">↑ Aktif</span> seluruh kategori kompetisi
          </div>
        </div>

        {/* Metric 2: Desain Kemasan */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <span className="admin-stat-label">Lomba Desain Kemasan</span>
            <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 font-mono text-[11px] font-bold">
              {loading ? '...' : `${dkPercent}%`}
            </span>
          </div>
          <div className="admin-stat-value mt-2 text-orange-600">
            {loading ? '...' : desainKemasanCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Pangan olahan lokal &amp; IKM
          </div>
        </div>

        {/* Metric 3: Video 1 Menit */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <span className="admin-stat-label">Lomba Video 1 Menit</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold">
              {loading ? '...' : `${vlPercent}%`}
            </span>
          </div>
          <div className="admin-stat-value mt-2 text-indigo-600">
            {loading ? '...' : videoLokalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Reels &amp; TikTok vertikal
          </div>
        </div>

        {/* Metric 4: Presensi Hadir di Braga */}
        <div className="admin-card border-emerald-200/80 bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="admin-stat-label text-emerald-800">Presensi Hadir di Braga</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
              {loading ? '...' : `${attendanceRate}%`}
            </span>
          </div>
          <div className="admin-stat-value mt-2 text-emerald-600">
            {loading ? '...' : checkedInCount}
          </div>
          <div className="text-[11px] text-slate-600 mt-2 font-medium">
            <strong className="text-emerald-700 font-bold">{notCheckedInCount}</strong> peserta belum check-in
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Breakdown (Detail Rekapitulasi Angka) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card A: Proporsi Kategori Lomba */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[12px]">
              Distribusi Kategori
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {total} Total
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Desain Kemasan</span>
                <span className="font-mono text-orange-600">{desainKemasanCount} ({dkPercent}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${dkPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Video Kreatif 1 Menit</span>
                <span className="font-mono text-indigo-600">{videoLokalCount} ({vlPercent}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${vlPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Rasio Peminatan:</span>
              <span className="font-semibold text-slate-700">
                {desainKemasanCount} : {videoLokalCount}
              </span>
            </div>
          </div>
        </div>

        {/* Card B: Rekapitulasi Presensi Gate */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[12px]">
              Presensi Gate Masuk
            </h2>
            <span className="text-xs font-semibold text-emerald-600">
              {attendanceRate}% Hadir
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Sudah Hadir di Lokasi
                </span>
                <span className="font-mono text-emerald-600">{checkedInCount}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Belum Hadir / Menunggu
                </span>
                <span className="font-mono text-slate-500">{notCheckedInCount}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full transition-all duration-500"
                  style={{ width: `${100 - attendanceRate}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status Gate Braga:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Scanner Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Card C: Status Kelengkapan & Berkas */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[12px]">
              Verifikasi &amp; Submission
            </h2>
            <span className="text-xs font-semibold text-blue-600">
              {submissionRate}% Terunggah
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Status Terkonfirmasi</span>
              <span className="font-bold text-slate-900 font-mono">{confirmedCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
              <span className="text-purple-700 font-medium">Kandidat Finalis</span>
              <span className="font-bold text-purple-900 font-mono">{finalistCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between text-xs">
              <span className="text-amber-700 font-medium">Menunggu Verifikasi</span>
              <span className="font-bold text-amber-900 font-mono">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards (Akses Cepat Modul) */}
      <div className="pt-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Akses Cepat Modul Operasional
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/participants"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Daftar Peserta Lengkap
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tabel data seluruh peserta ({total} pendaftar)
            </p>
          </Link>

          <Link
            href="/admin/check-ins"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="6" height="6" x="3" y="3" rx="1" />
                <rect width="6" height="6" x="15" y="3" rx="1" />
                <rect width="6" height="6" x="3" y="15" rx="1" />
                <path d="M15 15h2v2h-2z" />
                <path d="M21 15v6h-6" />
                <path d="M21 21h-2v-2" />
              </svg>
              <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Presensi Gate Real-Time
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Log pemindaian QR gate ({checkedInCount} hadir)
            </p>
          </Link>

          <Link
            href="/admin/registrations"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-600 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Verifikasi Registrasi
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Validasi status &amp; berkas pendaftaran
            </p>
          </Link>

          <Link
            href="/admin/competitions"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              QR Gate &amp; Kompetisi
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Manajemen token QR gate &amp; informasi lomba
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
