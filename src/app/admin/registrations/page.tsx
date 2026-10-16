'use client';

import { useState, useEffect } from 'react';
import type { PrideRegistration, RegistrationStatus } from '@/types';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: RegistrationStatus
  ) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch {
      alert('Gagal memperbarui status registrasi.');
    }
  };

  const filtered = registrations.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verifikasi & Manajemen Registrasi
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Validasi berkas peserta, seleksi finalis, dan kelayakan karya.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input form-select text-xs py-2 px-3 bg-white border border-slate-200 shadow-sm"
          >
            <option value="all">Semua Status Registrasi</option>
            <option value="confirmed">Terkonfirmasi</option>
            <option value="finalist">Lolos Grand Final</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="disqualified">Didiskualifikasi</option>
          </select>
        </div>
      </div>

      <div className="admin-card overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="data-table min-w-[850px] w-full">
            <thead>
              <tr>
                <th className="w-[190px]">Kode & Waktu</th>
                <th className="min-w-[220px]">Nama Peserta</th>
                <th className="w-[170px]">Kategori Lomba</th>
                <th className="w-[160px]">Status Saat Ini</th>
                <th className="w-[190px] text-right pr-6">Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-medium text-slate-400">
                    Memuat data registrasi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-medium text-slate-400">
                    Tidak ada data registrasi pada filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300/70 inline-block whitespace-nowrap">
                        {r.registration_code}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">{r.full_name}</div>
                      <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{r.email}</div>
                    </td>
                    <td>
                      <span
                        className={`badge whitespace-nowrap ${
                          r.competition_id === 'desain-kemasan'
                            ? 'badge-desain-kemasan'
                            : 'badge-video-lokal'
                        }`}
                      >
                        {r.competition_id === 'desain-kemasan'
                          ? 'Desain Kemasan'
                          : 'Video 1 Menit'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge whitespace-nowrap ${
                          r.status === 'confirmed'
                            ? 'badge-confirmed'
                            : r.status === 'finalist'
                            ? 'badge-finalist'
                            : r.status === 'disqualified'
                            ? 'badge-cancelled'
                            : 'badge-pending'
                        }`}
                      >
                        {r.status === 'confirmed' && 'Terkonfirmasi'}
                        {r.status === 'finalist' && 'Finalis Lomba'}
                        {r.status === 'pending' && 'Pending Review'}
                        {r.status === 'disqualified' && 'Didiskualifikasi'}
                        {r.status === 'cancelled' && 'Dibatalkan'}
                        {!['confirmed', 'finalist', 'pending', 'disqualified', 'cancelled'].includes(r.status) && r.status}
                      </span>
                    </td>
                    <td className="text-right pr-6">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            r.id,
                            e.target.value as RegistrationStatus
                          )
                        }
                        className="form-input form-select text-xs py-1.5 px-3 w-auto bg-white border border-slate-200 rounded-lg shadow-2xs font-semibold cursor-pointer"
                      >
                        <option value="confirmed">Konfirmasi (Lolos)</option>
                        <option value="finalist">Finalis Lomba</option>
                        <option value="pending">Pending Review</option>
                        <option value="disqualified">Diskualifikasi</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
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
