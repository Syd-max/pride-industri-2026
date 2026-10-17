'use client';

import { useState, useEffect } from 'react';
import type { PrideRegistration } from '@/types';

// Helper for real-time text highlight
function highlightMatch(text: string | undefined | null, query: string) {
  if (!text) return '-';
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-amber-300 text-amber-950 px-1 py-0.5 rounded font-extrabold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState('all');

  // Modals
  const [selectedParticipant, setSelectedParticipant] = useState<PrideRegistration | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<PrideRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (json.success) {
        setParticipants(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard accessibility: Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedParticipant(null);
        setRecordToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // In Data Presensi: ONLY attendees who have verified gate check-in
  const checkedInList = participants.filter((p) => p.check_in_status === 'checked_in');

  const filtered = checkedInList.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchQuery =
      !q ||
      p.full_name.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      p.registration_code.toLowerCase().includes(q) ||
      (p.phone && p.phone.includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q));

    const matchComp = compFilter === 'all' || p.competition_id === compFilter;
    return matchQuery && matchComp;
  });

  // Toggle check-in status (cancel check-in)
  const handleCancelCheckIn = async (p: PrideRegistration) => {
    if (!window.confirm(`Batalkan status presensi hadir untuk "${p.full_name}"?`)) return;

    try {
      const res = await fetch('/api/admin/data', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          check_in_status: 'not_checked_in',
        }),
      });

      if (res.ok) {
        setParticipants((prev) =>
          prev.map((item) =>
            item.id === p.id
              ? { ...item, check_in_status: 'not_checked_in', checked_in_at: undefined }
              : item
          )
        );
        setSelectedParticipant(null);
      }
    } catch {
      alert('Gagal membatalkan status presensi.');
    }
  };

  // Safe Delete Action
  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/data?id=${encodeURIComponent(recordToDelete.id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setDeleteError(json.error || 'Gagal menghapus data presensi.');
        setIsDeleting(false);
        return;
      }

      // Successfully deleted from database
      setParticipants((prev) => prev.filter((item) => item.id !== recordToDelete.id));
      if (selectedParticipant?.id === recordToDelete.id) {
        setSelectedParticipant(null);
      }
      setRecordToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError('Terjadi kesalahan jaringan saat menghapus data.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'No',
      'Kode Registrasi / Tiket',
      'Nama Lengkap',
      'Kategori',
      'Kontak / Asal',
      'Waktu Presensi',
      'Status',
    ];

    const rows = filtered.map((p, idx) => [
      idx + 1,
      p.registration_code,
      `"${p.full_name.replace(/"/g, '""')}"`,
      p.competition_id === 'desain-kemasan'
        ? 'Desain Kemasan'
        : p.competition_id === 'video-lokal'
        ? 'Video 1 Menit'
        : 'Pengunjung Umum',
      `"${(p.competition_id === 'pengunjung-umum' ? p.address || p.phone : p.phone || '').replace(/"/g, '""')}"`,
      p.checked_in_at ? new Date(p.checked_in_at).toLocaleString('id-ID') : 'Terverifikasi Gate',
      'Hadir di Braga',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `PRIDE_2026_Data_Presensi_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* ─── Top Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Data Presensi
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Data kehadiran resmi seluruh pengunjung dan peserta lomba yang telah check-in di gate Braga City Walk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
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

      {/* ─── Search & Category Filter Toolbar ─── */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* Real-time Search Input */}
        <div className="flex-1 min-w-[240px]">
          <div className="relative flex items-center">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, kode registrasi, atau nomor HP..."
              className="w-full text-xs py-2.5 rounded-xl bg-slate-50/70 focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              style={{ paddingLeft: '2.6rem', paddingRight: '2.25rem' }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
                title="Hapus pencarian"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={compFilter}
            onChange={(e) => setCompFilter(e.target.value)}
            className="w-full sm:w-auto text-xs py-2.5 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-700 font-bold focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">Semua Kategori ({checkedInList.length})</option>
            <option value="desain-kemasan">Lomba Desain Kemasan</option>
            <option value="video-lokal">Lomba Video 1 Menit</option>
            <option value="pengunjung-umum">Pengunjung Festival (Umum)</option>
          </select>
        </div>

        {/* Counter Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 whitespace-nowrap ml-auto">
          <span>Menampilkan:</span>
          <span className="text-emerald-700 font-extrabold">{filtered.length}</span>
          <span>dari {checkedInList.length} Kehadiran</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE VIEW: VERTICAL CARD LIST (MANDATORY: NO HORIZONTAL SWIPING)
          Tampilan ramping, teks terbaca jelas, tombol Detail & Hapus langsung terlihat
          ════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Memuat data presensi gate...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            {search || compFilter !== 'all'
              ? 'Tidak ditemukan data presensi yang sesuai pencarian.'
              : 'Belum ada data presensi yang tercatat di gate.'}
          </div>
        ) : (
          filtered.map((p) => {
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
              >
                {/* Header: Nama & Kode */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-slate-900 text-sm truncate">
                      {highlightMatch(p.full_name, search)}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 font-semibold mt-0.5">
                      {highlightMatch(p.registration_code, search)}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                      p.competition_id === 'desain-kemasan'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : p.competition_id === 'video-lokal'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {p.competition_id === 'desain-kemasan'
                      ? 'Desain Kemasan'
                      : p.competition_id === 'video-lokal'
                      ? 'Video 1 Menit'
                      : 'Pengunjung'}
                  </span>
                </div>

                {/* Sub-info: Waktu presensi & Status */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Hadir di Gate
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {p.checked_in_at
                      ? `${new Date(p.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
                      : 'Terverifikasi'}
                  </span>
                </div>

                {/* Actions: Detail & Hapus (Directly visible, no swiping!) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedParticipant(p)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Detail</span>
                    <span aria-hidden="true">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecordToDelete(p);
                      setDeleteError(null);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP VIEW: COMPACT, ELEGANT TABLE (HIDDEN ON MOBILE)
          ════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block overflow-hidden bg-white border border-slate-200 shadow-2xs rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5 min-w-[200px]">Kode Registrasi / Tiket</th>
                <th className="py-3.5 px-5 min-w-[220px]">Nama Peserta / Pengunjung</th>
                <th className="py-3.5 px-5 min-w-[150px]">Kategori</th>
                <th className="py-3.5 px-5 min-w-[140px]">Waktu Presensi</th>
                <th className="py-3.5 px-5 min-w-[180px] text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-medium text-slate-400">
                    Memuat data presensi gate...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-medium text-slate-400">
                    {search || compFilter !== 'all'
                      ? 'Tidak ditemukan data presensi yang sesuai kriteria pencarian.'
                      : 'Belum ada data presensi yang tercatat di gate.'}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Column 1: Kode */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {highlightMatch(p.registration_code, search)}
                        </span>
                      </td>

                      {/* Column 2: Nama */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {highlightMatch(p.full_name, search)}
                        </div>
                      </td>

                      {/* Column 3: Kategori */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            p.competition_id === 'desain-kemasan'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : p.competition_id === 'video-lokal'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {p.competition_id === 'desain-kemasan'
                            ? 'Desain Kemasan'
                            : p.competition_id === 'video-lokal'
                            ? 'Video 1 Menit'
                            : 'Pengunjung'}
                        </span>
                      </td>

                      {/* Column 4: Waktu Presensi */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-slate-600">
                          {p.checked_in_at
                            ? `${new Date(p.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
                            : 'Hadir'}
                        </span>
                      </td>

                      {/* Column 5: Aksi (Detail & Hapus) */}
                      <td className="py-3.5 px-5 text-right pr-6 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedParticipant(p)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Detail</span>
                            <span aria-hidden="true">→</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRecordToDelete(p);
                              setDeleteError(null);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Hapus data presensi"
                          >
                            <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DETAIL POPUP / MODAL (FULL RECORD)
          ════════════════════════════════════════════════════════════════ */}
      {selectedParticipant && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-200"
          onClick={() => setSelectedParticipant(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {selectedParticipant.registration_code}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {selectedParticipant.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Tutup popup detail"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Information Grid */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status Kehadiran Gate:</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Hadir di Braga City Walk
                </span>
              </div>

              {selectedParticipant.checked_in_at && (
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex justify-between items-center text-emerald-900">
                  <span className="font-medium">Waktu Presensi:</span>
                  <span className="font-mono font-bold">
                    {new Date(selectedParticipant.checked_in_at).toLocaleString('id-ID')} WIB
                  </span>
                </div>
              )}

              {selectedParticipant.competition_id === 'pengunjung-umum' ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Kategori:</span>
                    <span className="font-bold text-slate-800">Pengunjung Festival (Umum)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Asal Domisili:</span>
                    <span className="font-bold text-slate-800">{selectedParticipant.address || selectedParticipant.phone || 'Kota Bandung'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Pintu Masuk:</span>
                    <span className="font-semibold text-slate-700">Gate Utama Braga City Walk</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Kategori Lomba:</span>
                    <span className="font-bold text-slate-800">
                      {selectedParticipant.competition_id === 'desain-kemasan'
                        ? 'Lomba Desain Kemasan'
                        : 'Lomba Video 1 Menit'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedParticipant.email}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Nomor WhatsApp:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedParticipant.phone}</span>
                  </div>

                  {selectedParticipant.brand_name && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Brand Produk:</span>
                      <span className="font-bold text-slate-800">{selectedParticipant.brand_name}</span>
                    </div>
                  )}

                  {selectedParticipant.video_title && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Judul Karya Video:</span>
                      <span className="font-bold text-slate-800">{selectedParticipant.video_title}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCancelCheckIn(selectedParticipant)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
              >
                Batalkan Hadir
              </button>
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL (SAFE DELETION)
          ════════════════════════════════════════════════════════════════ */}
      {recordToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-200"
          onClick={() => !isDeleting && setRecordToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  Hapus Data Presensi?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data presensi untuk{' '}
                  <strong className="text-slate-800">{recordToDelete.full_name}</strong> (
                  <span className="font-mono text-slate-700">{recordToDelete.registration_code}</span>)?
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {deleteError}
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
              Tindakan ini akan menghapus catatan presensi ini dari database.
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
