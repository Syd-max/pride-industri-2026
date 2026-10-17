'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';

type VideoCategory = 'Fesyen' | 'Kuliner' | 'Kriya' | 'PRIDE Industri 2026';

const FORM_STEPS = [
  { step: 1, title: 'Data Diri', subtitle: 'Identitas peserta / tim' },
  { step: 2, title: 'Info Karya', subtitle: 'Kategori & sinopsis video' },
  { step: 3, title: 'Persetujuan', subtitle: 'Komitmen & orisinalitas' },
  { step: 4, title: 'Upload Dokumen', subtitle: 'Pakta integritas (Maks 5 MB)' },
  { step: 5, title: 'Siapkan TactLink', subtitle: 'Unduh, video & QR (Maks 2 MB)' },
];

export default function VideoLokalPage() {
  // ─── Step Navigation State ───
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // ─── Section 1: Data Diri ───
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // ─── Section 2: Informasi Karya ───
  const [videoCategory, setVideoCategory] = useState<VideoCategory>('Fesyen');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  // ─── Section 3: Persetujuan & Komitmen ───
  const [declarationOriginal, setDeclarationOriginal] = useState(false);
  const [declarationTerms, setDeclarationTerms] = useState(false);
  const [declarationUsageRights, setDeclarationUsageRights] = useState(false);

  // ─── Section 4: Upload Dokumen Persyaratan (Max 5 MB) ───
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // ─── Section 5: Siapkan Tactlink — Upload QR Code (Max 2 MB) ───
  const [tactlinkQrFile, setTactlinkQrFile] = useState<File | null>(null);
  const [tactlinkQrPreview, setTactlinkQrPreview] = useState<string | null>(null);
  const [tactlinkQrError, setTactlinkQrError] = useState<string | null>(null);
  const tactlinkQrInputRef = useRef<HTMLInputElement>(null);

  // ─── Submission States ───
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registration_code: string;
    full_name: string;
    email: string;
    institution: string;
    category: string;
    video_title: string;
  } | null>(null);

  // Helper format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ─── File Handlers with Strict Size Limits ───
  const handleDocumentChange = (file: File | null) => {
    setDocumentError(null);
    setStepError(null);
    if (!file) {
      setDocumentFile(null);
      return;
    }
    const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_DOC_SIZE) {
      setDocumentError(
        `File "${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas maksimal 5 MB. File tidak dapat dimasukkan.`
      );
      if (documentInputRef.current) documentInputRef.current.value = '';
      setDocumentFile(null);
      return;
    }
    setDocumentFile(file);
  };

  const handleTactlinkQrChange = (file: File | null) => {
    setTactlinkQrError(null);
    setErrorMessage(null);
    if (!file) {
      setTactlinkQrFile(null);
      setTactlinkQrPreview(null);
      return;
    }
    const MAX_QR_SIZE = 2 * 1024 * 1024; // 2 MB
    if (file.size > MAX_QR_SIZE) {
      setTactlinkQrError(
        `File "${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas maksimal 2 MB. File tidak dapat dimasukkan.`
      );
      if (tactlinkQrInputRef.current) tactlinkQrInputRef.current.value = '';
      setTactlinkQrFile(null);
      setTactlinkQrPreview(null);
      return;
    }
    setTactlinkQrFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setTactlinkQrPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setTactlinkQrPreview(null);
    }
  };

  // ─── Step Transitions with Validations ───
  const goToNextStep = (targetStep: number) => {
    setStepError(null);
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        setStepError('Nama lengkap wajib diisi minimal 3 karakter.');
        return;
      }
      if (!institution.trim() || institution.trim().length < 2) {
        setStepError('Instansi / asal peserta wajib diisi.');
        return;
      }
      if (!phone.trim() || phone.trim().length < 8) {
        setStepError('Nomor WhatsApp / HP wajib diisi minimal 8 digit.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setStepError('Alamat email aktif yang valid wajib diisi.');
        return;
      }
    } else if (currentStep === 2) {
      if (!videoTitle.trim() || videoTitle.trim().length < 3) {
        setStepError('Judul karya video wajib diisi minimal 3 karakter.');
        return;
      }
      if (!videoDescription.trim() || videoDescription.trim().length < 10) {
        setStepError('Deskripsi / sinopsis singkat karya wajib diisi minimal 10 karakter.');
        return;
      }
    } else if (currentStep === 3) {
      if (!declarationOriginal) {
        setStepError('Anda wajib mencentang persetujuan orisinalitas karya.');
        return;
      }
      if (!declarationTerms) {
        setStepError('Anda wajib mencentang persetujuan terhadap syarat & ketentuan lomba.');
        return;
      }
      if (!declarationUsageRights) {
        setStepError('Anda wajib mencentang persetujuan hak tayang & publikasi video.');
        return;
      }
    } else if (currentStep === 4) {
      if (!documentFile) {
        setStepError('Wajib mengunggah dokumen persyaratan lomba (maksimal 5 MB) sebelum melanjutkan.');
        return;
      }
      if (documentError) {
        setStepError(documentError);
        return;
      }
    }

    setCurrentStep(targetStep);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const goToPreviousStep = (targetStep: number) => {
    setStepError(null);
    setErrorMessage(null);
    setCurrentStep(targetStep);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  // ─── Form Submission Handler (Step 5) ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStepError(null);

    // Final checks
    if (!tactlinkQrFile) {
      setErrorMessage('Wajib mengunggah foto barcode / QR kartu nama digital TactLink (maksimal 2 MB).');
      return;
    }
    if (tactlinkQrError) {
      setErrorMessage(tactlinkQrError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        competition_id: 'video-lokal',
        full_name: fullName.trim(),
        institution: institution.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        video_category: videoCategory,
        video_title: videoTitle.trim(),
        video_description: videoDescription.trim(),
        declaration_original: declarationOriginal,
        declaration_terms: declarationTerms,
        declaration_usage_rights: declarationUsageRights,
        document_file_name: documentFile ? documentFile.name : '',
        tactlink_qr_name: tactlinkQrFile.name,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Terjadi kesalahan saat pendaftaran.');
        setLoading(false);
        return;
      }

      setSuccessData({
        registration_code: json.data.registration_code,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        institution: institution.trim(),
        category: videoCategory,
        video_title: videoTitle.trim(),
      });
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch {
      setErrorMessage('Gagal menghubungi server. Pastikan koneksi internet Anda stabil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            ← Kembali
          </Link>
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Image
              src="/LOGO_PRIDE_INDUSTRI.png"
              alt="PRIDE Industri 2026"
              width={140}
              height={42}
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>
        </div>

        {/* Page Title & Context Header */}
        <div className="pt-2 sm:pt-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            Formulir Pendaftaran Resmi
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight pt-1">
            Lomba Video 1 Menit PRIDE Industri 2026
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-700 italic">
            &ldquo;Karya Lokal, Cerita Lokal: Mengangkat Dinamika &amp; Eksistensi IKM Kota Bandung&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Pendaftaran terbuka untuk umum WNI, 100% gratis tanpa dipungut biaya. Total hadiah Rp 2.250.000 dengan piala dan sertifikat Walikota Bandung.
          </p>
        </div>

        {/* Technical Guide Notice Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-900">
              Panduan Teknis Video
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Format vertikal (9:16) maksimal 60 detik di koridor Jalan Braga pada 27–28 Nov 2026.
            </div>
          </div>
          <a
            href="/syarat-lomba-video.pdf"
            download
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-all shrink-0 cursor-pointer"
          >
            <span>Unduh Petunjuk Teknis PDF</span>
            <span>↗</span>
          </a>
        </div>

        {/* ─── SUCCESS SCREEN ─── */}
        {successData ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-200 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Pendaftaran Berhasil Dikirim
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Selamat, Berkas Anda Telah Terdaftar!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Terima kasih atas partisipasi Anda dalam Lomba Video 1 Menit PRIDE Industri 2026. Simpan kode registrasi Anda untuk verifikasi dan check-in di venue.
              </p>
            </div>

            {/* Registration Code Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kode Registrasi Peserta
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-blue-600 tracking-wider">
                {successData.registration_code}
              </div>
            </div>

            {/* Summary Data */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Nama Peserta:</span>
                <span className="font-bold text-slate-800">{successData.full_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Instansi / Asal:</span>
                <span className="font-bold text-slate-800">{successData.institution}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Kategori Sub-Sektor:</span>
                <span className="font-bold text-blue-700">{successData.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Judul Karya:</span>
                <span className="font-bold text-slate-800 line-clamp-1">{successData.video_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Konfirmasi:</span>
                <span className="font-bold text-slate-800">{successData.email}</span>
              </div>
            </div>

            {/* Next Steps Prompt */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 text-left max-w-md mx-auto space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <span>📍</span> Langkah Selanjutnya:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                <li>Bawa smartphone dan kartu identitas saat shooting di Braga (27–28 Nov 2026).</li>
                <li>Gunakan aplikasi TactLink Anda untuk check-in dan bertukar kontak digital.</li>
                <li>Pengumuman pemenang pada Malam Penganugerahan di Ballroom The Papandayan.</li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md cursor-pointer"
              >
                Kembali ke Beranda Utama
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ════════════════════════════════════════════════════════════════
                STEP PROGRESS BAR & STEPPER NAVIGATION
                ════════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Langkah {currentStep} dari 5: <span className="text-blue-600">{FORM_STEPS[currentStep - 1].title}</span>
                </span>
                <span className="text-slate-500 font-medium">
                  {Math.round((currentStep / 5) * 100)}% Selesai
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>

              {/* Stepper Buttons (Quick Jump to visited steps) */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {FORM_STEPS.map((s) => {
                  const isCompleted = s.step < currentStep;
                  const isActive = s.step === currentStep;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        if (isCompleted) goToPreviousStep(s.step);
                      }}
                      disabled={!isCompleted}
                      className={`py-2 px-1 rounded-xl text-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-black'
                          : isCompleted
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold cursor-pointer'
                          : 'bg-slate-50 text-slate-400 font-medium cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="text-[11px] sm:text-xs leading-none">
                        {isCompleted ? '✓' : s.step}
                      </div>
                      <div className="text-[10px] hidden sm:block truncate mt-0.5">
                        {s.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Error Notice */}
            {stepError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2.5 shadow-xs">
                <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{stepError}</span>
              </div>
            )}

            {/* Server Error Notice */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium flex items-center gap-2.5 shadow-xs">
                <svg className="w-4 h-4 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ─── MULTI-STEP SECTIONS (1 PER SECTION) ─── */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 1: DATA DIRI (Visible on currentStep === 1)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 1 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Data Diri / Tim Peserta
                      </h2>
                      <p className="text-xs text-slate-500">
                        Identitas ketua tim atau peserta perorangan yang sah.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="full_name" className="text-xs font-bold text-slate-700 block">
                        Nama Lengkap (Sesuai KTP/Kartu Pelajar/Mahasiswa) <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="full_name"
                        type="text"
                        required
                        placeholder="Contoh: Raden Rangga Sasana"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="institution" className="text-xs font-bold text-slate-700 block">
                        Instansi / Asal Peserta <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="institution"
                        type="text"
                        required
                        placeholder="Contoh: Institut Teknologi Bandung / Komunitas Kreator Bandung / Umum"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-700 block">
                        Nomor WhatsApp / HP Aktif <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        placeholder="081234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-700 block">
                        Alamat Email Aktif <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => goToNextStep(2)}
                      className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lanjut</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 2: INFORMASI KARYA (Visible on currentStep === 2)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 2 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Informasi Karya Video
                      </h2>
                      <p className="text-xs text-slate-500">
                        Rincian sub-sektor IKM, judul karya, dan konsep video promosi.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Kategori Sub-Sektor IKM yang Diangkat <span className="text-blue-600">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {(['Fesyen', 'Kuliner', 'Kriya', 'PRIDE Industri 2026'] as VideoCategory[]).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setVideoCategory(cat)}
                            className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                              videoCategory === cat
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="video_title" className="text-xs font-bold text-slate-700 block">
                        Judul Karya Video <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="video_title"
                        type="text"
                        required
                        placeholder="Contoh: Kilau Tenun Wastra di Sudut Kota Kembang"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="video_description" className="text-xs font-bold text-slate-700 block">
                        Sinopsis / Deskripsi Singkat Karya <span className="text-blue-600">*</span>
                      </label>
                      <textarea
                        id="video_description"
                        rows={3}
                        required
                        placeholder="Ceritakan pesan utama, keunikan produk IKM yang diangkat, dan sudut pandang visual video Anda..."
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => goToPreviousStep(1)}
                      className="py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>← Kembali</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToNextStep(3)}
                      className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lanjut</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 3: PERSETUJUAN & KOMITMEN (Visible on currentStep === 3)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 3 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Persetujuan &amp; Komitmen Peserta
                      </h2>
                      <p className="text-xs text-slate-500">
                        Pernyataan integritas karya, kepatuhan teknis festival, dan hak siar.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={declarationOriginal}
                        onChange={(e) => setDeclarationOriginal(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Keaslian Karya &amp; Bebas Pelanggaran Hak Cipta</strong>
                        Saya menyatakan bahwa video yang diikutsertakan adalah karya orisinal, tidak melanggar hak cipta pihak ketiga, tidak mengandung unsur SARA/pornografi, dan belum pernah memenangkan kompetisi lain.
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={declarationTerms}
                        onChange={(e) => setDeclarationTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Kepatuhan Syarat &amp; Ketentuan Teknis</strong>
                        Saya menyetujui seluruh ketentuan teknis festival, termasuk durasi maksimal 60 detik, format vertikal 9:16, serta jadwal shooting langsung di venue Braga City Walk pada 27–28 November 2026.
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={declarationUsageRights}
                        onChange={(e) => setDeclarationUsageRights(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Hak Tayang &amp; Publikasi Edukasi IKM</strong>
                        Saya memberikan hak kepada Disdagin Kota Bandung dan Pemerintah Kota Bandung untuk menayangkan, mengarsipkan, serta mempublikasikan video untuk kepentingan promosi IKM lokal dan dokumentasi resmi.
                      </div>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => goToPreviousStep(2)}
                      className="py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>← Kembali</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToNextStep(4)}
                      className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lanjut</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 4: UPLOAD DOKUMEN (Visible on currentStep === 4)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 4 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      4
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Upload Dokumen Persyaratan
                      </h2>
                      <p className="text-xs text-slate-500">
                        Pakta integritas dan kartu identitas peserta dalam 1 berkas (Maksimal 5 MB).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Warning Note */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>Format: PDF, DOCX, atau ZIP · <strong>Maksimal 5 MB</strong></span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Strict 5 MB
                      </span>
                    </div>

                    {/* Document Error Alert */}
                    {documentError && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{documentError}</span>
                      </div>
                    )}

                    {/* Upload Box */}
                    <div
                      onClick={() => documentInputRef.current?.click()}
                      className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                        documentFile
                          ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                          : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 text-slate-600'
                      }`}
                    >
                      <input
                        ref={documentInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.zip"
                        onChange={(e) => handleDocumentChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />

                      {documentFile ? (
                        <div className="flex items-center justify-between gap-3 text-left">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {documentFile.name}
                              </div>
                              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                {formatFileSize(documentFile.size)} · Berkas valid &amp; siap dikirim
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentChange(null);
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
                          >
                            Ganti File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            Klik untuk memilih dokumen persyaratan
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Format PDF, DOCX, atau ZIP (Maksimal 5 MB)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => goToPreviousStep(3)}
                      className="py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>← Kembali</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToNextStep(5)}
                      className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lanjut</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 5: SIAPKAN TACTLINK (Visible on currentStep === 5)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 5 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      5
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Siapkan TactLink (Wadah Jejaring Digital Resmi)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Ikuti 5 langkah mudah berikut untuk melengkapi kartu nama digital resmi Anda.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-1">

                    {/* ─── Step 1: Download Tactlink ─── */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                          1
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Download Aplikasi TactLink
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        TactLink adalah platform kartu nama digital resmi festival PRIDE Industri 2026. Unduh aplikasinya secara gratis melalui Play Store atau App Store.
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <a
                          href="https://apps.apple.com/id/app/tactlink/id1469516661"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all hover:scale-102 cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                          <span>Download di App Store ↗</span>
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.tactlink.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all hover:scale-102 cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>Download di Google Play ↗</span>
                        </a>
                      </div>
                    </div>

                    {/* ─── Step 2: Register Akun Tactlink (Embed Video 1) ─── */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                          2
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Register Akun TactLink
                        </h3>
                      </div>
                      {/* User Instruction: Press Play, No Autoplay */}
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-800 flex items-center gap-2 font-medium">
                        <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <span>Instruksi: Tekan tombol play untuk memutar video panduan registrasi akun. Video tidak autoplay agar halaman web Anda tetap ringan dan cepat.</span>
                      </div>

                      <div className="w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md aspect-video sm:aspect-[16/9] relative">
                        <iframe
                          src="https://www.youtube.com/embed/v7jOZ2_Igu8"
                          title="Panduan Registrasi Akun TactLink"
                          style={{ width: '100%', height: '100%', minHeight: '100%', border: 0 }}
                          className="w-full h-full block absolute inset-0 select-none"
                          loading="lazy"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    {/* ─── Step 3: Lengkapi Kartu Nama Digital (Embed Video 2) ─── */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                          3
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Lengkapi Kartu Nama Digital
                        </h3>
                      </div>
                      {/* User Instruction: Press Play, No Autoplay */}
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-800 flex items-center gap-2 font-medium">
                        <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <span>Instruksi: Tekan tombol play untuk menonton video panduan melengkapi profil dan informasi kartu nama digital.</span>
                      </div>

                      <div className="w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md aspect-video sm:aspect-[16/9] relative">
                        <iframe
                          src="https://www.youtube.com/embed/DJ1zPGb8YTM"
                          title="Panduan Melengkapi Kartu Nama Digital TactLink"
                          style={{ width: '100%', height: '100%', minHeight: '100%', border: 0 }}
                          className="w-full h-full block absolute inset-0 select-none"
                          loading="lazy"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    {/* ─── Step 4: Screenshot QR Code TactLink (Embed Video 3) ─── */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                          4
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Screenshoot QR Code untuk Diunggah
                        </h3>
                      </div>
                      {/* User Instruction: Press Play, No Autoplay */}
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-800 flex items-center gap-2 font-medium">
                        <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <span>Instruksi: Tekan tombol play untuk menonton video panduan mengambil tangkapan layar (screenshot) QR code kartu nama digital.</span>
                      </div>

                      <div className="w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md aspect-video sm:aspect-[16/9] relative">
                        <iframe
                          src="https://www.youtube.com/embed/jsNUHQI1EF4"
                          title="Panduan Screenshot QR Code TactLink"
                          style={{ width: '100%', height: '100%', minHeight: '100%', border: 0 }}
                          className="w-full h-full block absolute inset-0 select-none"
                          loading="lazy"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    {/* ─── Step 5: Upload Foto Barcode / QR Kartu Nama Digital ─── */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                          5
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Unggah Foto Barcode / QR Kartu Nama Digital TactLink
                        </h3>
                      </div>

                      {/* Strict Size Warning */}
                      <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          <span>Format: JPG atau PNG · <strong>Maksimal 2 MB</strong></span>
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Maks 2 MB
                        </span>
                      </div>

                      {/* QR Error Alert */}
                      {tactlinkQrError && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
                          <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>{tactlinkQrError}</span>
                        </div>
                      )}

                      {/* Upload Box */}
                      <div
                        onClick={() => tactlinkQrInputRef.current?.click()}
                        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          tactlinkQrFile
                            ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                            : 'border-slate-300 bg-white hover:border-blue-400 text-slate-600'
                        }`}
                      >
                        <input
                          ref={tactlinkQrInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handleTactlinkQrChange(e.target.files?.[0] || null)}
                          className="hidden"
                        />

                        {tactlinkQrFile ? (
                          <div className="flex items-center justify-between gap-3 text-left">
                            <div className="flex items-center gap-3 min-w-0">
                              {tactlinkQrPreview ? (
                                <img
                                  src={tactlinkQrPreview}
                                  alt="Preview QR Tactlink"
                                  className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                  </svg>
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {tactlinkQrFile.name}
                                </div>
                                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                  {formatFileSize(tactlinkQrFile.size)} · Foto barcode / QR siap diunggah
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTactlinkQrChange(null);
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
                            >
                              Ganti QR
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                              </svg>
                            </div>
                            <div className="text-xs font-bold text-slate-800">
                              Klik untuk mengunggah foto barcode / QR TactLink
                            </div>
                            <div className="text-[11px] text-slate-500">
                              JPG atau PNG · Maksimal 2 MB (Kamera / Galeri)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Step 5 Navigation & Final Submission */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => goToPreviousStep(4)}
                      className="w-full sm:w-auto py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>← Kembali</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Memproses Pendaftaran...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim Pendaftaran Resmi Lomba Video 1 Menit</span>
                          <span>✓</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    Dengan mengirim formulir ini, Anda telah menyelesaikan seluruh tahapan registrasi PRIDE Industri 2026.
                  </p>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
