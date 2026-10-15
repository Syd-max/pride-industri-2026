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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F0E8]">
            Dashboard Operasional Panitia
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Monitoring registrasi peserta, kategori lomba, dan presensi gate
            Braga City Walk.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="btn btn-ghost text-xs py-2 px-3 flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Segarkan Data</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#052E16] text-[#34D399] border border-[#166534] text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="admin-card">
          <div className="admin-stat-label">Total Peserta Terdaftar</div>
          <div className="admin-stat-value mt-2 text-[#E4C584]">
            {loading ? '...' : total}
          </div>
          <div className="text-[11px] text-[#8A8A8A] mt-2 flex items-center gap-1">
            <span className="text-[#34D399]">↑ Aktif</span> seluruh kategori
          </div>
        </div>

        {/* Metric 2 */}
        <div className="admin-card">
          <div className="admin-stat-label">Lomba Desain Kemasan</div>
          <div className="admin-stat-value mt-2 text-[#E85B26]">
            {loading ? '...' : desainKemasanCount}
          </div>
          <div className="text-[11px] text-[#8A8A8A] mt-2">
            Kategori pangan olahan lokal
          </div>
        </div>

        {/* Metric 3 */}
        <div className="admin-card">
          <div className="admin-stat-label">Lomba Video 1 Menit</div>
          <div className="admin-stat-value mt-2 text-[#C8A96E]">
            {loading ? '...' : videoLokalCount}
          </div>
          <div className="text-[11px] text-[#8A8A8A] mt-2">
            Reels / TikTok vertikal
          </div>
        </div>

        {/* Metric 4 */}
        <div className="admin-card border-[#166534]/50">
          <div className="admin-stat-label">Presensi Hadir di Braga</div>
          <div className="admin-stat-value mt-2 text-[#34D399]">
            {loading ? '...' : checkedInCount}
          </div>
          <div className="text-[11px] text-[#8A8A8A] mt-2">
            Tingkat kehadiran:{' '}
            <strong className="text-[#34D399]">{attendanceRate}%</strong> ({notCheckedInCount} belum hadir)
          </div>
        </div>
      </div>

      {/* Two Columns Grid: Recent Registrations vs Recent Gate Check-Ins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Registrations */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <h2 className="font-display text-base font-semibold text-[#F5F0E8]">
              Registrasi Terbaru
            </h2>
            <Link
              href="/admin/participants"
              className="text-xs text-[#C8A96E] hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {recentRegistrations.length === 0 ? (
              <p className="text-xs text-[#8A8A8A] py-6 text-center">
                Belum ada pendaftaran masuk.
              </p>
            ) : (
              recentRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-3 rounded-lg bg-[#141414] border border-[#222222] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-medium text-[#F5F0E8]">
                      {reg.full_name}
                    </div>
                    <div className="font-mono text-[11px] text-[#8A8A8A] mt-0.5">
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
                    <div className="text-[10px] text-[#6B6560] mt-1">
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
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <h2 className="font-display text-base font-semibold text-[#F5F0E8] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
              Presensi Gate Masuk Terkini
            </h2>
            <Link
              href="/admin/check-ins"
              className="text-xs text-[#C8A96E] hover:underline"
            >
              Log Presensi →
            </Link>
          </div>

          <div className="space-y-3">
            {recentCheckIns.length === 0 ? (
              <p className="text-xs text-[#8A8A8A] py-6 text-center">
                Belum ada peserta yang memindai QR gate.
              </p>
            ) : (
              recentCheckIns.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#141414] border border-[#166534]/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#052E16] text-[#34D399] flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-medium text-[#F5F0E8]">
                        {item.full_name}
                      </div>
                      <div className="font-mono text-[11px] text-[#8A8A8A]">
                        {item.registration_code}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-checked-in">Hadir di Lokasi</span>
                    <div className="text-[10px] text-[#8A8A8A] font-mono mt-1">
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
