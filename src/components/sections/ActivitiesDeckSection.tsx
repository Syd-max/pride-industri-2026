'use client';

import { useState, useEffect, useRef } from 'react';
import './activities-deck.css';

interface ProgramAgendaDetail {
  id: string;
  title: string;
  badge: string;
  timeVenue: string;
  categoryTags: string[];
  summary: string;
  agendaPoints: string[];
  agendaItems: {
    title: string;
    description: string;
  }[];
  audienceNote: string;
}

const PROGRAM_DETAILS: Record<string, ProgramAgendaDetail> = {
  fashion: {
    id: 'fashion',
    title: 'Fashion Show Runway Desainer Binaan',
    badge: 'Fesyen & Wastra',
    timeVenue: 'Jum’at, 27 November 2026 · 15:30 – 17:30 WIB · Main Runway Braga City Walk',
    categoryTags: ['Desainer Binaan', 'Ready-to-Wear', 'Wastra Bandung'],
    summary: 'Peragaan busana siap pakai kontemporer yang memadukan kekayaan wastra lokal khas Bandung dengan garis rancang modern oleh 20+ desainer fesyen binaan Disdagin Kota Bandung.',
    agendaPoints: [
      'Parade Runway 20+ Desainer Fesyen Binaan Disdagin',
      'Eksplorasi Wastra & Motif Khas Nusantara Berstandar Global',
      'Business Matching & Temu Jejaring Buyer Potensial'
    ],
    agendaItems: [
      {
        title: 'Parade Runway 20+ Desainer Binaan',
        description: 'Peragaan koleksi busana siap pakai (ready-to-wear) karya desainer fesyen lokal di atas panggung runway berstandar internasional.'
      },
      {
        title: 'Eksplorasi Wastra & Motif Khas Bandung',
        description: 'Kurasi busana berbahan dasar kain tenun, bordir, dan motif batik khas Bandung dengan siluet editorial kontemporer.'
      },
      {
        title: 'Sesi Temu Bisnis (Buyer-Designer Networking)',
        description: 'Ruang interaksi langsung antara desainer lokal dengan kurator, retailer, dan pembeli potensial untuk memperluas pasar komersial.'
      },
      {
        title: 'Photo Session & Media Coverage',
        description: 'Sesi dokumentasi editorial di koridor ikonik Braga bersama jajaran model profesional untuk publikasi media nasional.'
      }
    ],
    audienceNote: 'Terbuka gratis untuk umum dan pengunjung kawasan Braga City Walk.'
  },
  packaging: {
    id: 'packaging',
    title: 'Showcase & Penjurian Terbuka Desain Kemasan',
    badge: 'Inovasi Kemasan IKM',
    timeVenue: 'Sabtu, 28 November 2026 · 10:00 – 16:30 WIB · Area Expo Braga City Walk',
    categoryTags: ['Eco-Packaging', 'Pangan Lokal', 'Kesiapan Ekspor'],
    summary: 'Eksplorasi inovasi desain kemasan ramah lingkungan produk kuliner dan olahan pangan lokal binaan Kota Bandung untuk meningkatkan daya saing di ritel modern dan pasar ekspor.',
    agendaPoints: [
      'Pameran Fisik Mockup 3D Kemasan Ramah Lingkungan',
      'Live Pitching Finalis di Hadapan Dewan Juri Ahli',
      'Klinik Konsultasi & Kurasi Standar Ekspor Rumah Kemasan'
    ],
    agendaItems: [
      {
        title: 'Pameran Fisik Mockup 3D Kemasan',
        description: 'Showcase display prototipe kemasan inovatif produk olahan pangan lokal (umbi-umbian, tahu, tempe, dan penganan khas Bandung).'
      },
      {
        title: 'Live Pitching Finalis di Hadapan Juri',
        description: 'Presentasi konsep kreatif, pemilihan material ramah lingkungan (biodegradable), dan efisiensi biaya produksi oleh para finalis terpilih.'
      },
      {
        title: 'Klinik Kurasi & Konsultasi Rumah Kemasan',
        description: 'Sesi bimbingan langsung bersama tim ahli Rumah Kemasan Disdagin mengenai teknik cetak, labeling nutrisi, dan standar edar BPOM.'
      },
      {
        title: 'Kurasi Kesiapan Ritel Modern & Ekspor',
        description: 'Evaluasi kelayakan kemasan untuk penetrasi pasar swalayan modern dan rantai pasok ekspor produk olahan Jawa Barat.'
      }
    ],
    audienceNote: 'Pengunjung dapat melihat display pameran karya mockup kemasan secara langsung sepanjang hari.'
  },
  video: {
    id: 'video',
    title: 'Hunting Konten & Screening Lomba Video 1 Menit',
    badge: 'Kreativitas Visual',
    timeVenue: '27–28 November 2026 · Batas Upload 28 Nov 14:00 WIB · Screening 16:00 WIB',
    categoryTags: ['Video Vertikal', 'Cerita Lokal', 'Kreatif Braga'],
    summary: 'Kompetisi video vertikal 60 detik menangkap denyut produk IKM, kearifan lokal, dan atmosfer festival di koridor bersejarah Jalan Braga bertema “Karya Lokal, Cerita Lokal”.',
    agendaPoints: [
      'Hunting On-The-Spot Video 60 Detik di Seluruh Sudut Braga',
      'Kurasi 4 Kategori (Fesyen, Kuliner, Kriya, Suasana PRIDE)',
      'Screening Publik di Layar Videotron & Sesi Berbagi Kreator'
    ],
    agendaItems: [
      {
        title: 'On-the-Spot Video Hunting di Braga',
        description: 'Ratusan konten kreator berburu footage sinematik di berbagai sudut Braga City Walk dan booth pameran produk IKM.'
      },
      {
        title: 'Kurasi Karya 4 Kategori Kreatif',
        description: 'Penilaian karya video vertikal Reels/TikTok oleh dewan juri pada kategori Fesyen, Kuliner, Kriya, dan Atmosfer PRIDE 2026.'
      },
      {
        title: 'Screening Publik di Layar Videotron',
        description: 'Penayangan kurasi kompilasi video-video kreatif terbaik di layar LED videotron utama panggung Braga City Walk.'
      },
      {
        title: 'Mini Talkshow Konten Kreator',
        description: 'Diskusi singkat strategi pembuatan video vertikal bercerita (storytelling) yang efektif mengangkat nilai komersial produk lokal.'
      }
    ],
    audienceNote: 'Terbuka bagi seluruh pengunjung dan penonton festival di sepanjang koridor Braga.'
  },
  awards: {
    id: 'awards',
    title: 'Malam Gala Apresiasi Industri & Kepatuhan SIINAS',
    badge: 'Malam Penganugerahan',
    timeVenue: 'Sabtu, 28 November 2026 · 19:00 – 21:00 WIB · Ballroom Hotel Papandayan',
    categoryTags: ['Malam Anugerah', 'Kepatuhan SIINAS', '200 IKM Binaan'],
    summary: 'Malam anugerah kehormatan bagi pelaku industri besar, menengah, dan IKM yang tertib dan patuh dalam pelaporan Sistem Informasi Industri Nasional (SIINAS) Kota Bandung.',
    agendaPoints: [
      'Penganugerahan Kepatuhan Lapor SIINAS bagi 200 IKM Binaan',
      'Gala Dinner & Networking Eksekutif bersama Walikota Bandung',
      'Awarding Juara Lomba Desain Kemasan & Lomba Video 1 Menit'
    ],
    agendaItems: [
      {
        title: 'Penganugerahan Kepatuhan SIINAS 2026',
        description: 'Penyerahan trofi dan piagam penghargaan kehormatan kepada 200 pelaku industri dan IKM yang taat pelaporan data industri.'
      },
      {
        title: 'Gala Dinner & Networking Eksekutif',
        description: 'Perjamuan malam formal bersama Walikota Bandung, pimpinan Disdagin, Forkopimda, asosiasi bisnis, dan pimpinan industri.'
      },
      {
        title: 'Pemaparan Rapor Indeks Industri Kota Bandung',
        description: 'Presentasi capaian pertumbuhan sektor industri kreatif, realisasi investasi, dan peta jalan hilirisasi IKM Kota Bandung.'
      },
      {
        title: 'Awarding Juara Lomba Desain Kemasan & Video',
        description: 'Pengumuman resmi dan serah terima hadiah pemenang kompetisi festival PRIDE Industri 2026.'
      }
    ],
    audienceNote: 'Khusus undangan resmi, pelaku IKM binaan penerima penghargaan, dewan juri, dan perwakilan dinas.'
  },
  music: {
    id: 'music',
    title: 'Seremonial Mutu 100 Halal & Live Art Festival',
    badge: 'Standarisasi & Panggung Seni',
    timeVenue: '27–28 November 2026 · Penyerahan 28 Nov 14:00 WIB · Live Art 19:00 WIB',
    categoryTags: ['100 Halal & 3 SNI', 'Konsultasi Mutu', 'Panggung Perkusi & DJ'],
    summary: 'Seremonial penyerahan simbolis 100 Sertifikat Halal, 3 SNI, dan 100 fasilitasi Uji Mutu gratis dari Disdagin, dipadu panggung kolaborasi seni perkusi dan DJ kontemporer.',
    agendaPoints: [
      'Penyerahan Simbolis 100 Halal, 3 SNI & 100 Uji Mutu Gratis',
      'Pojok Meja Bantuan NIB, Legalitas Merek & Standar Mutu',
      'Live Percussion Beat, DJ Performance & Interactive Live Art'
    ],
    agendaItems: [
      {
        title: 'Penyerahan Simbolis 100 Sertifikat Halal & 3 SNI',
        description: 'Penyerahan dokumen jaminan mutu legalitas produk secara cuma-cuma (gratis) kepada perwakilan IKM binaan Kota Bandung.'
      },
      {
        title: 'Pojok Konsultasi Legalitas & Uji Mutu IKM',
        description: 'Layanan konsultasi meja bantuan (helpdesk) gratis untuk pendaftaran NIB, HKI Merek, uji laboratorium, dan sertifikasi Halal lanjutan.'
      },
      {
        title: 'Live Percussion & Electronic DJ Performance',
        description: 'Pertunjukan atraktif tabuhan ritme perkusi dipadu beat musik elektronik kontemporer menyemarakkan malam di Braga.'
      },
      {
        title: 'Live Interactive Art / Mural Exhibition',
        description: 'Aksi melukis langsung oleh perupa lokal Bandung yang memvisualisasikan semangat ragam inovasi industri kreatif Jawa Barat.'
      }
    ],
    audienceNote: 'Layanan konsultasi terbuka untuk seluruh pelaku usaha; panggung seni terbuka untuk umum.'
  }
};

