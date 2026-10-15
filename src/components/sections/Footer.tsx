'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CONFIG } from '@/config/event';

export default function Footer() {
  return (
    <footer
      className="relative bg-[#070707] border-t border-[rgba(255,255,255,0.08)] pt-16 pb-12 text-[#8A8A8A]"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1A1A1A]">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/LOGO_PRIDE_INDUSTRI.png"
                  alt="PRIDE Industri 2026"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-display text-lg font-bold text-[#F5F0E8] tracking-wide">
                PRIDE <span className="text-[#C8A96E]">2026</span>
              </span>
            </div>

            <p className="font-display italic text-sm text-[#B8B0A4] max-w-sm">
              Pagelaran Ragam Inovasi dan Eksistensi — Merayakan Daya Cipta dan
              Kemandirian Industri Kecil dan Menengah Kota Bandung.
            </p>

            <p className="text-xs text-[#6B6560] leading-relaxed">
              Diselenggarakan oleh{' '}
              <strong className="text-[#8A8A8A]">
                {EVENT_CONFIG.organizer}
              </strong>{' '}
              berkolaborasi dengan mitra strategis dan pelaku IKM Kota Bandung.
            </p>
          </div>

          {/* Col 2: Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold tracking-[0.15em] uppercase text-[#F5F0E8]">
              Navigasi Festival
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-[#C8A96E] transition-colors">
                  Tentang Acara
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-[#C8A96E] transition-colors">
                  Jadwal Program
                </a>
              </li>
              <li>
                <a href="#competitions" className="hover:text-[#C8A96E] transition-colors">
                  Kompetisi Resmi
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#C8A96E] transition-colors">
                  Lokasi Venue
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C8A96E] transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
              <li>
                <Link href="/check-in" className="hover:text-[#C8A96E] transition-colors">
                  Check-In Peserta
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Contact */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold tracking-[0.15em] uppercase text-[#F5F0E8]">
              Kanal Resmi & Kontak
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a
                  href={`mailto:${EVENT_CONFIG.contact.email}`}
                  className="hover:text-[#C8A96E] transition-colors"
                >
                  {EVENT_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📸</span>
                <a
                  href={EVENT_CONFIG.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8A96E] transition-colors"
                >
                  Instagram: {EVENT_CONFIG.contact.instagramHandle}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>🎵</span>
                <a
                  href={EVENT_CONFIG.contact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8A96E] transition-colors"
                >
                  TikTok: {EVENT_CONFIG.contact.tiktokHandle}
                </a>
              </li>
              <li className="pt-2 text-[11px] text-[#6B6560]">
                {EVENT_CONFIG.venue.name} · {EVENT_CONFIG.venue.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#6B6560]">
          <div>
            © 2026 PRIDE Industri · RRD Organizer. Hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-[#B8B0A4] transition-colors underline"
            >
              Kebijakan Privasi Data Peserta
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-[#B8B0A4] transition-colors text-[#555]"
            >
              Portal Panitia (Admin)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
