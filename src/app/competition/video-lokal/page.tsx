'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between pb-8 border-b border-[#1C1C1C] mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8B0A4] hover:text-[#C8A96E] transition-colors"
          >
            ← Kembali ke Beranda Festival
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
              PRIDE 2026
            </span>
          </div>
        </div>

        {/* Success State View */}
        {successData ? (
          <div className="glass-card-gold p-8 sm:p-12 rounded-2xl border border-[rgba(200,169,110,0.3)] text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#E85B26]/20 text-[#E85B26] border border-[#E85B26]/40 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#E85B26] block mb-1">
                Pendaftaran Berhasil Terkonfirmasi
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-[#F5F0E8] font-bold">
                Selamat, {successData.full_name}!
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B0A4] mt-2 max-w-md mx-auto">
                Anda telah terdaftar dalam{' '}
                <strong className="text-[#F5F0E8]">
                  Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026
                </strong>
                .
              </p>
            </div>

            {/* Official Pass Badge */}
            <div className="p-6 rounded-xl bg-[#141414] border border-[#2A2A2A] max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-[#222222]">
                <span className="text-[#8A8A8A] uppercase tracking-wider text-[10px]">
                  Kode Registrasi Resmi:
                </span>
                <span className="font-mono text-sm font-bold text-[#E4C584]">
                  {successData.registration_code}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A]">Kategori Terpilih:</span>
                <span className="text-[#F5F0E8] font-medium">
                  {formData.video_category}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A]">Email Terdaftar:</span>
                <span className="text-[#F5F0E8] font-mono">{successData.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A]">Status Kehadiran di Braga:</span>
                <span className="text-[#fbbf24] font-medium">
                  Belum Check-In di Lokasi
                </span>
              </div>
            </div>

            {/* Next Steps Instructions */}
            <div className="p-5 rounded-xl bg-[#111111] border border-[#222222] text-xs text-[#8A8A8A] text-left space-y-2 max-w-md mx-auto">
              <div className="font-semibold text-[#F5F0E8] uppercase tracking-wider text-[11px] mb-2">
                Instruksi Pengambilan & Pengunggahan Video:
              </div>
              <p>
                1. Pengambilan video wajib dilaksanakan pada{' '}
                <strong>27–28 November 2026 di Braga City Walk</strong>.
              </p>
              <p>
                2. Buat video format Reels vertikal dengan durasi maksimal 60
                detik.
              </p>
              <p>
                3. Unggah ke Instagram Reels / TikTok pribadi dalam kondisi
                publik.
              </p>
              <p className="font-mono text-[11px] text-[#C8A96E] bg-[#1a1a1a] p-2 rounded">
                Wajib Tagar: #disdaginkotabandung #kemilau #prideindustri2026 #bdg
                #eventbandung #bandung
                <br />
                Tag: @bdg.perdaganganindustri / @disdagin.bandung
              </p>
              <p>
                4. Datang ke venue dan lakukan{' '}
                <strong className="text-[#C8A96E]">Check-In</strong> di gate masuk
                menggunakan kamera ponsel Anda.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/check-in"
                className="btn btn-primary text-xs py-3 px-6 uppercase tracking-wider w-full sm:w-auto"
              >
                Buka Menu Check-In
              </Link>
              <Link
                href="/"
                className="btn btn-ghost text-xs py-3 px-6 uppercase tracking-wider w-full sm:w-auto"
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
              <div className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E85B26] mb-2">
                Formulir Pendaftaran Resmi
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-[#F5F0E8] font-bold">
                Lomba Video 1 Menit (60 Detik) PRIDE 2026
              </h1>
              <p className="font-display italic text-base sm:text-lg text-[#C8A96E] mt-2">
                “Karya Lokal, Cerita Lokal”
              </p>
              <p className="text-xs text-[#8A8A8A] mt-2 leading-relaxed">
                Terbuka untuk umum (perorangan). Angkat keunikan produk IKM Kota
                Bandung lewat video Reels/TikTok. Total hadiah Rp 2.250.000.
              </p>
            </div>

            {/* Download Guidelines Notice */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-[#B8B0A4]">
                Unduh syarat teknis, kriteria penilaian, dan pakta integritas.
              </div>
              <a
                href={EVENT_CONFIG.competitions.videoLokal.documentPath}
                download
                className="btn btn-secondary text-xs py-1.5 px-3"
              >
                Unduh Syarat & Ketentuan PDF ↗
              </a>
            </div>

            {/* Error Feedback */}
            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-[#2D0F0A] border border-[#7F1D1D] text-xs text-[#FCA5A5] flex items-center gap-3"
              >
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Data Section */}
              <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#F5F0E8] pb-2 border-b border-[#1C1C1C]">
                  1. Identitas Peserta
                </h2>

                <div className="form-field">
                  <label htmlFor="full_name" className="form-label form-label-required">
                    Nama Lengkap
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Nama lengkap peserta"
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="institution" className="form-label">
                    Instansi / Asal Komunitas (Opsional)
                  </label>
                  <input
                    id="institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Contoh: Universitas Padjadjaran / Umum / Komunitas Kreatif"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label htmlFor="email" className="form-label form-label-required">
                      Alamat Email
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
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone" className="form-label form-label-required">
                      No. WhatsApp / Telepon
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
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media & Video Category */}
              <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#F5F0E8] pb-2 border-b border-[#1C1C1C]">
                  2. Akun Media Sosial & Kategori Karya
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label htmlFor="instagram_handle" className="form-label">
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
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="tiktok_handle" className="form-label">
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
                      className="form-input"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-[#8A8A8A] block">
                  * Minimal isi salah satu akun yang akan digunakan untuk
                  mengunggah video lomba (akun wajib berstatus publik).
                </span>

                <div className="form-field pt-2">
                  <label htmlFor="video_category" className="form-label form-label-required">
                    Pilihan Kategori Lomba
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
                    className="form-input form-select"
                  >
                    <option value="Fesyen">
                      Fesyen — Keunikan produk fashion lokal Bandung
                    </option>
                    <option value="Kuliner">
                      Kuliner — Eksplorasi daya tarik kuliner & rasa khas lokal
                    </option>
                    <option value="Kriya">
                      Kriya — Nilai seni, keterampilan & kerajinan lokal
                    </option>
                    <option value="PRIDE Industri 2026">
                      PRIDE Industri 2026 — Keseruan acara & suasana pameran
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="video_url" className="form-label">
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
                    className="form-input"
                  />
                  <span className="text-[11px] text-[#6B6560]">
                    Dapat dilengkapi kemudian setelah video diunggah pada 27–28
                    November 2026.
                  </span>
                </div>
              </div>

              {/* Declarations & Pakta Integritas */}
              <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#F5F0E8] pb-2 border-b border-[#1C1C1C]">
                  3. Pakta Integritas & Pernyataan Resmi
                </h2>

                <div className="space-y-3">
                  <label className="form-checkbox-row">
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
                    />
                    <div className="text-xs text-[#8A8A8A]">
                      <strong className="text-[#F5F0E8] block">
                        Pakta Integritas Orisinalitas & Legalitas Aset:
                      </strong>
                      Saya menyatakan bahwa karya video yang saya ikutsertakan
                      merupakan karya asli buatan saya sendiri, pengambilan video
                      dilaksanakan pada 27–28 November 2026 di Braga City Walk,
                      serta seluruh audio/musik/visual yang digunakan memiliki izin
                      penggunaan yang sah.
                    </div>
                  </label>

                  <label className="form-checkbox-row">
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
                    />
                    <div className="text-xs text-[#8A8A8A]">
                      <strong className="text-[#F5F0E8] block">
                        Pernyataan Akun Publik & Hak Dokumentasi:
                      </strong>
                      Saya menyatakan akun media sosial saya berada dalam kondisi
                      publik selama masa penjurian, menyertakan tagar resmi dan
                      menandai akun panitia, serta bersedia karya video ini
                      digunakan oleh Dinas Perdagangan dan Perindustrian Kota
                      Bandung untuk keperluan publikasi dan promosi non-komersial.
                    </div>
                  </label>

                  <label className="form-checkbox-row">
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
                    />
                    <div className="text-xs text-[#8A8A8A]">
                      <strong className="text-[#F5F0E8] block">
                        Kepatuhan Syarat & Keputusan Dewan Juri:
                      </strong>
                      Saya mematuhi seluruh syarat dan ketentuan lomba, serta
                      menerima keputusan dewan juri yang bersifat final, mutlak,
                      dan tidak dapat diganggu gugat.
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-sm font-semibold tracking-wider uppercase justify-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Memproses Pendaftaran...
                    </span>
                  ) : (
                    'Kirim Formulir Pendaftaran Video 1 Menit →'
                  )}
                </button>
                <p className="text-center text-[11px] text-[#6B6560] mt-3">
                  Data Anda tersimpan dengan aman pada database terisolasi PRIDE
                  Industri 2026.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