export default function ActivitiesDeckSection() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramAgendaDetail | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProgram) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProgram]);

  useEffect(() => {
    /* ==========================================================
       1. CHARACTER SCRAMBLE INTERACTION (MATCHING ILIA DELIN CIPHER)
       ========================================================== */
    const heroNameEl = heroNameRef.current;
    const words = ['6', 'PROGRAM', 'UNGGULAN'];
    const cipherChars = '{[()]}/\\|<>?!#$%&*@+=~^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charSpans: HTMLSpanElement[] = [];

    if (heroNameEl) {
      heroNameEl.innerHTML = '';
      words.forEach((word, wordIdx) => {
        const wordWrap = document.createElement('span');
        wordWrap.className = 'deck-word';
        word.split('').forEach((char) => {
          const span = document.createElement('span');
          span.className = 'deck-hero-char';
          span.textContent = char;
          span.dataset.original = char;
          wordWrap.appendChild(span);
          charSpans.push(span);
        });
        heroNameEl.appendChild(wordWrap);

        if (wordIdx < words.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'deck-word-space';
          spaceSpan.innerHTML = '&nbsp;';
          heroNameEl.appendChild(spaceSpan);
        }
      });
    }

    function scrambleCharacter(span: HTMLSpanElement, duration = 360) {
      if (span.dataset.original === ' ') return;
      const anySpan = span as unknown as { scrambleTimer?: NodeJS.Timeout };
      if (anySpan.scrambleTimer) clearInterval(anySpan.scrambleTimer);

      const start = performance.now();
      anySpan.scrambleTimer = setInterval(() => {
        const elapsed = performance.now() - start;
        if (elapsed >= duration) {
          span.textContent = span.dataset.original || '';
          clearInterval(anySpan.scrambleTimer);
          anySpan.scrambleTimer = undefined;
        } else {
          span.textContent = cipherChars[Math.floor(Math.random() * cipherChars.length)];
        }
      }, 45);
    }

    charSpans.forEach((span, idx) => {
      const triggerScramble = () => {
        scrambleCharacter(span, 380);
        if (charSpans[idx + 1]) scrambleCharacter(charSpans[idx + 1], 320);
        if (charSpans[idx - 1]) scrambleCharacter(charSpans[idx - 1], 260);
      };
      span.addEventListener('pointerenter', triggerScramble);
      span.addEventListener('touchstart', triggerScramble, { passive: true });
    });

    /* ==========================================================
       2. PROCEDURAL 3D CANVAS ARTWORK RENDERERS (UNIFIED & HARMONIOUS)
       ========================================================== */
    function drawUnifiedCanvasBase(ctx: CanvasRenderingContext2D, w: number, h: number) {
      // 1. Unified Deep Midnight Obsidian Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, w, h);
      baseGrad.addColorStop(0, '#070b14');
      baseGrad.addColorStop(0.5, '#0c1220');
      baseGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Blueprint Architectural Perspective Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 64;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. Coordinate intersection markers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let x = 0; x < w; x += step * 2) {
        for (let y = 0; y < h; y += step * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Canvas 1: FASHION SHOW RUNWAY (Royal Violet & Rose Couture Waves)
    function drawFashionArt() {
      const canvas = document.getElementById('canvasFashion') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Luminous couture ambient light orbs
      const wavePositions = [
        { x: 920, y: 460, r: 420, c1: 'rgba(124, 58, 237, 0.45)', c2: 'rgba(99, 102, 241, 0.25)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 740, y: 220, r: 300, c1: 'rgba(236, 72, 153, 0.35)', c2: 'rgba(129, 140, 248, 0.18)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 1120, y: 660, r: 360, c1: 'rgba(56, 189, 248, 0.35)', c2: 'rgba(37, 99, 235, 0.2)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      wavePositions.forEach((wp) => {
        const g = ctx.createRadialGradient(wp.x - 60, wp.y - 60, 20, wp.x, wp.y, wp.r);
        g.addColorStop(0, wp.c1);
        g.addColorStop(0.5, wp.c2);
        g.addColorStop(1, wp.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Runway silhouette fabric lines
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.18)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.15 + i * 28, 0);
        ctx.bezierCurveTo(w * 0.45, h * 0.35, w * 0.35 + i * 16, h * 0.7, w * 0.85, h);
        ctx.stroke();
      }

      // Suspended fashion spheres
      const spheres = [
        { x: 420, y: 240, r: 85, color: '#ec4899' },
        { x: 540, y: 380, r: 110, color: '#8b5cf6' },
        { x: 480, y: 560, r: 95, color: '#3b82f6' },
        { x: 380, y: 700, r: 75, color: '#06b6d4' }
      ];
      spheres.forEach((s) => {
        const sg = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.05, s.x, s.y, s.r);
        sg.addColorStop(0, '#ffffff');
        sg.addColorStop(0.4, s.color);
        sg.addColorStop(1, '#070b14');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Canvas 2: LOMBA DESAIN KEMASAN (Emerald & Mint Eco-Blueprint Matrix)
    function drawPackagingArt() {
      const canvas = document.getElementById('canvasPackaging') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Emerald & mint ambient light orbs
      const ecoGlows = [
        { x: 920, y: 380, r: 380, c1: 'rgba(16, 185, 129, 0.35)', c2: 'rgba(5, 150, 105, 0.18)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 400, y: 540, r: 320, c1: 'rgba(52, 211, 153, 0.25)', c2: 'rgba(4, 120, 87, 0.12)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      ecoGlows.forEach((eg) => {
        const g = ctx.createRadialGradient(eg.x, eg.y, 10, eg.x, eg.y, eg.r);
        g.addColorStop(0, eg.c1);
        g.addColorStop(0.5, eg.c2);
        g.addColorStop(1, eg.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(eg.x, eg.y, eg.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3D Isometric packaging wireframe boxes
      ctx.save();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.32)';
      ctx.lineWidth = 1.6;
      const boxes = [
        { cx: 940, cy: 360, size: 130 },
        { cx: 780, cy: 520, size: 95 }
      ];
      boxes.forEach((b) => {
        const s = b.size;
        // Top Face
        ctx.beginPath();
        ctx.moveTo(b.cx, b.cy - s * 0.6);
        ctx.lineTo(b.cx + s * 0.9, b.cy - s * 0.1);
        ctx.lineTo(b.cx, b.cy + s * 0.4);
        ctx.lineTo(b.cx - s * 0.9, b.cy - s * 0.1);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
        ctx.stroke();
        // Verticals
        ctx.beginPath();
        ctx.moveTo(b.cx - s * 0.9, b.cy - s * 0.1); ctx.lineTo(b.cx - s * 0.9, b.cy + s * 0.6);
        ctx.moveTo(b.cx, b.cy + s * 0.4); ctx.lineTo(b.cx, b.cy + s * 1.1);
        ctx.moveTo(b.cx + s * 0.9, b.cy - s * 0.1); ctx.lineTo(b.cx + s * 0.9, b.cy + s * 0.6);
        ctx.stroke();
        // Bottom Face
        ctx.beginPath();
        ctx.moveTo(b.cx - s * 0.9, b.cy + s * 0.6);
        ctx.lineTo(b.cx, b.cy + s * 1.1);
        ctx.lineTo(b.cx + s * 0.9, b.cy + s * 0.6);
        ctx.stroke();
      });
      ctx.restore();

      // Technical blueprint dimension annotations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('ECO-BOX · 300g · BIODEGRADABLE', 820, 240);
      ctx.fillText('STANDAR EKSPOR IKM · 100%', 820, 520);
    }

    // Canvas 3: LOMBA VIDEO 1 MENIT (Sunset Amber & Cinema Reel Light Ribbons)
    function drawVideoArt() {
      const canvas = document.getElementById('canvasVideo') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Sunset Amber & Warm Gold ambient light orbs
      const videoGlows = [
        { x: 880, y: 440, r: 400, c1: 'rgba(245, 158, 11, 0.35)', c2: 'rgba(234, 88, 12, 0.2)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 420, y: 260, r: 280, c1: 'rgba(239, 68, 68, 0.25)', c2: 'rgba(180, 83, 9, 0.15)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      videoGlows.forEach((vg) => {
        const g = ctx.createRadialGradient(vg.x, vg.y, 10, vg.x, vg.y, vg.r);
        g.addColorStop(0, vg.c1);
        g.addColorStop(0.5, vg.c2);
        g.addColorStop(1, vg.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(vg.x, vg.y, vg.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Flowing 60fps golden cinematic light ribbons
      const palette = ['rgba(245, 158, 11, 0.32)', 'rgba(234, 88, 12, 0.28)', 'rgba(220, 38, 38, 0.22)', 'rgba(251, 191, 36, 0.3)'];
      for (let i = 0; i < 42; i++) {
        ctx.strokeStyle = palette[i % palette.length];
        ctx.lineWidth = 1.6 + (i % 3) * 1.2;
        const startX = (i * 30) % (w + 100);
        ctx.beginPath();
        ctx.moveTo(startX, h + 30);
        ctx.bezierCurveTo(startX - 120, h * 0.55, startX + 140, h * 0.3, startX + 60, -40);
        ctx.stroke();
      }

      // Vertical 9:16 Viewfinder reticle brackets
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.lineWidth = 1.8;
      const vx = 860, vy = 280, vw = 200, vh = 280;
      // Top-left
      ctx.beginPath(); ctx.moveTo(vx, vy + 24); ctx.lineTo(vx, vy); ctx.lineTo(vx + 24, vy); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(vx + vw - 24, vy); ctx.lineTo(vx + vw, vy); ctx.lineTo(vx + vw, vy + 24); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(vx, vy + vh - 24); ctx.lineTo(vx, vy + vh); ctx.lineTo(vx + 24, vy + vh); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(vx + vw - 24, vy + vh); ctx.lineTo(vx + vw, vy + vh); ctx.lineTo(vx + vw, vy + vh - 24); ctx.stroke();

      // Rec Indicator
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(vx + 18, vy + 20, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('REC [●] 00:01:00 · 9:16 REELS', vx + 28, vy + 24);
      ctx.restore();
    }

    // Canvas 4: APRESIASI INDUSTRI SIINAS (Royal Champagne Gold & Bronze Architecture)
    function drawAwardsArt() {
      const canvas = document.getElementById('canvasAwards') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Royal Champagne Gold ambient light cone
      const tg = ctx.createRadialGradient(960, 420, 10, 960, 420, 380);
      tg.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      tg.addColorStop(0.4, 'rgba(217, 119, 6, 0.18)');
      tg.addColorStop(1, 'rgba(7, 11, 20, 0)');
      ctx.fillStyle = tg;
      ctx.beginPath(); ctx.arc(960, 420, 380, 0, Math.PI * 2); ctx.fill();

      // Architectural fluted column beams
      const colCount = 18;
      for (let i = 0; i < colCount; i++) {
        const x = 520 + i * 44;
        const g = ctx.createLinearGradient(x, 0, x + 30, h);
        g.addColorStop(0, 'rgba(212, 175, 55, 0.2)');
        g.addColorStop(0.5, 'rgba(180, 83, 9, 0.1)');
        g.addColorStop(1, 'rgba(7, 11, 20, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + 36, 0);
        ctx.lineTo(x - 80, h); ctx.lineTo(x - 116, h);
        ctx.closePath();
        ctx.fill();
      }

      // Laurel concentric rings
      for (let r = 40; r <= 200; r += 40) {
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(960, 420, r, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('MALAM GALA ANUGERAH SIINAS · 200 IKM BINAAN', 780, 210);
    }

    // Canvas 5: SERTIFIKASI & LIVE ART (Electric Cyan & Neon Teal Acoustics)
    function drawMusicArt() {
      const canvas = document.getElementById('canvasMusic') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Cyan & teal ambient glow
      const acousticGlows = [
        { x: 380, y: 440, r: 380, c1: 'rgba(6, 182, 212, 0.32)', c2: 'rgba(13, 148, 136, 0.18)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 960, y: 360, r: 360, c1: 'rgba(56, 189, 248, 0.3)', c2: 'rgba(59, 130, 246, 0.15)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      acousticGlows.forEach((ag) => {
        const g = ctx.createRadialGradient(ag.x, ag.y, 10, ag.x, ag.y, ag.r);
        g.addColorStop(0, ag.c1);
        g.addColorStop(0.5, ag.c2);
        g.addColorStop(1, ag.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ag.x, ag.y, ag.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Concentric acoustic sound wave ripples
      for (let r = 30; r < 360; r += 32) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(380, 440, r, 0, Math.PI * 2); ctx.stroke();
      }

      // Live Equalizer frequency spectrum bars
      const barCount = 42;
      const startX = w * 0.18;
      const barWidth = (w * 0.64) / barCount;
      for (let i = 0; i < barCount; i++) {
        const barH = 35 + Math.sin(i * 0.4) * 110 + Math.cos(i * 0.7) * 45;
        const x = startX + i * barWidth;
        const y = h * 0.52 - barH / 2;
        const g = ctx.createLinearGradient(x, y, x, y + barH);
        g.addColorStop(0, '#06b6d4');
        g.addColorStop(0.5, '#3b82f6');
        g.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = g;
        ctx.fillRect(x + 2, y, barWidth - 4, barH);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('100 HALAL · 3 SNI · LIVE PERCUSSION BEAT', 820, 230);
    }

    // Render all canvases once mounted
    drawFashionArt();
    drawPackagingArt();
    drawVideoArt();
    drawAwardsArt();
    drawMusicArt();

    /* ==========================================================
       3. STACKED DECK SCROLL CHOREOGRAPHY (PEEL-DOWN ON SCROLL)
       ========================================================== */
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.activities-card'));
    cards.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

    const totalCards = cards.length; // 6 cards (0..5)

    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function updateDeck(scrollProgress: number) {
      // Maps scrollProgress across card peel stages:
      // Cards 0..4 peel down. Card 5 is the final resting showcase card!
      const peelableCards = totalCards - 1;
      const stageProgress = scrollProgress * peelableCards;
      const isMobile = window.innerWidth <= 768;
      const PEEK_STEP_Y = isMobile ? 8 : 12;
      const SCALE_STEP = isMobile ? 0.016 : 0.022;

      cards.forEach((card, i) => {
        card.style.zIndex = String((totalCards - i) * 10);
        
        const isFinalCard = i === totalCards - 1;
        const depth = isFinalCard ? Math.max(0, i - stageProgress) : (i - stageProgress);

        if (depth < 0) {
          const peelAmount = clamp(-depth, 0, 1);
          const easedPeel = easeInOutCubic(peelAmount);
          const translateYPercent = easedPeel * 120;
          const opacity = Math.max(0, 1 - Math.pow(peelAmount, 1.8));

          card.style.transform = `translate3d(0, ${translateYPercent}%, 0) scale(1)`;
          card.style.opacity = opacity.toFixed(3);
          card.style.pointerEvents = peelAmount > 0.15 ? 'none' : 'auto';
          card.style.visibility = peelAmount >= 1 ? 'hidden' : 'visible';
        } else {
          const effectiveDepth = Math.min(depth, 3.8);
          const yOffset = -effectiveDepth * PEEK_STEP_Y;
          const scale = 1 - effectiveDepth * SCALE_STEP;

          card.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale.toFixed(4)})`;
          card.style.opacity = '1';
          card.style.visibility = 'visible';
          card.style.pointerEvents = depth < 0.35 ? 'auto' : 'none';
        }
      });
    }

    function getScrollProgress(): number {
      const driver = scrollDriverRef.current;
      if (!driver) return 0;
      const rect = driver.getBoundingClientRect();
      const totalScroll = driver.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return 0;
      const current = -rect.top;
      return clamp(current / totalScroll, 0, 1);
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDeck(getScrollProgress());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      drawFashionArt();
      drawPackagingArt();
      drawVideoArt();
      drawAwardsArt();
      drawMusicArt();
      handleScroll();
    }, { passive: true });

    updateDeck(getScrollProgress());

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="activities-scroll-driver" id="programUnggulan" ref={scrollDriverRef}>
      <section className="activities-stage" aria-label="6 Program Unggulan PRIDE 2026">

        {/* 6-Card Stack Deck Container */}
        <div className="activities-deck-container" ref={deckContainerRef}>

          {/* LAYER 5: SERTIFIKASI & LIVE ART (Backmost Card) */}
          <article className="activities-card deck-project-card" data-index="5">
            <canvas className="deck-project-canvas" id="canvasMusic" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">SERTIFIKASI &amp; LIVE ART</span>
                  <span className="deck-project-subtitle">100 HALAL · 3 SNI · LIVE PERCUSSION &amp; DJ</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">FASILITASI GRATIS</span>
                  <span className="deck-tag-pill">STANDAR MUTU</span>
                  <span className="deck-tag-pill">PANGGUNG SENI</span>
                </div>
              </div>

              {/* Center Action: Opens Agenda Details (NO direct register CTA) */}
              <button
                type="button"
                onClick={() => setSelectedProgram(PROGRAM_DETAILS.music)}
                className="deck-view-btn"
                aria-label="Lihat Rincian Agenda Sertifikasi & Live Art"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>LIHAT DETAIL AGENDA</span>
              </button>

              {/* Bottom Structured Agenda Bar */}
              <div className="deck-agenda-bar">
                <div className="deck-agenda-top">
                  <div className="deck-agenda-badge">
                    <span className="deck-agenda-pulse" />
                    <span>AGENDA KEGIATAN UTAMA</span>
                  </div>
                  <span className="deck-agenda-time">27–28 NOV 2026 · BRAGA CITY WALK</span>
                </div>
                <div className="deck-agenda-items">
                  {PROGRAM_DETAILS.music.agendaPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="deck-agenda-item">
                      <span className="deck-agenda-bullet">✦</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <p className="deck-agenda-summary">
                  {PROGRAM_DETAILS.music.summary}
                </p>
              </div>
            </div>
          </article>

          {/* LAYER 4: MALAM GALA APRESIASI INDUSTRI (SIINAS) */}
          <article className="activities-card deck-project-card" data-index="4">
            <canvas className="deck-project-canvas" id="canvasAwards" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">APRESIASI INDUSTRI SIINAS</span>
                  <span className="deck-project-subtitle">28 NOV 2026 · BALLROOM HOTEL PAPANDAYAN</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">MALAM ANUGERAH</span>
                  <span className="deck-tag-pill">KEPATUHAN SIINAS</span>
                  <span className="deck-tag-pill">200 IKM BINAAN</span>
                </div>
              </div>

              {/* Center Action: Opens Agenda Details */}
              <button
                type="button"
                onClick={() => setSelectedProgram(PROGRAM_DETAILS.awards)}
                className="deck-view-btn"
                aria-label="Lihat Rincian Agenda Malam Gala SIINAS"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>LIHAT DETAIL AGENDA</span>
              </button>

              {/* Bottom Structured Agenda Bar */}
              <div className="deck-agenda-bar">
                <div className="deck-agenda-top">
                  <div className="deck-agenda-badge">
                    <span className="deck-agenda-pulse" />
                    <span>AGENDA KEGIATAN UTAMA</span>
                  </div>
                  <span className="deck-agenda-time">28 NOV 2026 · THE PAPANDAYAN</span>
                </div>
                <div className="deck-agenda-items">
                  {PROGRAM_DETAILS.awards.agendaPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="deck-agenda-item">
                      <span className="deck-agenda-bullet">✦</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <p className="deck-agenda-summary">
                  {PROGRAM_DETAILS.awards.summary}
                </p>
              </div>
            </div>
          </article>

          {/* LAYER 3: LOMBA VIDEO 1 MENIT BRAGA */}
          <article className="activities-card deck-project-card" data-index="3">
            <canvas className="deck-project-canvas" id="canvasVideo" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">LOMBA VIDEO 1 MENIT</span>
                  <span className="deck-project-subtitle">REELS &amp; TIKTOK · TOTAL HADIAH PULUHAN JUTA</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">VIDEO VERTIKAL</span>
                  <span className="deck-tag-pill">CERITA LOKAL</span>
                  <span className="deck-tag-pill">KREATIF BRAGA</span>
                </div>
              </div>

              {/* Center Action: Opens Agenda Details (NO direct register CTA) */}
              <button
                type="button"
                onClick={() => setSelectedProgram(PROGRAM_DETAILS.video)}
                className="deck-view-btn"
                aria-label="Lihat Rincian Agenda Lomba Video 1 Menit"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>LIHAT DETAIL AGENDA</span>
              </button>

              {/* Bottom Structured Agenda Bar */}
              <div className="deck-agenda-bar">
                <div className="deck-agenda-top">
                  <div className="deck-agenda-badge">
                    <span className="deck-agenda-pulse" />
                    <span>AGENDA KEGIATAN UTAMA</span>
                  </div>
                  <span className="deck-agenda-time">27–28 NOV 2026 · BRAGA CITY WALK</span>
                </div>
                <div className="deck-agenda-items">
                  {PROGRAM_DETAILS.video.agendaPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="deck-agenda-item">
                      <span className="deck-agenda-bullet">✦</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <p className="deck-agenda-summary">
                  {PROGRAM_DETAILS.video.summary}
                </p>
              </div>
            </div>
          </article>

          {/* LAYER 2: LOMBA DESAIN KEMASAN IKM */}
          <article className="activities-card deck-project-card" data-index="2">
            <canvas className="deck-project-canvas" id="canvasPackaging" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">LOMBA DESAIN KEMASAN</span>
                  <span className="deck-project-subtitle">SHOWCASE &amp; PENJURIAN TERBUKA · ECO-PACKAGING</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">ECO-PACKAGING</span>
                  <span className="deck-tag-pill">PANGAN LOKAL</span>
                  <span className="deck-tag-pill">KESIAPAN EKSPOR</span>
                </div>
              </div>

              {/* Center Action: Opens Agenda Details (NO direct register CTA) */}
              <button
                type="button"
                onClick={() => setSelectedProgram(PROGRAM_DETAILS.packaging)}
                className="deck-view-btn"
                aria-label="Lihat Rincian Agenda Lomba Desain Kemasan"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>LIHAT DETAIL AGENDA</span>
              </button>

              {/* Bottom Structured Agenda Bar */}
              <div className="deck-agenda-bar">
                <div className="deck-agenda-top">
                  <div className="deck-agenda-badge">
                    <span className="deck-agenda-pulse" />
                    <span>AGENDA KEGIATAN UTAMA</span>
                  </div>
                  <span className="deck-agenda-time">28 NOV 2026 · BRAGA CITY WALK</span>
                </div>
                <div className="deck-agenda-items">
                  {PROGRAM_DETAILS.packaging.agendaPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="deck-agenda-item">
                      <span className="deck-agenda-bullet">✦</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <p className="deck-agenda-summary">
                  {PROGRAM_DETAILS.packaging.summary}
                </p>
              </div>
            </div>
          </article>

          {/* LAYER 1: FASHION SHOW RUNWAY */}
          <article className="activities-card deck-project-card" data-index="1">
            <canvas className="deck-project-canvas" id="canvasFashion" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">FASHION SHOW RUNWAY</span>
                  <span className="deck-project-subtitle">27 NOV 2026 · MAIN STAGE BRAGA CITY WALK</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">DESAINER BINAAN</span>
                  <span className="deck-tag-pill">READY-TO-WEAR</span>
                  <span className="deck-tag-pill">WASTRA BANDUNG</span>
                </div>
              </div>

              {/* Center Action: Opens Agenda Details */}
              <button
                type="button"
                onClick={() => setSelectedProgram(PROGRAM_DETAILS.fashion)}
                className="deck-view-btn"
                aria-label="Lihat Rincian Agenda Fashion Show Runway"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>LIHAT DETAIL AGENDA</span>
              </button>

              {/* Bottom Structured Agenda Bar */}
              <div className="deck-agenda-bar">
                <div className="deck-agenda-top">
                  <div className="deck-agenda-badge">
                    <span className="deck-agenda-pulse" />
                    <span>AGENDA KEGIATAN UTAMA</span>
                  </div>
                  <span className="deck-agenda-time">27 NOV 2026 · 15:30–17:30 WIB</span>
                </div>
                <div className="deck-agenda-items">
                  {PROGRAM_DETAILS.fashion.agendaPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="deck-agenda-item">
                      <span className="deck-agenda-bullet">✦</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <p className="deck-agenda-summary">
                  {PROGRAM_DETAILS.fashion.summary}
                </p>
              </div>
            </div>
          </article>

          {/* LAYER 0 (Frontmost): WHITE INTRO COVER CARD */}
          <section className="activities-card deck-intro-card" data-index="0">
            <div className="deck-intro-top">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>Rangkaian Acara Festival</span>
                </div>
                <h2 className="deck-hero-name" id="heroName" ref={heroNameRef} aria-label="6 PROGRAM UNGGULAN">
                  6 PROGRAM UNGGULAN
                </h2>
              </div>
            </div>

            <div className="deck-intro-bottom">
              <nav className="deck-meta-tags" aria-label="Detail Penyelenggaraan">
                <span>27–28 NOVEMBER 2026</span>
                <span>•</span>
                <span>JALAN BRAGA</span>
                <span>•</span>
                <span>HOTEL PAPANDAYAN</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">DISDAGIN KOTA BANDUNG</span>
              </nav>

              <p className="deck-bio-copy">
                Eksplorasi 6 program unggulan festival industri kreatif Kota Bandung: panggung runway desainer binaan, penganugerahan malam gala kepatuhan SIINAS, kompetisi desain kemasan ramah lingkungan, lomba video vertikal Braga, hingga seremonial 100 sertifikasi halal dan uji mutu.
              </p>

              <div className="deck-scroll-hint">
                <svg className="w-4 h-4 animate-bounce text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
                <span>Scroll ke bawah untuk membuka tumpukan kartu program (1 per 1)</span>
              </div>
            </div>
          </section>

        </div>

      </section>

      {/* ─── INTERACTIVE AGENDA DETAIL MODAL (NO REGISTER CTA) ─── */}
      {selectedProgram && (
        <div
          className="deck-modal-backdrop"
          onClick={() => setSelectedProgram(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="deck-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="deck-modal-header">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-2">
                  <span>{selectedProgram.badge}</span>
                </div>
                <h3 id="modal-title" className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedProgram.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                  📍 {selectedProgram.timeVenue}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="deck-modal-close"
                aria-label="Tutup jendela informasi"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="deck-modal-body">
              {/* Ringkasan Program */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedProgram.summary}
              </div>

              {/* Rangkaian Agenda (Ngapain Aja) */}
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <span>✦</span>
                  <span>Rangkaian Agenda Kegiatan (Ngapain Aja):</span>
                </div>
                <div className="deck-modal-agenda-list">
                  {selectedProgram.agendaItems.map((item, idx) => (
                    <div key={idx} className="deck-modal-agenda-row">
                      <span className="deck-modal-step-badge">{idx + 1}</span>
                      <div className="space-y-1">
                        <div className="font-bold text-slate-100 text-xs sm:text-sm">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sasaran & Akses Pengunjung */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <span className="text-blue-400 font-bold">ℹ Akses Kegiatan:</span>
                <span>{selectedProgram.audienceNote}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="deck-modal-footer">
              <a
                href="#agenda"
                onClick={() => setSelectedProgram(null)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Lihat Seluruh Rundown Festival di Bawah ↓</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 transition-all cursor-pointer"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
