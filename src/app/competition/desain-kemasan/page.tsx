'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';
import TactlinkBanner from '@/components/ui/TactlinkBanner';
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
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors"
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

        {/* Success State View */}
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
              <h1 className="text-3xl sm:text-4xl text-slate-900 font-extrabold">
                Selamat, {successData.full_name}!
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Anda telah terdaftar resmi dalam{' '}
                <strong className="text-blue-600 font-bold">
                  Lomba Desain Kemasan PRIDE Industri 2026
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
                <span className="text-slate-500">Kategori Lomba:</span>
                <span className="text-slate-800 font-bold">
                  Desain Kemasan Kuliner Lokal
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
                1. Simpan kode registrasi di atas sebagai tanda bukti kepesertaan Anda.
              </p>
              <p>
                2. Siapkan file karya dalam 1 file PDF maksimal 10 MB (Konsep, Pola/Technical Pack, dan Mockup Final).
              </p>
              <p>
                3. Pantau pengumuman peserta lolos Grand Final pada tanggal{' '}
                <strong className="text-slate-800">25 November 2026</strong>.
              </p>
              <p>
                4. Pada hari festival (27–28 Nov 2026), buka menu{' '}
                <strong className="text-blue-600 font-bold">Check-In</strong> di website ini untuk memindai QR gate di Braga City Walk.
              </p>
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
          /* Form View */
          <div className="space-y-8">
            
            {/* Header */}
            <div>
              <div className="inline-block text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 mb-3">
                Formulir Pendaftaran Resmi
              </div>
              <h1 className="text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight">
                Lomba Desain Kemasan PRIDE Industri 2026
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-bold italic mt-2">
                “Inovasi Desain Kemasan Ramah Lingkungan untuk Produk Kuliner
                Berbahan Dasar Lokal”
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Pendaftaran terbuka untuk umum WNI (individu), 100% gratis tanpa dipungut
                biaya. Total hadiah resmi Rp 2.250.000.
              </p>
            </div>

            {/* Download Guidelines Notice */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                Pastikan Anda telah membaca syarat teknis dan kriteria karya lomba.
              </div>
              <a
                href={EVENT_CONFIG.competitions.desainKemasan.documentPath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
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
                  1. Data Diri Peserta
                </h2>

                <div className="space-y-1.5">
                  <label htmlFor="full_name" className="text-xs font-bold text-slate-700 block">
                    Nama Lengkap (Sesuai KTP/Identitas) <span className="text-rose-600">*</span>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                      placeholder="08123456789"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-xs font-bold text-slate-700 block">
                    Alamat Domisili Lengkap <span className="text-rose-600">*</span>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Product & Design Concept Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  2. Konsep Desain Kemasan Kuliner
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="brand_name" className="text-xs font-bold text-slate-700 block">
                      Nama Merek Produk (Brand) <span className="text-rose-600">*</span>
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="product_name" className="text-xs font-bold text-slate-700 block">
                      Nama Produk Kuliner <span className="text-rose-600">*</span>
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="local_ingredients" className="text-xs font-bold text-slate-700 block">
                    Bahan Dasar Lokal yang Digunakan <span className="text-rose-600">*</span>
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
                    placeholder="Contoh: Ubi ungu, tahu Sumedang, tempe, oncom, olahan lokal Jawa Barat"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Sesuai ketentuan lomba: produk kuliner berbahan dasar lokal khas Kota Bandung / Jawa Barat.
                  </span>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.ai_used}
                      onChange={(e) =>
                        setFormData({ ...formData, ai_used: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
                    />
                    <div className="text-xs">
                      <span className="text-slate-900 font-bold block">
                        Karya ini menggunakan Artificial Intelligence (AI) sebagai alat bantu final mockup
                      </span>
                      <span className="text-slate-500 block mt-0.5">
                        Sesuai Pasal Persyaratan Karya: AI diizinkan hanya sebagai alat bantu visualisasi final mockup. Peserta tetap wajib melampirkan bukti proses kreatif dan technical pack pola orisinal.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Declarations & Pakta Integritas */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  3. Pakta Integritas & Pernyataan Resmi
                </h2>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
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
                      className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 block font-bold">
                        Pakta Integritas Orisinalitas Karya:
                      </strong>
                      Saya menyatakan bahwa karya desain kemasan yang saya ikut sertakan merupakan karya asli (orisinal) buatan saya sendiri, tidak melanggar hak cipta/kekayaan intelektual pihak lain, dan saya bertanggung jawab penuh atas segala konsekuensi hukum yang timbul.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
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
                      className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 block font-bold">
                        Surat Pernyataan Persetujuan Publikasi:
                      </strong>
                      Saya menyatakan karya ini belum pernah dipublikasikan secara komersial/memenangkan perlombaan sejenis, dan bersedia karyanya digunakan oleh panitia/Dinas Perdagangan dan Perindustrian Kota Bandung untuk dokumentasi dan publikasi non-komersial.
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
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
                      className="w-4 h-4 mt-0.5 accent-blue-600 flex-shrink-0"
                    />
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900 block font-bold">
                        Kepatuhan Syarat & Ketentuan:
                      </strong>
                      Saya telah membaca, memahami, dan menyetujui seluruh syarat, ketentuan teknis, jadwal, serta menerima keputusan Dewan Juri PRIDE Industri 2026 yang bersifat mutlak dan tidak dapat diganggu gugat.
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-4 sm:px-6 rounded-full text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 text-center flex items-center justify-center leading-normal"
                >
                  {loading ? 'Memproses Pendaftaran...' : 'Kirim Formulir Pendaftaran Desain Kemasan →'}
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
