import Link from 'next/link';
import { EVENT_CONFIG } from '@/config/event';
import TactlinkBanner from '@/components/ui/TactlinkBanner';

export const metadata = {
  title: 'Kebijakan Privasi & Perlindungan Data Peserta',
  description:
    'Pemberitahuan kebijakan privasi dan perlindungan data peserta PRIDE Industri 2026 Kota Bandung.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8B0A4] hover:text-[#C8A96E] transition-colors mb-6"
          >
            ← Kembali ke Beranda Festival
          </Link>

          <div className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C8A96E] mb-2">
            Transparansi & Keamanan
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#F5F0E8] font-bold">
            Kebijakan Privasi Data Peserta
          </h1>
          <p className="font-display italic text-base text-[#B8B0A4] mt-2">
            PRIDE Industri 2026 — Pagelaran Ragam Inovasi dan Eksistensi
          </p>
        </div>

        {/* Content sections */}
        <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] text-xs sm:text-sm text-[#8A8A8A] leading-relaxed space-y-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#F5F0E8] mb-2">
              1. Komitmen Pengelolaan Data
            </h2>
            <p>
              Penyelenggara PRIDE Industri 2026 (
              <strong>PT Rahman Ramadhan Diandra / RRD Organizer</strong>)
              bersama mitra resmi berkomitmen penuh melindungi privasi data
              pribadi yang Anda serahkan saat melakukan pendaftaran lomba maupun
              presensi kegiatan. Seluruh data dikelola dengan prinsip kehati-hatian,
              kerahasiaan, dan pembatasan akses.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-[#F5F0E8] mb-2">
              2. Data yang Dikumpulkan
            </h2>
            <p className="mb-2">
              Data yang dikumpulkan melalui formulir pendaftaran meliputi:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#B8B0A4]">
              <li>
                <strong>Data Identitas:</strong> Nama lengkap, alamat domisili,
                nomor WhatsApp/telepon, dan alamat surat elektronik (email).
              </li>
              <li>
                <strong>Data Karya Lomba Desain Kemasan:</strong> Nama merek,
                nama produk pangan olahan, bahan dasar lokal, dan status
                penggunaan kecerdasan buatan (AI) pada mockup.
              </li>
              <li>
                <strong>Data Karya Lomba Video 1 Menit:</strong> Nama akun
                Instagram/TikTok publik, pilihan kategori, dan tautan video.
              </li>
              <li>
                <strong>Data Presensi:</strong> Waktu kehadiran dan token gate
                masuk saat pemindaian kode QR di venue festival.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-[#F5F0E8] mb-2">
              3. Tujuan Penggunaan Data
            </h2>
            <p>Data peserta digunakan secara eksklusif untuk keperluan:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#B8B0A4] mt-2">
              <li>
                Verifikasi keabsahan kepesertaan kompetisi dan penjurian resmi.
              </li>
              <li>
                Pencatatan presensi kehadiran peserta di lokasi Braga City Walk.
              </li>
              <li>
                Komunikasi teknis pengumuman babak final dan penganugerahan
                hadiah.
              </li>
              <li>
                Dokumentasi dan publikasi non-komersial oleh Dinas Perdagangan
                dan Perindustrian (Disdagin) Kota Bandung sesuai persetujuan
                peserta pada Pakta Integritas.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-[#F5F0E8] mb-2">
              4. Perlindungan & Isolasi Database
            </h2>
            <p>
              Data tersimpan dalam arsitektur database Supabase yang terisolasi
              dengan Row Level Security (RLS). Kunci akses tingkat tinggi
              (service-role) disimpan eksklusif pada server backend dan tidak
              pernah dipublikasikan ke publik browser.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-[#F5F0E8] mb-2">
              5. Hak Peserta & Hubungi Kami
            </h2>
            <p>
              Peserta berhak meminta konfirmasi atau pembetulan data identitas
              yang keliru dengan menghubungi sekretariat panitia:
            </p>
            <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] mt-2 text-[#E4C584]">
              <div>
                <strong>Email:</strong> {EVENT_CONFIG.contact.email}
              </div>
              <div className="mt-1">
                <strong>Alamat Acara:</strong> {EVENT_CONFIG.venue.name} ·{' '}
                {EVENT_CONFIG.venue.address}
              </div>
            </div>
          </div>
        </div>

        {/* Tactlink Partner Banner */}
        <div className="pt-2">
          <TactlinkBanner variant="dark" />
        </div>

        <div className="text-center pt-4">
          <Link href="/" className="btn btn-ghost text-xs py-3 px-6 uppercase tracking-wider">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
