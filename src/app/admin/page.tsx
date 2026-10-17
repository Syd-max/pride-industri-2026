'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PrideRegistration } from '@/types';

export default function AdminOverviewPage() {
  const [records, setRecords] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (json.success) {
        setRecords(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  // ─── Real Database Metrics Calculations ───
  // 1. Competition Registrations (Excluding general festival visitors)
  const competitionRegistrations = records.filter(
    (r) => r.competition_id !== 'pengunjung-umum'
  );
  const totalCompRegistrations = competitionRegistrations.length;

  const desainKemasanCount = records.filter(
    (r) => r.competition_id === 'desain-kemasan'
  ).length;

  const videoLokalCount = records.filter(
    (r) => r.competition_id === 'video-lokal'
  ).length;

  // 2. Attendance & Gate Check-ins (All verified check-ins)
  const totalCheckIns = records.filter(
    (r) => r.check_in_status === 'checked_in'
  ).length;

  const visitorCheckIns = records.filter(
    (r) => r.competition_id === 'pengunjung-umum' && r.check_in_status === 'checked_in'
  ).length;

  const participantCheckIns = records.filter(
    (r) => r.competition_id !== 'pengunjung-umum' && r.check_in_status === 'checked_in'
  ).length;

  const compAttendanceRate =
    totalCompRegistrations > 0
      ? Math.round((participantCheckIns / totalCompRegistrations) * 100)
      : 0;

  // 3. Status breakdown for competition entries
  const confirmedCount = competitionRegistrations.filter(
    (r) => r.status === 'confirmed'
  ).length;
  const finalistCount = competitionRegistrations.filter(
    (r) => r.status === 'finalist'
  ).length;
  const pendingCount = competitionRegistrations.filter(
    (r) => r.status === 'pending'
  ).length;

  // 4. Real Recent Activity (Sorted by timestamp descending)
  const recentActivities = [...records]
    .sort((a, b) => {
      const timeA = new Date(a.checked_in_at || a.created_at).getTime();
      const timeB = new Date(b.checked_in_at || b.created_at).getTime();
      return timeB - timeA;
    })
    .slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* ─── Top Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ringkasan Operasional Event
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Monitoring rekapitulasi data kehadiran gate Braga City Walk dan pendaftaran lomba PRIDE Industri 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>Segarkan</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* ─── Primary Essential Statistics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Presensi Gate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Kehadiran Gate
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
              Braga Gate
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
            {loading ? '...' : totalCheckIns}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Peserta Lomba: <strong>{participantCheckIns}</strong></span>
            <span>Pengunjung: <strong>{visitorCheckIns}</strong></span>
          </div>
        </div>

        {/* Metric 2: Total Pendaftar Lomba */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pendaftar Lomba
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
              2 Kompetisi
            </span>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 tracking-tight">
            {loading ? '...' : totalCompRegistrations}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Kemasan: <strong>{desainKemasanCount}</strong></span>
            <span>Video 1 Menit: <strong>{videoLokalCount}</strong></span>
          </div>
        </div>

        {/* Metric 3: Tingkat Kehadiran Peserta */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Presensi Peserta
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono text-[10px] font-bold border border-purple-200">
              {compAttendanceRate}% Hadir
            </span>
          </div>
          <div className="text-3xl font-extrabold text-purple-600 tracking-tight">
            {loading ? '...' : `${participantCheckIns} / ${totalCompRegistrations}`}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            {totalCompRegistrations - participantCheckIns} peserta lomba belum hadir di gate
          </div>
        </div>

        {/* Metric 4: Status Verifikasi Lomba */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status Berkas Lomba
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
              Verifikasi
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {loading ? '...' : confirmedCount + finalistCount}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-emerald-600 font-semibold">{confirmedCount} Terkonfirmasi</span>
            <span className="text-amber-600 font-semibold">{pendingCount} Menunggu</span>
          </div>
        </div>
      </div>

      {/* ─── Breakdown Grid & Navigation Shortcuts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Activities (Real Data Only) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Aktivitas Terbaru
            </h2>
            <span className="text-xs text-slate-400">
              Berdasarkan database langsung
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Memuat aktivitas terbaru...
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Belum ada aktivitas transaksi pendaftaran atau presensi.
              </div>
            ) : (
              recentActivities.map((item) => {
                const isCheckIn = item.check_in_status === 'checked_in';
                const timeStr = item.checked_in_at || item.created_at;
                return (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.registration_code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.competition_id === 'desain-kemasan'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : item.competition_id === 'video-lokal'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.competition_id === 'desain-kemasan'
                            ? 'Desain Kemasan'
                            : item.competition_id === 'video-lokal'
                            ? 'Video 1 Menit'
                            : 'Pengunjung Umum'}
                        </span>
                        {isCheckIn && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Hadir di Gate
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {item.full_name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.competition_id === 'pengunjung-umum'
                          ? `Asal: ${item.address || item.phone || 'Kota Bandung'}`
                          : item.email}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono text-slate-500 font-semibold">
                        {new Date(timeStr).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WIB
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(timeStr).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Quick Navigation Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Akses Cepat Modul
            </h2>
          </div>

          <div className="space-y-3">
            {/* Shortcut 1: Data Presensi */}
            <Link
              href="/admin/participants"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    Data Presensi Gate
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {totalCheckIns} orang telah hadir di Braga
                  </div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-emerald-600 font-bold text-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* Shortcut 2: Data Daftar Lomba */}
            <Link
              href="/admin/registrations"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                  </svg>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                    Data Daftar Lomba
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {totalCompRegistrations} peserta terdaftar di 2 kompetisi
                  </div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-blue-600 font-bold text-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* Shortcut 3: QR Code Generator */}
            <Link
              href="/admin/qr-generator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="6" height="6" x="3" y="3" rx="1" />
                    <rect width="6" height="6" x="15" y="3" rx="1" />
                    <rect width="6" height="6" x="3" y="15" rx="1" />
                    <path d="M15 15h2v2h-2z" />
                    <path d="M21 15v6h-6" />
                    <path d="M21 21h-2v-2" />
                  </svg>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                    QR Code Generator
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Cetak poster barcode gate & QR lomba
                  </div>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-indigo-600 font-bold text-sm transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
