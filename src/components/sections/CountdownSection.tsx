'use client';

import Countdown from '@/components/ui/Countdown';
import './runway-countdown.css';

export default function CountdownSection() {
  return (
    <section
      id="countdown"
      className="runway-section py-20 sm:py-28"
      aria-label="Hitung Mundur Menuju Panggung Utama PRIDE Industri 2026"
    >
      {/* 1. Full-Width Top Transition Glow (Seamless continuation from Braga Hero Stage) */}
      <div className="runway-top-glow" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 via-rose-500/50 to-transparent z-10" />

      {/* 2. Overhead Stage Spotlights (Cones sweeping across the stage) */}
      <div className="stage-spotlight stage-spotlight-left" />
      <div className="stage-spotlight stage-spotlight-right" />

      {/* 3. Runway Ambient Camera Flash Bursts (Paparazzi / Audience Atmosphere) */}
      <div className="paparazzi-flash flash-1" />
      <div className="paparazzi-flash flash-2" />
      <div className="paparazzi-flash flash-3" />

      {/* 4. 3D Runway Perspective Floor (Catwalk Track with Flowing Floor Lines) */}
      <div className="runway-perspective-stage">
        <div className="runway-perspective-floor">
          {/* Animated Center Stride Flow Line */}
          <div className="runway-center-line" />

          {/* Left & Right Runway Edge Guide Beacons */}
          <div className="runway-edge-beacons">
            {/* Left Edge Beacons */}
            <span className="beacon-dot text-rose-500" style={{ top: '15%', left: '8px' }} />
            <span className="beacon-dot text-amber-400" style={{ top: '40%', left: '8px', animationDelay: '0.4s' }} />
            <span className="beacon-dot text-blue-400" style={{ top: '65%', left: '8px', animationDelay: '0.8s' }} />
            <span className="beacon-dot text-emerald-400" style={{ top: '90%', left: '8px', animationDelay: '1.2s' }} />

            {/* Right Edge Beacons */}
            <span className="beacon-dot text-rose-500" style={{ top: '15%', right: '8px' }} />
            <span className="beacon-dot text-amber-400" style={{ top: '40%', right: '8px', animationDelay: '0.4s' }} />
            <span className="beacon-dot text-blue-400" style={{ top: '65%', right: '8px', animationDelay: '0.8s' }} />
            <span className="beacon-dot text-emerald-400" style={{ top: '90%', right: '8px', animationDelay: '1.2s' }} />
          </div>
        </div>
      </div>

      {/* 5. Main Stage Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Stage Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-950/30 mb-4 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span>Panggung Eksistensi &amp; Inovasi 2026</span>
        </div>

        {/* Editorial Fashion Headline */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-3 max-w-3xl mx-auto leading-tight">
          <span className="block sm:inline">Detik-Detik Menuju </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-amber-300 font-extrabold whitespace-nowrap">
            Panggung Utama
          </span>
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
          Sorotan lampu, peragaan busana karya desainer binaan, pameran produk unggulan IKM Kota Bandung, dan malam penganugerahan siap digelar di koridor historis Braga.
        </p>
        
        {/* The 4 Elevated Runway Pedestals */}
        <div className="relative max-w-4xl mx-auto">
          <Countdown />
        </div>
      </div>

      {/* 6. Dynamic Infinite Highlights Marquee Ribbon */}
      <div className="runway-marquee-ribbon">
        <div className="runway-marquee-track text-xs font-extrabold uppercase tracking-widest text-slate-300">
          <span className="inline-flex items-center gap-5">
            <span className="text-rose-400">✦</span>
            <span>Peragaan Busana Desainer Binaan Kota Bandung</span>
            <span className="text-amber-400">✦</span>
            <span>Eksibisi 200+ Produk Fesyen, Kuliner &amp; Kriya</span>
            <span className="text-blue-400">✦</span>
            <span>Malam Penganugerahan SIINAS Hotel Papandayan</span>
            <span className="text-emerald-400">✦</span>
            <span>Kompetisi Desain Kemasan Ramah Lingkungan</span>
            <span className="text-rose-400">✦</span>
            <span>Lomba Video Sinematik 1 Menit IKM</span>
            <span className="text-amber-400">✦</span>
            <span>27–28 November 2026 · Braga City Walk Bandung</span>
          </span>
          <span className="inline-flex items-center gap-5" aria-hidden="true">
            <span className="text-rose-400">✦</span>
            <span>Peragaan Busana Desainer Binaan Kota Bandung</span>
            <span className="text-amber-400">✦</span>
            <span>Eksibisi 200+ Produk Fesyen, Kuliner &amp; Kriya</span>
            <span className="text-blue-400">✦</span>
            <span>Malam Penganugerahan SIINAS Hotel Papandayan</span>
            <span className="text-emerald-400">✦</span>
            <span>Kompetisi Desain Kemasan Ramah Lingkungan</span>
            <span className="text-rose-400">✦</span>
            <span>Lomba Video Sinematik 1 Menit IKM</span>
            <span className="text-amber-400">✦</span>
            <span>27–28 November 2026 · Braga City Walk Bandung</span>
          </span>
        </div>
      </div>

      {/* 7. Bottom Smooth Blend into White AboutSection */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#060912]/50 to-white pointer-events-none z-10" />
    </section>
  );
}
