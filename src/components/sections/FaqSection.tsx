'use client';

import { useState } from 'react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah pendaftaran kompetisi dipungut biaya?',
      a: 'Tidak sama sekali. Pendaftaran Lomba Desain Kemasan maupun Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026 sepenuhnya 100% GRATIS dan tidak dipungut biaya apa pun bagi seluruh peserta.',
    },
    {
      q: 'Siapa saja yang memenuhi syarat mengikuti kompetisi ini?',
      a: 'Kompetisi terbuka untuk Umum Warga Negara Indonesia (WNI) secara perorangan (individu). Anda dapat langsung mendaftar melalui website ini dengan mengisi formulir resmi serta menyetujui Pakta Integritas.',
    },
    {
      q: 'Apakah boleh menggunakan Artificial Intelligence (AI) untuk Lomba Desain Kemasan?',
      a: 'Penggunaan AI diizinkan HANYA sebagai alat bantu pembuatan final mock-up visual. Peserta wajib melampirkan bukti proses kreatif, eksplorasi ide orisinal, serta technical pack pola kemasan buatan sendiri.',
    },
    {
      q: 'Kapan dan di mana pengambilan video untuk Lomba Video 1 Menit dilakukan?',
      a: 'Pengambilan video wajib dilaksanakan pada tanggal 27–28 November 2026 secara langsung di area festival PRIDE Industri 2026, Braga City Walk, Kota Bandung. Format video vertikal (Reels/TikTok) durasi maksimal 60 detik.',
    },
    {
      q: 'Apa saja tagar dan akun resmi yang wajib ditandai pada video lomba?',
      a: 'Peserta wajib menyertakan tagar #disdaginkotabandung #kemilau #prideindustri2026 #bdg #eventbandung #bandung, serta menandai akun Instagram resmi @bdg.perdaganganindustri atau akun TikTok resmi @disdagin.bandung dengan akun berstatus publik.',
    },
    {
      q: 'Bagaimana cara melakukan check-in kehadiran di venue Braga?',
      a: 'Peserta yang telah mendaftar dapat membuka menu "Scan QR Check-In" di website ini menggunakan browser smartphone, izinkan akses kamera, lalu arahkan kamera ke kode QR gate yang disediakan panitia untuk verifikasi instan.',
    },
    {
      q: 'Ke mana saya dapat menghubungi panitia jika memiliki pertanyaan lebih lanjut?',
      a: 'Anda dapat menghubungi panitia pelaksana melalui email: rumahkemasan.disdaginbdg@gmail.com atau melalui pesan langsung (DM) ke akun Instagram resmi Disdagin Kota Bandung.',
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-20 sm:py-28 bg-white border-t border-slate-200/80"
      aria-label="Pertanyaan yang Sering Diajukan"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Bantuan & FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Informasi penting seputar pendaftaran, teknis karya, dan kehadiran di
            PRIDE Industri 2026.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-blue-300 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-transform ${
                      isOpen
                        ? 'bg-blue-600 text-white rotate-180'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
