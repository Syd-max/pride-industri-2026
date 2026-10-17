'use client';

import { useState, useEffect } from 'react';
import type { PrideRegistration, RegistrationStatus } from '@/types';

// Helper to highlight matching search text (Apple clean styling)
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
            className="bg-neutral-200 text-neutral-900 px-1 py-0.5 rounded font-medium"
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

interface FileAttachmentItemProps {
  label: string;
  fileName: string | undefined | null;
  registrationCode: string;
  onDownload: () => void;
  isDownloading: boolean;
}

function FileAttachmentItem({
  label,
  fileName,
  registrationCode,
  onDownload,
  isDownloading,
}: FileAttachmentItemProps) {
  const cleanName = fileName?.trim();

  if (!cleanName) {
    return (
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-neutral-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="min-w-0">
          <div className="font-medium text-neutral-800 text-xs">{label}</div>
          <div className="text-[11px] text-neutral-400 mt-0.5 italic">
            Tidak ada file yang diunggah
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium text-neutral-400 bg-neutral-100 border border-neutral-200/50 shrink-0">
          Belum Diunggah
        </span>
      </div>
    );
  }

  const ext = cleanName.includes('.')
    ? cleanName.split('.').pop()?.toUpperCase() || 'FILE'
    : 'FILE';

  const isImage = ['PNG', 'JPG', 'JPEG', 'WEBP', 'SVG'].includes(ext);

  // Format badge styling
  let badgeStyle = 'bg-neutral-100 text-neutral-600 border-neutral-200/60';
  if (ext === 'PDF') {
    badgeStyle = 'bg-red-50 text-red-700 border-red-200/70';
  } else if (isImage) {
    badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200/70';
  } else if (['AI', 'PSD', 'CDR'].includes(ext)) {
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200/70';
  } else if (['ZIP', 'RAR', '7Z'].includes(ext)) {
    badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200/70';
  }

  const previewUrl = `/api/download?code=${encodeURIComponent(
    registrationCode
  )}&file=${encodeURIComponent(cleanName)}&inline=true`;

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-neutral-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2.5 min-w-0">
        {isImage ? (
          <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-neutral-200/80 bg-neutral-100 shrink-0 group">
            <img
              src={previewUrl}
              alt={cleanName}
              className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
              onClick={() => window.open(previewUrl, '_blank')}
              title="Klik untuk membuka gambar ukuran penuh"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200/70 flex items-center justify-center shrink-0 text-neutral-600">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-neutral-900 text-xs truncate">
              {label}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${badgeStyle} shrink-0`}
            >
              {ext}
            </span>
          </div>
          <div
            className="text-[11px] font-mono text-neutral-500 truncate mt-0.5"
            title={cleanName}
          >
            {cleanName}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isDownloading}
        onClick={onDownload}
        className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 active:bg-neutral-200 disabled:opacity-50 border border-neutral-200/70 transition-colors shrink-0 cursor-pointer inline-flex items-center gap-1.5"
      >
        {isDownloading ? (
          <>
            <span className="w-3 h-3 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />
            <span>Mengunduh...</span>
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5 text-neutral-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Unduh {ext}</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState<'all' | 'desain-kemasan' | 'video-lokal'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [selectedReg, setSelectedReg] = useState<PrideRegistration | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<PrideRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch registration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keyboard accessibility: Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReg(null);
        setRecordToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Safe Deletion Action
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
        setDeleteError(json.error || 'Gagal menghapus pendaftaran.');
        setIsDeleting(false);
        return;
      }

      // Successfully removed
      setRegistrations((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      if (selectedReg?.id === recordToDelete.id) {
        setSelectedReg(null);
      }
      setRecordToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError('Terjadi kesalahan jaringan saat menghapus pendaftaran.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Download Original Attachment from Storage
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const handleDownloadAttachment = async (
    fileName: string | undefined | null,
    fileLabel: string,
    reg: PrideRegistration
  ) => {
    const targetName = fileName?.trim();
    if (!targetName) {
      alert(`Tidak ada berkas yang diunggah untuk ${fileLabel}.`);
      return;
    }

    const fileKey = `${reg.id}-${fileLabel}`;
    try {
      setDownloadingFile(fileKey);

      // Fetch real binary file uploaded by participant from /api/download
      const downloadUrl = `/api/download?code=${encodeURIComponent(
        reg.registration_code
      )}&file=${encodeURIComponent(targetName)}`;

      const res = await fetch(downloadUrl);
      if (!res.ok) {
        let errorMsg = `Berkas asli "${targetName}" tidak ditemukan di server.`;
        try {
          const json = await res.json();
          if (json.error) errorMsg = json.error;
        } catch {}
        alert(
          `${errorMsg}\n\nCatatan: Berkas fisik tidak ditemukan pada server penyimpanan. Pendaftaran ini kemungkinan dibuat sebelum fitur upload berkas diaktifkan.`
        );
        return;
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = targetName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Gagal mengunduh berkas fisik:', err);
      alert('Terjadi kesalahan jaringan saat mengunduh berkas fisik.');
    } finally {
      setDownloadingFile(null);
    }
  };

  // Filtered registrations (Competition participants only)
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

    const matchComp =
      compFilter === 'all'
        ? r.competition_id !== 'pengunjung-umum'
        : r.competition_id === compFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchSearch && matchComp && matchStatus;
  });

  // Export to spreadsheet
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
      'Kategori Video',
      'Status Verifikasi',
      'Presensi Gate',
    ];

    const rows = filtered.map((r, idx) => [
      idx + 1,
      r.registration_code,
      new Date(r.created_at).toLocaleString('id-ID'),
      r.competition_id === 'desain-kemasan' ? 'Desain Kemasan' : 'Video 1 Menit',
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      r.email,
      `'${r.phone}`,
      `"${(r.address || '-').replace(/"/g, '""')}"`,
      `"${(r.product_name || '-').replace(/"/g, '""')}"`,
      `"${(r.brand_name || '-').replace(/"/g, '""')}"`,
      `"${(r.local_ingredients || '-').replace(/"/g, '""')}"`,
      r.video_category || '-',
      r.status,
      r.check_in_status === 'checked_in' ? 'Hadir di Gate' : 'Belum Hadir',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `PRIDE_2026_Data_Pendaftar_Lomba_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* ─── Top Header (Apple Minimal Style) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-neutral-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
            Data Daftar Lomba
          </h1>
          <p className="text-xs sm:text-sm font-normal text-neutral-500 mt-1">
            Data pendaftar kompetisi Desain Kemasan IKM dan Video 1 Menit PRIDE Industri 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportToSpreadsheet}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-700 bg-white border border-neutral-200/80 hover:bg-neutral-50 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <line x1="10" y1="9" x2="10" y2="9.01" />
            </svg>
            <span>Ekspor Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* ─── Search & Dropdown Filter Toolbar (Apple Toolbar Style) ─── */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-wrap items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="flex-1 min-w-[240px]">
          <div className="relative flex items-center">
            <svg className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama peserta, email, HP, kode pendaftaran, atau brand..."
              className="w-full text-xs py-2 rounded-xl bg-neutral-100/70 focus:bg-white border border-neutral-200/80 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 transition-all"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.25rem' }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded cursor-pointer transition-colors"
                title="Hapus pencarian"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Competition Category Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={compFilter}
            onChange={(e) =>
              setCompFilter(e.target.value as 'all' | 'desain-kemasan' | 'video-lokal')
            }
            className="w-full sm:w-auto text-xs py-2 px-3.5 rounded-xl bg-neutral-100/70 border border-neutral-200/80 text-neutral-700 font-medium focus:bg-white focus:outline-none focus:border-[#0071e3] transition-all cursor-pointer"
          >
            <option value="all">Semua Kategori Lomba</option>
            <option value="desain-kemasan">Lomba Desain Kemasan</option>
            <option value="video-lokal">Lomba Video 1 Menit</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto text-xs py-2 px-3.5 rounded-xl bg-neutral-100/70 border border-neutral-200/80 text-neutral-700 font-medium focus:bg-white focus:outline-none focus:border-[#0071e3] transition-all cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="confirmed">Terkonfirmasi</option>
            <option value="finalist">Lolos Finalis</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="disqualified">Didiskualifikasi</option>
          </select>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE VIEW: VERTICAL CARD LIST (NO HORIZONTAL SWIPING)
          ════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200/80 text-xs text-neutral-400">
            Memuat data pendaftar lomba...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200/80 text-xs text-neutral-400">
            Tidak ditemukan pendaftar yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3"
            >
              {/* Header: Name & Code */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-neutral-900 text-sm truncate">
                    {highlightMatch(r.full_name, search)}
                  </div>
                  <div className="font-mono text-[11px] text-neutral-500 font-medium mt-0.5">
                    {highlightMatch(r.registration_code, search)}
                  </div>
                </div>

                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 bg-neutral-100 text-neutral-700 border border-neutral-200/70">
                  {r.status === 'confirmed' && 'Terkonfirmasi'}
                  {r.status === 'finalist' && 'Finalis'}
                  {r.status === 'pending' && 'Menunggu'}
                  {r.status === 'disqualified' && 'Diskualifikasi'}
                </span>
              </div>

              {/* Sub-info: Category & Date */}
              <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/70">
                  {r.competition_id === 'desain-kemasan'
                    ? 'Desain Kemasan'
                    : 'Video 1 Menit'}
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {new Date(r.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              {/* Action Buttons: Detail & Delete */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedReg(r)}
                  className="w-full py-1.5 px-3 rounded-xl text-xs font-medium text-neutral-700 bg-neutral-100/80 hover:bg-neutral-200/80 border border-neutral-200/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Detail</span>
                  <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRecordToDelete(r);
                    setDeleteError(null);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl text-xs font-medium text-rose-600 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP VIEW: CLEAN APPLE-STYLE TABLE (HIDDEN ON MOBILE)
          ════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block overflow-hidden bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-200/80 text-neutral-500 font-medium text-[11px]">
                <th className="py-3 px-5 min-w-[190px]">Kode &amp; Tanggal</th>
                <th className="py-3 px-5 min-w-[220px]">Nama Peserta &amp; Kontak</th>
                <th className="py-3 px-5 min-w-[150px]">Kategori Lomba</th>
                <th className="py-3 px-5 min-w-[170px]">Status Verifikasi</th>
                <th className="py-3 px-5 min-w-[170px] text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-normal text-neutral-400">
                    Memuat data pendaftar lomba...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-xs font-normal text-neutral-400">
                    Tidak ditemukan pendaftar yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Column 1: Kode & Tanggal */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="font-mono text-xs font-medium text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/60 inline-block">
                        {highlightMatch(r.registration_code, search)}
                      </span>
                      <div className="text-[10px] text-neutral-400 font-normal mt-1">
                        {new Date(r.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Column 2: Nama & Kontak */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="font-medium text-neutral-900 text-sm">
                        {highlightMatch(r.full_name, search)}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-normal mt-0.5">
                        {highlightMatch(r.email, search)}
                      </div>
                    </td>

                    {/* Column 3: Kategori */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/70">
                        {r.competition_id === 'desain-kemasan'
                          ? 'Desain Kemasan'
                          : 'Video 1 Menit'}
                      </span>
                      {r.video_category && (
                        <div className="text-[10px] text-neutral-500 font-medium mt-1">
                          {r.video_category}
                        </div>
                      )}
                    </td>

                    {/* Column 4: Status Verifikasi */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleUpdateStatus(r.id, e.target.value as RegistrationStatus)
                        }
                        className="text-xs py-1 px-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50/70 text-neutral-800 font-medium cursor-pointer transition-colors focus:outline-none focus:border-[#0071e3]"
                      >
                        <option value="confirmed">Terkonfirmasi</option>
                        <option value="finalist">Lolos Finalis</option>
                        <option value="pending">Menunggu</option>
                        <option value="disqualified">Didiskualifikasi</option>
                      </select>
                    </td>

                    {/* Column 5: Aksi (Detail & Hapus) */}
                    <td className="py-3.5 px-5 text-right pr-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReg(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100/80 hover:bg-neutral-200/80 border border-neutral-200/70 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Detail</span>
                          <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRecordToDelete(r);
                            setDeleteError(null);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/60 transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Hapus pendaftaran"
                        >
                          <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>Hapus</span>
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

      {/* ════════════════════════════════════════════════════════════════
          DETAIL POPUP / MODAL (FULL RECORD MATCHING PUBLIC FORM)
          ════════════════════════════════════════════════════════════════ */}
      {selectedReg && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in-50 duration-200"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                    {selectedReg.registration_code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      selectedReg.competition_id === 'desain-kemasan'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {selectedReg.competition_id === 'desain-kemasan'
                      ? 'Lomba Desain Kemasan IKM'
                      : 'Lomba Video 1 Menit'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                  {selectedReg.full_name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Terdaftar pada: {new Date(selectedReg.created_at).toLocaleString('id-ID')} WIB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors shrink-0"
                aria-label="Tutup jendela detail"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ─── Detail Form: Desain Kemasan ─── */}
            {selectedReg.competition_id === 'desain-kemasan' && (
              <div className="space-y-4 text-xs">
                {/* 1. Data Diri */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    1. Data Diri Peserta
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Nama Lengkap:</span>
                      <span className="font-medium text-neutral-900">{selectedReg.full_name}</span>
                    </div>
                    <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Alamat Lengkap:</span>
                      <span className="font-medium text-neutral-900 text-right max-w-[280px]">
                        {selectedReg.address || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Nomor HP / WhatsApp:</span>
                      <a
                        href={`https://wa.me/62${selectedReg.phone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium text-[#0071e3] hover:underline inline-flex items-center gap-1"
                      >
                        <span>{selectedReg.phone}</span>
                        <svg className="w-3 h-3 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-normal">Alamat Email:</span>
                      <span className="font-mono font-medium text-neutral-900">{selectedReg.email}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Informasi Produk dan Desain */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    2. Informasi Produk dan Desain
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Nama Merek Produk:</span>
                      <span className="font-medium text-neutral-900">{selectedReg.brand_name || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Nama Produk Kuliner:</span>
                      <span className="font-medium text-neutral-900">{selectedReg.product_name || '-'}</span>
                    </div>
                    <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Bahan Dasar Lokal:</span>
                      <span className="font-medium text-neutral-900 text-right max-w-[280px]">
                        {selectedReg.local_ingredients || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start pt-1">
                      <span className="text-neutral-500 font-normal">Deskripsi Konsep Desain:</span>
                      <span className="font-normal text-neutral-800 text-right max-w-[280px]">
                        {selectedReg.design_concept || selectedReg.video_description || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Berkas & Dokumen Terlampir */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    3. Berkas Karya &amp; Dokumen Pendukung
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
                    <FileAttachmentItem
                      label="File Karya Desain Kemasan"
                      fileName={selectedReg.design_file_name || selectedReg.packaging_file_name}
                      registrationCode={selectedReg.registration_code}
                      onDownload={() =>
                        handleDownloadAttachment(
                          selectedReg.design_file_name || selectedReg.packaging_file_name,
                          'File Karya Desain Kemasan',
                          selectedReg
                        )
                      }
                      isDownloading={downloadingFile === `${selectedReg.id}-File Karya Desain Kemasan`}
                    />

                    <FileAttachmentItem
                      label="Master File Desain"
                      fileName={selectedReg.master_file_name}
                      registrationCode={selectedReg.registration_code}
                      onDownload={() =>
                        handleDownloadAttachment(
                          selectedReg.master_file_name,
                          'Master File Desain',
                          selectedReg
                        )
                      }
                      isDownloading={downloadingFile === `${selectedReg.id}-Master File Desain`}
                    />

                    <FileAttachmentItem
                      label="Pakta Integritas Bertanda Tangan"
                      fileName={selectedReg.pakta_integritas_file_name}
                      registrationCode={selectedReg.registration_code}
                      onDownload={() =>
                        handleDownloadAttachment(
                          selectedReg.pakta_integritas_file_name,
                          'Pakta Integritas',
                          selectedReg
                        )
                      }
                      isDownloading={downloadingFile === `${selectedReg.id}-Pakta Integritas`}
                    />

                    <FileAttachmentItem
                      label="Surat Pernyataan Persetujuan"
                      fileName={selectedReg.surat_persetujuan_file_name}
                      registrationCode={selectedReg.registration_code}
                      onDownload={() =>
                        handleDownloadAttachment(
                          selectedReg.surat_persetujuan_file_name,
                          'Surat Pernyataan Persetujuan',
                          selectedReg
                        )
                      }
                      isDownloading={downloadingFile === `${selectedReg.id}-Surat Pernyataan Persetujuan`}
                    />
                  </div>
                </div>

                {/* 4. Persetujuan & Deklarasi */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    4. Persetujuan &amp; Komitmen Peserta
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2 text-neutral-700">
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Karya merupakan karya asli dan tidak melanggar hak cipta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Karya belum pernah dipublikasikan / diikutkan lomba lain</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Menyetujui seluruh syarat &amp; ketentuan PRIDE Industri 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Menyetujui penggunaan karya untuk publikasi nonkomersial</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Detail Form: Video 1 Menit ─── */}
            {selectedReg.competition_id === 'video-lokal' && (
              <div className="space-y-4 text-xs">
                {/* 1. Data Diri */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    1. Data Diri Peserta
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Nama Lengkap:</span>
                      <span className="font-medium text-neutral-900">{selectedReg.full_name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Instansi / Asal:</span>
                      <span className="font-medium text-neutral-900">{selectedReg.institution || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Nomor WhatsApp:</span>
                      <a
                        href={`https://wa.me/62${selectedReg.phone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium text-[#0071e3] hover:underline inline-flex items-center gap-1"
                      >
                        <span>{selectedReg.phone}</span>
                        <svg className="w-3 h-3 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 font-normal">Alamat Email:</span>
                      <span className="font-mono font-medium text-neutral-900">{selectedReg.email}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Informasi Karya Video */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    2. Informasi Karya Video
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Sub-sektor IKM:</span>
                      <span className="font-medium text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[11px] border border-neutral-200/60">
                        {selectedReg.video_category || 'PRIDE 2026'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Judul Karya Video:</span>
                      <span className="font-medium text-neutral-900 text-right max-w-[280px]">
                        {selectedReg.video_title ? `“${selectedReg.video_title}”` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start pb-2 border-b border-neutral-200/60">
                      <span className="text-neutral-500 font-normal">Deskripsi Singkat:</span>
                      <span className="font-normal text-neutral-800 text-right max-w-[280px]">
                        {selectedReg.video_description || '-'}
                      </span>
                    </div>
                    {selectedReg.video_url && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-neutral-500 font-normal">Link Video Karya:</span>
                        <a
                          href={selectedReg.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#0071e3] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Buka Video Karya</span>
                          <svg className="w-3 h-3 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Berkas & Barcode TactLink */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    3. Berkas Dokumen &amp; QR TactLink
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
                    <FileAttachmentItem
                      label="Dokumen Persyaratan Lomba"
                      fileName={selectedReg.document_file_name || selectedReg.pakta_integritas_file_name}
                      registrationCode={selectedReg.registration_code}
                      onDownload={() =>
                        handleDownloadAttachment(
                          selectedReg.document_file_name || selectedReg.pakta_integritas_file_name,
                          'Dokumen Persyaratan Lomba',
                          selectedReg
                        )
                      }
                      isDownloading={downloadingFile === `${selectedReg.id}-Dokumen Persyaratan Lomba`}
                    />

                    <FileAttachmentItem
                      label="Foto Barcode QR TactLink"
                      fileName={selectedReg.tactlink_qr_name || selectedReg.surat_persetujuan_file_name}
                      registrationCode={selectedReg.registration_code}
                      onDownload={() =>
                        handleDownloadAttachment(
                          selectedReg.tactlink_qr_name || selectedReg.surat_persetujuan_file_name,
                          'Foto Barcode QR TactLink',
                          selectedReg
                        )
                      }
                      isDownloading={downloadingFile === `${selectedReg.id}-Foto Barcode QR TactLink`}
                    />
                  </div>
                </div>

                {/* 4. Persetujuan */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700 tracking-tight">
                    4. Persetujuan Peserta
                  </h4>
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2 text-neutral-700">
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Karya merupakan karya asli dan tidak melanggar hak pihak lain</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Menyetujui seluruh syarat &amp; ketentuan lomba video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Menyetujui hak tayang &amp; publikasi video nonkomersial</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Verifikasi Selector */}
            <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 font-medium">Status Verifikasi:</span>
                <select
                  value={selectedReg.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedReg.id, e.target.value as RegistrationStatus)
                  }
                  className="text-xs py-1.5 px-3 bg-white border border-neutral-200/80 rounded-xl font-medium text-neutral-800 focus:outline-none focus:border-[#0071e3] cursor-pointer"
                >
                  <option value="confirmed">Terkonfirmasi (Lengkap)</option>
                  <option value="finalist">Lolos Finalis Lomba</option>
                  <option value="pending">Menunggu Verifikasi</option>
                  <option value="disqualified">Didiskualifikasi</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                <span className="text-neutral-500 font-normal">Status Kehadiran Gate:</span>
                <span className="px-2.5 py-0.5 rounded-full font-medium text-xs bg-neutral-100 text-neutral-700 border border-neutral-200/60 inline-flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedReg.check_in_status === 'checked_in' ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
                  {selectedReg.check_in_status === 'checked_in'
                    ? 'Hadir di Lokasi'
                    : 'Belum Hadir'}
                </span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRecordToDelete(selectedReg);
                  setDeleteError(null);
                }}
                className="py-2 px-3.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/60 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Hapus Pendaftaran</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 transition-colors cursor-pointer text-center"
              >
                Tutup
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
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-200"
          onClick={() => !isDeleting && setRecordToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl border border-neutral-200/80 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#1d1d1f]">
                  Hapus Pendaftaran Lomba?
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data pendaftaran{' '}
                  <strong className="text-neutral-800 font-medium">{recordToDelete.full_name}</strong> (
                  <span className="font-mono text-neutral-700">{recordToDelete.registration_code}</span>)?
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {deleteError}
              </div>
            )}

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-[11px] text-neutral-500">
              Tindakan ini permanen dan akan menghapus berkas serta data peserta dari database.
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Pendaftaran'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
