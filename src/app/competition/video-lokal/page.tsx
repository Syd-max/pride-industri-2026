'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';
import TactlinkBanner from '@/components/ui/TactlinkBanner';

type VideoCategory = 'Fesyen' | 'Kuliner' | 'Kriya' | 'PRIDE Industri 2026';

export default function VideoLokalPage() {
  // ─── 1. Form States ───
  // Section 1: Data Diri
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Section 2: Informasi Karya
  const [videoCategory, setVideoCategory] = useState<VideoCategory>('Fesyen');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  // Section 3: Persetujuan & Komitmen
  const [declarationOriginal, setDeclarationOriginal] = useState(false);
  const [declarationTerms, setDeclarationTerms] = useState(false);
  const [declarationUsageRights, setDeclarationUsageRights] = useState(false);

  // Section 4: Upload Dokumen Persyaratan (Max 5 MB)
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Section 5: Siapkan Tactlink — Upload QR Code (Max 2 MB)
  const [tactlinkQrFile, setTactlinkQrFile] = useState<File | null>(null);
  const [tactlinkQrPreview, setTactlinkQrPreview] = useState<string | null>(null);
  const [tactlinkQrError, setTactlinkQrError] = useState<string | null>(null);
  const tactlinkQrInputRef = useRef<HTMLInputElement>(null);

  // Submission States
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

  // ─── Form Submission Handler ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Section 1: Data Diri
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Nama lengkap wajib diisi minimal 3 karakter.');
      return;
    }
    if (!institution.trim() || institution.trim().length < 2) {
      setErrorMessage('Instansi / asal peserta wajib diisi (misal: Universitas / Sekolah / Komunitas / Umum).');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Nomor WhatsApp / HP wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Alamat email aktif wajib diisi dengan format yang benar.');
      return;
    }

    // Section 2: Informasi Karya
    if (!videoTitle.trim() || videoTitle.trim().length < 3) {
      setErrorMessage('Judul karya video wajib diisi minimal 3 karakter.');
      return;
    }

    // Section 3: Persetujuan
    if (!declarationOriginal) {
      setErrorMessage('Anda wajib mencentang persetujuan orisinalitas karya.');
      return;
    }
    if (!declarationTerms) {
      setErrorMessage('Anda wajib mencentang persetujuan terhadap syarat dan ketentuan lomba.');
      return;
    }
    if (!declarationUsageRights) {
      setErrorMessage('Anda wajib mencentang persetujuan hak publikasi & tayang video.');
      return;
    }

    // Section 4: Dokumen Persyaratan (Max 5 MB)
    if (!documentFile) {
      setErrorMessage('Wajib mengunggah dokumen persyaratan lomba (maksimal 5 MB).');
      return;
    }

    // Section 5: Barcode/QR TactLink (Max 2 MB)
    if (!tactlinkQrFile) {
      setErrorMessage('Wajib mengunggah foto barcode / QR kartu nama digital TactLink (maksimal 2 MB).');
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
        document_file_name: documentFile.name,
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
              PRIDE <span className="text-blue-600">INDUSTRI 2026</span>
            </span>
          </div>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-blue-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
                Pendaftaran Berhasil Terkonfirmasi
              </span>
              <h1 className="text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight">
                Selamat, {successData.full_name}!
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Anda telah resmi terdaftar dalam{' '}
                <strong className="text-blue-600 font-bold">
                  Lomba Video 1 Menit PRIDE Industri 2026
                </strong>
                .
              </p>
            </div>

            {/* Official Pass Badge */}
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-blue-100">
                <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  Kode Registrasi Resmi:
                </span>
                <span className="font-mono text-base font-extrabold text-blue-700">
                  {successData.registration_code}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Kategori:</span>
                <span className="text-slate-800 font-bold">{successData.category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Judul Karya:</span>
                <span className="text-slate-800 font-bold truncate max-w-[200px]">{successData.video_title}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Instansi / Asal:</span>
                <span className="text-slate-800 font-medium">{successData.institution}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Status Kehadiran:</span>
                <span className="text-amber-700 font-bold">Belum Check-In di Lokasi</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/check-in"
                className="px-6 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all w-full sm:w-auto"
              >
                Buka Menu Check-In
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all w-full sm:w-auto"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          /* Main Form View */
          <div className="space-y-8">
            {/* Header Section */}
            <div>
              <div className="inline-block text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-3">
                Formulir Pendaftaran Resmi
              </div>
              <h1 className="text-3xl sm:text-4xl text-slate-900 font-black tracking-tight">
                Lomba Video 1 Menit PRIDE Industri 2026
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-bold italic mt-2">
                &ldquo;Karya Lokal, Cerita Lokal: Mengangkat Dinamika &amp; Eksistensi IKM Kota Bandung&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Pendaftaran terbuka untuk umum WNI, 100% gratis tanpa dipungut biaya. Total hadiah Rp 2.250.000 dengan piala dan sertifikat Walikota Bandung.
              </p>
            </div>

            {/* Quick Guidelines Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">Panduan Teknis Video</div>
                <div className="text-slate-600">
                  Format vertikal (9:16) maksimal 60 detik di koridor Jalan Braga pada 27–28 Nov 2026.
                </div>
              </div>
              <a
                href={EVENT_CONFIG.competitions.videoLokal.documentPath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
              >
                Unduh Petunjuk Teknis PDF ↗
              </a>
            </div>

            {/* Global Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3 font-semibold shadow-xs"
              >
                <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ─── 5 SECTIONS FORM ─── */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 1: DATA DIRI
                  ════════════════════════════════════════════════════════════════ */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
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
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 2: INFORMASI KARYA
                  ════════════════════════════════════════════════════════════════ */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
                    2
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Informasi Karya Video
                    </h2>
                    <p className="text-xs text-slate-500">
                      Kategori dan fokus objek visual karya video vertikal Anda.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Kategori Objek Lomba <span className="text-blue-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {(['Fesyen', 'Kuliner', 'Kriya', 'PRIDE Industri 2026'] as VideoCategory[]).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setVideoCategory(cat)}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            videoCategory === cat
                              ? 'bg-blue-50 border-blue-500 text-blue-800 font-black shadow-xs ring-2 ring-blue-500/10'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs">{cat}</span>
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
                      placeholder="Contoh: Langkah Baru Wastra Braga - Cerita Dari Balik Canting"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="video_desc" className="text-xs font-bold text-slate-700 block">
                      Deskripsi Singkat &amp; Konsep Cerita
                    </label>
                    <textarea
                      id="video_desc"
                      rows={3}
                      placeholder="Ceritakan secara ringkas pesan, alur cerita, atau produk IKM yang Anda angkat dalam video..."
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 3: PERSETUJUAN & KOMITMEN (REPLACES SOCIAL LINKS)
                  ════════════════════════════════════════════════════════════════ */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
                    3
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Persetujuan &amp; Komitmen Peserta
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pakta integritas kepatuhan hukum, orisinalitas, dan tata tertib festival.
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
                      <strong className="text-slate-900 block mb-0.5">Pernyataan Orisinalitas Karya</strong>
                      Saya menyatakan bahwa karya video yang didaftarkan adalah murni karya orisinal saya/tim, belum pernah memenangkan kompetisi sejenis, dan tidak melanggar hak cipta musik atau visual pihak manapun.
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
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 4: UPLOAD DOKUMEN PERSYARATAN (MAKS. 5 MB)
                  ════════════════════════════════════════════════════════════════ */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
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
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3">
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
                    className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
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
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {documentFile.name}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-mono font-bold">
                              {formatFileSize(documentFile.size)} · Siap Diunggah
                            </span>
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
                          Ganti
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Klik untuk memilih dokumen persyaratan
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Format PDF/DOCX/ZIP · Maksimal 5 MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  SECTION 5: SIAPKAN TACTLINK (5 DETAILED STEPS)
                  ════════════════════════════════════════════════════════════════ */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
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
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all hover:scale-102 cursor-pointer"
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all hover:scale-102 cursor-pointer"
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
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Register Akun TactLink
                      </h3>
                    </div>
                    {/* User Instruction: Press Play, No Autoplay */}
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-800 flex items-center gap-2 font-medium">
                      <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span>Instruksi: Tekan tombol play untuk memutar video panduan registrasi akun. Video tidak autoplay agar halaman web Anda tetap ringan dan cepat.</span>
                    </div>

                    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
                      <iframe
                        src="https://www.youtube.com/embed/v7jOZ2_Igu8"
                        title="Panduan Registrasi Akun TactLink"
                        className="w-full h-full border-0"
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* ─── Step 3: Lengkapi Kartu Nama Digital (Embed Video 2) ─── */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                        3
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Lengkapi Kartu Nama Digital
                      </h3>
                    </div>
                    {/* User Instruction: Press Play, No Autoplay */}
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-800 flex items-center gap-2 font-medium">
                      <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span>Instruksi: Tekan tombol play untuk menonton video panduan melengkapi profil dan informasi kartu nama digital.</span>
                    </div>

                    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
                      <iframe
                        src="https://www.youtube.com/embed/DJ1zPGb8YTM"
                        title="Panduan Melengkapi Kartu Nama Digital TactLink"
                        className="w-full h-full border-0"
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* ─── Step 4: Screenshot QR Code (Embed Video 3) ─── */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                        4
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Screenshot QR Code Kartu Nama Digital
                      </h3>
                    </div>
                    {/* User Instruction: Press Play, No Autoplay */}
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-800 flex items-center gap-2 font-medium">
                      <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span>Instruksi: Tonton panduan di bawah untuk melihat langkah screenshot QR code kartu nama digital TactLink Anda sebelum diunggah.</span>
                    </div>

                    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
                      <iframe
                        src="https://www.youtube.com/embed/jsNUHQI1EF4"
                        title="Panduan Screenshot QR Code Kartu Nama Digital TactLink"
                        className="w-full h-full border-0"
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* ─── Step 5: Upload Barcode / QR Code (Max 2 MB) ─── */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                        5
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Unggah foto barcode / QR kartu nama digital TactLink
                        </h3>
                        <p className="text-xs text-slate-500">
                          {tactlinkQrFile
                            ? `${tactlinkQrFile.name} (${formatFileSize(tactlinkQrFile.size)})`
                            : 'Belum diunggah · JPG/PNG, maksimal 2 MB'}
                        </p>
                      </div>
                    </div>

                    {/* Size Warning Badge */}
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
                      <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>
                        Peringatan: File harus berformat JPG atau PNG dengan ukuran <strong>maksimal 2 MB</strong>. Jika ukuran file lebih dari 2 MB, sistem otomatis menolak file tersebut.
                      </span>
                    </div>

                    {/* QR Error Alert */}
                    {tactlinkQrError && (
                      <div className="p-3.5 rounded-2xl bg-amber-100 border border-amber-300 text-xs text-amber-950 font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{tactlinkQrError}</span>
                      </div>
                    )}

                    {/* QR Upload Box */}
                    <div
                      onClick={() => tactlinkQrInputRef.current?.click()}
                      className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                        tactlinkQrFile
                          ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900'
                          : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-400 text-slate-600'
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
                        <div className="flex items-center justify-between gap-4 text-left">
                          <div className="flex items-center gap-3.5 min-w-0">
                            {tactlinkQrPreview ? (
                              <div className="relative w-14 h-14 rounded-xl border border-emerald-200 overflow-hidden shrink-0 bg-white shadow-2xs">
                                <Image
                                  src={tactlinkQrPreview}
                                  alt="Preview QR Tactlink"
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
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
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {tactlinkQrFile.name}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-mono font-bold">
                                {formatFileSize(tactlinkQrFile.size)} · QR Terverifikasi (&le; 2 MB)
                              </span>
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
                        <div className="space-y-1.5">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            JPG atau PNG · Maksimal 2 MB
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* ─── Submit Action ─── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
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
                      <span>Kirim Pendaftaran Lomba Video 1 Menit</span>
                      <span>→</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2.5">
                  Dengan mengirim formulir ini, Anda telah memenuhi seluruh syarat pendaftaran resmi PRIDE Industri 2026.
                </p>
              </div>

            </form>
          </div>
        )}

        {/* Tactlink Partner Banner at Bottom */}
        <div className="pt-4">
          <TactlinkBanner variant="light" />
        </div>

      </div>
    </div>
  );
}
