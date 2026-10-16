'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TactlinkBanner from '@/components/ui/TactlinkBanner';

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

// Crisp, pleasant audio chime using Web Audio API (zero external assets, instant zero-latency feedback)
function playAudioChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Smooth high two-tone chime (D5 to A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch {
    // AudioContext blocked or unsupported, silently fail
  }
}

export default function CheckInPage() {
  // Gate scan state: When accessed from menu, hasScanned is false by default.
  // It only becomes true when a valid gate barcode is scanned by camera OR opened from the physical poster URL (?scanned=true).
  const [hasScanned, setHasScanned] = useState(false);
  const [activeTab, setActiveTab] = useState<VisitorTab>('umum');

  // Camera & Scanner states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<{ stop: () => void; switchTorch?: (onOff: boolean) => Promise<void> } | null>(null);
  
  const [cameraStatus, setCameraStatus] = useState<'starting' | 'active' | 'permission_denied' | 'no_camera' | 'unsupported' | 'error'>('starting');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [scanSuccessPing, setScanSuccessPing] = useState(false);
  const [cameraRetryCount, setCameraRetryCount] = useState(0);

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

  // Auto-detect gate query parameter if scanned via physical QR poster using native phone camera
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isScannedParam = params.get('scanned') === 'true' || params.has('gate');
      if (isScannedParam) {
        setHasScanned(true);
      }
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

  // Handle successful barcode scan (from camera, file, or simulation)
  const handleCodeDetected = useCallback((scannedText: string) => {
    playAudioChime();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([60, 40, 80]);
      } catch {}
    }

    setScanSuccessPing(true);

    // Stop current camera stream
    if (scannerControlsRef.current) {
      try {
        scannerControlsRef.current.stop();
      } catch {}
      scannerControlsRef.current = null;
    }

    // Parse potential deep params in scanned text
    try {
      if (scannedText.includes('?')) {
        const urlObj = new URL(scannedText, window.location.origin);
        const codeParam = urlObj.searchParams.get('code');
        const typeParam = urlObj.searchParams.get('type');
        if (codeParam) {
          setPesertaCode(codeParam.toUpperCase());
          setActiveTab('peserta');
        } else if (typeParam === 'peserta' || typeParam === 'umum') {
          setActiveTab(typeParam);
        }
      } else if (scannedText.startsWith('PRIDE-')) {
        // Direct participant code was scanned
        setPesertaCode(scannedText.trim().toUpperCase());
        setActiveTab('peserta');
      }
    } catch {}

    // Update browser URL silently with gate and scanned flags
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('gate', 'braga-city-walk');
      url.searchParams.set('scanned', 'true');
      window.history.replaceState({}, '', url.toString());
    } catch {}

    // Smooth transition into Gate Selection screen
    setTimeout(() => {
      setHasScanned(true);
      setScanSuccessPing(false);
    }, 450);
  }, []);

  // Initialize Camera Scanner whenever in camera mode
  useEffect(() => {
    if (hasScanned || successResult) return;

    let isMounted = true;

    async function startScanner() {
      setCameraStatus('starting');
      setErrorMsg(null);

      try {
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        const reader = new BrowserQRCodeReader();

        if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) setCameraStatus('unsupported');
          return;
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: facingMode === 'environment' ? { ideal: 'environment' } : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        if (!videoRef.current) return;

        const controls = await reader.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result) => {
            if (result && isMounted) {
              const text = result.getText();
              handleCodeDetected(text);
            }
          }
        );

        if (isMounted) {
          scannerControlsRef.current = controls;
          setCameraStatus('active');
          setHasTorch(Boolean(controls?.switchTorch));
        } else {
          controls.stop();
        }
      } catch (err: unknown) {
        console.warn('Camera initiation failed:', err);
        if (!isMounted) return;
        const errObj = err as { name?: string };
        if (errObj?.name === 'NotAllowedError' || errObj?.name === 'PermissionDeniedError') {
          setCameraStatus('permission_denied');
        } else if (errObj?.name === 'NotFoundError' || errObj?.name === 'DevicesNotFoundError') {
          setCameraStatus('no_camera');
        } else {
          setCameraStatus('error');
        }
      }
    }

    startScanner();

    return () => {
      isMounted = false;
      if (scannerControlsRef.current) {
        try {
          scannerControlsRef.current.stop();
        } catch {}
        scannerControlsRef.current = null;
      }
    };
  }, [hasScanned, successResult, facingMode, cameraRetryCount, handleCodeDetected]);

  // Handle Torch / Flashlight toggle
  const handleToggleTorch = async () => {
    if (scannerControlsRef.current?.switchTorch) {
      try {
        const nextTorch = !torchOn;
        await scannerControlsRef.current.switchTorch(nextTorch);
        setTorchOn(nextTorch);
      } catch (err) {
        console.warn('Torch switch failed:', err);
      }
    }
  };

  // Switch between Rear and Front cameras
  const handleSwitchCamera = () => {
    if (scannerControlsRef.current) {
      try {
        scannerControlsRef.current.stop();
      } catch {}
      scannerControlsRef.current = null;
    }
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Reset back to Camera Scanner mode
  const handleRescanCamera = () => {
    setHasScanned(false);
    setSuccessResult(null);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('scanned');
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between antialiased selection:bg-emerald-500 selection:text-white">
      {/* ─── Top Brand Header ─── */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3.5 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 flex-shrink-0 transition-transform group-hover:scale-105">
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
              <span className="font-black text-xs text-white leading-tight tracking-tight">
                PRIDE 2026
              </span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">
                Braga City Walk
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!hasScanned ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Kamera Scanner Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Gate Terverifikasi
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-5 flex flex-col justify-center">
        {/* =========================================================================
            STATE 1: HAS NOT SCANNED YET (DIRECT CAMERA SCANNER HUD)
            "DI MENU SCAN BARCODE HANYA ADA LANGSUNG BUKA KAMERA DAN AKSES KAMERA"
           ========================================================================= */}
        {!hasScanned && !successResult && (
          <div className="space-y-4">
            {/* Camera Viewport Container */}
            <div className="relative aspect-4/5 w-full bg-black rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl flex items-center justify-center">
              {/* Active Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  cameraStatus === 'active' ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Viewfinder Overlay Frame */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                {/* Square Bounding Box */}
                <div
                  className={`relative w-64 h-64 sm:w-72 sm:h-72 transition-all duration-300 ${
                    scanSuccessPing ? 'scale-105' : 'scale-100'
                  }`}
                >
                  {/* Four High-Precision Corner Brackets */}
                  <div
                    className={`absolute top-0 left-0 w-9 h-9 border-t-4 border-l-4 rounded-tl-xl transition-colors duration-200 ${
                      scanSuccessPing ? 'border-emerald-400' : 'border-white'
                    }`}
                  />
                  <div
                    className={`absolute top-0 right-0 w-9 h-9 border-t-4 border-r-4 rounded-tr-xl transition-colors duration-200 ${
                      scanSuccessPing ? 'border-emerald-400' : 'border-white'
                    }`}
                  />
                  <div
                    className={`absolute bottom-0 left-0 w-9 h-9 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-200 ${
                      scanSuccessPing ? 'border-emerald-400' : 'border-white'
                    }`}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-9 h-9 border-b-4 border-r-4 rounded-br-xl transition-colors duration-200 ${
                      scanSuccessPing ? 'border-emerald-400' : 'border-white'
                    }`}
                  />

                  {/* Animated Laser Scanning Beam */}
                  {cameraStatus === 'active' && !scanSuccessPing && (
                    <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scanner-laser pointer-events-none" />
                  )}

                  {/* Success Flash Indicator */}
                  {scanSuccessPing && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs rounded-xl flex items-center justify-center animate-in zoom-in-75 duration-200">
                      <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtitle guidance inside viewport */}
                <div className="mt-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200 text-center shadow-lg">
                  Arahkan kamera ke Barcode / QR Code Gate
                </div>
              </div>

              {/* Top HUD Controls over camera */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  GATE SCANNER
                </div>

                <div className="flex items-center gap-2">
                  {hasTorch && (
                    <button
                      type="button"
                      onClick={handleToggleTorch}
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                        torchOn
                          ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md'
                          : 'bg-black/50 text-white border-white/15 hover:bg-black/70'
                      }`}
                      title="Senter Flash"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-md"
                    title="Balik Kamera"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Camera State Fallback Overlay (When camera is starting, denied, or unavailable) */}
              {cameraStatus !== 'active' && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4 z-20">
                  {cameraStatus === 'starting' ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full border-3 border-emerald-400 border-t-transparent animate-spin" />
                      <p className="text-xs font-semibold text-slate-300">
                        Membuka akses kamera...
                      </p>
                    </div>
                  ) : cameraStatus === 'permission_denied' ? (
                    <div className="space-y-3 max-w-xs">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M1 1l22 22M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h6l2 3h1" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        Izin Kamera Ditolak
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Mohon izinkan akses kamera pada browser Anda untuk memindai Barcode Gate di Braga City Walk.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCameraRetryCount((c) => c + 1)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all cursor-pointer shadow-md"
                      >
                        Coba Izinkan Kamera Lagi
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-w-xs">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        Kamera Tidak Terdeteksi
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pastikan izin akses kamera diaktifkan di browser Anda untuk memindai poster Barcode Gate di Braga City Walk.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message if Any */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5">
                <svg className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Gate Instruction Card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center space-y-1.5 shadow-md">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Arahkan Kamera ke Poster Barcode Gate</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Pindai poster barcode fisik resmi yang terpasang di Meja Registrasi Gate Braga City Walk untuk membuka menu presensi.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: GATE BARCODE HAS BEEN SCANNED
            "BARU NANTI DI BARCODE YANG KITA BUAT TERSEDIA PILIHAN"
           ========================================================================= */}
        {hasScanned && !successResult && (
          <div className="space-y-5 animate-in fade-in-50 zoom-in-98 duration-250">
            {/* Verified Gate Banner with Rescan Button */}
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold min-w-0">
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="truncate">Gate Braga City Walk Terverifikasi</span>
              </div>
              <button
                type="button"
                onClick={handleRescanCamera}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>Pindai Ulang</span>
              </button>
            </div>

            {/* Welcome Heading */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Presensi Gate Masuk
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-normal">
                Pindai Barcode Selesai! Pilih kategori kunjungan Anda untuk masuk gate Braga City Walk:
              </p>
            </div>

            {/* Segmented Choice Buttons (Visitor Umum vs Visitor Peserta) */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 gap-1.5 shadow-md">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('umum');
                  setErrorMsg(null);
                }}
                className={`py-3 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-black transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer leading-tight ${
                  activeTab === 'umum'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Visitor Umum</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('peserta');
                  setErrorMsg(null);
                }}
                className={`py-3 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-black transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer leading-tight ${
                  activeTab === 'peserta'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
                <span>Visitor Peserta Lomba</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-shake">
                <svg className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in-50 duration-200"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    <span>1-Klik Langsung Masuk</span>
                  </div>
                  <h2 className="text-base font-bold text-white">
                    Pengunjung Umum Festival
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Untuk masyarakat umum, penikmat bazar kuliner IKM, pameran seni kriya, fashion show, dan pertunjukan musik.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Nama Lengkap / Panggilan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={umumName}
                      onChange={(e) => setUmumName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl text-xs py-3 px-3.5 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Asal Kota / Domisili
                    </label>
                    <input
                      type="text"
                      value={umumCity}
                      onChange={(e) => setUmumCity(e.target.value)}
                      placeholder="Kota Bandung"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl text-xs py-3 px-3.5 transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
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
                className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in-50 duration-200"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                    <span>Peserta Lomba Resmi</span>
                  </div>
                  <h2 className="text-base font-bold text-white">
                    Verifikasi Kode Peserta Lomba
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Masukkan kode pendaftaran resmi yang Anda terima saat mendaftar lomba.
                  </p>
                </div>

                {/* Non-Delegable & Strict Code Warning Banner */}
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                  <span className="text-amber-400 font-black text-sm flex-shrink-0">⚠️</span>
                  <div>
                    <strong className="text-amber-100 font-bold block mb-0.5">Wajib Kode Resmi &amp; Tidak Bisa Diwakilkan!</strong>
                    Presensi ini hanya untuk diri sendiri. Pastikan kode registrasi sesuai dengan bukti pendaftaran Anda. Jika kode tidak terdaftar atau salah, presensi akan gagal.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Kode Registrasi Resmi Peserta (Wajib)
                  </label>
                  <input
                    type="text"
                    value={pesertaCode}
                    onChange={(e) => setPesertaCode(e.target.value.toUpperCase())}
                    placeholder="PRIDE-DK-20261021-X9K2L1"
                    className="w-full bg-slate-900 border border-blue-500/40 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-mono text-xs sm:text-sm uppercase py-3 px-3.5 rounded-xl tracking-wider font-bold text-blue-300 transition-all outline-none"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Kode berformat resmi (contoh: PRIDE-DK-... atau PRIDE-VD-...). Presensi ditolak jika kode tidak cocok.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs font-black text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
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
                  className="text-emerald-400 font-bold hover:underline"
                >
                  0812-2345-6789
                </a>
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 3: SUCCESS RESULT (E-PASS / E-BADGE SCREEN)
           ========================================================================= */}
        {successResult && (
          <div className="bg-slate-800/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-250">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Badge Title */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider mb-2 ${
                successResult.visitor_type === 'peserta'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}>
                {successResult.visitor_type === 'peserta'
                  ? 'E-Badge Peserta Lomba'
                  : 'E-Pass Pengunjung Festival'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {infoMsg ? 'Presensi Sudah Terdata' : 'Presensi Berhasil!'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Selamat Datang di Festival PRIDE Industri 2026
              </p>
            </div>

            {/* Verification Detail Card */}
            <div className={`p-4 rounded-2xl border text-left space-y-2.5 ${
              successResult.visitor_type === 'peserta'
                ? 'bg-blue-950/40 border-blue-800/60'
                : 'bg-emerald-950/40 border-emerald-800/60'
            }`}>
              <div className="flex justify-between items-start text-xs border-b pb-2 border-slate-700/60">
                <span className="text-slate-400 font-medium">Nama Pengunjung:</span>
                <span className="font-extrabold text-white text-right">{successResult.full_name}</span>
              </div>

              {successResult.visitor_type === 'peserta' ? (
                <>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-700/60">
                    <span className="text-slate-400 font-medium">Kode Registrasi:</span>
                    <span className="font-mono font-bold text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/50">
                      {successResult.registration_code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-700/60">
                    <span className="text-slate-400 font-medium">Kategori Lomba:</span>
                    <span className="font-bold text-slate-200">
                      {successResult.competition_id === 'desain-kemasan'
                        ? 'Desain Kemasan'
                        : 'Video 1 Menit'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-700/60">
                    <span className="text-slate-400 font-medium">Nomor Tiket:</span>
                    <span className="font-mono font-bold text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50">
                      {successResult.ticket_code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b pb-2 border-slate-700/60">
                    <span className="text-slate-400 font-medium">Asal Domisili:</span>
                    <span className="font-bold text-slate-200">{successResult.city}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-xs pt-0.5">
                <span className="text-slate-400 font-medium">Waktu Presensi:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {new Date(successResult.checked_in_at).toLocaleTimeString('id-ID')} WIB
                </span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 leading-relaxed text-left">
              {successResult.visitor_type === 'peserta' ? (
                <p>
                  🏆 <strong>Informasi Peserta:</strong> Tunjukkan E-Badge ini ke Meja Registrasi Utama di dekat panggung untuk pengambilan <strong>ID Card &amp; Kit Peserta Resmi</strong>.
                </p>
              ) : (
                <p>
                  🎉 <strong>Selamat Menikmati Acara:</strong> Kunjungi booth pameran IKM unggulan, bazar kuliner lokal, dan panggung pertunjukan di sepanjang selasar Braga City Walk!
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Link
                href="/"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-black text-slate-950 bg-white hover:bg-slate-100 transition-colors block shadow-md text-center"
              >
                Buka Rundown Acara &amp; Denah Booth
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Presensi terdaftar khusus untuk diri Anda dan tidak dapat diwakilkan</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-5 px-4 border-t border-slate-800 bg-slate-900/90 space-y-3">
        <div className="max-w-md mx-auto">
          <TactlinkBanner variant="light" />
        </div>
        <p className="text-center text-[10px] text-slate-500">
          Dinas Perdagangan dan Perindustrian Kota Bandung · PRIDE 2026
        </p>
      </footer>
    </div>
  );
}
