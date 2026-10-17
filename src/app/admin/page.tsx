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
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* ─── Top Header (Apple Minimal Style) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-neutral-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
            Ringkasan Operasional
          </h1>
          <p className="text-xs sm:text-sm font-normal text-neutral-500 mt-1">
            Rekapitulasi data kehadiran gate Braga City Walk dan pendaftaran lomba PRIDE Industri 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-700 bg-white border border-neutral-200/80 hover:bg-neutral-50 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>Segarkan</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100/90 text-neutral-600 border border-neutral-200/70 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Sinkron Aktif
          </span>
        </div>
      </div>

      {/* ─── Primary Essential Statistics (Apple Card Design) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Presensi Gate */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Kehadiran Gate
            </span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono text-[10px] font-medium border border-neutral-200/60">
              Braga Gate
            </span>
          </div>
          <div className="text-3xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
            {loading ? '...' : totalCheckIns}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100">
            <span>Peserta: <strong className="text-neutral-800 font-medium">{participantCheckIns}</strong></span>
            <span>Pengunjung: <strong className="text-neutral-800 font-medium">{visitorCheckIns}</strong></span>
          </div>
        </div>

        {/* Metric 2: Total Pendaftar Lomba */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Pendaftar Lomba
            </span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono text-[10px] font-medium border border-neutral-200/60">
              2 Kategori
            </span>
          </div>
          <div className="text-3xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
            {loading ? '...' : totalCompRegistrations}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100">
            <span>Kemasan: <strong className="text-neutral-800 font-medium">{desainKemasanCount}</strong></span>
            <span>Video: <strong className="text-neutral-800 font-medium">{videoLokalCount}</strong></span>
          </div>
        </div>

        {/* Metric 3: Tingkat Kehadiran Peserta */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Presensi Peserta
            </span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono text-[10px] font-medium border border-neutral-200/60">
              {compAttendanceRate}% Hadir
            </span>
          </div>
          <div className="text-3xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
            {loading ? '...' : `${participantCheckIns} / ${totalCompRegistrations}`}
          </div>
          <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 truncate">
            {totalCompRegistrations - participantCheckIns} peserta belum hadir di lokasi
          </div>
        </div>

        {/* Metric 4: Status Verifikasi Lomba */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status Berkas
            </span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono text-[10px] font-medium border border-neutral-200/60">
              Verifikasi
            </span>
          </div>
          <div className="text-3xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
            {loading ? '...' : confirmedCount + finalistCount}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100">
            <span>Terkonfirmasi: <strong className="text-neutral-800 font-medium">{confirmedCount}</strong></span>
            <span>Menunggu: <strong className="text-neutral-800 font-medium">{pendingCount}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
