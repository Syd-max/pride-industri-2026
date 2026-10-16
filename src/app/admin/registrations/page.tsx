'use client';

import { useState, useEffect } from 'react';
import type { PrideRegistration, RegistrationStatus } from '@/types';

// Helper to highlight matching search text with yellow background
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
          <mark
            key={i}
            className="bg-amber-300 text-amber-950 px-1 py-0.5 rounded font-extrabold"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState<'all' | 'desain-kemasan' | 'video-lokal'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Detail Modal
  const [selectedReg, setSelectedReg] = useState<PrideRegistration | null>(null);

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
        if (selectedReg?.id === id) {
          setSelectedReg((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch {
      alert('Gagal memperbarui status registrasi.');
    }
  };

  // Filtered registrations
  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.registration_code.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      (r.product_name && r.product_name.toLowerCase().includes(q)) ||
      (r.brand_name && r.brand_name.toLowerCase().includes(q)) ||
      (r.video_category && r.video_category.toLowerCase().includes(q));

    const matchComp = compFilter === 'all' || r.competition_id === compFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchSearch && matchComp && matchStatus;
  });

  // Export to clean spreadsheet (CSV UTF-8 with BOM for Excel & Google Sheets)
  const exportToSpreadsheet = () => {
    const headers = [
      'No',
      'Kode Registrasi',
      'Tanggal Daftar',
      'Kategori Lomba',
      'Nama Peserta',
      'Email',
      'Nomor WhatsApp',
      'Alamat Domisili',
      'Nama Produk Kuliner',
      'Nama Brand',
      'Bahan Baku Lokal',
      'Penggunaan AI',
      'Kategori Video',
      'Instagram Handle',
      'TikTok Handle',
      'Link Video Karya',
      'Status Verifikasi',
      'Presensi Gate',
      'Waktu Presensi',
    ];

    const rows = filtered.map((r, idx) => [
      idx + 1,
      r.registration_code,
      new Date(r.created_at).toLocaleString('id-ID'),
      r.competition_id === 'desain-kemasan' ? 'Desain Kemasan' : 'Video 1 Menit',
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      r.email,
      `'${r.phone}`, // Prefix with single quote so Excel keeps leading zero and formats as text
      `"${(r.address || '-').replace(/"/g, '""')}"`,
      `"${(r.product_name || '-').replace(/"/g, '""')}"`,
      `"${(r.brand_name || '-').replace(/"/g, '""')}"`,
      `"${(r.local_ingredients || '-').replace(/"/g, '""')}"`,
      r.ai_used ? 'Ya (AI)' : 'Bukan AI (Manual)',
      r.video_category || '-',
      r.instagram_handle ? `@${r.instagram_handle}` : '-',
      r.tiktok_handle ? `@${r.tiktok_handle}` : '-',
      r.video_url || '-',
      r.status,
      r.check_in_status === 'checked_in' ? 'Hadir' : 'Belum Hadir',
      r.checked_in_at ? new Date(r.checked_in_at).toLocaleString('id-ID') : '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `PRIDE_2026_Verifikasi_Registrasi_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Top Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verifikasi &amp; Manajemen Registrasi
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Validasi berkas formulir peserta, kurasi karya, seleksi finalis, dan ekspor spreadsheet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export to Spreadsheet Button */}
          <button
            type="button"
            onClick={exportToSpreadsheet}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <line x1="10" y1="9" x2="10" y2="9.01" />
            </svg>
            <span>Export to Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* ─── Search & Dropdown Filter Toolbar ─── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* Real-time Search Input with Yellow Highlight */}
        <div className="flex-1 min-w-[260px]">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama peserta, email, HP, kode pendaftaran, atau brand..."
              className="form-input text-xs py-2.5 pl-9 pr-8 w-full rounded-xl bg-white border border-slate-200"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Lomba: HANYA ADA 2 LOMBA (VIDEO SAMA KEMASAN) */}
        <div className="w-full sm:w-auto">
          <select
            value={compFilter}
            onChange={(e) => setCompFilter(e.target.value as 'all' | 'desain-kemasan' | 'video-lokal')}
            className="form-input form-select text-xs py-2.5 px-3.5 w-full sm:w-auto rounded-xl bg-white border border-slate-200 font-bold text-slate-700"
          >
            <option value="all">Semua Kategori (2 Lomba)</option>
            <option value="desain-kemasan">Lomba Desain Kemasan</option>
            <option value="video-lokal">Lomba Video 1 Menit</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input form-select text-xs py-2.5 px-3.5 w-full sm:w-auto rounded-xl bg-white border border-slate-200 font-medium text-slate-700"
          >
            <option value="all">Semua Status Verifikasi</option>
            <option value="confirmed">Terkonfirmasi</option>
            <option value="finalist">Lolos Finalis</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="disqualified">Didiskualifikasi</option>
          </select>
        </div>
      </div>

      {/* Search results notification badge if searching */}
      {search.trim() && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-medium">
            <span>🔍 Hasil pencarian untuk:</span>
            <mark className="bg-amber-300 text-amber-950 px-2 py-0.5 rounded font-extrabold">
              &quot;{search}&quot;
            </mark>
            <span>({filtered.length} peserta ditemukan)</span>
          </div>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* ─── REGISTRATIONS DATA TABLE (Spacious, No Overlapping!) ─── */}
      <div className="admin-card overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5 min-w-[240px]">Kode &amp; Waktu Daftar</th>
                <th className="py-3.5 px-5 min-w-[240px]">Nama &amp; Identitas Peserta</th>
                <th className="py-3.5 px-5 min-w-[160px]">Kategori Lomba</th>
                <th className="py-3.5 px-5 min-w-[160px]">Status Verifikasi</th>
                <th className="py-3.5 px-5 min-w-[240px] text-right pr-6">Ubah Status &amp; Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-medium text-slate-400">
                    Memuat data verifikasi registrasi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-medium text-slate-400">
                    Tidak ditemukan pendaftar yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Column 1: Kode & Waktu */}
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/90 inline-block whitespace-nowrap">
                        {highlightMatch(r.registration_code, search)}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1.5 font-medium whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        · {new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </div>
                    </td>

                    {/* Column 2: Nama Peserta */}
                    <td className="py-3.5 px-5">
                      <div className="font-extrabold text-slate-900 text-sm whitespace-nowrap">
                        {highlightMatch(r.full_name, search)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        {highlightMatch(r.email, search)}
                      </div>
                      {r.brand_name && (
                        <div className="text-[10px] text-orange-600 font-semibold mt-0.5">
                          Brand: {highlightMatch(r.brand_name, search)}
                        </div>
                      )}
                    </td>

                    {/* Column 3: Kategori Lomba */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                          r.competition_id === 'desain-kemasan'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {r.competition_id === 'desain-kemasan'
                          ? 'Desain Kemasan'
                          : 'Video 1 Menit'}
                      </span>
                    </td>

                    {/* Column 4: Status Saat Ini */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                          r.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : r.status === 'finalist'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : r.status === 'disqualified'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          r.status === 'confirmed'
                            ? 'bg-emerald-500'
                            : r.status === 'finalist'
                            ? 'bg-purple-500'
                            : r.status === 'disqualified'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`} />
                        <span>
                          {r.status === 'confirmed' && 'Terkonfirmasi'}
                          {r.status === 'finalist' && 'Lolos Finalis'}
                          {r.status === 'pending' && 'Menunggu Verifikasi'}
                          {r.status === 'disqualified' && 'Didiskualifikasi'}
                          {r.status === 'cancelled' && 'Dibatalkan'}
                        </span>
                      </span>
                    </td>

                    {/* Column 5: Ubah Status & Tombol Lihat Detail */}
                    <td className="py-3.5 px-5 text-right pr-6 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Select Dropdown - Clear, No Truncation */}
                        <select
                          value={r.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              r.id,
                              e.target.value as RegistrationStatus
                            )
                          }
                          className="form-input form-select text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:border-slate-300"
                        >
                          <option value="confirmed">Terkonfirmasi</option>
                          <option value="finalist">Lolos Finalis</option>
                          <option value="pending">Menunggu Verifikasi</option>
                          <option value="disqualified">Didiskualifikasi</option>
                        </select>

                        {/* Button Lihat Detail Registrasi */}
                        <button
                          type="button"
                          onClick={() => setSelectedReg(r)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>Lihat Detail</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL LIHAT DETAIL REGISTRASI PER-PENDAFTAR (SESUAI FORM ASLI) ─── */}
      {selectedReg && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-200"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                    {selectedReg.registration_code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    selectedReg.competition_id === 'desain-kemasan'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {selectedReg.competition_id === 'desain-kemasan'
                      ? 'Lomba Desain Kemasan'
                      : 'Lomba Video 1 Menit'}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedReg.full_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Terdaftar pada: {new Date(selectedReg.created_at).toLocaleString('id-ID')} WIB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Section 1: Data Identitas & Kontak */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Identitas &amp; Kontak Pendaftar
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Nama Lengkap:</span>
                  <span className="font-extrabold text-slate-900">{selectedReg.full_name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReg.email}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Nomor WhatsApp:</span>
                  <a
                    href={`https://wa.me/62${selectedReg.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{selectedReg.phone}</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
                <div className="flex justify-between items-start pt-0.5">
                  <span className="text-slate-500 font-medium">Alamat Domisili:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[280px]">
                    {selectedReg.address || 'Kota Bandung'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Data Formulir Khusus Desain Kemasan */}
            {selectedReg.competition_id === 'desain-kemasan' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  2. Isian Form Desain Kemasan Pangan
                </h4>
                <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-orange-200/60">
                    <span className="text-slate-600 font-medium">Nama Produk Kuliner:</span>
                    <span className="font-bold text-slate-900">{selectedReg.product_name || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-orange-200/60">
                    <span className="text-slate-600 font-medium">Nama Brand / Merek:</span>
                    <span className="font-bold text-slate-900">{selectedReg.brand_name || '-'}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-orange-200/60">
                    <span className="text-slate-600 font-medium">Bahan Baku Lokal:</span>
                    <span className="font-medium text-slate-900 text-right max-w-[260px]">
                      {selectedReg.local_ingredients || 'Olahan Pangan Lokal'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-slate-600 font-medium">Penggunaan Alat AI:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      selectedReg.ai_used
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedReg.ai_used ? 'Ya, Berbantuan AI' : '100% Desain Manual / Non-AI'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Data Formulir Khusus Video 1 Menit */}
            {selectedReg.competition_id === 'video-lokal' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  2. Isian Form Lomba Video 1 Menit (17 Poin Spesifikasi)
                </h4>
                <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
                    <span className="text-slate-600 font-medium">Instansi / Asal Peserta:</span>
                    <span className="font-bold text-slate-900">{selectedReg.institution || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
                    <span className="text-slate-600 font-medium">Kategori Video:</span>
                    <span className="font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded text-[11px]">
                      {selectedReg.video_category || 'PRIDE 2026'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-rose-200/60">
                    <span className="text-slate-600 font-medium">Judul Karya Video:</span>
                    <span className="font-bold text-slate-900 text-right max-w-[260px]">
                      {selectedReg.video_title ? `“${selectedReg.video_title}”` : '-'}
                    </span>
                  </div>
                  {selectedReg.video_description && (
                    <div className="flex justify-between items-start pb-2 border-b border-rose-200/60">
                      <span className="text-slate-600 font-medium">Deskripsi Karya:</span>
                      <span className="text-slate-700 text-right max-w-[260px] italic text-[11px]">
                        {selectedReg.video_description}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
                    <span className="text-slate-600 font-medium">Akun Instagram:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedReg.instagram_handle ? `@${selectedReg.instagram_handle}` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
                    <span className="text-slate-600 font-medium">Akun TikTok:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedReg.tiktok_handle ? `@${selectedReg.tiktok_handle}` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
                    <span className="text-slate-600 font-medium">Tautan Video:</span>
                    {selectedReg.video_url || selectedReg.instagram_video_url || selectedReg.tiktok_video_url ? (
                      <a
                        href={selectedReg.video_url || selectedReg.instagram_video_url || selectedReg.tiktok_video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Buka Video Karya</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Belum disubmit</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
                    <span className="text-slate-600 font-medium">Dokumen Pakta Integritas:</span>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {selectedReg.pakta_integritas_file_name || 'Tervalidasi (Formulir Resmi)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-slate-600 font-medium">Surat Pernyataan Publikasi:</span>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {selectedReg.surat_persetujuan_file_name || 'Tervalidasi (Formulir Resmi)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Keputusan Status Verifikasi Admin */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Keputusan Verifikasi Berkas
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Tetapkan Status:</span>
                  <select
                    value={selectedReg.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedReg.id, e.target.value as RegistrationStatus)
                    }
                    className="form-input form-select text-xs py-2 px-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                  >
                    <option value="confirmed">Terkonfirmasi (Lengkap)</option>
                    <option value="finalist">Lolos Finalis Lomba</option>
                    <option value="pending">Menunggu Verifikasi</option>
                    <option value="disqualified">Didiskualifikasi</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Status Presensi Gate Braga:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold ${
                    selectedReg.check_in_status === 'checked_in'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedReg.check_in_status === 'checked_in'
                      ? `✓ Hadir (${new Date(selectedReg.checked_in_at || '').toLocaleTimeString('id-ID')} WIB)`
                      : 'Belum Hadir di Lokasi'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup Detail Registrasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
