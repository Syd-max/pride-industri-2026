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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F5F0E8] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#34D399] animate-pulse" />
            Monitoring Presensi Gate Braga
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Data pemindaian kamera QR code peserta secara langsung dari pintu masuk Braga City Walk.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#8A8A8A]">Total Hadir:</div>
          <div className="font-display text-2xl font-bold text-[#34D399]">
            {checkedInList.length} Peserta
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
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
                  <td colSpan={6} className="text-center py-10 text-xs">
                    Memuat data presensi...
                  </td>
                </tr>
              ) : checkedInList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-[#8A8A8A]">
                    Belum ada peserta yang melakukan check-in di gate.
                  </td>
                </tr>
              ) : (
                checkedInList.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs text-[#34D399]">
                      {p.checked_in_at
                        ? new Date(p.checked_in_at).toLocaleTimeString('id-ID') + ' WIB'
                        : '-'}
                    </td>
                    <td className="font-mono text-xs font-semibold text-[#E4C584]">
                      {p.registration_code}
                    </td>
                    <td className="font-medium text-[#F5F0E8]">{p.full_name}</td>
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
                    <td className="text-xs text-[#8A8A8A]">
                      Gate Utama Braga City Walk
                    </td>
                    <td>
                      <span className="badge badge-checked-in inline-flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
