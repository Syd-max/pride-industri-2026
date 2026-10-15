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
      // 1. Request camera stream explicitly
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

      // 2. Initialize ZXing reader
      const reader = new BrowserMultiFormatReader();
      codeReaderRef.current = reader;

      reader.decodeFromVideoElement(videoRef.current!, (result, error) => {
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
          'Izin akses kamera ditolak oleh browser. Silakan aktifkan izin kamera di pengaturan browser Anda atau gunakan input token gate manual di bawah.'
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1C1C1C] mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8B0A4] hover:text-[#C8A96E] transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                fill
                sizes="24px"
                className="object-contain"
              />
            </div>
            <span className="text-xs font-display tracking-wider font-semibold text-[#C8A96E]">
              Gate Check-In
            </span>
          </div>
        </div>

        {/* Success Attendance Badge */}
        {scanState === 'success' && successInfo ? (
          <div className="glass-card-gold p-8 sm:p-10 rounded-2xl border border-[rgba(52,211,153,0.3)] text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#052E16] text-[#34D399] border-2 border-[#166534] flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_rgba(52,211,153,0.3)]">
              ✓
            </div>

            <div>
              <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded bg-[#052E16] text-[#34D399] border border-[#166534] mb-2">
                Kehadiran Resmi Terverifikasi
              </span>
              <h1 className="font-display text-3xl text-[#F5F0E8] font-bold">
                Selamat Datang di Braga!
              </h1>
              <p className="font-display italic text-lg text-[#C8A96E] mt-1">
                {successInfo.full_name}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <span className="text-[#8A8A8A]">Kode Peserta:</span>
                <span className="font-mono font-bold text-[#E4C584]">
                  {successInfo.registration_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8A8A8A]">Kategori:</span>
                <span className="text-[#F5F0E8] font-medium capitalize">
                  {successInfo.competition_id.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8A8A8A]">Waktu Check-In:</span>
                <span className="text-[#34D399] font-mono">
                  {new Date(successInfo.checked_in_at).toLocaleTimeString('id-ID')}{' '}
                  WIB
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8A8A8A]">Lokasi Gate:</span>
                <span className="text-[#F5F0E8]">
                  Gate Utama · Braga City Walk
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              Kehadiran Anda telah dicatat secara real-time pada sistem
              monitoring panitia PRIDE Industri 2026. Selamat menikmati seluruh
              rangkaian festival!
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="btn btn-primary w-full py-3.5 text-xs uppercase tracking-wider justify-center"
              >
                Lihat Jadwal & Panduan Festival
              </Link>
            </div>
          </div>
        ) : (
          /* Check-In Form & Camera Viewfinder */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C8A96E]">
                Sistem Presensi Real-Time
              </div>
              <h1 className="font-display text-3xl font-bold text-[#F5F0E8]">
                Check-In Peserta di Braga
              </h1>
              <p className="text-xs text-[#8A8A8A] leading-relaxed max-w-sm mx-auto">
                Buka kamera ponsel Anda dan pindai kode QR yang terpasang di gate
                masuk Braga City Walk untuk mencatat kehadiran resmi Anda.
              </p>
            </div>

            {/* Error Feedback */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-[#2D0F0A] border border-[#7F1D1D] text-xs text-[#FCA5A5] flex items-start gap-3"
              >
                <span className="text-base flex-shrink-0">⚠️</span>
                <div className="flex-1">
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Step 1: Input Registration Code */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <div className="form-field">
                <label
                  htmlFor="reg_code"
                  className="form-label form-label-required"
                >
                  Kode Registrasi Peserta Anda
                </label>
                <input
                  id="reg_code"
                  type="text"
                  required
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target.value)}
                  placeholder="Contoh: PRIDE-DK-20261021-AB12CD"
                  className="form-input font-mono uppercase text-sm"
                  disabled={scanState === 'scanning'}
                />
                <span className="text-[11px] text-[#6B6560]">
                  * Diberikan saat Anda menyelesaikan pendaftaran di website ini.
                </span>
              </div>
            </div>

            {/* Camera Viewfinder Box */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4 text-center">
              {scanState === 'scanning' ? (
                <div className="space-y-4">
                  <div className="camera-viewfinder bg-black">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="scan-line" />
                  </div>

                  <p className="text-xs text-[#E4C584] animate-pulse">
                    Arahkan kamera ke kode QR di Gate Braga City Walk...
                  </p>

                  <button
                    onClick={() => {
                      stopCamera();
                      setScanState('idle');
                    }}
                    className="btn btn-ghost text-xs py-2 px-4"
                  >
                    Hentikan Kamera
                  </button>
                </div>
              ) : scanState === 'validating' ? (
                <div className="py-12 space-y-3">
                  <div className="w-10 h-10 border-3 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium text-[#F5F0E8]">
                    Memvalidasi Kode Gate & Kehadiran Peserta...
                  </p>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center mx-auto text-3xl text-[#C8A96E]">
                    📷
                  </div>

                  <div>
                    <h3 className="font-display text-base font-semibold text-[#F5F0E8]">
                      Pemindai Kamera Browser
                    </h3>
                    <p className="text-xs text-[#8A8A8A] max-w-xs mx-auto mt-1">
                      Browser akan meminta izin akses kamera perangkat untuk
                      memindai kode QR secara langsung.
                    </p>
                  </div>

                  <button
                    onClick={startScanner}
                    disabled={!registrationCode.trim()}
                    className="btn btn-primary w-full py-3.5 text-xs uppercase tracking-wider justify-center"
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
                className="text-xs text-[#8A8A8A] hover:text-[#C8A96E] transition-colors underline block mx-auto text-center"
              >
                {showManualInput
                  ? 'Sembunyikan Opsi Manual'
                  : 'Kamera bermasalah? Masukkan kode token gate secara manual'}
              </button>

              {showManualInput && (
                <div className="mt-4 p-5 rounded-xl bg-[#141414] border border-[#222222] space-y-3 animate-fade-in">
                  <div className="text-xs font-semibold text-[#F5F0E8]">
                    Input Manual Token Gate
                  </div>
                  <p className="text-[11px] text-[#8A8A8A]">
                    Tanyakan kode token gate kepada petugas pintu masuk jika
                    kamera smartphone Anda tidak dapat aktif.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualGateToken}
                      onChange={(e) => setManualGateToken(e.target.value)}
                      placeholder="Contoh: PRIDE2026-GATE-BRAGA-MAIN"
                      className="form-input text-xs font-mono"
                    />
                    <button
                      onClick={() => handleScannedToken(manualGateToken)}
                      disabled={!registrationCode.trim() || !manualGateToken.trim()}
                      className="btn btn-secondary text-xs px-4 flex-shrink-0"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo QR Helper for testing */}
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#1A1A1A] text-center text-[11px] text-[#6B6560]">
              <span className="font-semibold text-[#8A8A8A] block mb-1">
                Informasi Pengujian Panitia:
              </span>
              Token QR Gate Resmi:{' '}
              <button
                onClick={() => {
                  setManualGateToken('PRIDE2026-GATE-BRAGA-MAIN');
                  setShowManualInput(true);
                }}
                className="font-mono text-[#C8A96E] underline hover:text-[#E4C584]"
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
