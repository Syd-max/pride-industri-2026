'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BrowserMultiFormatReader } from '@zxing/browser';

type ScanState =
  | 'idle'
  | 'requesting_permission'
  | 'scanning'
  | 'validating'
  | 'success'
  | 'error';

export default function CheckInPage() {
  const [registrationCode, setRegistrationCode] = useState('');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    full_name: string;
    registration_code: string;
    competition_id: string;
    checked_in_at: string;
  } | null>(null);

  const [manualGateToken, setManualGateToken] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start real browser camera scanner
  const startScanner = async () => {
    setErrorMessage(null);

    if (!registrationCode.trim()) {
      setErrorMessage(
        'Masukkan kode registrasi Anda terlebih dahulu sebelum memindai QR gate.'
      );
      return;
    }

    setScanState('requesting_permission');

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setScanState('scanning');

      const reader = new BrowserMultiFormatReader();
      codeReaderRef.current = reader;

      reader.decodeFromVideoElement(videoRef.current!, (result) => {
        if (result) {
          const scannedText = result.getText();
          stopCamera();
          handleScannedToken(scannedText);
        }
      });
    } catch (err: unknown) {
      console.error('Camera error:', err);
      stopCamera();
      setScanState('error');
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setErrorMessage(
          'Izin akses kamera ditolak oleh browser. Silakan izinkan akses kamera di setelan browser atau gunakan input kode manual di bawah.'
        );
      } else {
        setErrorMessage(
          'Kamera tidak dapat diakses atau perangkat tidak mendukung. Anda dapat menggunakan opsi input token manual.'
        );
      }
      setShowManualInput(true);
    }
  };

  // Submit scanned or manual gate token to backend
  const handleScannedToken = async (gateToken: string) => {
    setScanState('validating');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_code: registrationCode.trim(),
          gate_token: gateToken.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setScanState('error');
        setErrorMessage(
          json.error || 'Check-in gagal. Periksa kembali kode Anda.'
        );
        return;
      }

      setSuccessInfo(json.data);
      setScanState('success');
    } catch {
      setScanState('error');
      setErrorMessage(
        'Koneksi ke server terputus saat validasi. Silakan ulangi.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="28px"
                className="object-contain"
              />
            </div>
            <span className="text-xs font-extrabold tracking-tight text-slate-900">
              Gate Check-In
            </span>
          </div>
        </div>

        {/* Success Attendance Badge */}
        {scanState === 'success' && successInfo ? (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-emerald-200 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center mx-auto text-4xl font-black">
              ✓
            </div>

            <div>
              <span className="inline-block text-xs font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                Kehadiran Resmi Terverifikasi
              </span>
              <h1 className="text-3xl text-slate-900 font-extrabold">
                Selamat Datang di Braga!
              </h1>
              <p className="text-xl font-bold text-blue-600 mt-1">
                {successInfo.full_name}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Kode Peserta:</span>
                <span className="font-mono font-extrabold text-blue-700 text-sm">
                  {successInfo.registration_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Kategori Lomba:</span>
                <span className="text-slate-800 font-bold capitalize">
                  {successInfo.competition_id.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Waktu Check-In:</span>
                <span className="text-emerald-700 font-mono font-bold">
                  {new Date(successInfo.checked_in_at).toLocaleTimeString('id-ID')} WIB
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Lokasi Gate:</span>
                <span className="text-slate-800 font-medium">
                  Gate Utama · Braga City Walk
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Kehadiran Anda telah dicatat secara real-time pada sistem monitoring
              panitia PRIDE Industri 2026. Selamat menikmati seluruh rangkaian acara!
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="w-full py-3.5 px-6 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md block text-center"
              >
                Lihat Jadwal & Panduan Festival
              </Link>
            </div>
          </div>
        ) : (
          /* Check-In Form & Camera Viewfinder */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Sistem Presensi Real-Time
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Check-In Peserta di Braga
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Buka kamera smartphone Anda dan pindai kode QR yang terpasang di
                gate masuk Braga City Walk untuk mencatat kehadiran resmi Anda.
              </p>
            </div>

            {/* Error Feedback */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3 font-medium"
              >
                <span className="text-base flex-shrink-0">⚠️</span>
                <div className="flex-1">
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Step 1: Input Registration Code */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <label
                htmlFor="reg_code"
                className="text-xs font-bold text-slate-700 block"
              >
                Kode Registrasi Peserta Anda <span className="text-rose-600">*</span>
              </label>
              <input
                id="reg_code"
                type="text"
                required
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                placeholder="Contoh: PRIDE-DK-20261021-AB12CD"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-mono uppercase text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                disabled={scanState === 'scanning'}
              />
              <span className="text-[11px] text-slate-500 block">
                * Diberikan saat Anda menyelesaikan pendaftaran di website ini.
              </span>
            </div>

            {/* Camera Viewfinder Box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 text-center">
              {scanState === 'scanning' ? (
                <div className="space-y-4">
                  <div className="camera-viewfinder bg-slate-900">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="scan-line" />
                  </div>

                  <p className="text-xs text-blue-600 font-bold animate-pulse">
                    Arahkan kamera ke kode QR di Gate Braga City Walk...
                  </p>

                  <button
                    onClick={() => {
                      stopCamera();
                      setScanState('idle');
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Hentikan Kamera
                  </button>
                </div>
              ) : scanState === 'validating' ? (
                <div className="py-12 space-y-3">
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-800">
                    Memvalidasi Kode Gate & Kehadiran Peserta...
                  </p>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-3xl">
                    📷
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Pemindai Kamera Browser
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      Browser akan meminta izin akses kamera perangkat untuk
                      memindai kode QR secara langsung.
                    </p>
                  </div>

                  <button
                    onClick={startScanner}
                    disabled={!registrationCode.trim()}
                    className="w-full py-3.5 px-6 rounded-full text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                  >
                    Buka Kamera Scanner QR →
                  </button>
                </div>
              )}
            </div>

            {/* Alternative: Manual Token Input Fallback */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowManualInput(!showManualInput)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors underline block mx-auto text-center cursor-pointer"
              >
                {showManualInput
                  ? 'Sembunyikan Opsi Manual'
                  : 'Kamera bermasalah? Masukkan kode token gate secara manual'}
              </button>

              {showManualInput && (
                <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    Input Manual Token Gate
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Tanyakan kode token gate kepada petugas pintu masuk jika
                    kamera ponsel Anda tidak dapat aktif.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualGateToken}
                      onChange={(e) => setManualGateToken(e.target.value)}
                      placeholder="Contoh: PRIDE2026-GATE-BRAGA-MAIN"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleScannedToken(manualGateToken)}
                      disabled={!registrationCode.trim() || !manualGateToken.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-colors disabled:opacity-50"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Gate Token helper for testing */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-[11px] text-slate-500">
              <span className="font-bold text-slate-700 block mb-1">
                Informasi Pengujian Panitia:
              </span>
              Token QR Gate Resmi:{' '}
              <button
                onClick={() => {
                  setManualGateToken('PRIDE2026-GATE-BRAGA-MAIN');
                  setShowManualInput(true);
                }}
                className="font-mono font-bold text-blue-700 underline hover:text-blue-900 cursor-pointer"
              >
                PRIDE2026-GATE-BRAGA-MAIN
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
