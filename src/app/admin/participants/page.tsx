'use client';

import { useState, useEffect } from 'react';
import type { PrideRegistration } from '@/types';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState('all');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [selectedParticipant, setSelectedParticipant] =
    useState<PrideRegistration | null>(null);

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
  }, []);

  // Filter participants
  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    const matchQuery =
      p.full_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.registration_code.toLowerCase().includes(q) ||
      p.phone.includes(q);

    const matchComp =
      compFilter === 'all' || p.competition_id === compFilter;
    const matchAttendance =
      attendanceFilter === 'all' || p.check_in_status === attendanceFilter;

    return matchQuery && matchComp && matchAttendance;
  });

  // Toggle Check-in status manually
  const handleToggleCheckIn = async (p: PrideRegistration) => {
    const nextStatus =
      p.check_in_status === 'checked_in' ? 'not_checked_in' : 'checked_in';
    const confirmMsg =
      nextStatus === 'checked_in'
        ? `Tandai ${p.full_name} sebagai HADIR di Braga secara manual?`
        : `Batalkan status hadir untuk ${p.full_name}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/admin/data', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          check_in_status: nextStatus,
        }),
      });

      if (res.ok) {
        setParticipants((prev) =>
          prev.map((item) =>
            item.id === p.id
              ? {
                  ...item,
                  check_in_status: nextStatus,
                  checked_in_at:
                    nextStatus === 'checked_in'
                      ? new Date().toISOString()
                      : undefined,
                }
              : item
          )
        );
        if (selectedParticipant?.id === p.id) {
          setSelectedParticipant((prev) =>
            prev ? { ...prev, check_in_status: nextStatus } : null
          );
        }
      }
    } catch (err) {
      alert('Gagal memperbarui status presensi.');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Kode Registrasi',
      'Nama Lengkap',
      'Kompetisi',
      'Email',
      'No. Telepon',
      'Status Pendaftaran',
      'Presensi Hadir',
      'Waktu Check-In',
      'Tanggal Daftar',
    ];

    const rows = filtered.map((p) => [
      `"${p.registration_code}"`,
      `"${p.full_name}"`,
      `"${p.competition_id}"`,
      `"${p.email}"`,
      `"${p.phone}"`,
      `"${p.status}"`,
      `"${p.check_in_status}"`,
      `"${p.checked_in_at || '-'}"`,
      `"${p.created_at}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `PRIDE_2026_Peserta_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F5F0E8]">
            Direktori Peserta Festival
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Total {filtered.length} peserta sesuai kriteria pencarian.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] flex flex-wrap items-center gap-4 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, no HP, atau kode..."
            className="form-input text-xs py-2"
          />
        </div>

        <div>
          <select
            value={compFilter}
            onChange={(e) => setCompFilter(e.target.value)}
            className="form-input form-select text-xs py-2"
          >
            <option value="all">Semua Kompetisi</option>
            <option value="desain-kemasan">Desain Kemasan</option>
            <option value="video-lokal">Video 1 Menit</option>
          </select>
        </div>

        <div>
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="form-input form-select text-xs py-2"
          >
            <option value="all">Semua Status Presensi</option>
            <option value="checked_in">Hadir di Braga</option>
            <option value="not_checked_in">Belum Check-In</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Peserta</th>
                <th>Kompetisi</th>
                <th>Kontak</th>
                <th>Presensi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs">
                    Memuat data peserta...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-[#8A8A8A]">
                    Tidak ditemukan peserta dengan kata kunci tersebut.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs font-semibold text-[#E4C584]">
                      {p.registration_code}
                    </td>
                    <td>
                      <div className="font-medium text-[#F5F0E8]">{p.full_name}</div>
                      <div className="text-[11px] text-[#8A8A8A]">{p.email}</div>
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
                          : 'Video Lokal'}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-[#B8B0A4]">{p.phone}</td>
                    <td>
                      <button
                        onClick={() => handleToggleCheckIn(p)}
                        className={`badge cursor-pointer hover:opacity-80 transition-opacity ${
                          p.check_in_status === 'checked_in'
                            ? 'badge-checked-in'
                            : 'badge-not-checked-in'
                        } inline-flex items-center gap-1.5`}
                        title="Klik untuk mengubah status presensi"
                      >
                        {p.check_in_status === 'checked_in' ? (
                          <>
                            <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Hadir</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            <span>Belum Hadir</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedParticipant(p)}
                        className="text-xs text-[#C8A96E] hover:underline cursor-pointer"
                      >
                        Detail Lengkap →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Drawer/Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
              <div>
                <span className="font-mono text-xs font-bold text-[#E4C584]">
                  {selectedParticipant.registration_code}
                </span>
                <h2 className="font-display text-xl font-bold text-[#F5F0E8] mt-1">
                  {selectedParticipant.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="w-8 h-8 rounded-full bg-[#1C1C1C] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#181818] border border-[#222222]">
                <div>
                  <span className="text-[#8A8A8A] block">Email:</span>
                  <span className="font-medium text-[#F5F0E8]">
                    {selectedParticipant.email}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A8A8A] block">Telepon / WA:</span>
                  <span className="font-medium text-[#F5F0E8]">
                    {selectedParticipant.phone}
                  </span>
                </div>
              </div>

              {/* Competition Specifics */}
              {selectedParticipant.competition_id === 'desain-kemasan' ? (
                <div className="space-y-2 p-3.5 rounded-lg bg-[#181818] border border-[#222222]">
                  <div className="font-semibold text-[#E85B26] uppercase tracking-wider text-[11px]">
                    Data Produk & Desain Kemasan:
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">Nama Merek (Brand):</span>{' '}
                    <span className="text-[#F5F0E8] font-medium">
                      {selectedParticipant.brand_name || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">Nama Produk:</span>{' '}
                    <span className="text-[#F5F0E8] font-medium">
                      {selectedParticipant.product_name || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">Bahan Dasar Lokal:</span>{' '}
                    <span className="text-[#F5F0E8]">
                      {selectedParticipant.local_ingredients || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">Penggunaan AI:</span>{' '}
                    <span className="text-[#F5F0E8]">
                      {selectedParticipant.ai_used
                        ? 'Ya (alat bantu final mockup)'
                        : 'Tidak'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">Alamat Domisili:</span>{' '}
                    <span className="text-[#F5F0E8]">
                      {selectedParticipant.address || '-'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 p-3.5 rounded-lg bg-[#181818] border border-[#222222]">
                  <div className="font-semibold text-[#C8A96E] uppercase tracking-wider text-[11px]">
                    Data Lomba Video 1 Menit:
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">Kategori:</span>{' '}
                    <span className="text-[#F5F0E8] font-medium">
                      {selectedParticipant.video_category || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">Instagram:</span>{' '}
                    <span className="text-[#F5F0E8]">
                      @{selectedParticipant.instagram_handle || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A]">TikTok:</span>{' '}
                    <span className="text-[#F5F0E8]">
                      @{selectedParticipant.tiktok_handle || '-'}
                    </span>
                  </div>
                  {selectedParticipant.video_url && (
                    <div>
                      <span className="text-[#8A8A8A]">Tautan Video:</span>{' '}
                      <a
                        href={selectedParticipant.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C8A96E] underline"
                      >
                        Buka Video ↗
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Attendance & Registration Status */}
              <div className="p-3.5 rounded-lg bg-[#181818] border border-[#222222] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#8A8A8A]">Presensi Kehadiran di Braga:</span>
                  <span
                    className={`badge ${
                      selectedParticipant.check_in_status === 'checked_in'
                        ? 'badge-checked-in'
                        : 'badge-not-checked-in'
                    }`}
                  >
                    {selectedParticipant.check_in_status === 'checked_in'
                      ? 'Hadir di Lokasi'
                      : 'Belum Check-In'}
                  </span>
                </div>
                {selectedParticipant.checked_in_at && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#8A8A8A]">Waktu Check-In:</span>
                    <span className="text-[#34D399] font-mono">
                      {new Date(
                        selectedParticipant.checked_in_at
                      ).toLocaleString('id-ID')}{' '}
                      WIB
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#222222]">
              <button
                onClick={() => handleToggleCheckIn(selectedParticipant)}
                className="btn btn-secondary text-xs py-2 px-4"
              >
                {selectedParticipant.check_in_status === 'checked_in'
                  ? 'Batalkan Presensi'
                  : 'Tandai Hadir Manual'}
              </button>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="btn btn-ghost text-xs py-2 px-4"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
