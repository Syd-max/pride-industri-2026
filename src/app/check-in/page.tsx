'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">
      {/* ─── Top Brand Header ─── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="h-8 flex items-center">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE 2026"
                width={110}
                height={32}
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="flex flex-col border-l border-slate-200 pl-2.5">
              <span className="font-extrabold text-xs text-slate-900 leading-tight tracking-tight">
                Braga City Walk
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
                Gate Presensi
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!hasScanned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Scanner Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
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
           ========================================================================= */}
        {!hasScanned && !successResult && (
          <div className="space-y-4">
            {/* Camera Viewport Container */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-3 sm:p-4 shadow-xs space-y-3">
              <div className="relative aspect-4/5 w-full bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
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
                    className={`relative w-60 h-60 sm:w-68 sm:h-68 transition-all duration-300 ${
                      scanSuccessPing ? 'scale-105' : 'scale-100'
                    }`}
                  >
                    {/* Four Clean White Corner Brackets */}
                    <div
                      className={`absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 rounded-tl-xl transition-colors duration-200 ${
                        scanSuccessPing ? 'border-emerald-400' : 'border-white/90'
                      }`}
                    />
                    <div
                      className={`absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 rounded-tr-xl transition-colors duration-200 ${
                        scanSuccessPing ? 'border-emerald-400' : 'border-white/90'
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 rounded-bl-xl transition-colors duration-200 ${
                        scanSuccessPing ? 'border-emerald-400' : 'border-white/90'
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 rounded-br-xl transition-colors duration-200 ${
                        scanSuccessPing ? 'border-emerald-400' : 'border-white/90'
                      }`}
                    />

                    {/* Subtle Soft Scan Line (Clean light beam, no neon laser) */}
                    {cameraStatus === 'active' && !scanSuccessPing && (
                      <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none animate-scanner-laser" />
                    )}

                    {/* Success Flash Indicator */}
                    {scanSuccessPing && (
                      <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs rounded-2xl flex items-center justify-center animate-in zoom-in-75 duration-200">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtitle guidance inside viewport */}
                  <div className="mt-5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-white/90 text-center shadow-sm">
                    Arahkan ke poster QR Gate resmi
                  </div>
                </div>

                {/* Top HUD Controls over camera */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Pindai Gate
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasTorch && (
                      <button
                        type="button"
                        onClick={handleToggleTorch}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                          torchOn
                            ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                            : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                        }`}
                        title="Lampu Flash"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSwitchCamera}
                      className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title="Ganti Kamera"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Camera State Fallback Overlay */}
                {cameraStatus !== 'active' && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4 z-20">
                    {cameraStatus === 'starting' ? (
                      <div className="space-y-3">
                        <div className="w-10 h-10 mx-auto rounded-full border-3 border-white border-t-transparent animate-spin" />
                        <p className="text-xs font-semibold text-slate-200">
                          Membuka akses kamera...
                        </p>
                      </div>
                    ) : cameraStatus === 'permission_denied' ? (
                      <div className="space-y-3 max-w-xs">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300 flex items-center justify-center">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 1l22 22M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h6l2 3h1" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-white">
                          Izin Kamera Ditolak
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Mohon izinkan akses kamera pada browser Anda untuk memindai QR Gate di Braga City Walk.
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
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-white">
                          Kamera Tidak Terdeteksi
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Pastikan izin akses kamera aktif untuk memindai poster QR Gate di Braga City Walk.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Error Message if Any */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-start gap-2.5 shadow-2xs">
                <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Gate Instruction Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center space-y-1 shadow-2xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900">
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01M7 17h.01M17 7h.01M17 17h.01" />
                </svg>
                <span>Meja Registrasi Braga City Walk</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Pindai poster barcode fisik resmi yang terpasang di Meja Gate untuk membuka menu presensi pengunjung.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: GATE BARCODE HAS BEEN SCANNED
           ========================================================================= */}
        {hasScanned && !successResult && (
          <div className="space-y-5 animate-in fade-in-50 zoom-in-98 duration-200">
            {/* Verified Gate Banner with Rescan Button */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold min-w-0">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="truncate">Gate Braga City Walk Terverifikasi</span>
              </div>
              <button
                type="button"
                onClick={handleRescanCamera}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-100/60 border border-emerald-200 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>Pindai Ulang</span>
              </button>
            </div>

            {/* Welcome Heading */}
            <div className="text-center space-y-1 pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Presensi Gate Masuk
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Silakan pilih kategori kunjungan Anda untuk memasuki area festival:
              </p>
            </div>

            {/* Segmented Choice Buttons (Visitor Umum vs Visitor Peserta) */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('umum');
                  setErrorMsg(null);
                }}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
                  activeTab === 'umum'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <svg className={`w-5 h-5 shrink-0 ${activeTab === 'umum' ? 'text-blue-600' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Pengunjung Umum</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('peserta');
                  setErrorMsg(null);
                }}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
                  activeTab === 'peserta'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <svg className={`w-5 h-5 shrink-0 ${activeTab === 'peserta' ? 'text-blue-600' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
                <span>Peserta Lomba</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-start gap-2.5 shadow-2xs">
                <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in-50 duration-200"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                    <span>Akses Langsung</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Pengunjung Umum Festival
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Untuk masyarakat umum, penikmat bazar kuliner IKM, pameran seni kriya, fashion show, dan pertunjukan musik.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Nama Lengkap / Panggilan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={umumName}
                      onChange={(e) => setUmumName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 rounded-xl text-xs sm:text-sm py-2.5 px-4 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Asal Kota / Domisili
                    </label>
                    <input
                      type="text"
                      value={umumCity}
                      onChange={(e) => setUmumCity(e.target.value)}
                      placeholder="Kota Bandung"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 rounded-xl text-xs sm:text-sm py-2.5 px-4 transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {loading ? (
                    <span>Memproses Presensi...</span>
                  ) : (
                    <>
                      <span>Konfirmasi Masuk Festival</span>
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
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in-50 duration-200"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                    <span>Peserta Resmi</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Verifikasi Kode Peserta Lomba
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Masukkan kode pendaftaran resmi yang Anda terima saat mendaftar lomba.
                  </p>
                </div>

                {/* Non-Delegable Warning Banner */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <div>
                    <strong className="text-amber-950 font-bold block mb-0.5">Wajib Kode Resmi &amp; Tidak Bisa Diwakilkan</strong>
                    Presensi ini khusus untuk peserta terdaftar. Pastikan kode registrasi sesuai bukti pendaftaran Anda.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kode Registrasi Peserta (Wajib)
                  </label>
                  <input
                    type="text"
                    value={pesertaCode}
                    onChange={(e) => setPesertaCode(e.target.value.toUpperCase())}
                    placeholder="PRIDE-DK-20261021-X9K2L1"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-mono text-xs sm:text-sm uppercase py-2.5 px-4 rounded-xl tracking-wider font-bold text-slate-900 transition-all outline-none"
                    required
                  />
                  <p className="text-[11px] text-slate-500">
                    Format kode: PRIDE-DK-... atau PRIDE-VL-...
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {loading ? (
                    <span>Memverifikasi Kode...</span>
                  ) : (
                    <>
                      <span>Verifikasi &amp; Masuk Gate</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Help Notice */}
            <div className="text-center pt-2 text-xs text-slate-500 space-y-1">
              <p>Butuh bantuan saat check-in?</p>
              <p>
                Kunjungi Meja Panitia Braga City Walk atau WhatsApp{' '}
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

        {/* =========================================================================
            STATE 3: SUCCESS RESULT (E-PASS / E-BADGE SCREEN)
           ========================================================================= */}
        {successResult && (
          <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            {/* Success Icon */}
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Badge Title */}
            <div className="space-y-1">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  successResult.visitor_type === 'peserta'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {successResult.visitor_type === 'peserta'
                    ? 'E-Badge Peserta Lomba'
                    : 'E-Pass Pengunjung Festival'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight pt-1">
                {infoMsg ? 'Presensi Sudah Terdata' : 'Presensi Berhasil!'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Selamat Datang di Festival PRIDE Industri 2026
              </p>
            </div>

            {/* Verification Detail Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Nama Pengunjung:</span>
                <span className="font-bold text-slate-900 text-right">{successResult.full_name}</span>
              </div>

              {successResult.visitor_type === 'peserta' ? (
                <>
                  <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                    <span className="text-slate-500 font-medium">Kode Registrasi:</span>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 select-all">
                      {successResult.registration_code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                    <span className="text-slate-500 font-medium">Kategori Lomba:</span>
                    <span className="font-semibold text-slate-800">
                      {successResult.competition_id === 'desain-kemasan'
                        ? 'Desain Kemasan'
                        : 'Video 1 Menit'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                    <span className="text-slate-500 font-medium">Nomor Tiket:</span>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 select-all">
                      {successResult.ticket_code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                    <span className="text-slate-500 font-medium">Asal Domisili:</span>
                    <span className="font-semibold text-slate-800">{successResult.city}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-0.5">
                <span className="text-slate-500 font-medium">Waktu Presensi:</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {new Date(successResult.checked_in_at).toLocaleTimeString('id-ID')} WIB
                </span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed text-left">
              {successResult.visitor_type === 'peserta' ? (
                <p className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                    <path d="M4 22h16"/>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                  </svg>
                  <span><strong>Informasi Peserta:</strong> Tunjukkan E-Badge ini ke Meja Registrasi Utama di dekat panggung untuk pengambilan <strong>ID Card &amp; Kit Peserta Resmi</strong>.</span>
                </p>
              ) : (
                <p className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span><strong>Selamat Menikmati Acara:</strong> Kunjungi booth pameran IKM unggulan, bazar kuliner lokal, dan panggung pertunjukan di sepanjang Braga City Walk!</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <Link
                href="/"
                className="w-full py-3 px-6 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all block shadow-md text-center cursor-pointer"
              >
                Buka Rundown Acara &amp; Denah Booth
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <footer className="py-6 px-4 border-t border-slate-200/80 bg-white">
        <p className="text-center text-[11px] text-slate-500">
          Dinas Perdagangan dan Perindustrian Kota Bandung · PRIDE Industri 2026
        </p>
      </footer>
    </div>
  );
}
