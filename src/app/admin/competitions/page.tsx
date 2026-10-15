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

  // Generate an online QR Code API URL for instant high-res printable poster
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
    gateToken
  )}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-[#222222]">
        <h1 className="font-display text-2xl font-bold text-[#F5F0E8]">
          Katalog Kompetisi & Generator QR Gate
        </h1>
        <p className="text-xs text-[#8A8A8A] mt-1">
          Kelola parameter kompetisi dan cetak QR Code resmi untuk ditempatkan pada gate Braga City Walk.
        </p>
      </div>

      {/* Gate QR Generator Standee Tool */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#C8A96E]/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded bg-[#C8A96E]/10 text-[#E4C584] border border-[#C8A96E]/20 mb-2">
              Official Gate Asset
            </div>
            <h2 className="font-display text-xl font-bold text-[#F5F0E8]">
              Cetak Poster QR Gate Presensi
            </h2>
            <p className="text-xs text-[#8A8A8A] mt-1">
              Letakkan kode QR ini di meja registrasi / gerbang masuk Braga City Walk untuk dipindai peserta melalui kamera smartphone mereka.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn btn-primary text-xs py-2 px-4 flex items-center gap-2"
            >
              <span>🖨️</span>
              <span>Cetak Standee Gate</span>
            </button>
          </div>
        </div>

        {/* Printable Standee Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4 border-t border-[#222222]">
          <div className="md:col-span-5 flex justify-center">
            {/* White Poster Card for high contrast printing/scanning */}
            <div className="p-6 bg-white text-black rounded-2xl text-center shadow-2xl max-w-xs w-full space-y-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                PRIDE INDUSTRI 2026 · BRAGA
              </div>
              <div className="font-bold text-base leading-tight">
                PINDAI DENGAN KAMERA UNTUK CHECK-IN
              </div>
              <div className="p-2 bg-zinc-100 rounded-xl inline-block border border-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt="QR Gate PRIDE Industri 2026"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="text-[10px] font-mono text-zinc-600 bg-zinc-100 p-1.5 rounded truncate">
                {gateToken}
              </div>
              <div className="text-[9px] text-zinc-400">
                Buka website event · Pilih menu Check-In
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 text-xs text-[#8A8A8A]">
            <div className="form-field">
              <label className="form-label">Token Rahasia Gate:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gateToken}
                  onChange={(e) => setGateToken(e.target.value)}
                  className="form-input font-mono text-xs"
                />
                <button
                  onClick={handleCopy}
                  className="btn btn-secondary text-xs px-4 flex-shrink-0"
                >
                  {copied ? 'Tersalin!' : 'Salin Token'}
                </button>
              </div>
              <span className="text-[11px] text-[#6B6560]">
                Ubah token jika Anda ingin memperbarui atau mencabut akses gate tertentu.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] space-y-2">
              <div className="font-semibold text-[#F5F0E8] text-xs">
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
        <div className="admin-card space-y-4">
          <div className="flex justify-between items-start">
            <span className="badge badge-desain-kemasan">Kategori Kuliner</span>
            <span className="text-xs font-mono text-[#E4C584]">Rp 2.250.000</span>
          </div>
          <h3 className="font-display text-lg font-bold text-[#F5F0E8]">
            {EVENT_CONFIG.competitions.desainKemasan.name}
          </h3>
          <p className="text-xs text-[#8A8A8A]">
            {EVENT_CONFIG.competitions.desainKemasan.theme}
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <a
              href={EVENT_CONFIG.competitions.desainKemasan.documentPath}
              download
              className="text-[#C8A96E] hover:underline"
            >
              📄 Unduh Dokumen Syarat (.pdf)
            </a>
            <span className="text-[#34D399]">File Terverifikasi Aktif</span>
          </div>
        </div>

        {/* Video Lokal */}
        <div className="admin-card space-y-4">
          <div className="flex justify-between items-start">
            <span className="badge badge-video-lokal">4 Kategori Kreatif</span>
            <span className="text-xs font-mono text-[#E4C584]">Rp 2.250.000</span>
          </div>
          <h3 className="font-display text-lg font-bold text-[#F5F0E8]">
            {EVENT_CONFIG.competitions.videoLokal.name}
          </h3>
          <p className="text-xs text-[#8A8A8A]">
            {EVENT_CONFIG.competitions.videoLokal.theme}
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <a
              href={EVENT_CONFIG.competitions.videoLokal.documentPath}
              download
              className="text-[#C8A96E] hover:underline"
            >
              📄 Unduh Dokumen Syarat (.pdf)
            </a>
            <span className="text-[#34D399]">File Terverifikasi Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
