'use client';

import { useEffect, useState } from 'react';
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
    </div>
  );
}
