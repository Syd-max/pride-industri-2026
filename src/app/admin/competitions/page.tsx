'use client';

import { useState } from 'react';
import { EVENT_CONFIG } from '@/config/event';

export default function CompetitionsAdminPage() {
  const [gateToken, setGateToken] = useState('PRIDE2026-GATE-BRAGA-MAIN');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(gateToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentHost =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://pride-industri-2026.vercel.app';
  const gateCheckInUrl = `${currentHost}/check-in?gate=braga-city-walk&token=${encodeURIComponent(
    gateToken
  )}&scanned=true`;

  // Generate an online QR Code API URL for instant high-res printable poster
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
    gateCheckInUrl
  )}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Katalog Kompetisi & Generator QR Gate
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Kelola parameter kompetisi dan cetak QR Code resmi untuk ditempatkan pada gate Braga City Walk.
        </p>
      </div>

      {/* Gate QR Generator Standee Tool */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              Official Gate Asset
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Cetak Poster QR Gate Presensi
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 max-w-xl">
              Letakkan kode QR ini di meja registrasi / gerbang masuk Braga City Walk untuk dipindai peserta melalui kamera smartphone mereka.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect width="12" height="8" x="6" y="14" rx="1" />
              </svg>
              <span>Cetak Standee Gate</span>
            </button>
          </div>
        </div>

        {/* Printable Standee Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6 border-t border-slate-100">
          <div className="md:col-span-5 flex justify-center">
            {/* White Poster Card for high contrast printing/scanning */}
            <div className="p-6 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-center shadow-md max-w-xs w-full space-y-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                PRIDE INDUSTRI 2026 · BRAGA
              </div>
              <div className="font-extrabold text-sm leading-tight text-slate-900">
                PINDAI DENGAN KAMERA UNTUK CHECK-IN
              </div>
              <div className="p-3 bg-white rounded-xl inline-block border border-slate-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt="QR Gate PRIDE Industri 2026"
                  className="w-48 h-48 mx-auto"
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

          <div className="md:col-span-7 space-y-4 text-xs text-slate-600">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Token Rahasia Gate:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gateToken}
                  onChange={(e) => setGateToken(e.target.value)}
                  className="form-input font-mono text-xs py-2 px-3 flex-1"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all flex-shrink-0 cursor-pointer"
                >
                  {copied ? '✓ Tersalin!' : 'Salin Token'}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Ubah token jika Anda ingin memperbarui atau mencabut akses gate tertentu.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-600 leading-relaxed">
              <div className="font-bold text-slate-900 text-xs">
                Panduan Operasional Petugas Gate:
              </div>
              <p>
                1. Cetak poster di samping atau tampilkan pada layar tablet di gerbang masuk.
              </p>
              <p>
                2. Arahkan pengunjung yang telah mendaftar lomba untuk membuka halaman <strong>/check-in</strong> pada browser ponsel mereka.
              </p>
              <p>
                3. Peserta memasukkan kode registrasi mereka lalu mengarahkan kamera ke kode QR ini.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog of Two Competitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Desain Kemasan */}
        <div className="admin-card space-y-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="badge badge-desain-kemasan">Kategori Kuliner</span>
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">Rp 2.250.000</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {EVENT_CONFIG.competitions.desainKemasan.name}
          </h3>
          <p className="text-xs font-medium text-slate-500">
            {EVENT_CONFIG.competitions.desainKemasan.theme}
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <a
              href={EVENT_CONFIG.competitions.desainKemasan.documentPath}
              download
              className="text-blue-600 font-bold hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Unduh Dokumen Syarat (.pdf)</span>
            </a>
            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> File Terverifikasi Aktif
            </span>
          </div>
        </div>

        {/* Video Lokal */}
        <div className="admin-card space-y-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="badge badge-video-lokal">4 Kategori Kreatif</span>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">Rp 2.250.000</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {EVENT_CONFIG.competitions.videoLokal.name}
          </h3>
          <p className="text-xs font-medium text-slate-500">
            {EVENT_CONFIG.competitions.videoLokal.theme}
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <a
              href={EVENT_CONFIG.competitions.videoLokal.documentPath}
              download
              className="text-blue-600 font-bold hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Unduh Dokumen Syarat (.pdf)</span>
            </a>
            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> File Terverifikasi Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
