'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';
import TactlinkBanner from '@/components/ui/TactlinkBanner';

type VideoCategory = 'Fesyen' | 'Kuliner' | 'Kriya' | 'PRIDE Industri 2026';

export default function VideoLokalPage() {
  // ─── 1. Form State (17 Specific Fields) ───
  // Section 1: Data Diri Peserta
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Section 2: Informasi Karya
  const [videoCategory, setVideoCategory] = useState<VideoCategory>('Fesyen');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  // Section 3: Informasi Akun Media Sosial
  const [platformInstagram, setPlatformInstagram] = useState(true);
  const [platformTiktok, setPlatformTiktok] = useState(false);
  const [instagramHandle, setInstagramHandle] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [instagramVideoUrl, setInstagramVideoUrl] = useState('');
  const [tiktokVideoUrl, setTiktokVideoUrl] = useState('');

  // Section 4: Persetujuan & Dokumen Pendukung
  const [declarationOriginal, setDeclarationOriginal] = useState(false);
  const [declarationTerms, setDeclarationTerms] = useState(false);
  const [declarationUsageRights, setDeclarationUsageRights] = useState(false);
  const [paktaFile, setPaktaFile] = useState<File | null>(null);
  const [suratFile, setSuratFile] = useState<File | null>(null);

  // File input refs for drag-and-drop / click to browse
  const paktaInputRef = useRef<HTMLInputElement>(null);
  const suratInputRef = useRef<HTMLInputElement>(null);

  // Drag states
  const [isDraggingPakta, setIsDraggingPakta] = useState(false);
  const [isDraggingSurat, setIsDraggingSurat] = useState(false);

  // ─── UI / Submission State ───
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registration_code: string;
    full_name: string;
    email: string;
    institution: string;
    category: string;
    video_title: string;
    platforms: string[];
  } | null>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ─── Form Submission Handler ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation 1: Section 1 (Data Diri)
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

    // Validation 2: Section 2 (Informasi Karya)
    if (!videoTitle.trim() || videoTitle.trim().length < 3) {
      setErrorMessage('Judul karya video wajib diisi minimal 3 karakter.');
      return;
    }

    // Validation 3: Section 3 (Akun Media Sosial)
    if (!platformInstagram && !platformTiktok) {
      setErrorMessage('Pilih minimal salah satu platform publikasi: Instagram atau TikTok.');
      return;
    }
    if (platformInstagram && !instagramHandle.trim()) {
      setErrorMessage('Username Instagram wajib diisi karena Anda memilih platform Instagram.');
      return;
    }
    if (platformTiktok && !tiktokHandle.trim()) {
      setErrorMessage('Username TikTok wajib diisi karena Anda memilih platform TikTok.');
      return;
    }

    // Validation 4: Section 4 (Persetujuan & Dokumen)
    if (!declarationOriginal) {
      setErrorMessage('Anda wajib menyetujui pernyataan orisinalitas karya.');
      return;
    }
    if (!declarationTerms) {
      setErrorMessage('Anda wajib menyetujui seluruh syarat dan ketentuan lomba.');
      return;
    }
    if (!declarationUsageRights) {
      setErrorMessage('Anda wajib menyetujui persetujuan hak publikasi & promosi karya.');
      return;
    }
    if (!paktaFile) {
      setErrorMessage('Wajib mengunggah dokumen Pakta Integritas yang telah diisi dan ditandatangani.');
      return;
    }
    if (!suratFile) {
      setErrorMessage('Wajib mengunggah dokumen Surat Pernyataan Persetujuan Rekaman dan Publikasi.');
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
        platform_instagram: platformInstagram,
        platform_tiktok: platformTiktok,
        instagram_handle: instagramHandle.trim().replace(/^@/, ''),
        tiktok_handle: tiktokHandle.trim().replace(/^@/, ''),
        instagram_video_url: instagramVideoUrl.trim(),
        tiktok_video_url: tiktokVideoUrl.trim(),
        declaration_original: declarationOriginal,
        declaration_terms: declarationTerms,
        declaration_usage_rights: declarationUsageRights,
        pakta_integritas_name: paktaFile.name,
        surat_persetujuan_name: suratFile.name,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Terjadi kendala saat memproses pendaftaran. Silakan coba kembali.');
        setLoading(false);
        return;
      }

      const activePlatforms: string[] = [];
      if (platformInstagram) activePlatforms.push('Instagram Reels');
      if (platformTiktok) activePlatforms.push('TikTok');

      setSuccessData({
        registration_code: json.data.registration_code,
        full_name: json.data.full_name,
        email: json.data.email,
        institution: institution.trim(),
        category: videoCategory,
        video_title: videoTitle.trim(),
        platforms: activePlatforms,
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrorMessage('Gagal menghubungi server. Periksa koneksi internet Anda dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const categories: Array<{
    id: VideoCategory;
    title: string;
    desc: string;
    iconType: 'fashion' | 'culinary' | 'craft' | 'festival';
  }> = [
    {
      id: 'Fesyen',
      title: 'Fesyen',
      desc: 'Pesona karya apparel, tekstil & fashion lokal Bandung.',
      iconType: 'fashion',
    },
    {
      id: 'Kuliner',
      title: 'Kuliner',
      desc: 'Eksplorasi cita rasa, kemasan & keunikan santapan khas.',
      iconType: 'culinary',
    },
    {
      id: 'Kriya',
      title: 'Kriya',
      desc: 'Kreativitas seni, kerajinan tangan & kriya lokal unggulan.',
      iconType: 'craft',
    },
    {
      id: 'PRIDE Industri 2026',
      title: 'PRIDE Industri 2026',
      desc: 'Keseruan, kemeriahan & pengalaman festival di Braga City Walk.',
      iconType: 'festival',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/90 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-rose-600 transition-colors"
          >
            ← Kembali ke Beranda Festival
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image
                src="/LOGO_PRIDE_INDUSTRI.png"
                alt="PRIDE Industri 2026"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-black tracking-tight text-slate-900 leading-none">
                PRIDE <span className="text-rose-600">INDUSTRI 2026</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Disdagin Kota Bandung
              </span>
            </div>
          </div>
        </div>

        {/* ─── SUCCESS STATE VIEW ─── */}
        {successData ? (
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-rose-200 shadow-xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-block">
                Pendaftaran Berhasil Terkonfirmasi
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-900 font-black tracking-tight">
                Selamat, {successData.full_name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Data pendaftaran dan berkas pendukung Anda telah resmi tercatat dalam sistem penjurian{' '}
                <strong className="text-rose-600 font-bold">
                  Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026
                </strong>
                .
              </p>
            </div>

            {/* Official Pass Badge */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/80 to-white border border-rose-200/90 max-w-lg mx-auto text-left space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-rose-100 gap-1">
                <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  Kode Registrasi Resmi:
                </span>
                <span className="font-mono text-lg font-black text-rose-700 tracking-wider">
                  {successData.registration_code}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Kategori Lomba:</span>
                  <span className="text-slate-800 font-bold">{successData.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Instansi / Asal:</span>
                  <span className="text-slate-800 font-bold">{successData.institution}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Judul Karya:</span>
                  <span className="text-slate-800 font-bold line-clamp-1">“{successData.video_title}”</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Platform Publikasi:</span>
                  <span className="text-slate-800 font-bold">{successData.platforms.join(' & ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status Kehadiran:</span>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px] inline-block">
                    Belum Check-In di Lokasi
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Instructions */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 text-left space-y-2.5 max-w-lg mx-auto leading-relaxed">
              <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 17v5"/>
                  <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/>
                </svg>
                <span>Langkah Selanjutnya Bagi Peserta:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
                <li>
                  <strong className="text-slate-800">Simpan bukti kode registrasi</strong> di atas sebagai akses verifikasi dan presensi panitia di lokasi.
                </li>
                <li>
                  <strong className="text-slate-800">Pengambilan gambar / shooting langsung</strong> dilakukan di area festival <strong className="text-slate-800">Braga City Walk</strong> pada tanggal <strong className="text-rose-600">27–28 November 2026</strong>.
                </li>
                <li>
                  Video berdurasi maksimal <strong className="text-slate-800">60 detik (format 9:16 vertikal)</strong> diunggah ke Reels atau TikTok dengan tagar resmi: <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-mono text-[11px]">#disdaginkotabandung #kemilau #prideindustri2026</code> dan tag akun <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-mono text-[11px]">@bdg.perdaganganindustri</code>.
                </li>
                <li>
                  Batas akhir publikasi karya dan penyerahan link adalah <strong className="text-slate-800">Sabtu, 28 November 2026 pukul 14:00 WIB</strong>.
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-extrabold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak / Simpan PDF
              </button>
              <Link
                href="/check-in"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
              >
                Buka Menu Check-In →
              </Link>
            </div>
          </div>
        ) : (
          /* ─── FORM VIEW (4 MAIN SECTIONS) ─── */
          <div className="space-y-8">
            
            {/* Header Hero */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Formulir Pendaftaran Resmi
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Disdagin Kota Bandung
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-900 font-black tracking-tight leading-tight">
                Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026
              </h1>
              <p className="text-base sm:text-lg text-rose-600 font-extrabold italic">
                “Karya Lokal, Cerita Lokal”
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Kompetisi pembuatan video pendek vertikal (9:16) untuk mengangkat potensi, kreativitas, dan ragam produk IKM Kota Bandung langsung di arena festival Braga City Walk. Terbuka untuk umum dengan total apresiasi hadiah senilai Rp 2.250.000.
              </p>
            </div>

            {/* Official Guidelines & Document Template Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span>Pedoman Teknis &amp; Template Dokumen Lomba</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  Unduh formulir template Pakta Integritas dan Surat Pernyataan Persetujuan Publikasi (format resmi Disdagin).
                </p>
              </div>
              <a
                href={EVENT_CONFIG.competitions.videoLokal.documentPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex-shrink-0"
              >
                <span>Unduh Dokumen PDF (4.5 MB)</span>
                <span className="text-rose-500">↗</span>
              </a>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3 font-medium animate-fadeIn"
              >
                <svg className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="space-y-0.5">
                  <div className="font-extrabold">Periksa Formulir Anda:</div>
                  <div>{errorMessage}</div>
                </div>
              </div>
            )}

            {/* ─── FORM START ─── */}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* ─────────────────────────────────────────────────────────────
                  SECTION 1: DATA DIRI PESERTA
                 ───────────────────────────────────────────────────────────── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Data Diri Peserta
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    Wajib Dilengkapi
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Field 1: Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label htmlFor="full_name" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>1. Nama Lengkap <span className="text-rose-600">*</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">Sesuai KTP / SIM / Kartu Pelajar</span>
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masukkan nama lengkap peserta"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Field 2: Instansi / Asal */}
                  <div className="space-y-1.5">
                    <label htmlFor="institution" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>2. Instansi / Asal <span className="text-rose-600">*</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">Sekolah / Universitas / Komunitas / Umum</span>
                    </label>
                    <input
                      id="institution"
                      type="text"
                      required
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="Contoh: Universitas Padjadjaran / SMK Negeri 1 Bandung / Komunitas Sinematografi / Umum"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Field 3 & 4: Kontak (WhatsApp & Email) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Field 3: Nomor HP / WhatsApp */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>3. Nomor HP / WhatsApp <span className="text-rose-600">*</span></span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
                      />
                      <span className="text-[11px] text-slate-400 block">
                        Untuk konfirmasi teknis & grup koordinasi lomba
                      </span>
                    </div>

                    {/* Field 4: Alamat Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>4. Alamat Email <span className="text-rose-600">*</span></span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
                      />
                      <span className="text-[11px] text-slate-400 block">
                        Bukti registrasi resmi akan dikaitkan ke email ini
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  SECTION 2: INFORMASI KARYA
                 ───────────────────────────────────────────────────────────── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Informasi Karya Video
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    Kategori & Judul
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Field 5: Kategori Lomba */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      5. Kategori Lomba <span className="text-rose-600">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const isSelected = videoCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setVideoCategory(cat.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'border-rose-600 bg-rose-50/50 shadow-xs ring-2 ring-rose-500/20'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              {cat.iconType === 'fashion' && (
                                <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                                </svg>
                              )}
                              {cat.iconType === 'culinary' && (
                                <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/>
                                  <path d="M15 2v19"/>
                                  <path d="M5 2v19"/>
                                  <path d="M8 2v6a3 3 0 0 1-3 3"/>
                                </svg>
                              )}
                              {cat.iconType === 'craft' && (
                                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                                </svg>
                              )}
                              {cat.iconType === 'festival' && (
                                <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="20" height="15" x="2" y="7" rx="2" ry="2"/>
                                  <polyline points="17 2 12 7 7 2"/>
                                </svg>
                              )}
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-extrabold ${isSelected ? 'text-rose-900' : 'text-slate-800'}`}>
                                  {cat.title}
                                </span>
                                {isSelected && (
                                  <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug">
                                {cat.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field 6: Judul Karya Video */}
                  <div className="space-y-1.5">
                    <label htmlFor="video_title" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>6. Judul Karya Video <span className="text-rose-600">*</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">Maksimal 100 karakter</span>
                    </label>
                    <input
                      id="video_title"
                      type="text"
                      required
                      maxLength={100}
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Contoh: Pesona Kuliner Legendaris Braga / Jejak Kreatif Kriya Bandung"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Field 7: Deskripsi Singkat Karya */}
                  <div className="space-y-1.5">
                    <label htmlFor="video_description" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>7. Deskripsi Singkat Karya</span>
                      <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                    </label>
                    <textarea
                      id="video_description"
                      rows={3}
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Jelaskan sinopsis singkat, pesan yang ingin disampaikan, atau produk IKM yang difitur dalam video Anda..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  SECTION 3: INFORMASI AKUN MEDIA SOSIAL
                 ───────────────────────────────────────────────────────────── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Informasi Akun Media Sosial
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    Platform & Tautan
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Field 8: Platform Publikasi */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>8. Platform Publikasi <span className="text-rose-600">*</span></span>
                      <span className="text-[11px] text-slate-400 font-normal">Pilih salah satu atau keduanya</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Instagram Toggle Card */}
                      <button
                        type="button"
                        onClick={() => setPlatformInstagram(!platformInstagram)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          platformInstagram
                            ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block">
                              Instagram (Reels)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Format 9:16 Vertikal
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={platformInstagram}
                          onChange={() => {}}
                          className="w-4 h-4 accent-rose-600 cursor-pointer pointer-events-none"
                        />
                      </button>

                      {/* TikTok Toggle Card */}
                      <button
                        type="button"
                        onClick={() => setPlatformTiktok(!platformTiktok)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          platformTiktok
                            ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.895 2.895 0 0 1 2.31-4.643c.307 0 .603.048.882.138V9.324a6.34 6.34 0 0 0-.882-.061C6.012 9.263 3.2 12.075 3.2 15.547 3.2 19.02 6.012 21.83 9.484 21.83c3.473 0 6.285-2.811 6.285-6.284V8.756c1.373.985 3.056 1.572 4.88 1.624v-3.48a4.82 4.82 0 0 1-1.06-.214z"/>
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block">
                              TikTok Video
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Format 9:16 Vertikal
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={platformTiktok}
                          onChange={() => {}}
                          className="w-4 h-4 accent-rose-600 cursor-pointer pointer-events-none"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Field 9 & 10: Usernames */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Field 9: Username Instagram */}
                    <div className="space-y-1.5">
                      <label htmlFor="instagram_handle" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>
                          9. Username Instagram{' '}
                          {platformInstagram ? (
                            <span className="text-rose-600">* (Wajib)</span>
                          ) : (
                            <span className="text-slate-400 font-normal">(Opsional)</span>
                          )}
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                          @
                        </span>
                        <input
                          id="instagram_handle"
                          type="text"
                          required={platformInstagram}
                          value={instagramHandle}
                          onChange={(e) => setInstagramHandle(e.target.value)}
                          placeholder="username_instagram"
                          className={`w-full pl-8 pr-4 py-3 rounded-xl border text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 ${
                            platformInstagram
                              ? 'border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                              : 'border-slate-200 bg-slate-50/70 text-slate-500'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        Akun wajib bersifat publik (tidak diprivat)
                      </span>
                    </div>

                    {/* Field 10: Username TikTok */}
                    <div className="space-y-1.5">
                      <label htmlFor="tiktok_handle" className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>
                          10. Username TikTok{' '}
                          {platformTiktok ? (
                            <span className="text-rose-600">* (Wajib)</span>
                          ) : (
                            <span className="text-slate-400 font-normal">(Opsional)</span>
                          )}
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                          @
                        </span>
                        <input
                          id="tiktok_handle"
                          type="text"
                          required={platformTiktok}
                          value={tiktokHandle}
                          onChange={(e) => setTiktokHandle(e.target.value)}
                          placeholder="username_tiktok"
                          className={`w-full pl-8 pr-4 py-3 rounded-xl border text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400 ${
                            platformTiktok
                              ? 'border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                              : 'border-slate-200 bg-slate-50/70 text-slate-500'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        Akun wajib bersifat publik (tidak diprivat)
                      </span>
                    </div>
                  </div>

                  {/* Field 11 & 12: Tautan Video Unggahan */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Tautan Video Publikasi</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Dapat Dilengkapi Setelah Publikasi
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Field 11: Tautan video Instagram */}
                      <div className="space-y-1.5">
                        <label htmlFor="instagram_video_url" className="text-[11px] font-semibold text-slate-600 block">
                          11. Tautan Video Instagram Reels
                        </label>
                        <input
                          id="instagram_video_url"
                          type="url"
                          value={instagramVideoUrl}
                          onChange={(e) => setInstagramVideoUrl(e.target.value)}
                          placeholder="https://www.instagram.com/reel/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>

                      {/* Field 12: Tautan video TikTok */}
                      <div className="space-y-1.5">
                        <label htmlFor="tiktok_video_url" className="text-[11px] font-semibold text-slate-600 block">
                          12. Tautan Video TikTok
                        </label>
                        <input
                          id="tiktok_video_url"
                          type="url"
                          value={tiktokVideoUrl}
                          onChange={(e) => setTiktokVideoUrl(e.target.value)}
                          placeholder="https://www.tiktok.com/@user/video/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                        <path d="M9 18h6"/>
                        <path d="M10 22h4"/>
                      </svg>
                      <span><strong>Catatan:</strong> Tautan dapat dikosongkan terlebih dahulu saat pendaftaran awal. Peserta dapat melengkapi tautan setelah proses shooting di Braga City Walk dan publikasi video paling lambat <strong>28 November 2026 pukul 14:00 WIB</strong>.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  SECTION 4: PERSETUJUAN DAN DOKUMEN PENDUKUNG
                 ───────────────────────────────────────────────────────────── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Persetujuan & Dokumen Pendukung
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    Wajib & Legal
                  </span>
                </div>

                {/* Checklist Persetujuan Resmi (13, 14, 15) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    Pernyataan & Persetujuan Peserta:
                  </div>

                  {/* Field 13: Orisinalitas */}
                  <label className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 cursor-pointer hover:border-rose-300 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={declarationOriginal}
                      onChange={(e) => setDeclarationOriginal(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-rose-600 flex-shrink-0 cursor-pointer"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="text-slate-900 font-bold block mb-0.5">
                        13. Pernyataan Orisinalitas Karya <span className="text-rose-600">*</span>
                      </span>
                      Saya menyatakan dengan sungguh-sungguh bahwa karya bersifat orisinal, diambil langsung di area festival PRIDE Industri 2026 (Braga City Walk) pada tanggal 27–28 November 2026, dan tidak melanggar hak cipta, hak kekayaan intelektual, maupun hak pihak lain.
                    </div>
                  </label>

                  {/* Field 14: Syarat & Ketentuan */}
                  <label className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 cursor-pointer hover:border-rose-300 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={declarationTerms}
                      onChange={(e) => setDeclarationTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-rose-600 flex-shrink-0 cursor-pointer"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="text-slate-900 font-bold block mb-0.5">
                        14. Persetujuan Syarat & Ketentuan Lomba <span className="text-rose-600">*</span>
                      </span>
                      Saya telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan teknis lomba video serta bersedia menerima keputusan dewan juri yang bersifat mutlak, independen, dan tidak dapat diganggu gugat.
                    </div>
                  </label>

                  {/* Field 15: Hak Penggunaan Karya & Promosi */}
                  <label className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 cursor-pointer hover:border-rose-300 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={declarationUsageRights}
                      onChange={(e) => setDeclarationUsageRights(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-rose-600 flex-shrink-0 cursor-pointer"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="text-slate-900 font-bold block mb-0.5">
                        15. Persetujuan Penggunaan Karya untuk Publikasi <span className="text-rose-600">*</span>
                      </span>
                      Saya menyetujui penggunaan materi karya video oleh Dinas Perdagangan dan Perindustrian Kota Bandung untuk keperluan publikasi resmi, dokumentasi arsip, dan promosi IKM Kota Bandung dengan tetap mencantumkan kredit nama pembuat karya.
                    </div>
                  </label>
                </div>

                {/* Upload Dokumen Pendukung (16 & 17) */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div className="text-xs font-bold text-slate-800">
                      Upload Dokumen Bertandatangan:
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Format file: PDF, JPG, PNG (Maksimal 10 MB per file)
                    </span>
                  </div>

                  {/* Field 16: Pakta Integritas Upload Dropzone */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        16. Upload Pakta Integritas <span className="text-rose-600">*</span>
                      </label>
                      <a
                        href={EVENT_CONFIG.competitions.videoLokal.documentPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
                      >
                        <span>Unduh Template Format</span>
                        <span>↗</span>
                      </a>
                    </div>

                    <input
                      ref={paktaInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            setErrorMessage('Ukuran file Pakta Integritas melebihi batas 10 MB.');
                            return;
                          }
                          setPaktaFile(file);
                        }
                      }}
                    />

                    {paktaFile ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate">
                              {paktaFile.name}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-mono">
                              {formatFileSize(paktaFile.size)} • Siap dikirim
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPaktaFile(null);
                            if (paktaInputRef.current) paktaInputRef.current.value = '';
                          }}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex-shrink-0"
                        >
                          Ganti Berkas
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingPakta(true);
                        }}
                        onDragLeave={() => setIsDraggingPakta(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingPakta(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              setErrorMessage('Ukuran file Pakta Integritas melebihi batas 10 MB.');
                              return;
                            }
                            setPaktaFile(file);
                          }
                        }}
                        onClick={() => paktaInputRef.current?.click()}
                        className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          isDraggingPakta
                            ? 'border-rose-500 bg-rose-50/50'
                            : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50/50 bg-slate-50/20'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Klik untuk memilih file atau seret file ke sini
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Pakta Integritas yang telah diisi & ditandatangani pembuat karya (PDF / JPG / PNG, max 10MB)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Field 17: Surat Pernyataan Persetujuan Rekaman Upload Dropzone */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        17. Upload Surat Pernyataan Persetujuan Rekaman & Publikasi <span className="text-rose-600">*</span>
                      </label>
                      <a
                        href={EVENT_CONFIG.competitions.videoLokal.documentPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
                      >
                        <span>Unduh Template Format</span>
                        <span>↗</span>
                      </a>
                    </div>

                    <input
                      ref={suratInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            setErrorMessage('Ukuran file Surat Pernyataan melebihi batas 10 MB.');
                            return;
                          }
                          setSuratFile(file);
                        }
                      }}
                    />

                    {suratFile ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate">
                              {suratFile.name}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-mono">
                              {formatFileSize(suratFile.size)} • Siap dikirim
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSuratFile(null);
                            if (suratInputRef.current) suratInputRef.current.value = '';
                          }}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex-shrink-0"
                        >
                          Ganti Berkas
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingSurat(true);
                        }}
                        onDragLeave={() => setIsDraggingSurat(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingSurat(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              setErrorMessage('Ukuran file Surat Pernyataan melebihi batas 10 MB.');
                              return;
                            }
                            setSuratFile(file);
                          }
                        }}
                        onClick={() => suratInputRef.current?.click()}
                        className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                          isDraggingSurat
                            ? 'border-rose-500 bg-rose-50/50'
                            : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50/50 bg-slate-50/20'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Klik untuk memilih file atau seret file ke sini
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Surat Pernyataan Persetujuan Rekaman & Publikasi yang telah ditandatangani (PDF / JPG / PNG, max 10MB)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── SUBMIT ACTION ─── */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full text-xs sm:text-sm font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/25 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Memvalidasi & Menyimpan Data...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Formulir Pendaftaran Lomba Video</span>
                      <span>→</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  <span>Data formulir terenkripsi aman dan diverifikasi resmi oleh Panitia PRIDE Industri 2026</span>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* ─── TACTLINK PARTNER BANNER ─── */}
        <div className="mt-10 sm:mt-12 max-w-2xl mx-auto">
          <TactlinkBanner variant="light" />
        </div>

      </div>
    </div>
  );
}
