'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type FaqCategory = 'all' | 'pendaftaran' | 'karya' | 'video' | 'kehadiran';

interface FaqItem {
  id: string;
  category: FaqCategory;
  categoryLabel: string;
  q: string;
  a: string;
  highlight?: string;
  action?: {
    label: string;
    href?: string;
    type?: 'link' | 'copy';
    copyText?: string;
  };
}

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'pendaftaran',
      categoryLabel: 'Pendaftaran & Biaya',
      q: 'Apakah pendaftaran kompetisi dipungut biaya?',
      a: 'Tidak sama sekali. Pendaftaran Lomba Desain Kemasan maupun Lomba Video 1 Menit (60 Detik) PRIDE Industri 2026 sepenuhnya 100% GRATIS dan tidak dipungut biaya apa pun bagi seluruh peserta.',
      highlight: '100% Bebas Biaya Pendaftaran',
      action: {
        label: 'Daftar Kompetisi Sekarang',
        href: '/#competitions',
        type: 'link',
      },
    },
    {
      id: 'faq-2',
      category: 'pendaftaran',
      categoryLabel: 'Pendaftaran & Syarat',
      q: 'Siapa saja yang memenuhi syarat mengikuti kompetisi ini?',
      a: 'Kompetisi terbuka untuk Umum Warga Negara Indonesia (WNI) secara perorangan (individu). Anda dapat langsung mendaftar melalui website ini dengan mengisi formulir resmi serta menyetujui Pakta Integritas orisinalitas karya.',
      highlight: 'Terbuka Umum Seluruh WNI (Individu)',
    },
    {
      id: 'faq-3',
      category: 'karya',
      categoryLabel: 'Aturan Karya & AI',
      q: 'Apakah boleh menggunakan Artificial Intelligence (AI) untuk Lomba Desain Kemasan?',
      a: 'Penggunaan Generative AI hanya diizinkan sebagai alat bantu rendering/mock-up visual akhir. Peserta tetap wajib melampirkan bukti eksplorasi konsep orisinal, sketsa/proses kreatif, serta technical pack pola kemasan (dieline/jaring-jaring) buatan sendiri.',
      highlight: 'AI Hanya Boleh untuk Visual Mock-up Akhir',
    },
    {
      id: 'faq-4',
      category: 'video',
      categoryLabel: 'Lomba Video 1 Menit',
      q: 'Kapan dan di mana pengambilan video untuk Lomba Video 1 Menit dilakukan?',
      a: 'Pengambilan video wajib dilaksanakan pada tanggal 27–28 November 2026 secara langsung (on-site) di area festival PRIDE Industri 2026, Braga City Walk, Kota Bandung. Format video vertikal (9:16 Reels/TikTok) dengan durasi maksimal 60 detik.',
      highlight: 'On-Site Braga City Walk · 27–28 Nov 2026',
    },
    {
      id: 'faq-5',
      category: 'video',
      categoryLabel: 'Lomba Video & Tagar',
      q: 'Apa saja tagar dan akun resmi yang wajib ditandai pada video lomba?',
      a: 'Peserta wajib menyertakan tagar resmi: #disdaginkotabandung #kemilau #prideindustri2026 #bdg #eventbandung #bandung, serta menandai akun Instagram resmi @bdg.perdaganganindustri atau akun TikTok @disdagin.bandung dengan status akun publik (tidak di-private).',
      action: {
        label: 'Salin Semua Tagar Resmi',
        type: 'copy',
        copyText: '#disdaginkotabandung #kemilau #prideindustri2026 #bdg #eventbandung #bandung',
      },
    },
    {
      id: 'faq-6',
      category: 'kehadiran',
      categoryLabel: 'Presensi & Kehadiran',
      q: 'Bagaimana cara melakukan check-in kehadiran di venue Braga City Walk?',
      a: 'Buka menu "Scan Barcode Check-In" di website ini melalui smartphone Anda saat tiba di lokasi. Izinkan akses kamera, lalu pindai poster barcode fisik resmi yang terpasang di Meja Registrasi Gate Braga City Walk untuk mencetak E-Pass Pengunjung atau memverifikasi E-Badge Peserta Lomba Anda.',
      highlight: 'Wajib Scan Kamera di Gate Braga',
      action: {
        label: 'Buka Scanner Check-In Gate',
        href: '/check-in',
        type: 'link',
      },
    },
    {
      id: 'faq-7',
      category: 'pendaftaran',
      categoryLabel: 'Layanan & Bantuan',
      q: 'Ke mana saya dapat menghubungi panitia jika memiliki pertanyaan lebih lanjut?',
      a: 'Panitia siap membantu Anda melalui email resmi: rumahkemasan.disdaginbdg@gmail.com, pesan langsung (DM) ke Instagram resmi @bdg.perdaganganindustri, atau melalui nomor layanan informasi Meja Registrasi Utama.',
      highlight: 'Respon Cepat Disdagin Kota Bandung',
    },
  ];

  const categories = [
    { key: 'all', label: 'Semua' },
    { key: 'pendaftaran', label: 'Pendaftaran' },
    { key: 'karya', label: 'Desain Kemasan' },
    { key: 'video', label: 'Lomba Video' },
    { key: 'kehadiran', label: 'Presensi & Lokasi' },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory = activeCategory === 'all' || faq.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        faq.q.toLowerCase().includes(query) ||
        faq.a.toLowerCase().includes(query) ||
        faq.categoryLabel.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  const handleCopyTagar = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section
      id="faq"
      className="relative py-10 sm:py-14 lg:py-16 bg-white border-t border-slate-200/80"
      aria-label="Pertanyaan yang Sering Diajukan"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200/90 shadow-2xs mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Pusat Bantuan &amp; FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Informasi lengkap seputar pendaftaran, teknis karya, dan kehadiran di PRIDE Industri 2026.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="mb-6 sm:mb-8 space-y-4">
          
          {/* Quick Search Input (Apple-style clean pill) */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-full outline-none transition-all placeholder:text-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Bersihkan pencarian"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter Pills (Rapi, Simetris & Scrollable di Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key as FaqCategory)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 border border-slate-200/80 text-slate-500 text-xs space-y-2">
              <p className="font-semibold text-slate-700">Tidak ada pertanyaan yang sesuai dengan kata kunci &quot;{searchQuery}&quot;.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Tampilkan semua pertanyaan
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              const formattedIndex = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-blue-400/90 bg-white shadow-md ring-2 ring-blue-500/10 border-l-4 border-l-blue-600'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                  }`}
                >
                  {/* Accordion Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-start sm:items-center justify-between gap-3.5 cursor-pointer select-none group"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <span
                        className={`font-mono text-xs font-extrabold flex-shrink-0 transition-colors mt-0.5 sm:mt-0 ${
                          isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {formattedIndex}
                      </span>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {faq.categoryLabel}
                          </span>
                        </div>
                        <h3
                          className={`text-sm sm:text-base font-bold transition-colors leading-snug ${
                            isOpen ? 'text-blue-950 font-extrabold' : 'text-slate-800 group-hover:text-slate-900'
                          }`}
                        >
                          {faq.q}
                        </h3>
                      </div>
                    </div>

                    {/* Smooth Icon Transition (+ / -) */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isOpen
                          ? 'bg-blue-600 text-white shadow-xs rotate-45'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content Body */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-100 space-y-3.5 animate-in fade-in-50 duration-200">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-7">
                        {faq.a}
                      </p>

                      {/* Highlights & Actions */}
                      <div className="pl-0 sm:pl-7 flex flex-wrap items-center gap-2.5 pt-1">
                        {faq.highlight && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {faq.highlight}
                          </span>
                        )}

                        {faq.action && faq.action.type === 'link' && faq.action.href && (
                          <Link
                            href={faq.action.href}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                          >
                            <span>{faq.action.label}</span>
                          </Link>
                        )}

                        {faq.action && faq.action.type === 'copy' && faq.action.copyText && (
                          <button
                            type="button"
                            onClick={() => handleCopyTagar(faq.action?.copyText || '')}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                              copiedHashtags
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                            }`}
                          >
                            {copiedHashtags ? (
                              <>
                                <svg className="w-3.5 h-3.5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <span>Berhasil Disalin ke Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                </svg>
                                <span>{faq.action.label}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Creative Clean Support Card */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <span>Masih punya pertanyaan seputar kompetisi?</span>
              <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
              </svg>
            </h4>
            <p className="text-xs text-slate-600">
              Tim panitia Rumah Kemasan Disdagin Kota Bandung siap membantu Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              href="mailto:rumahkemasan.disdaginbdg@gmail.com"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Email Panitia</span>
            </a>
            <a
              href="https://www.instagram.com/bdg.perdaganganindustri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>DM Instagram Disdagin</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
