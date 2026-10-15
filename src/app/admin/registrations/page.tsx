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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F5F0E8]">
            Verifikasi & Manajemen Registrasi
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Validasi berkas peserta, seleksi finalis, dan kelayakan karya.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input form-select text-xs py-2"
          >
            <option value="all">Semua Status Registrasi</option>
            <option value="confirmed">Terkonfirmasi</option>
            <option value="finalist">Lolos Grand Final</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="disqualified">Didiskualifikasi</option>
          </select>
        </div>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode & Waktu</th>
                <th>Nama Peserta</th>
                <th>Kategori Lomba</th>
                <th>Status Saat Ini</th>
                <th>Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-xs">
                    Memuat data registrasi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-xs text-[#8A8A8A]">
                    Tidak ada data registrasi pada filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-mono text-xs font-bold text-[#E4C584]">
                        {r.registration_code}
                      </div>
                      <div className="text-[10px] text-[#8A8A8A]">
                        {new Date(r.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-[#F5F0E8]">{r.full_name}</div>
                      <div className="text-[11px] text-[#8A8A8A]">{r.email}</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
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
                        className={`badge ${
                          r.status === 'confirmed'
                            ? 'badge-confirmed'
                            : r.status === 'finalist'
                            ? 'badge-finalist'
                            : r.status === 'disqualified'
                            ? 'badge-cancelled'
                            : 'badge-pending'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            r.id,
                            e.target.value as RegistrationStatus
                          )
                        }
                        className="form-input form-select text-xs py-1 px-2 w-auto"
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
