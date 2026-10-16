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
    } catch {
      alert('Gagal memperbarui status presensi.');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Kode Registrasi',
      'Nama Peserta',
      'Email',
      'Telepon',
      'Kompetisi',
      'Status Pendaftaran',
      'Presensi Gate',
      'Waktu Presensi',
      'Tanggal Daftar',
    ];

    const rows = filtered.map((p) => [
      p.registration_code,
      `"${p.full_name.replace(/"/g, '""')}"`,
      p.email,
      `'${p.phone}`,
      p.competition_id,
      p.status,
      p.check_in_status,
      p.checked_in_at ? new Date(p.checked_in_at).toLocaleString('id-ID') : '-',
      new Date(p.created_at).toLocaleString('id-ID'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Direktori Peserta Festival
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Total {filtered.length} peserta sesuai kriteria pencarian.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex-1 min-w-[220px]">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, no HP, atau kode..."
            className="form-input text-xs py-2 px-3"
          />
        </div>

        <div>
          <select
            value={compFilter}
            onChange={(e) => setCompFilter(e.target.value)}
            className="form-input form-select text-xs py-2 px-3"
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
            className="form-input form-select text-xs py-2 px-3"
          >
            <option value="all">Semua Status Presensi</option>
            <option value="checked_in">Hadir di Braga</option>
            <option value="not_checked_in">Belum Check-In</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="admin-card overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="overflow-x-auto w-full">
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
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    Memuat data peserta...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    Tidak ditemukan peserta dengan kata kunci tersebut.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block">
                        {p.registration_code}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{p.full_name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{p.email}</div>
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
                    <td className="font-mono text-xs text-slate-600 font-medium">{p.phone}</td>
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
                            <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Hadir</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Belum Hadir</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedParticipant(p)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {selectedParticipant.registration_code}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                  {selectedParticipant.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium block">Email:</span>
                  <span className="font-bold text-slate-900 break-all">
                    {selectedParticipant.email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Telepon / WA:</span>
                  <span className="font-bold text-slate-900">
                    {selectedParticipant.phone}
                  </span>
                </div>
              </div>

              {/* Competition Specifics */}
              {selectedParticipant.competition_id === 'desain-kemasan' ? (
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-orange-700 uppercase tracking-wider text-[11px]">
                    Data Produk & Desain Kemasan:
                  </div>
                  <div>
                    <span className="text-slate-500">Nama Merek (Brand):</span>{' '}
                    <span className="text-slate-900 font-bold">
                      {selectedParticipant.brand_name || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Nama Produk:</span>{' '}
                    <span className="text-slate-900 font-bold">
                      {selectedParticipant.product_name || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Bahan Dasar Lokal:</span>{' '}
                    <span className="text-slate-800 font-medium">
                      {selectedParticipant.local_ingredients || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Penggunaan AI:</span>{' '}
                    <span className="text-slate-800 font-medium">
                      {selectedParticipant.ai_used
                        ? 'Ya (alat bantu final mockup)'
                        : 'Tidak'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Alamat Domisili:</span>{' '}
                    <span className="text-slate-800 font-medium">
                      {selectedParticipant.address || '-'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-blue-700 uppercase tracking-wider text-[11px]">
                    Data Lomba Video 1 Menit:
                  </div>
                  <div>
                    <span className="text-slate-500">Kategori:</span>{' '}
                    <span className="text-slate-900 font-bold">
                      {selectedParticipant.video_category || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Instagram:</span>{' '}
                    <span className="text-slate-900 font-bold">
                      @{selectedParticipant.instagram_handle || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">TikTok:</span>{' '}
                    <span className="text-slate-900 font-bold">
                      @{selectedParticipant.tiktok_handle || '-'}
                    </span>
                  </div>
                  {selectedParticipant.video_url && (
                    <div>
                      <span className="text-slate-500">Tautan Video:</span>{' '}
                      <a
                        href={selectedParticipant.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Buka Video ↗
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Status Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block">Presensi Braga:</span>
                  <span className="font-bold text-slate-900">
                    {selectedParticipant.check_in_status === 'checked_in'
                      ? 'Sudah Check-In'
                      : 'Belum Hadir'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleCheckIn(selectedParticipant)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-xs cursor-pointer transition-all"
                >
                  Ubah Presensi
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
