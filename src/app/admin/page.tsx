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

  const recentRegistrations = [...registrations]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const recentCheckIns = [...registrations]
    .filter((r) => r.check_in_status === 'checked_in')
    .sort(
      (a, b) =>
        new Date(b.checked_in_at || 0).getTime() -
        new Date(a.checked_in_at || 0).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Operasional Panitia
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Monitoring registrasi peserta, kategori lomba, dan presensi gate Braga City Walk.
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="admin-card">
          <div className="admin-stat-label">Total Peserta Terdaftar</div>
          <div className="admin-stat-value mt-2 text-blue-600">
            {loading ? '...' : total}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
            <span className="text-emerald-600 font-bold">↑ Aktif</span> seluruh kategori
          </div>
        </div>

        {/* Metric 2 */}
        <div className="admin-card">
          <div className="admin-stat-label">Lomba Desain Kemasan</div>
          <div className="admin-stat-value mt-2 text-orange-600">
            {loading ? '...' : desainKemasanCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Kategori pangan olahan lokal
          </div>
        </div>

        {/* Metric 3 */}
        <div className="admin-card">
          <div className="admin-stat-label">Lomba Video 1 Menit</div>
          <div className="admin-stat-value mt-2 text-indigo-600">
            {loading ? '...' : videoLokalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Reels / TikTok vertikal
          </div>
        </div>

        {/* Metric 4 */}
        <div className="admin-card border-emerald-200/80 bg-emerald-50/20">
          <div className="admin-stat-label text-emerald-800">Presensi Hadir di Braga</div>
          <div className="admin-stat-value mt-2 text-emerald-600">
            {loading ? '...' : checkedInCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Kehadiran:{' '}
            <strong className="text-emerald-700">{attendanceRate}%</strong> ({notCheckedInCount} belum hadir)
          </div>
        </div>
      </div>

      {/* Two Columns Grid: Recent Registrations vs Recent Gate Check-Ins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Registrations */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Registrasi Terbaru
            </h2>
            <Link
              href="/admin/participants"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentRegistrations.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 py-6 text-center">
                Belum ada pendaftaran masuk.
              </p>
            ) : (
              recentRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs hover:border-slate-200 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {reg.full_name}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                      {reg.registration_code}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge ${
                        reg.competition_id === 'desain-kemasan'
                          ? 'badge-desain-kemasan'
                          : 'badge-video-lokal'
                      }`}
                    >
                      {reg.competition_id === 'desain-kemasan'
                        ? 'Desain Kemasan'
                        : 'Video Lokal'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">
                      {new Date(reg.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Gate Check-In Stream */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Presensi Gate Masuk Terkini
            </h2>
            <Link
              href="/admin/check-ins"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Log Presensi →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentCheckIns.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 py-6 text-center">
                Belum ada peserta yang memindai QR gate.
              </p>
            ) : (
              recentCheckIns.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between gap-3 text-xs hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {item.full_name}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        {item.registration_code}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-checked-in">Hadir di Lokasi</span>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 font-medium">
                      {new Date(item.checked_in_at || '').toLocaleTimeString(
                        'id-ID'
                      )}{' '}
                      WIB
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
