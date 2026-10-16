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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Monitoring Presensi Gate Braga
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Data pemindaian kamera QR code peserta secara langsung dari pintu masuk Braga City Walk.
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
            <span>Segarkan</span>
          </button>
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-2 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Total Hadir</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 leading-tight">
              {checkedInList.length} <span className="text-xs font-semibold text-emerald-700">Peserta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="data-table">
            <thead>
              <tr>
                <th>Waktu Check-In</th>
                <th>Kode Registrasi</th>
                <th>Nama Peserta</th>
                <th>Kompetisi</th>
                <th>Pintu Masuk</th>
                <th>Status Validasi</th>
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
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block">
                        {p.checked_in_at
                          ? new Date(p.checked_in_at).toLocaleTimeString('id-ID') + ' WIB'
                          : '-'}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block">
                        {p.registration_code}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {p.full_name}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          p.competition_id === 'desain-kemasan'
                            ? 'badge-desain-kemasan'
                            : 'badge-video-lokal'
                        }`}
                      >
                        {p.competition_id === 'desain-kemasan'
                          ? 'Desain Kemasan'
                          : 'Video 1 Menit'}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500 font-medium">
                      Gate Utama Braga City Walk
                    </td>
                    <td>
                      <span className="badge badge-checked-in inline-flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
