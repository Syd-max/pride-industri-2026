'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';
import type { DesainKemasanFormData } from '@/types';

export default function DesainKemasanPage() {
  const [formData, setFormData] = useState<DesainKemasanFormData>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    product_name: '',
    brand_name: '',
    local_ingredients: '',
    ai_used: false,
    declaration_original: false,
    declaration_unpublished: false,
    declaration_terms: false,
  });

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

    if (
      !formData.declaration_original ||
      !formData.declaration_unpublished ||
      !formData.declaration_terms
    ) {
      setErrorMessage(
        'Anda wajib menyetujui Pakta Integritas, Surat Pernyataan, dan seluruh syarat & ketentuan.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition_id: 'desain-kemasan',
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
            <div className="w-16 h-16 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] border border-[#C8A96E]/40 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#C8A96E] block mb-1">
                Pendaftaran Berhasil Terkonfirmasi
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-[#F5F0E8] font-bold">
                Selamat, {successData.full_name}!
              </h1>
              <p className="text-xs sm:text-sm text-[#B8B0A4] mt-2 max-w-md mx-auto">
                Anda telah terdaftar dalam{' '}
                <strong className="text-[#F5F0E8]">
                  Lomba Desain Kemasan PRIDE Industri 2026
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
                <span className="text-[#8A8A8A]">Kategori:</span>
                <span className="text-[#F5F0E8] font-medium">
                  Desain Kemasan Kuliner Lokal
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A]">Email Terdaftar:</span>
                <span className="text-[#F5F0E8] font-mono">{successData.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8A8A8A]">Status Kehadiran:</span>
                <span className="text-[#fbbf24] font-medium">
                  Belum Check-In di Lokasi
                </span>
              </div>
            </div>

            {/* Next Steps Instructions */}
            <div className="p-5 rounded-xl bg-[#111111] border border-[#222222] text-xs text-[#8A8A8A] text-left space-y-2 max-w-md mx-auto">
              <div className="font-semibold text-[#F5F0E8] uppercase tracking-wider text-[11px] mb-2">
                Langkah Selanjutnya:
              </div>
              <p>
                1. Simpan kode registrasi di atas sebagai tanda bukti kepesertaan
                Anda.
              </p>
              <p>
                2. Siapkan file karya dalam 1 file PDF maksimal 10 MB (Konsep,
                Eksplorasi, Pola/Technical Pack, dan Mockup Final).
              </p>
              <p>
                3. Pantau pengumuman peserta lolos Grand Final pada tanggal{' '}
                <strong>25 November 2026</strong>.
              </p>
              <p>
                4. Pada hari acara (27–28 Nov 2026), gunakan menu{' '}
                <strong className="text-[#C8A96E]">Check-In</strong> di website
                ini untuk memindai QR gate di Braga City Walk.
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
                Lomba Desain Kemasan PRIDE Industri 2026
              </h1>
              <p className="font-display italic text-base sm:text-lg text-[#C8A96E] mt-2">
                “Inovasi Desain Kemasan Ramah Lingkungan untuk Produk Kuliner
                Berbahan Dasar Lokal”
              </p>
              <p className="text-xs text-[#8A8A8A] mt-2 leading-relaxed">
                Pendaftaran terbuka untuk umum WNI (individu), tidak dipungut
                biaya. Total hadiah Rp 2.250.000.
              </p>
            </div>

            {/* Download Guidelines Notice */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-[#B8B0A4]">
                Pastikan Anda telah membaca syarat teknis dan ketentuan karya.
              </div>
              <a
                href={EVENT_CONFIG.competitions.desainKemasan.documentPath}
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
                  1. Data Diri Peserta
                </h2>

                <div className="form-field">
                  <label htmlFor="full_name" className="form-label form-label-required">
                    Nama Lengkap (Sesuai KTP/Identitas)
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Contoh: Raden Aulia Pratama"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label htmlFor="email" className="form-label form-label-required">
                      Alamat Email Aktif
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
                      placeholder="08123456789"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="address" className="form-label form-label-required">
                    Alamat Domisili Lengkap
                  </label>
                  <textarea
                    id="address"
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Alamat tempat tinggal saat ini..."
                    className="form-input"
                  />
                </div>
              </div>

              {/* Product & Design Concept Section */}
              <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#F5F0E8] pb-2 border-b border-[#1C1C1C]">
                  2. Konsep Desain Kemasan Kuliner
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label htmlFor="brand_name" className="form-label form-label-required">
                      Nama Merek Produk (Brand)
                    </label>
                    <input
                      id="brand_name"
                      type="text"
                      required
                      value={formData.brand_name}
                      onChange={(e) =>
                        setFormData({ ...formData, brand_name: e.target.value })
                      }
                      placeholder="Contoh: Sangkuriang Crunch"
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="product_name" className="form-label form-label-required">
                      Nama Produk Kuliner
                    </label>
                    <input
                      id="product_name"
                      type="text"
                      required
                      value={formData.product_name}
                      onChange={(e) =>
                        setFormData({ ...formData, product_name: e.target.value })
                      }
                      placeholder="Contoh: Keripik Ubi Ungu Renyah"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="local_ingredients" className="form-label form-label-required">
                    Bahan Dasar Lokal yang Digunakan
                  </label>
                  <input
                    id="local_ingredients"
                    type="text"
                    required
                    value={formData.local_ingredients}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        local_ingredients: e.target.value,
                      })
                    }
                    placeholder="Contoh: Ubi ungu, tahu Sumedang, tempe, oncom, dll."
                    className="form-input"
                  />
                  <span className="text-[11px] text-[#6B6560]">
                    Sesuai ketentuan lomba: produk kuliner olahan berbahan dasar
                    lokal khas Jawa Barat / Bandung.
                  </span>
                </div>

                <div className="pt-2">
                  <label className="form-checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.ai_used}
                      onChange={(e) =>
                        setFormData({ ...formData, ai_used: e.target.checked })
                      }
                    />
                    <div className="text-xs">
                      <span className="text-[#F5F0E8] font-medium block">
                        Karya ini menggunakan Artificial Intelligence (AI)
                        sebagai alat bantu final mockup
                      </span>
                      <span className="text-[#8A8A8A] block mt-0.5">
                        Sesuai Pasal Persyaratan Karya: AI diizinkan hanya
                        sebagai alat bantu visualisasi final mockup. Peserta
                        tetap wajib melampirkan bukti proses kreatif dan
                        eksplorasi konsep orisinal.
                      </span>
                    </div>
                  </label>
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
                        Pakta Integritas Orisinalitas Karya:
                      </strong>
                      Saya menyatakan bahwa karya desain kemasan yang saya ikut
                      sertakan merupakan karya asli (orisinal) buatan saya
                      sendiri, tidak melanggar hak cipta/kekayaan intelektual
                      pihak lain, dan saya bertanggung jawab penuh atas segala
                      konsekuensi hukum yang timbul.
                    </div>
                  </label>

                  <label className="form-checkbox-row">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declaration_unpublished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          declaration_unpublished: e.target.checked,
                        })
                      }
                    />
                    <div className="text-xs text-[#8A8A8A]">
                      <strong className="text-[#F5F0E8] block">
                        Surat Pernyataan Persetujuan Publikasi:
                      </strong>
                      Saya menyatakan karya ini belum pernah dipublikasikan
                      secara komersial/memenangkan perlombaan sejenis, dan
                      bersedia karyanya digunakan oleh panitia/Dinas Perdagangan
                      dan Perindustrian Kota Bandung untuk dokumentasi,
                      publikasi, dan promosi non-komersial dengan tetap
                      mencantumkan kredit nama saya.
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
                        Kepatuhan Syarat & Ketentuan:
                      </strong>
                      Saya telah membaca, memahami, dan menyetujui seluruh
                      syarat, ketentuan teknis, jadwal, serta menerima keputusan
                      Dewan Juri PRIDE Industri 2026 yang bersifat mutlak dan
                      tidak dapat diganggu gugat.
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
                    'Kirim Formulir Pendaftaran Desain Kemasan →'
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
