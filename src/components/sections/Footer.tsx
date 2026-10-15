'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';

export default function Footer() {
  return (
    <footer
      className="relative bg-slate-900 border-t border-slate-800 pt-16 pb-12 text-slate-400"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Organizer */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/LOGO_PRIDE_INDUSTRI.png"
                  alt="PRIDE Industri 2026"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                PRIDE <span className="text-rose-500">INDUSTRI 2026</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed">
              Pagelaran Ragam Inovasi dan Eksistensi — Merayakan Daya Cipta dan
              Kemandirian Industri Kecil dan Menengah (IKM) Kota Bandung.
            </p>

            <div className="text-xs text-slate-400 space-y-1">
              <p>
                <strong className="text-slate-200">Penyelenggara:</strong>{' '}
                {EVENT_CONFIG.organizer}
              </p>
              <p>
                <strong className="text-slate-200">Didukung Oleh:</strong> Dinas
                Perdagangan dan Perindustrian Kota Bandung (KEMILAU)
              </p>
            </div>
          </div>

          {/* Col 2: Navigasi Festival */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Tentang Acara
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-white transition-colors">
                  Jadwal Program
                </a>
              </li>
              <li>
                <a href="#competitions" className="hover:text-white transition-colors">
                  Kompetisi Resmi
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">
                  Lokasi Venue
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Akses Peserta */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Akses Peserta
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/competition/desain-kemasan"
                  className="hover:text-white transition-colors"
                >
                  Daftar Desain Kemasan
                </Link>
              </li>
              <li>
                <Link
                  href="/competition/video-lokal"
                  className="hover:text-white transition-colors"
                >
                  Daftar Lomba Video
                </Link>
              </li>
              <li>
                <Link
                  href="/check-in"
                  className="hover:text-white transition-colors text-blue-400 font-semibold"
                >
                  Kamera QR Check-In
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors text-slate-500"
                >
                  Portal Admin Panitia
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Social Media */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Kontak Panitia
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a
                  href={`mailto:${EVENT_CONFIG.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {EVENT_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📸</span>
                <a
                  href="https://instagram.com/bdg.perdaganganindustri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @bdg.perdaganganindustri
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>🎵</span>
                <a
                  href="https://tiktok.com/@disdagin.bandung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @disdagin.bandung
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 PRIDE Industri Kota Bandung. Hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-4">
            <span>Braga City Walk Bandung</span>
            <span>·</span>
            <span>27–28 November 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
