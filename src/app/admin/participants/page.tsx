'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { PrideRegistration } from '@/types';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<PrideRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState('all');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<PrideRegistration | null>(null);
  const [showGateQrModal, setShowGateQrModal] = useState(false);

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

  // Calculate live stats
  const totalCount = participants.length;
  const checkedInCount = participants.filter((p) => p.check_in_status === 'checked_in').length;
  const notCheckedInCount = totalCount - checkedInCount;
  const attendanceRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  // Toggle Check-in status manually (Admin Manage Presensi)
  const handleToggleCheckIn = async (p: PrideRegistration) => {
    const nextStatus =
      p.check_in_status === 'checked_in' ? 'not_checked_in' : 'checked_in';
    const confirmMsg =
      nextStatus === 'checked_in'
        ? `Tandai "${p.full_name}" sebagai HADIR di Braga City Walk secara manual?`
        : `Batalkan status presensi hadir untuk "${p.full_name}"?`;

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
      `PRIDE_2026_Presensi_Peserta_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://pride-industri-2026.vercel.app';
  const gateCheckInUrl = `${currentHost}/check-in`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    gateCheckInUrl
  )}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Top Header & Primary Actions ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Direktori &amp; Presensi Peserta
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Monitoring data pendaftar dan kelola status presensi gate Braga City Walk secara real-time.
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

      {/* ─── Attendance Quick Stat Strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Peserta</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : totalCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Seluruh Kategori Lomba</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hadir di Lokasi</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{loading ? '...' : checkedInCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Tingkat Kehadiran: {attendanceRate}%</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Belum Presensi</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{loading ? '...' : notCheckedInCount}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Menunggu Kedatangan</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Sistem Presensi</div>
          <div className="text-sm font-extrabold text-blue-900 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>QR Scan &amp; Manual</span>
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">Sinkronisasi Real-Time</div>
        </div>
      </div>

      {/* ─── Search & Filter Toolbar ─── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama peserta, email, nomor HP, atau kode..."
              className="form-input text-xs py-2.5 pl-9 pr-3.5 w-full rounded-xl"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={compFilter}
            onChange={(e) => setCompFilter(e.target.value)}
            className="form-input form-select text-xs py-2.5 px-3.5 w-full sm:w-auto rounded-xl"
          >
            <option value="all">Semua Kategori Lomba</option>
            <option value="desain-kemasan">Desain Kemasan</option>
            <option value="video-lokal">Video 1 Menit</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="form-input form-select text-xs py-2.5 px-3.5 w-full sm:w-auto rounded-xl"
          >
            <option value="all">Semua Status Presensi</option>
            <option value="checked_in">Sudah Hadir di Braga</option>
            <option value="not_checked_in">Belum Presensi</option>
          </select>
        </div>
      </div>

      {/* ─── DIRECTORY TABLE (Clean, Spacious, No Overlapping!) ─── */}
      <div className="admin-card overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5 min-w-[240px]">Kode Registrasi</th>
                <th className="py-3.5 px-5 min-w-[240px]">Nama &amp; Identitas Peserta</th>
                <th className="py-3.5 px-5 min-w-[160px]">Kategori Lomba</th>
                <th className="py-3.5 px-5 min-w-[150px]">Kontak WhatsApp</th>
                <th className="py-3.5 px-5 min-w-[200px]">Status Presensi Gate (Manage)</th>
                <th className="py-3.5 px-5 min-w-[130px] text-right pr-6">Aksi Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    Memuat data peserta festival...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                    Tidak ditemukan peserta yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isCheckedIn = p.check_in_status === 'checked_in';
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Column 1: Kode Registrasi */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/90 inline-flex items-center gap-1.5 whitespace-nowrap">
                          <span>{p.registration_code}</span>
                        </span>
                      </td>

                      {/* Column 2: Nama & Identitas */}
                      <td className="py-3.5 px-5">
                        <div className="font-extrabold text-slate-900 text-sm whitespace-nowrap">
                          {p.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                          {p.email}
                        </div>
                      </td>

                      {/* Column 3: Kategori Lomba */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                            p.competition_id === 'desain-kemasan'
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {p.competition_id === 'desain-kemasan'
                            ? 'Desain Kemasan'
                            : 'Video 1 Menit'}
                        </span>
                      </td>

                      {/* Column 4: Kontak WhatsApp */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <a
                          href={`https://wa.me/62${p.phone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-slate-700 hover:text-emerald-600 font-semibold inline-flex items-center gap-1.5 transition-colors"
                          title="Hubungi via WhatsApp"
                        >
                          <span>{p.phone}</span>
                          <span className="text-[10px] text-emerald-600 font-bold">↗</span>
                        </a>
                      </td>

                      {/* Column 5: Status Presensi (Manage Live) */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckIn(p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border ${
                              isCheckedIn
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                            title={
                              isCheckedIn
                                ? 'Klik untuk membatalkan status hadir'
                                : 'Klik untuk menandai hadir secara manual'
                            }
                          >
                            {isCheckedIn ? (
                              <>
                                <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Hadir di Lokasi</span>
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
                                <span>Belum Hadir (+ Tandai)</span>
                              </>
                            )}
                          </button>

                          {isCheckedIn && p.checked_in_at && (
                            <span className="text-[10px] font-mono text-slate-400 ml-1">
                              Waktu: {new Date(p.checked_in_at).toLocaleTimeString('id-ID')} WIB
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 6: Aksi Detail */}
                      <td className="py-3.5 px-5 text-right pr-6 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedParticipant(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1"
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
                    {selectedParticipant.check_in_status === 'checked_in'
                      ? '✓ Hadir di Braga'
                      : 'Belum Hadir'}
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
