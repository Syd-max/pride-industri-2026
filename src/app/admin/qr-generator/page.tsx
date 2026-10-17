'use client';

import { useState } from 'react';

interface QrItem {
  id: string;
  title: string;
  category: string;
  path: string;
  description: string;
  badge: string;
  badgeClass: string;
}

export default function QrGeneratorPage() {
  const [gateToken, setGateToken] = useState('PRIDE2026-GATE-BRAGA-MAIN');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentHost =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://pride-industri-2026.vercel.app';

  // ─── Group A: Gate Check-in QR Destination ───
  const gateCheckInUrl = `${currentHost}/check-in?gate=braga-city-walk&token=${encodeURIComponent(
    gateToken
  )}&scanned=true`;

  const gateQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    gateCheckInUrl
  )}&bgcolor=ffffff&color=000000&margin=12`;

  // ─── Group B: Competition Registration Pages ───
  const competitionList: QrItem[] = [
    {
      id: 'desain-kemasan',
      title: 'Lomba Desain Kemasan IKM 2026',
      category: 'Kompetisi Kemasan Kuliner',
      path: '/competition/desain-kemasan',
      description: 'Formulir registrasi & upload berkas karya desain kemasan produk kuliner berbahan dasar lokal.',
      badge: 'Lomba Desain Kemasan',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      id: 'video-lokal',
      title: 'Lomba Video Kreatif 1 Menit',
      category: 'Kompetisi Video Sinematik',
      path: '/competition/video-lokal',
      description: 'Formulir pendaftaran 4 kategori (Fesyen, Kuliner, Kriya, PRIDE 2026) & submission link karya reels/TikTok.',
      badge: 'Lomba Video 1 Menit',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'website-utama',
      title: 'Website Utama PRIDE Industri 2026',
      category: 'Portal Resmi Festival',
      path: '/',
      description: 'Halaman beranda publik, info rundown agenda, lokasi Braga City Walk, dan FAQ event.',
      badge: 'Portal Resmi Event',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* ─── Top Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            QR Code Generator
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Generate QR Code operasional resmi untuk presensi gerbang Braga City Walk dan pendaftaran kompetisi.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect width="12" height="8" x="6" y="14" rx="1" />
          </svg>
          <span>Cetak Poster Standee</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          GROUP A: GATE CHECK-IN QR (PRESENSI KEHADIRAN DI BRAGA)
          ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            A. QR Code Presensi Gate (Braga City Walk)
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Official Gate Asset
          </span>
        </div>

        <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Standee Preview Card */}
            <div className="md:col-span-5 flex justify-center">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-sm max-w-xs w-full space-y-4">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  PRIDE INDUSTRI 2026 · BRAGA
                </div>
                <div className="font-extrabold text-sm leading-tight text-slate-900">
                  PINDAI DENGAN KAMERA UNTUK CHECK-IN
                </div>
                <div className="p-3 bg-white rounded-xl inline-block border border-slate-200 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={gateQrImageUrl}
                    alt="QR Gate PRIDE Industri 2026"
                    className="w-48 h-48 mx-auto object-contain"
                  />
                </div>
                <div className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 p-2 rounded-lg truncate">
                  {gateToken}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Buka website event · Pilih menu Check-In
                </div>
              </div>
            </div>

            {/* Token Configuration & Gate Details */}
            <div className="md:col-span-7 space-y-5 text-xs text-slate-600">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Token Rahasia Gerbang (Gate Token):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gateToken}
                    onChange={(e) => setGateToken(e.target.value)}
                    className="w-full text-xs py-2 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(gateToken, 'gateToken')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all shrink-0 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {copiedKey === 'gateToken' ? (
                      <span className="text-emerald-600 font-bold">Tersalin!</span>
                    ) : (
                      <span>Salin Token</span>
                    )}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Token yang disisipkan dalam link QR Code gerbang masuk untuk verifikasi keabsahan lokasi.
                </span>
              </div>

              {/* Destination URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  URL Tujuan QR Presensi:
                </label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 break-all flex items-center justify-between gap-2">
                  <span>{gateCheckInUrl}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(gateCheckInUrl, 'gateUrl')}
                    className="text-blue-600 hover:underline font-bold shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'gateUrl' ? 'Tersalin!' : 'Salin URL'}
                  </button>
                </div>
              </div>

              {/* Operational Guide */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-600 leading-relaxed">
                <div className="font-bold text-slate-900 text-xs">
                  Panduan Alur Presensi Peserta & Pengunjung:
                </div>
                <p>
                  1. Cetak poster ini atau tampilkan di layar tablet / standee meja gerbang Braga City Walk.
                </p>
                <p>
                  2. Pengunjung memindai QR Code ini menggunakan kamera bawaan smartphone mereka.
                </p>
                <p>
                  3. Halaman presensi akan terbuka secara instan. Pengunjung umum dapat langsung konfirmasi nama & domisili, sedangkan peserta lomba memasukkan kode registrasi mereka.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleDownload(gateQrImageUrl, `PRIDE2026-QR-Gate-Braga.png`)
                  }
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh QR Gate (PNG)</span>
                </button>

                <a
                  href={gateCheckInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all flex items-center gap-2"
                >
                  <span>Buka Halaman Presensi ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          GROUP B: COMPETITION REGISTRATION QR CODES
          ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            B. QR Code Pendaftaran Kompetisi
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Pendaftaran Resmi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitionList.map((comp) => {
            const targetUrl = `${currentHost}${comp.path}`;
            const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
              targetUrl
            )}&bgcolor=ffffff&color=000000&margin=10`;

            return (
              <div
                key={comp.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${comp.badgeClass}`}
                    >
                      {comp.badge}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      Aktif
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  {/* QR Image Frame */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <div className="p-2 bg-white rounded-lg inline-block border border-slate-200/80 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrImg}
                        alt={`QR Code ${comp.title}`}
                        className="w-40 h-40 mx-auto object-contain"
                      />
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-slate-500 truncate">
                      {targetUrl}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(qrImg, `PRIDE2026-QR-${comp.id}.png`)
                    }
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Unduh PNG</span>
                  </button>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Buka Halaman Form di Tab Baru"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
