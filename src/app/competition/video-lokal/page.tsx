'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';
import TactlinkBanner from '@/components/ui/TactlinkBanner';
import type { VideoLokalFormData } from '@/types';

export default function VideoLokalPage() {
  const [formData, setFormData] = useState<VideoLokalFormData>({
    full_name: '',
    email: '',
    phone: '',
    instagram_handle: '',
    tiktok_handle: '',
    video_category: 'Fesyen',
    video_url: '',
    declaration_original: false,
    declaration_public_account: false,
    declaration_terms: false,
  });

  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registration_code: string;
    full_name: string;
    email: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.instagram_handle && !formData.tiktok_handle) {
      setErrorMessage(
        'Wajib mencantumkan minimal satu akun media sosial (Instagram atau TikTok).'
      );
      return;
    }

    if (
      !formData.declaration_original ||
      !formData.declaration_public_account ||
      !formData.declaration_terms
    ) {
      setErrorMessage(
        'Anda wajib menyetujui seluruh pernyataan dan Pakta Integritas.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition_id: 'video-lokal',
          institution,
          ...formData,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Terjadi kesalahan saat pendaftaran.');
        setLoading(false);
        return;
      }

      setSuccessData(json.data);
    } catch {
      setErrorMessage(
        'Gagal menghubungi server. Periksa koneksi internet Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-rose-600 transition-colors"
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
              PRIDE <span className="text-rose-600">INDUSTRI 2026</span>
            </span>
          </div>
        </div>

        {/* Success State View */}
        {successData ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-rose-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
                Pendaftaran Berhasil Terkonfirmasi
              </span>
              <h1 className="text-3xl sm:text-4xl text-slate-900 font-extrabold">
                Selamat, {successData.full_name}!
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Anda telah terdaftar resmi dalam{' '}
                <strong className="text-rose-600 font-bold">
                  Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026
                </strong>
                .
              </p>
            </div>

            {/* Official Pass Badge */}
            <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-rose-100">
                <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  Kode Registrasi Resmi:
                </span>
                <span className="font-mono text-base font-extrabold text-rose-700">
                  {successData.registration_code}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Kategori Lomba:</span>
                <span className="text-slate-800 font-bold">
                  Video 1 Menit ({formData.video_category})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Email Terdaftar:</span>
                <span className="text-slate-800 font-mono font-medium">
                  {successData.email}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Status Kehadiran:</span>
                <span className="text-amber-700 font-bold">
                  Belum Check-In di Lokasi
                </span>
              </div>
            </div>

            {/* Next Steps Instructions */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2 max-w-md mx-auto leading-relaxed">
              <div className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Langkah Selanjutnya:
              </div>
              <p>
                1. Simpan kode registrasi Anda sebagai bukti verifikasi panitia.
              </p>
              <p>
                2. Lakukan shooting langsung di area festival Braga City Walk pada tanggal 27–28 November 2026.
              </p>
              <p>
                3. Unggah video berdurasi maksimal 60 detik ke Reels / TikTok dengan tagar: <strong className="text-slate-800">#disdaginkotabandung #kemilau #prideindustri2026</strong> serta tag akun <strong className="text-slate-800">@bdg.perdaganganindustri</strong>.
              </p>
              <p>
                4. Batas akhir publikasi karya adalah Sabtu, 28 November 2026 pukul 14:00 WIB.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/check-in"
                className="px-6 py-3 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all w-full sm:w-auto"
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
          /* Form View */
          <div className="space-y-8">
            
            {/* Header */}
            <div>
              <div className="inline-block text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 mb-3">
                Formulir Pendaftaran Resmi
              </div>
              <h1 className="text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight">
                Lomba Video 1 Menit (60 Detik) PRIDE 2026
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-bold italic mt-2">
                “Karya Lokal, Cerita Lokal”
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Terbuka untuk umum (perorangan). Angkat pesona dan keunikan produk IKM Kota
                Bandung lewat format video vertikal Reels / TikTok. Total hadiah Rp 2.250.000.
              </p>
            </div>

            {/* Download Guidelines Notice */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                Unduh syarat teknis, kriteria penilaian dewan juri, dan pedoman lomba.
              </div>
              <a
                href={EVENT_CONFIG.competitions.videoLokal.documentPath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Unduh Syarat & Ketentuan PDF ↗
              </a>
            </div>

            {/* Error Feedback */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-3 font-medium"
              >
                <svg className="w-4 h-4 text-rose-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Data Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  1. Identitas Peserta
                </h2>

                <div className="space-y-1.5">
                  <label htmlFor="full_name" className="text-xs font-bold text-slate-700 block">
                    Nama Lengkap <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Nama lengkap peserta sesuai identitas"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="institution" className="text-xs font-bold text-slate-700 block">
                    Instansi / Asal Komunitas (Opsional)
                  </label>
                  <input
                    id="institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Contoh: Universitas Padjadjaran / Mahasiswa / Umum / Komunitas Kreatif"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-700 block">
                      Alamat Email Aktif <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-700 block">
                      No. WhatsApp / Telepon <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media & Video Category */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  2. Akun Media Sosial & Kategori Karya
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="instagram_handle" className="text-xs font-bold text-slate-700 block">
                      Akun Instagram (Tanpa @)
                    </label>
                    <input
                      id="instagram_handle"
                      type="text"
                      value={formData.instagram_handle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagram_handle: e.target.value,
                        })
                      }
                      placeholder="username_instagram"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="tiktok_handle" className="text-xs font-bold text-slate-700 block">
                      Akun TikTok (Tanpa @)
                    </label>
                    <input
                      id="tiktok_handle"
                      type="text"
                      value={formData.tiktok_handle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tiktok_handle: e.target.value,
                        })
                      }
                      placeholder="username_tiktok"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  * Minimal isi salah satu akun yang akan digunakan untuk mengunggah video lomba (akun wajib berstatus publik).
                </span>

                <div className="space-y-1.5 pt-2">
                  <label htmlFor="video_category" className="text-xs font-bold text-slate-700 block">
                    Pilihan Kategori Lomba <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="video_category"
                    value={formData.video_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        video_category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white cursor-pointer"
                  >
                    <option value="Fesyen">
                      Fesyen — Keunikan dan daya tarik produk fashion lokal Bandung
                    </option>
                    <option value="Kuliner">
                      Kuliner — Eksplorasi cita rasa dan ragam kuliner khas lokal
                    </option>
                    <option value="Kriya">
                      Kriya — Nilai seni, kreativitas & kerajinan tangan lokal
                    </option>
                    <option value="PRIDE Industri 2026">
                      PRIDE Industri 2026 — Keseruan acara & kemeriahan festival
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="video_url" className="text-xs font-bold text-slate-700 block">
                    Tautan Video Unggahan (Opsional saat pendaftaran awal)
                  </label>
                  <input
                    id="video_url"
                    type="url"
                    value={formData.video_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                    placeholder="https://www.instagram.com/reel/... atau https://vt.tiktok.com/..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Dapat dilengkapi kemudian setelah shooting dan posting pada 27–28 November 2026.
                  </span>
                </div>
              </div>

              {/* Declarations & Pakta Integritas */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  3. Pakta Integritas & Pernyataan Resmi
                </h2>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-rose-300 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declaration_original}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          declaration_original: e.target.checked,
                        })
                      }
                      className="w-4 h-4 mt-0.5 accent-rose-600 flex-shrink-0"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 block font-bold">
                        Orisinalitas & Lokasi Pengambilan Gambar:
                      </strong>
                      Saya menyatakan bahwa video merupakan karya asli, diambil langsung di area festival PRIDE Industri 2026 (Braga City Walk) pada tanggal 27–28 November 2026, dan tidak melanggar hak cipta musik/visual pihak lain.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-rose-300 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declaration_public_account}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          declaration_public_account: e.target.checked,
                        })
                      }
                      className="w-4 h-4 mt-0.5 accent-rose-600 flex-shrink-0"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 block font-bold">
                        Status Akun Publik & Penandaan Resmi:
                      </strong>
                      Saya memastikan akun media sosial tidak diprivat selama periode lomba dan penjurian, serta wajib menyematkan tagar resmi dan men-tag akun Disdagin Kota Bandung.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-rose-300 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declaration_terms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          declaration_terms: e.target.checked,
                        })
                      }
                      className="w-4 h-4 mt-0.5 accent-rose-600 flex-shrink-0"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 block font-bold">
                        Persetujuan Syarat & Ketentuan:
                      </strong>
                      Saya telah membaca, memahami, dan menyetujui seluruh ketentuan lomba serta menerima keputusan dewan juri yang bersifat mutlak dan tidak dapat diganggu gugat.
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-4 sm:px-6 rounded-full text-xs sm:text-sm font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/25 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 text-center flex items-center justify-center leading-normal"
                >
                  {loading ? 'Memproses Pendaftaran...' : 'Kirim Formulir Pendaftaran Lomba Video →'}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">
                  Data Anda tersimpan dengan aman pada database terisolasi PRIDE Industri 2026.
                </p>
              </div>

            </form>
          </div>
        )}

        {/* Tactlink Partner Banner */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
          <TactlinkBanner variant="light" />
        </div>

      </div>
    </div>
  );
}
