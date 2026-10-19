'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { sanitizeStorageFileName } from '@/lib/storage';
import { generateRegistrationCode } from '@/lib/utils';

function inferContentType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'zip': return 'application/zip';
    case 'rar': return 'application/x-rar-compressed';
    default: return 'application/pdf';
  }
}

const FORM_STEPS = [
  { step: 1, title: 'Data Diri', subtitle: 'Identitas peserta & alamat' },
  { step: 2, title: 'Info Produk & Desain', subtitle: 'Merek & bahan lokal' },
  { step: 3, title: 'File Karya & Dokumen', subtitle: 'Desain PDF & pakta integritas' },
  { step: 4, title: 'Persetujuan Peserta', subtitle: 'Orisinalitas & ketentuan lomba' },
  { step: 5, title: 'Siapkan TactLink', subtitle: 'Kartu nama digital resmi (Wajib)' },
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

  // ─── Section 5: Siapkan TactLink (Wadah Jejaring Digital Resmi - Wajib) ───
  const [tactlinkQrFile, setTactlinkQrFile] = useState<File | null>(null);
  const [tactlinkQrPreview, setTactlinkQrPreview] = useState<string | null>(null);
  const [tactlinkQrError, setTactlinkQrError] = useState<string | null>(null);
  const tactlinkQrInputRef = useRef<HTMLInputElement>(null);

  // ─── Submission States ───
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [activeVideoTab, setActiveVideoTab] = useState<number>(1);
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
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      setDesignError(
        `File "${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas maksimal 10 MB. File tidak dapat dimasukkan.`
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
        setStepError('Upload file karya desain kemasan dalam format PDF (maks. 10 MB) wajib diunggah.');
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
    } else if (currentStep === 4) {
      if (!declarationOriginal) {
        setStepError('Anda wajib mencentang pernyataan bahwa karya merupakan karya asli dan tidak melanggar hak cipta.');
        return;
      }
      if (!declarationUnpublished) {
        setStepError('Anda wajib mencentang persetujuan bahwa karya belum pernah dipublikasikan atau diikutsertakan lomba lain.');
        return;
      }
      if (!declarationTerms) {
        setStepError('Anda wajib mencentang persetujuan terhadap seluruh syarat dan ketentuan lomba.');
        return;
      }
      if (!declarationUsageRights) {
        setStepError('Anda wajib mencentang persetujuan penggunaan karya untuk publikasi & promosi nonkomersial.');
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

  // ─── Form Submission Handler (Step 5) ───
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

    // Mandatory check for TactLink QR (Step 5)
    if (!tactlinkQrFile) {
      setErrorMessage('Wajib mengunggah foto barcode / QR kartu nama digital TactLink (maksimal 2 MB).');
      return;
    }
    if (tactlinkQrError) {
      setErrorMessage(tactlinkQrError);
      return;
    }

    setLoading(true);
    setUploadProgress('Menyiapkan pendaftaran...');

    try {
      const code = generateRegistrationCode('desain-kemasan');
      const supabase = createClient();

      const filesToUpload: { file: File; key: string }[] = [];
      if (designFile) filesToUpload.push({ file: designFile, key: 'design_file' });
      if (masterFile) filesToUpload.push({ file: masterFile, key: 'master_file' });
      if (paktaFile) filesToUpload.push({ file: paktaFile, key: 'pakta_integritas_file' });
      if (persetujuanFile) filesToUpload.push({ file: persetujuanFile, key: 'surat_persetujuan_file' });
      if (tactlinkQrFile) filesToUpload.push({ file: tactlinkQrFile, key: 'tactlink_qr_file' });

      // Direct client upload to Supabase Storage (bypasses Vercel 4.5MB serverless limit)
      for (let i = 0; i < filesToUpload.length; i++) {
        const item = filesToUpload[i];
        setUploadProgress(`Mengunggah berkas (${i + 1}/${filesToUpload.length})...`);

        const safeName = sanitizeStorageFileName(item.file.name);
        const objectPath = `registrations/${code}/${safeName}`;
        const contentType = inferContentType(item.file);

        const { error: uploadError } = await supabase.storage
          .from('community-assets')
          .upload(objectPath, item.file, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Gagal mengunggah berkas "${item.file.name}": ${uploadError.message}`);
        }
      }

      setUploadProgress('Menyimpan data registrasi...');

      // Send lightweight metadata to API (< 2 KB)
      const payload = {
        registration_code: code,
        competition_id: 'desain-kemasan',
        full_name: fullName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        brand_name: brandName.trim(),
        product_name: productName.trim(),
        local_ingredients: localIngredients.trim(),
        design_concept: designConcept.trim(),
        declaration_original: true,
        declaration_unpublished: true,
        declaration_terms: true,
        declaration_usage_rights: true,
        design_file_name: designFile?.name,
        master_file_name: masterFile?.name || null,
        pakta_integritas_file_name: paktaFile?.name,
        surat_persetujuan_file_name: persetujuanFile?.name,
        tactlink_qr_name: tactlinkQrFile?.name,
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
        registration_code: json.data?.registration_code || code,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        brand_name: brandName.trim(),
        product_name: productName.trim(),
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('[REGISTRATION_SUBMIT_ERROR]', err);
      setErrorMessage(
        err?.message || 'Gagal mengirim pendaftaran. Periksa koneksi internet Anda lalu coba lagi.'
      );
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Bar: Clean Brand Logo on left, back button on right */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="h-8 flex items-center">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE Industri 2026"
                width={120}
                height={32}
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 transition-all shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Kembali</span>
          </Link>
        </div>

        {/* ─── SUCCESS SCREEN ─── */}
        {successData ? (
          <div className="p-6 sm:p-9 rounded-3xl bg-white border border-emerald-200 shadow-xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Pendaftaran Berhasil
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                Selamat, {successData.full_name}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Berkas pendaftaran Lomba Desain Kemasan IKM PRIDE Industri 2026 Anda telah kami terima dan diverifikasi oleh sistem.
              </p>
            </div>

            {/* Registration Code Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kode Registrasi Peserta
              </span>
              <div className="font-mono text-base sm:text-xl font-black text-blue-600 tracking-normal select-all">
                {successData.registration_code}
              </div>
            </div>

            {/* Summary Data */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium">Nama Merek:</span>
                <span className="font-semibold text-slate-900 text-right">{successData.brand_name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium">Produk Kuliner:</span>
                <span className="font-semibold text-slate-900 text-right">{successData.product_name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium">Peserta:</span>
                <span className="font-semibold text-slate-900 text-right">{successData.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-semibold text-slate-900 text-right">{successData.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md cursor-pointer"
              >
                Kembali ke Beranda Utama
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Page Title & Context Header */}
            <div className="pt-1 space-y-1.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pendaftaran Desain Kemasan IKM
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Inovasi Eco-Packaging Produk Kuliner &amp; Olahan Pangan Lokal Kota Bandung. Pendaftaran 100% gratis.
              </p>
            </div>

            {/* Download Buttons: Compact pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href="/template-desain-kemasan.pdf"
                download
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="truncate">Format Template (PDF)</span>
                </span>
                <span className="text-[11px] text-blue-600 font-medium shrink-0 ml-2">Unduh ↗</span>
              </a>

              <a
                href="/syarat-desain-kemasan.pdf"
                download
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="truncate">Juknis &amp; Pakta (PDF)</span>
                </span>
                <span className="text-[11px] text-slate-600 font-medium shrink-0 ml-2">Unduh ↗</span>
              </a>

              <a
                href="https://bit.ly/PRIDE2026LogodanVisualAssets"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-2xs text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                  <span className="truncate">Logo &amp; Aset Visual</span>
                </span>
                <span className="text-[11px] text-emerald-600 font-medium shrink-0 ml-2">Buka ↗</span>
              </a>
            </div>
          <div className="space-y-6">

            {/* ════════════════════════════════════════════════════════════════
                STEP PROGRESS BAR & STEPPER NAVIGATION (5 SECTIONS)
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
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
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
                      <span>Lanjut</span>
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

                    {/* ─── 9. Upload file karya desain kemasan (PDF, maks 10 MB, wajib) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          9. File Karya Desain Kemasan <span className="text-blue-600">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          PDF · Maks 10 MB
                        </span>
                      </div>

                      {designError && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                          {designError}
                        </div>
                      )}

                      <div
                        onClick={() => designInputRef.current?.click()}
                        className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
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
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">{designFile.name}</div>
                                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                  {formatFileSize(designFile.size)} · Berkas terpilih
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDesignFileChange(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/70"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-800">
                              Pilih berkas PDF karya desain
                            </div>
                            <div className="text-[11px] text-slate-500">
                              5 halaman sesuai template resmi
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ─── 10. Upload master file desain (PDF jika pakai AI/PSD/CDR) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          10. Master File Desain
                        </label>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          Opsional · Maks 15 MB
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
                              Pilih master file (PDF, ZIP, atau RAR)
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Diperlukan jika menggunakan AI, PSD, atau CorelDraw
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ─── 11. Upload Pakta Integritas (wajib, maks 5 MB) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          11. Pakta Integritas Bertanda Tangan <span className="text-blue-600">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          PDF / Gambar · Maks 5 MB
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
                              Pilih dokumen Pakta Integritas
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
                          12. Surat Pernyataan Persetujuan <span className="text-blue-600">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          PDF / Gambar · Maks 5 MB
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
                              Pilih dokumen Surat Pernyataan
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
                      <span>← Kembali</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToNextStep(5)}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-2xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Lanjut ke Step 5 (TactLink)</span>
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
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-slate-900">
                          Siapkan TactLink (Wadah Jejaring Digital Resmi)
                        </h2>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Wajib
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Ikuti langkah mudah berikut untuk melengkapi kartu nama digital resmi Anda sebagai syarat wajib festival PRIDE Industri 2026.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 pt-1">

                    {/* ─── 1. Download Tactlink App ─── */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                            1
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                            Unduh Aplikasi TactLink
                          </h3>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">Gratis</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        TactLink adalah platform kartu nama digital resmi festival PRIDE Industri 2026. Unduh secara gratis melalui tautan di bawah ini.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <a
                          href="https://apps.apple.com/id/app/tactlink/id1469516661"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                          <span>App Store ↗</span>
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.tactlink.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>Google Play ↗</span>
                        </a>
                      </div>
                    </div>

                    {/* ─── 2. Video Panduan Tabbed Player ─── */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                            2
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                            Video Panduan TactLink
                          </h3>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">Pilih langkah di bawah</span>
                      </div>

                      {/* Video Selector Tabs */}
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setActiveVideoTab(1)}
                          className={`py-2 px-2 text-center rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                            activeVideoTab === 1
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                          }`}
                        >
                          1. Daftar Akun
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveVideoTab(2)}
                          className={`py-2 px-2 text-center rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                            activeVideoTab === 2
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                          }`}
                        >
                          2. Isi Profil
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveVideoTab(3)}
                          className={`py-2 px-2 text-center rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                            activeVideoTab === 3
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                          }`}
                        >
                          3. Ambil QR
                        </button>
                      </div>

                      {/* Single Responsive Embedded Video */}
                      <div className="w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs aspect-video relative">
                        {activeVideoTab === 1 && (
                          <iframe
                            src="https://www.youtube.com/embed/v7jOZ2_Igu8"
                            title="Panduan Registrasi Akun TactLink"
                            className="w-full h-full block absolute inset-0 select-none border-0"
                            loading="lazy"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                        {activeVideoTab === 2 && (
                          <iframe
                            src="https://www.youtube.com/embed/DJ1zPGb8YTM"
                            title="Panduan Melengkapi Profil TactLink"
                            className="w-full h-full block absolute inset-0 select-none border-0"
                            loading="lazy"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                        {activeVideoTab === 3 && (
                          <iframe
                            src="https://www.youtube.com/embed/jsNUHQI1EF4"
                            title="Panduan Screenshot QR Code TactLink"
                            className="w-full h-full block absolute inset-0 select-none border-0"
                            loading="lazy"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    </div>

                    {/* ─── 3. Upload QR Code Tactlink ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 block">
                          3. Foto Barcode / QR Kartu Nama Digital <span className="text-blue-600">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Gambar · Maks 2 MB
                        </span>
                      </div>

                      {tactlinkQrError && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                          {tactlinkQrError}
                        </div>
                      )}

                      <div
                        onClick={() => tactlinkQrInputRef.current?.click()}
                        className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          tactlinkQrFile
                            ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 text-slate-600'
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
                                  className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                  {formatFileSize(tactlinkQrFile.size)} · Foto barcode siap diunggah
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTactlinkQrChange(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/70"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-800">
                              Pilih tangkapan layar (screenshot) QR TactLink
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Format JPG atau PNG
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Step 5 Navigation & Final Submission */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
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
                          <span>{uploadProgress || 'Memproses Pendaftaran...'}</span>
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
          </>
        )}

      </div>
    </div>
  );
}
