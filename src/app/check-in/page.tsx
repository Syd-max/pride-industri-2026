'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type VisitorTab = 'umum' | 'peserta';

interface CheckInResult {
  visitor_type: 'umum' | 'peserta';
  full_name: string;
  ticket_code?: string;
  registration_code?: string;
  competition_id?: string;
  city?: string;
  checked_in_at: string;
  gate_name?: string;
}

export default function CheckInPage() {
  const [activeTab, setActiveTab] = useState<VisitorTab>('umum');

  // Form states - Visitor Umum
  const [umumName, setUmumName] = useState('');
  const [umumCity, setUmumCity] = useState('Kota Bandung');

  // Form states - Visitor Peserta
  const [pesertaCode, setPesertaCode] = useState('');

  // Status & Result states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<CheckInResult | null>(null);

  // Auto-detect gate query parameter if scanned from dynamic QR
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialTab = params.get('type');
      if (initialTab === 'peserta' || initialTab === 'umum') {
        setActiveTab(initialTab);
      }
      const codeParam = params.get('code');
      if (codeParam) {
        setPesertaCode(codeParam.toUpperCase());
        setActiveTab('peserta');
      }
    }
  }, []);

  // Handle General Visitor Check-In
  const handleCheckInUmum = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_type: 'umum',
          full_name: umumName.trim() || 'Pengunjung Umum',
          city: umumCity.trim() || 'Kota Bandung',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error || 'Gagal memproses presensi gate.');
        return;
      }

      setSuccessResult(json.data);
    } catch {
      setErrorMsg('Koneksi internet bermasalah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Competition Participant Check-In
  const handleCheckInPeserta = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = pesertaCode.trim().toUpperCase();

    if (!query) {
      setErrorMsg('Masukkan kode registrasi Anda terlebih dahulu.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_type: 'peserta',
          registration_code: query,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(
          json.error || 'Kode registrasi tidak ditemukan. Periksa kembali huruf dan angka kode Anda.'
        );
        return;
      }

      if (json.already_checked_in) {
        setInfoMsg(json.message);
      }

      setSuccessResult(json.data);
    } catch {
      setErrorMsg('Koneksi internet bermasalah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessResult(null);
    setErrorMsg(null);
    setInfoMsg(null);
    setPesertaCode('');
    setUmumName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between antialiased">
      {/* ─── Top Brand Header ─── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-slate-900 leading-tight">
                PRIDE 2026
              </span>
              <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">
                Braga City Walk
              </span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Gate Masuk Aktif
          </span>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* SUCCESS PASS / BADGE SCREEN */}
        {successResult ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-250">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Badge Title */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider mb-2 ${
                successResult.visitor_type === 'peserta'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {successResult.visitor_type === 'peserta'
                  ? 'E-Badge Peserta Lomba'
                  : 'E-Pass Pengunjung Festival'}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {infoMsg ? 'Presensi Sudah Terdata' : 'Presensi Berhasil!'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Selamat Datang di Festival PRIDE Industri 2026
              </p>
            </div>

            {/* Verification Detail Card */}
            <div className={`p-4 rounded-2xl border text-left space-y-2.5 ${
              successResult.visitor_type === 'peserta'
                ? 'bg-blue-50/50 border-blue-100'
                : 'bg-emerald-50/50 border-emerald-100'
            }`}>
              <div className="flex justify-between items-start text-xs border-b pb-2 border-slate-200/60">
                <span className="text-slate-500 font-medium">Nama Pengunjung:</span>
                <span className="font-extrabold text-slate-900 text-right">{successResult.full_name}</span>
              </div>

              {successResult.visitor_type === 'peserta' ? (
                <>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-200/60">
                    <span className="text-slate-500 font-medium">Kode Registrasi:</span>
                    <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                      {successResult.registration_code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-200/60">
                    <span className="text-slate-500 font-medium">Kategori Lomba:</span>
                    <span className="font-bold text-slate-800">
                      {successResult.competition_id === 'desain-kemasan'
                        ? 'Desain Kemasan'
                        : 'Video 1 Menit'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-200/60">
                    <span className="text-slate-500 font-medium">Nomor Tiket:</span>
                    <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {successResult.ticket_code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-200/60">
                    <span className="text-slate-500 font-medium">Asal Domisili:</span>
                    <span className="font-bold text-slate-800">{successResult.city}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-xs pt-0.5">
                <span className="text-slate-500 font-medium">Waktu Presensi:</span>
                <span className="font-mono text-slate-700 font-bold">
                  {new Date(successResult.checked_in_at).toLocaleTimeString('id-ID')} WIB
                </span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              {successResult.visitor_type === 'peserta' ? (
                <p>
                  🏆 <strong>Informasi Peserta:</strong> Silakan tunjukkan halaman ini ke meja registrasi lomba di dekat panggung utama untuk pengambilan <strong>ID Card &amp; Kit Peserta</strong>.
                </p>
              ) : (
                <p>
                  🎉 <strong>Selamat Menikmati Acara:</strong> Kunjungi booth pameran IKM unggulan, bazar kuliner lokal, dan panggung pertunjukan di sepanjang selasar Braga City Walk!
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <Link
                href="/"
                className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-colors block shadow-md"
              >
                Buka Rundown Acara &amp; Denah Booth
              </Link>

              <button
                type="button"
                onClick={resetForm}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Presensi untuk Orang Lain
              </button>
            </div>
          </div>
        ) : (
          /* FORM PILIHAN PENGUNJUNG SCREEN */
          <div className="space-y-6">
            {/* Welcome Heading */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Presensi Gate Masuk
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Pindai Barcode Selesai! Pilih kategori kunjungan Anda untuk masuk gate Braga City Walk:
              </p>
            </div>

            {/* Segmented Choice Buttons (Umum vs Peserta) */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-200/80 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('umum');
                  setErrorMsg(null);
                }}
                className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'umum'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-base">👥</span>
                <span>Visitor Umum</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('peserta');
                  setErrorMsg(null);
                }}
                className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === 'peserta'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-base">🎖️</span>
                <span>Visitor Peserta Lomba</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-shake">
                <svg className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: VISITOR UMUM */}
            {activeTab === 'umum' && (
              <form
                onSubmit={handleCheckInUmum}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in-50 duration-200"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                    <span>1-Klik Langsung Masuk</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    Pengunjung Umum Festival
                  </h2>
                  <p className="text-xs text-slate-500">
                    Untuk masyarakat umum, penikmat bazar kuliner IKM, pameran seni kriya, fashion show, dan pertunjukan musik.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap / Panggilan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={umumName}
                      onChange={(e) => setUmumName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="form-input text-xs py-2.5 px-3.5 w-full rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Asal Kota / Domisili
                    </label>
                    <input
                      type="text"
                      value={umumCity}
                      onChange={(e) => setUmumCity(e.target.value)}
                      placeholder="Kota Bandung"
                      className="form-input text-xs py-2.5 px-3.5 w-full rounded-xl"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {loading ? (
                    <span>Memproses Masuk...</span>
                  ) : (
                    <>
                      <span>Pencet Umum Scan Masuk</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: VISITOR PESERTA */}
            {activeTab === 'peserta' && (
              <form
                onSubmit={handleCheckInPeserta}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in-50 duration-200"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                    <span>Peserta Lomba Resmi</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    Verifikasi Kode Peserta
                  </h2>
                  <p className="text-xs text-slate-500">
                    Masukkan kode pendaftaran resmi yang Anda terima saat mendaftar (contoh: PRIDE-DK-... atau PRIDE-VL-...).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Registrasi Peserta (atau No. WhatsApp)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pesertaCode}
                      onChange={(e) => setPesertaCode(e.target.value.toUpperCase())}
                      placeholder="PRIDE-DK-20261021-X9K2L1"
                      className="form-input font-mono text-xs sm:text-sm uppercase py-3 px-3.5 w-full rounded-xl tracking-wider font-bold text-blue-900 bg-blue-50/30 border-blue-200 focus:border-blue-500"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    💡 Kode ini tertera di email bukti pendaftaran atau kartu peserta digital Anda.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {loading ? (
                    <span>Memverifikasi Kode...</span>
                  ) : (
                    <>
                      <span>Verifikasi &amp; Scan Masuk Peserta</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Help Notice */}
            <div className="text-center pt-2 text-[11px] text-slate-400 space-y-1">
              <p>Mengalami kesulitan saat check-in?</p>
              <p>
                Hubungi panitia di Meja Registrasi Utama Braga City Walk atau WhatsApp ke{' '}
                <a
                  href="https://wa.me/6281223456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:underline"
                >
                  0812-2345-6789
                </a>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-4 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        Dinas Perdagangan dan Perindustrian Kota Bandung · PRIDE 2026
      </footer>
    </div>
  );
}
