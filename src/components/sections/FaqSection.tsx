'use client';

import { useState } from 'react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah pendaftaran kompetisi dipungut biaya?',
      a: 'Tidak. Pendaftaran Lomba Desain Kemasan maupun Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026 sepenuhnya GRATIS dan tidak dipungut biaya apa pun bagi seluruh peserta.',
    },
    {
      q: 'Siapa saja yang memenuhi syarat mengikuti kompetisi ini?',
      a: 'Lomba terbuka untuk Umum Warga Negara Indonesia (WNI) secara perorangan (individu). Anda dapat mendaftar langsung melalui situs ini dengan mengisi formulir resmi serta menyetujui Pakta Integritas.',
    },
    {
      q: 'Apakah boleh menggunakan Artificial Intelligence (AI) untuk Lomba Desain Kemasan?',
      a: 'Penggunaan AI diizinkan HANYA sebagai alat bantu pembuatan final mock up. Peserta wajib melampirkan bukti proses kreatif, eksplorasi ide, dan technical pack pola kemasan yang orisinal buatan sendiri.',
    },
    {
      q: 'Kapan dan di mana pengambilan video untuk Lomba Video 1 Menit dilakukan?',
      a: 'Pengambilan video wajib dilaksanakan pada tanggal 27–28 November 2026 secara langsung di area festival PRIDE Industri 2026, Braga City Walk, Kota Bandung. Video dibuat dengan format vertikal (Reels/TikTok) durasi maksimal 60 detik.',
    },
    {
      q: 'Apa saja tagar dan akun resmi yang wajib ditandai pada video lomba?',
      a: 'Peserta wajib menyertakan tagar #disdaginkotabandung #kemilau #prideindustri2026 #bdg #eventbandung #bandung, serta menandai akun Instagram resmi @bdg.perdaganganindustri atau akun TikTok resmi @disdagin.bandung dan memastikan akun dalam kondisi publik.',
    },
    {
      q: 'Bagaimana alur check-in kehadiran peserta di lokasi acara?',
      a: 'Peserta yang telah berhasil mendaftar akan menerima kode registrasi unik. Saat tiba di lokasi festival (Braga City Walk), buka menu "Check-In" di website ini pada smartphone Anda, izinkan akses kamera browser, dan pindai kode QR yang terpasang di gate masuk untuk mencatat kehadiran resmi secara real-time.',
    },
    {
      q: 'Ke mana saya dapat menghubungi panitia jika memiliki pertanyaan lebih lanjut?',
      a: 'Anda dapat menghubungi panitia pelaksana melalui surat elektronik ke email resmi: rumahkemasan.disdaginbdg@gmail.com atau melalui pesan langsung (DM) ke akun media sosial Disdagin Kota Bandung.',
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32 bg-[#0A0A0A]"
      aria-label="Pertanyaan yang Sering Diajukan"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#C8A96E] mb-3">
            <span className="w-8 h-[1px] bg-[#C8A96E]" />
            Bantuan & Panduan
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#F5F0E8] font-bold">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-[#8A8A8A]">
            Informasi penting seputar pendaftaran, teknis karya, dan kehadiran di
            PRIDE Industri 2026.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111111] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#161616] transition-colors"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-[#F5F0E8]">
                    {faq.q}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.15)] text-[#C8A96E] text-sm flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#C8A96E]/10' : ''
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#8A8A8A] leading-relaxed border-t border-[#1C1C1C]">
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
