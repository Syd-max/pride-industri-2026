'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { PrideRegistration } from '@/types';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<PrideRegistration | null>(null);
  const [showGateQrModal, setShowGateQrModal] = useState(false);

  // Helper for real-time yellow text highlighting on search match
  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const cleanQuery = query.trim();
    if (!cleanQuery) return text;
    const regex = new RegExp(`(${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-300 text-amber-950 font-extrabold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

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
    // Live polling every 12 seconds so admin sees scans in real time
    const interval = setInterval(fetchData, 12000);
    return () => clearInterval(interval);
  }, []);

  // In Data Presensi: ONLY participants who have scanned QR Code at the gate (check_in_status === 'checked_in')
  const checkedInList = participants.filter((p) => p.check_in_status === 'checked_in');

  const filtered = checkedInList.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchQuery =
      !q ||
      p.full_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.registration_code.toLowerCase().includes(q) ||
      p.phone.includes(q);

    const matchComp =
      compFilter === 'all' || p.competition_id === compFilter;

    return matchQuery && matchComp;
  });

  // Toggle Check-in status manually (Admin Manage Presensi)
  const handleToggleCheckIn = async (p: PrideRegistration) => {
    const nextStatus =
      p.check_in_status === 'checked_in' ? 'not_checked_in' : 'checked_in';
    const confirmMsg =
      nextStatus === 'checked_in'
        ? `Tandai "${p.full_name}" sebagai HADIR di Braga City Walk secara manual?`
        : `Batalkan status presensi hadir untuk "${p.full_name}"? Peserta akan dihapus dari Data Presensi.`;

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
      'Status Presensi Gate',
      'Waktu Scan Gate',
      'Tanggal Daftar',
    ];

    const rows = filtered.map((p) => [
      p.registration_code,
      `"${p.full_name.replace(/"/g, '""')}"`,
      p.email,
      `'${p.phone}`,
      p.competition_id,
      'Sudah Scan QR Gate',
      p.checked_in_at ? new Date(p.checked_in_at).toLocaleString('id-ID') : 'Terverifikasi',
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
      `PRIDE_2026_Data_Presensi_Gate_Braga_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://pride-industri-2026.vercel.app';
  const gateCheckInUrl = `${currentHost}/check-in?gate=braga-city-walk&scanned=true`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    gateCheckInUrl
  )}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Top Header & Primary Actions ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Data Presensi
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Data kehadiran resmi seluruh peserta yang telah berhasil melakukan scan barcode / QR Code di gate event Braga City Walk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Button to open official Gate Barcode modal for visitors & participants to scan */}
          <button
            type="button"
            onClick={() => setShowGateQrModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="6" height="6" x="3" y="3" rx="1" />
              <rect width="6" height="6" x="15" y="3" rx="1" />
              <rect width="6" height="6" x="3" y="15" rx="1" />
              <path d="M15 15h2v2h-2z" />
              <path d="M21 15v6h-6" />
              <path d="M21 21h-2v-2" />
            </svg>
            <span>Buka Barcode Gate Scan</span>
          </button>

          <button
            type="button"
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

      {/* ─── Sticky Locked Search & Filter Toolbar ─── */}
      <div className="sticky top-16 sm:top-20 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center gap-3 text-xs mb-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[260px]">
          <div className="relative flex items-center">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama peserta, email, nomor HP, atau kode..."
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

        {/* Competition Filter Dropdown Only (2 Lomba + Pengunjung) */}
        <div className="w-full sm:w-auto">
          <select
            value={compFilter}
            onChange={(e) => setCompFilter(e.target.value)}
            className="form-input form-select text-xs py-2.5 px-3.5 w-full sm:w-auto rounded-xl bg-slate-50/70 font-semibold text-slate-700 border-slate-200"
          >
            <option value="all">Semua Kategori (Peserta & Pengunjung)</option>
            <option value="desain-kemasan">Lomba Desain Kemasan</option>
            <option value="video-lokal">Lomba Video 1 Menit</option>
            <option value="pengunjung-umum">Pengunjung Festival (Umum)</option>
          </select>
        </div>

        {/* Counter Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-[11px] font-bold text-emerald-800 whitespace-nowrap ml-auto">
          <span>Menampilkan:</span>
          <span className="text-emerald-700 font-extrabold">{filtered.length}</span>
          <span>dari {checkedInList.length} Kehadiran (Sudah Scan QR Gate)</span>
        </div>
      </div>

      {/* ─── DIRECTORY TABLE (Clean, Spacious, Sticky Header, Scrollable Data) ─── */}
      <div className="overflow-hidden bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-270px)] w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
              <tr className="text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5 min-w-[220px] whitespace-nowrap bg-slate-50">Kode Registrasi</th>
                <th className="py-3.5 px-5 min-w-[240px] whitespace-nowrap bg-slate-50">Nama &amp; Identitas</th>
                <th className="py-3.5 px-5 min-w-[150px] whitespace-nowrap bg-slate-50">Kategori</th>
                <th className="py-3.5 px-5 min-w-[150px] whitespace-nowrap bg-slate-50">Kontak WhatsApp</th>
                <th className="py-3.5 px-5 min-w-[200px] whitespace-nowrap bg-slate-50">Status Presensi Gate</th>
                <th className="py-3.5 px-5 min-w-[110px] whitespace-nowrap bg-slate-50 text-right pr-6">Aksi Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    Memuat data presensi peserta...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    {search || compFilter !== 'all'
                      ? 'Tidak ditemukan data presensi yang sesuai dengan kriteria filter / pencarian.'
                      : 'Belum ada data presensi. Peserta dan pengunjung akan otomatis muncul di sini setelah melakukan presensi QR code di Gate Event.'}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Column 1: Kode Registrasi */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/90 inline-flex items-center gap-1.5 whitespace-nowrap">
                          {highlightMatch(p.registration_code, search)}
                        </span>
                      </td>

                      {/* Column 2: Nama & Identitas */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 text-sm whitespace-nowrap">
                          {highlightMatch(p.full_name, search)}
                        </div>
                        {p.competition_id !== 'pengunjung-umum' && p.email && (
                          <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                            {highlightMatch(p.email, search)}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Kategori */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                            p.competition_id === 'desain-kemasan'
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : p.competition_id === 'video-lokal'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {p.competition_id === 'desain-kemasan'
                            ? 'Desain Kemasan'
                            : p.competition_id === 'video-lokal'
                            ? 'Video 1 Menit'
                            : 'Pengunjung Festival'}
                        </span>
                      </td>

                      {/* Column 4: Kontak WhatsApp */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {p.competition_id === 'pengunjung-umum' ? (
                          <span className="text-slate-400 font-mono text-xs pl-2">-</span>
                        ) : (
                          <a
                            href={`https://wa.me/62${p.phone.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-slate-700 hover:text-emerald-600 font-semibold inline-flex items-center gap-1.5 transition-colors"
                            title="Hubungi via WhatsApp"
                          >
                            <span>{highlightMatch(p.phone, search)}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">↗</span>
                          </a>
                        )}
                      </td>

                      {/* Column 5: Status Presensi (Semua di sini sudah scan QR) */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleCheckIn(p)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border whitespace-nowrap bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-2xs"
                          title="Klik jika ingin membatalkan status presensi hadir"
                        >
                          <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Sudah Scan QR Gate</span>
                        </button>
                      </td>

                      {/* Column 6: Aksi Detail */}
                      <td className="py-3.5 px-5 text-right pr-6 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedParticipant(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>Detail</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL BARCODE GATE UNTUK DISCAN PENGUNJUNG & PESERTA ─── */}
      {showGateQrModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-200"
          onClick={() => setShowGateQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">
                  Gate Masuk Utama Braga
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Barcode Presensi Festival
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGateQrModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* QR Barcode Image */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block mx-auto shadow-inner">
              <div className="relative w-56 h-56 mx-auto bg-white p-2 rounded-xl">
                <Image
                  src={qrCodeImageUrl}
                  alt="QR Code Presensi Gate PRIDE 2026"
                  fill
                  sizes="224px"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-2 font-bold break-all">
                {gateCheckInUrl}
              </p>
            </div>

            {/* Instruction Explanation */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-left text-xs text-blue-900 space-y-1.5">
              <div className="font-extrabold flex items-center gap-1.5">
                <span>ℹ</span>
                <span>Alur Saat Barcode Discan Pengunjung:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800 leading-relaxed">
                <li>Pengunjung memindai barcode ini menggunakan kamera HP bawaan.</li>
                <li>
                  Muncul 2 pilihan terarah: <strong>Visitor Umum</strong> (1-klik masuk langsung) atau <strong>Visitor Peserta Lomba</strong> (masukkan kode registrasi).
                </li>
                <li>Peserta yang check-in otomatis tercatat <strong>Hadir di Lokasi</strong> di tabel direktori ini.</li>
              </ol>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={gateCheckInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 text-center transition-colors"
              >
                Buka Layar Gate di Tab Baru ↗
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cetak Barcode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Participant Detail Drawer Modal ─── */}
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
                <span className="text-slate-500 font-medium">Status Presensi:</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    selectedParticipant.check_in_status === 'checked_in'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedParticipant.check_in_status === 'checked_in' ? (
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3 h-3 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>Hadir di Braga</span>
                      </span>
                    ) : (
                      'Belum Hadir'
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleCheckIn(selectedParticipant)}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    (Ubah)
                  </button>
                </div>
              </div>

              {selectedParticipant.checked_in_at && (
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex justify-between items-center text-emerald-900">
                  <span className="font-medium">Waktu Presensi Gate:</span>
                  <span className="font-mono font-bold">
                    {new Date(selectedParticipant.checked_in_at).toLocaleString('id-ID')} WIB
                  </span>
                </div>
              )}

              {selectedParticipant.competition_id === 'pengunjung-umum' ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Tipe Presensi:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Pengunjung Umum Festival
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Nama Pengunjung:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedParticipant.full_name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Asal Domisili / Kota:</span>
                    <span className="font-bold text-slate-800 text-sm">{selectedParticipant.address || selectedParticipant.phone || 'Kota Bandung'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Pintu Masuk Event:</span>
                    <span className="font-semibold text-slate-700">Gate Utama Braga City Walk</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Kategori Lomba:</span>
                    <span className="font-bold text-slate-800">
                      {selectedParticipant.competition_id === 'desain-kemasan'
                        ? 'Desain Kemasan Pangan Lokal'
                        : 'Video Sinematik 1 Menit'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedParticipant.email}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">WhatsApp:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedParticipant.phone}</span>
                  </div>

                  {selectedParticipant.brand_name && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Brand Produk:</span>
                      <span className="font-bold text-slate-800">{selectedParticipant.brand_name}</span>
                    </div>
                  )}

                  {selectedParticipant.video_url && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Link Karya Video:</span>
                      <a
                        href={selectedParticipant.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-600 hover:underline truncate max-w-[200px]"
                      >
                        Buka Link Karya ↗
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedParticipant(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Tutup Jendela Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
