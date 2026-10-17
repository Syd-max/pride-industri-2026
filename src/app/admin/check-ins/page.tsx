'use client';

import { useState, useEffect } from 'react';
import type { PrideRegistration } from '@/types';

export default function CheckInsPage() {
  const [participants, setParticipants] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (json.success) {
        setParticipants(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkedInList = participants
    .filter((p) => p.check_in_status === 'checked_in')
    .sort(
      (a, b) =>
        new Date(b.checked_in_at || 0).getTime() -
        new Date(a.checked_in_at || 0).getTime()
    );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Monitoring Presensi Gate Braga
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Data pemindaian kamera QR code peserta secara langsung dari gerbang masuk Braga City Walk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>Segarkan Data</span>
          </button>
          <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl px-4 py-2 text-right shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Total Hadir</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 leading-tight">
              {checkedInList.length} <span className="text-xs font-semibold text-emerald-700">Peserta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card with Scroll Wrapper */}
      <div className="admin-card overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="data-table min-w-[850px] w-full">
            <thead>
              <tr>
                <th className="w-[150px]">Waktu Check-In</th>
                <th className="w-[190px]">Kode Registrasi</th>
                <th className="min-w-[200px]">Nama Peserta</th>
                <th className="w-[160px]">Kompetisi</th>
                <th className="w-[180px]">Pintu Masuk</th>
                <th className="w-[170px]">Status Validasi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    Memuat data presensi...
                  </td>
                </tr>
              ) : checkedInList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    Belum ada peserta yang melakukan check-in di gate.
                  </td>
                </tr>
              ) : (
                checkedInList.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300/70 inline-block whitespace-nowrap">
                        {p.checked_in_at
                          ? new Date(p.checked_in_at).toLocaleTimeString('id-ID') + ' WIB'
                          : '-'}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300/70 inline-block whitespace-nowrap">
                        {p.registration_code}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
                        {p.full_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {p.competition_id === 'pengunjung-umum'
                          ? `Pengunjung Umum • Asal: ${p.address || p.phone || 'Kota Bandung'}`
                          : p.email}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge whitespace-nowrap ${
                          p.competition_id === 'desain-kemasan'
                            ? 'badge-desain-kemasan'
                            : p.competition_id === 'video-lokal'
                            ? 'badge-video-lokal'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {p.competition_id === 'desain-kemasan'
                          ? 'Desain Kemasan'
                          : p.competition_id === 'video-lokal'
                          ? 'Video 1 Menit'
                          : 'Pengunjung Festival'}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs text-slate-600 font-medium whitespace-nowrap flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Gate Utama Braga City Walk
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-checked-in whitespace-nowrap inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Terverifikasi Server</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
