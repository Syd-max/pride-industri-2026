'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FORM_STEPS = [
  { step: 1, title: 'Data Diri', subtitle: 'Identitas peserta & alamat' },
  { step: 2, title: 'Info Produk & Desain', subtitle: 'Merek & bahan lokal' },
  { step: 3, title: 'File Karya & Dokumen', subtitle: 'Desain PDF & pakta integritas' },
  { step: 4, title: 'Persetujuan Peserta', subtitle: 'Orisinalitas & ketentuan lomba' },
];

export default function DesainKemasanPage() {
  // ─── Step Navigation State ───
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // ─── Section 1: Data Diri Peserta ───
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // ─── Section 2: Informasi Produk dan Desain ───
  const [brandName, setBrandName] = useState('');
  const [productName, setProductName] = useState('');
  const [localIngredients, setLocalIngredients] = useState('');
  const [designConcept, setDesignConcept] = useState('');

  // ─── Section 3: File Karya dan Dokumen Pendukung ───
  // 9. File karya desain kemasan (PDF, maks 5 MB, wajib)
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designError, setDesignError] = useState<string | null>(null);
  const designInputRef = useRef<HTMLInputElement>(null);

  // 10. Master file desain (PDF jika pakai AI/PSD/CDR, opsional/ketentuan panitia)
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [masterError, setMasterError] = useState<string | null>(null);
  const masterInputRef = useRef<HTMLInputElement>(null);

  // 11. Pakta Integritas (wajib, maks 5 MB)
  const [paktaFile, setPaktaFile] = useState<File | null>(null);
  const [paktaError, setPaktaError] = useState<string | null>(null);
  const paktaInputRef = useRef<HTMLInputElement>(null);

  // 12. Surat Pernyataan Persetujuan (wajib, maks 5 MB)
  const [persetujuanFile, setPersetujuanFile] = useState<File | null>(null);
  const [persetujuanError, setPersetujuanError] = useState<string | null>(null);
  const persetujuanInputRef = useRef<HTMLInputElement>(null);

  // ─── Section 4: Persetujuan Peserta ───
  const [declarationOriginal, setDeclarationOriginal] = useState(false);
  const [declarationUnpublished, setDeclarationUnpublished] = useState(false);
  const [declarationTerms, setDeclarationTerms] = useState(false);
  const [declarationUsageRights, setDeclarationUsageRights] = useState(false);

  // ─── Submission States ───
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registration_code: string;
    full_name: string;
    email: string;
    brand_name: string;
    product_name: string;
  } | null>(null);

  // Helper format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ─── File Handlers with Strict Size Limits ───
  const handleDesignFileChange = (file: File | null) => {
    setDesignError(null);
    setStepError(null);
    if (!file) {
      setDesignFile(null);
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      setDesignError(
        `File "${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas maksimal 5 MB. File tidak dapat dimasukkan.`
      );
      if (designInputRef.current) designInputRef.current.value = '';
      setDesignFile(null);
      return;
    }
    setDesignFile(file);
  };

  const handleMasterFileChange = (file: File | null) => {
    setMasterError(null);
    setStepError(null);
    if (!file) {
      setMasterFile(null);
      return;
    }
    const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
    if (file.size > MAX_SIZE) {
      setMasterError(
        `Master file "${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas maksimal 15 MB.`
      );
      if (masterInputRef.current) masterInputRef.current.value = '';
      setMasterFile(null);
      return;
    }
    setMasterFile(file);
  };

  const handlePaktaFileChange = (file: File | null) => {
    setPaktaError(null);
    setStepError(null);
    if (!file) {
      setPaktaFile(null);
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      setPaktaError(
        `File Pakta Integritas "${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas maksimal 5 MB.`
      );
      if (paktaInputRef.current) paktaInputRef.current.value = '';
      setPaktaFile(null);
      return;
    }
    setPaktaFile(file);
  };

  const handlePersetujuanFileChange = (file: File | null) => {
    setPersetujuanError(null);
    setStepError(null);
    if (!file) {
      setPersetujuanFile(null);
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      setPersetujuanError(
        `File Surat Pernyataan "${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas maksimal 5 MB.`
      );
      if (persetujuanInputRef.current) persetujuanInputRef.current.value = '';
      setPersetujuanFile(null);
      return;
    }
    setPersetujuanFile(file);
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
      if (!address.trim() || address.trim().length < 5) {
        setStepError('Alamat lengkap wajib diisi sesuai dokumen Pakta Integritas.');
        return;
      }
      if (!phone.trim() || phone.trim().length < 8) {
        setStepError('Nomor HP / WhatsApp aktif wajib diisi minimal 8 digit.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setStepError('Alamat email aktif yang valid wajib diisi.');
        return;
      }
    } else if (currentStep === 2) {
      if (!brandName.trim() || brandName.trim().length < 2) {
        setStepError('Nama merek produk wajib diisi.');
        return;
      }
      if (!productName.trim() || productName.trim().length < 2) {
        setStepError('Nama produk kuliner wajib diisi.');
        return;
      }
      if (!localIngredients.trim() || localIngredients.trim().length < 2) {
        setStepError('Bahan dasar lokal yang digunakan wajib diisi.');
        return;
      }
    } else if (currentStep === 3) {
      if (!designFile) {
        setStepError('Upload file karya desain kemasan dalam format PDF (maks. 5 MB) wajib diunggah.');
        return;
      }
      if (designError) {
        setStepError(designError);
        return;
      }
      if (!paktaFile) {
        setStepError('Upload Pakta Integritas yang telah diisi dan ditandatangani wajib diunggah.');
        return;
      }
      if (paktaError) {
        setStepError(paktaError);
        return;
      }
      if (!persetujuanFile) {
        setStepError('Upload Surat Pernyataan Persetujuan yang telah diisi dan ditandatangani wajib diunggah.');
        return;
      }
      if (persetujuanError) {
        setStepError(persetujuanError);
        return;
      }
    }

    setCurrentStep(targetStep);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const goToPreviousStep = (targetStep: number) => {
    setStepError(null);
    setErrorMessage(null);
    setCurrentStep(targetStep);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // ─── Form Submission Handler (Step 4) ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStepError(null);

    // Final checks on declarations
    if (!declarationOriginal) {
      setErrorMessage('Anda wajib mencentang pernyataan bahwa karya merupakan karya asli dan tidak melanggar hak cipta.');
      return;
    }
    if (!declarationUnpublished) {
      setErrorMessage('Anda wajib mencentang persetujuan bahwa karya belum pernah dipublikasikan atau diikutsertakan lomba lain.');
      return;
    }
    if (!declarationTerms) {
      setErrorMessage('Anda wajib mencentang persetujuan terhadap seluruh syarat dan ketentuan lomba.');
      return;
    }
    if (!declarationUsageRights) {
      setErrorMessage('Anda wajib mencentang persetujuan penggunaan karya untuk publikasi & promosi nonkomersial.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        competition_id: 'desain-kemasan',
        full_name: fullName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        brand_name: brandName.trim(),
        product_name: productName.trim(),
        local_ingredients: localIngredients.trim(),
        design_concept: designConcept.trim(),
        design_file_name: designFile ? designFile.name : '',
        master_file_name: masterFile ? masterFile.name : '',
        pakta_integritas_file_name: paktaFile ? paktaFile.name : '',
        surat_persetujuan_file_name: persetujuanFile ? persetujuanFile.name : '',
        declaration_original: declarationOriginal,
        declaration_unpublished: declarationUnpublished,
        declaration_terms: declarationTerms,
        declaration_usage_rights: declarationUsageRights,
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
        brand_name: brandName.trim(),
        product_name: productName.trim(),
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
            ← Kembali ke Beranda Festival
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="PRIDE Industri 2026"
              width={110}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>

        {/* Page Title & Context Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            Formulir Pendaftaran Resmi
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Lomba Desain Kemasan IKM PRIDE Industri 2026
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-700 italic">
            &ldquo;Inovasi Eco-Packaging Produk Kuliner &amp; Olahan Pangan Lokal Kota Bandung&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Terbuka untuk umum, mahasiswa, desainer, dan pelaku IKM Kota Bandung. Pendaftaran 100% gratis dengan total hadiah puluhan juta rupiah, piala, serta sertifikat Walikota Bandung.
          </p>
        </div>

        {/* Technical Guide & Template Download Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Format Template Desain
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                5 Halaman standar (Cover, Profil, Konsep, Tampak 3D, Mockup).
              </div>
            </div>
            <a
              href="/template-desain-kemasan.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Unduh Format Template (PDF)</span>
            </a>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Petunjuk Teknis &amp; Format Pakta
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Buku panduan lomba resmi, ketentuan teknis, dan surat pernyataan.
              </div>
            </div>
            <a
              href="/syarat-desain-kemasan.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Unduh Juknis &amp; Format Pakta (PDF)</span>
            </a>
          </div>
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
                Pendaftaran Berhasil Terkonfirmasi
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Selamat, {successData.full_name}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Berkas pendaftaran Lomba Desain Kemasan IKM PRIDE Industri 2026 Anda telah kami terima dan diverifikasi oleh sistem.
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
                <span className="text-slate-500">Nama Merek Produk:</span>
                <span className="font-bold text-slate-800">{successData.brand_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Produk Kuliner:</span>
                <span className="font-bold text-blue-700">{successData.product_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Peserta:</span>
                <span className="font-bold text-slate-800">{successData.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-800">{successData.email}</span>
              </div>
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
                STEP PROGRESS BAR & STEPPER NAVIGATION (4 SECTIONS)
                ════════════════════════════════════════════════════════════════ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Langkah {currentStep} dari 4: <span className="text-blue-600">{FORM_STEPS[currentStep - 1].title}</span>
                </span>
                <span className="text-slate-500 font-medium">
                  {Math.round((currentStep / 4) * 100)}% Selesai
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>

              {/* Stepper Buttons (Quick Jump to visited steps) */}
              <div className="grid grid-cols-4 gap-2 pt-1">
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

            {/* Step Error Alert */}
            {stepError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2.5 shadow-xs">
                <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{stepError}</span>
              </div>
            )}

            {/* Server Error Alert */}
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

            {/* ─── 4 SECTIONS MULTI-STEP FORM ─── */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 1: DATA DIRI PESERTA (Visible on currentStep === 1)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 1 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Data Diri Peserta
                      </h2>
                      <p className="text-xs text-slate-500">
                        Identitas diri dan alamat domisili lengkap peserta yang sah.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* 1. Nama lengkap */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="full_name" className="text-xs font-bold text-slate-700 block">
                        Nama Lengkap (Sesuai KTP) <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="full_name"
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Irsyad"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>

                    {/* 2. Alamat lengkap */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="address" className="text-xs font-bold text-slate-700 block">
                        Alamat Lengkap (Wajib sesuai dokumen Pakta Integritas) <span className="text-blue-600">*</span>
                      </label>
                      <textarea
                        id="address"
                        rows={2}
                        required
                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota Bandung"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* 3. Nomor HP / WhatsApp */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-700 block">
                        Nomor HP / WhatsApp Aktif <span className="text-blue-600">*</span>
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

                    {/* 4. Alamat email */}
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
                      <span>Lanjutkan ke Langkah 2: Info Produk &amp; Desain</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 2: INFORMASI PRODUK DAN DESAIN (Visible on currentStep === 2)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 2 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Informasi Produk dan Desain
                      </h2>
                      <p className="text-xs text-slate-500">
                        Rincian merek, produk kuliner, bahan dasar lokal, dan konsep desain.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* 5. Nama merek produk */}
                    <div className="space-y-1.5">
                      <label htmlFor="brand_name" className="text-xs font-bold text-slate-700 block">
                        Nama Merek Produk <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="brand_name"
                        type="text"
                        required
                        placeholder="Contoh: Kripik Seuhah Raos / Sambal Priangan"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>

                    {/* 6. Nama produk kuliner */}
                    <div className="space-y-1.5">
                      <label htmlFor="product_name" className="text-xs font-bold text-slate-700 block">
                        Nama Produk Kuliner <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="product_name"
                        type="text"
                        required
                        placeholder="Contoh: Keripik Singkong Balado Daun Jeruk"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>

                    {/* 7. Bahan dasar lokal yang digunakan */}
                    <div className="space-y-1.5">
                      <label htmlFor="local_ingredients" className="text-xs font-bold text-slate-700 block">
                        Bahan Dasar Lokal yang Digunakan <span className="text-blue-600">*</span>
                      </label>
                      <input
                        id="local_ingredients"
                        type="text"
                        required
                        placeholder="Contoh: Singkong Manggu lokal Bandung, cabai merah tanjung, daun jeruk purut"
                        value={localIngredients}
                        onChange={(e) => setLocalIngredients(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                      <p className="text-[11px] text-slate-500">
                        Sebutkan bahan baku atau komoditas lokal Jawa Barat yang menjadi keunggulan produk.
                      </p>
                    </div>

                    {/* 8. Deskripsi singkat konsep desain kemasan (opsional) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="design_concept" className="text-xs font-bold text-slate-700 block">
                          Deskripsi Singkat Konsep Desain Kemasan
                        </label>
                        <span className="text-[10px] text-slate-400 font-semibold">(Opsional)</span>
                      </div>
                      <textarea
                        id="design_concept"
                        rows={3}
                        placeholder="Jelaskan filosofi visual, pemilihan warna, material ramah lingkungan (eco-packaging), atau keunikan bentuk kemasan..."
                        value={designConcept}
                        onChange={(e) => setDesignConcept(e.target.value)}
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
                      <span>← Kembali ke Data Diri</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToNextStep(3)}
                      className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lanjutkan ke Langkah 3: File Karya &amp; Dokumen</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 3: FILE KARYA DAN DOKUMEN PENDUKUNG (currentStep === 3)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 3 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        File Karya dan Dokumen Pendukung
                      </h2>
                      <p className="text-xs text-slate-500">
                        Unggah karya desain kemasan PDF, master file, Pakta Integritas, dan Surat Pernyataan.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 pt-1">

                    {/* ─── 9. Upload file karya desain kemasan (PDF, maks 5 MB, wajib) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          9. File Karya Desain Kemasan (PDF, Maksimal 5 MB) <span className="text-blue-600">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Maks 5 MB · Wajib PDF
                        </span>
                      </div>

                      {designError && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                          {designError}
                        </div>
                      )}

                      <div
                        onClick={() => designInputRef.current?.click()}
                        className={`p-5 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          designFile
                            ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 text-slate-600'
                        }`}
                      >
                        <input
                          ref={designInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleDesignFileChange(e.target.files?.[0] || null)}
                          className="hidden"
                        />

                        {designFile ? (
                          <div className="flex items-center justify-between gap-3 text-left">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">{designFile.name}</div>
                                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                  {formatFileSize(designFile.size)} · Siap dikirim
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDesignFileChange(null);
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/70"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="text-xs font-bold text-slate-800">
                              Klik untuk mengunggah file karya desain (PDF)
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Format 5 halaman PDF sesuai template resmi (Maksimal 5 MB)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ─── 10. Upload master file desain (PDF jika pakai AI/PSD/CDR) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          10. Master File Desain (Format PDF jika menggunakan AI, PSD, atau CDR)
                        </label>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          Opsional / Ketentuan Panitia
                        </span>
                      </div>

                      {masterError && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                          {masterError}
                        </div>
                      )}

                      <div
                        onClick={() => masterInputRef.current?.click()}
                        className={`p-4 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          masterFile
                            ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 text-slate-600'
                        }`}
                      >
                        <input
                          ref={masterInputRef}
                          type="file"
                          accept=".pdf,.zip,.rar"
                          onChange={(e) => handleMasterFileChange(e.target.files?.[0] || null)}
                          className="hidden"
                        />

                        {masterFile ? (
                          <div className="flex items-center justify-between gap-3 text-left">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">{masterFile.name}</div>
                                <div className="text-[11px] text-emerald-700 font-semibold">{formatFileSize(masterFile.size)}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMasterFileChange(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                              Hapus
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-700">
                              Unggah master file PDF (opsional jika karya dibuat via vector/raster)
                            </div>
                            <div className="text-[11px] text-slate-400">
                              PDF atau arsip ZIP/RAR (Maksimal 15 MB)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ─── 11. Upload Pakta Integritas (wajib, maks 5 MB) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          11. Pakta Integritas yang Telah Diisi &amp; Ditandatangani <span className="text-blue-600">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Wajib · PDF / JPG / PNG
                        </span>
                      </div>

                      {paktaError && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                          {paktaError}
                        </div>
                      )}

                      <div
                        onClick={() => paktaInputRef.current?.click()}
                        className={`p-4 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          paktaFile
                            ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 text-slate-600'
                        }`}
                      >
                        <input
                          ref={paktaInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.docx"
                          onChange={(e) => handlePaktaFileChange(e.target.files?.[0] || null)}
                          className="hidden"
                        />

                        {paktaFile ? (
                          <div className="flex items-center justify-between gap-3 text-left">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">{paktaFile.name}</div>
                                <div className="text-[11px] text-emerald-700 font-semibold">{formatFileSize(paktaFile.size)}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePaktaFileChange(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-700">
                              Klik untuk mengunggah scan / foto Pakta Integritas (Maksimal 5 MB)
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Format PDF, JPG, atau PNG bertanda tangan
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ─── 12. Upload Surat Pernyataan Persetujuan (wajib, maks 5 MB) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          12. Surat Pernyataan Persetujuan yang Telah Diisi &amp; Ditandatangani <span className="text-blue-600">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Wajib · PDF / JPG / PNG
                        </span>
                      </div>

                      {persetujuanError && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                          {persetujuanError}
                        </div>
                      )}

                      <div
                        onClick={() => persetujuanInputRef.current?.click()}
                        className={`p-4 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          persetujuanFile
                            ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 text-slate-600'
                        }`}
                      >
                        <input
                          ref={persetujuanInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.docx"
                          onChange={(e) => handlePersetujuanFileChange(e.target.files?.[0] || null)}
                          className="hidden"
                        />

                        {persetujuanFile ? (
                          <div className="flex items-center justify-between gap-3 text-left">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">{persetujuanFile.name}</div>
                                <div className="text-[11px] text-emerald-700 font-semibold">{formatFileSize(persetujuanFile.size)}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePersetujuanFileChange(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-700">
                              Klik untuk mengunggah scan / foto Surat Pernyataan Persetujuan (Maksimal 5 MB)
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Format PDF, JPG, atau PNG bertanda tangan
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => goToPreviousStep(2)}
                      className="py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>← Kembali ke Info Produk</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToNextStep(4)}
                      className="py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Lanjutkan ke Langkah 4: Persetujuan</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 4: PERSETUJUAN PESERTA (Visible on currentStep === 4)
                  ════════════════════════════════════════════════════════════════ */}
              {currentStep === 4 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      4
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Persetujuan Peserta
                      </h2>
                      <p className="text-xs text-slate-500">
                        Pernyataan keaslian karya, belum dipublikasikan, syarat lomba, dan hak guna nonkomersial.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {/* 13. Orisinalitas */}
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={declarationOriginal}
                        onChange={(e) => setDeclarationOriginal(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Keaslian Karya &amp; Hak Cipta</strong>
                        Saya menyatakan bahwa karya desain kemasan yang didaftarkan merupakan karya asli ciptaan sendiri dan tidak melanggar hak cipta pihak mana pun.
                      </div>
                    </label>

                    {/* 14. Belum pernah dipublikasikan */}
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={declarationUnpublished}
                        onChange={(e) => setDeclarationUnpublished(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Belum Pernah Dipublikasikan</strong>
                        Saya menyatakan bahwa karya desain ini belum pernah dipublikasikan di media komersial mana pun dan belum pernah diikutsertakan dalam kompetisi desain lain sesuai ketentuan panitia.
                      </div>
                    </label>

                    {/* 15. Syarat dan Ketentuan Lomba */}
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={declarationTerms}
                        onChange={(e) => setDeclarationTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Kepatuhan Syarat &amp; Ketentuan Lomba</strong>
                        Saya telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan Lomba Desain Kemasan PRIDE Industri 2026 serta menerima keputusan Dewan Juri bersifat mutlak.
                      </div>
                    </label>

                    {/* 16. Hak Penggunaan Nonkomersial */}
                    <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={declarationUsageRights}
                        onChange={(e) => setDeclarationUsageRights(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Hak Publikasi &amp; Dokumentasi Nonkomersial</strong>
                        Saya menyetujui penggunaan karya oleh Disdagin Kota Bandung untuk publikasi, promosi festival, dan dokumentasi resmi lomba secara nonkomersial dengan tetap mencantumkan nama pembuat.
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => goToPreviousStep(3)}
                      className="w-full sm:w-auto py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>← Kembali ke File Karya</span>
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
                          <span>Kirim Formulir Pendaftaran Desain Kemasan</span>
                          <span>✓</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">
                    Data Anda tersimpan secara aman pada sistem registrasi resmi PRIDE Industri 2026.
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
