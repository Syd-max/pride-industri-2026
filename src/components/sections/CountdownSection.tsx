'use client';

import Countdown from '@/components/ui/Countdown';

export default function CountdownSection() {
  return (
    <section
      id="countdown"
      className="relative py-16 sm:py-24 border-y border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]"
      aria-label="Hitung Mundur PRIDE Industri 2026"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-[#C8A96E] mb-3">
          Waktu Indonesia Barat (WIB / GMT+7)
        </div>
        <h2 className="font-display italic text-2xl sm:text-3xl text-[#F5F0E8] font-normal mb-8">
          Hitung Mundur Perhelatan Akbar
        </h2>
        
        <div className="p-6 sm:p-10 rounded-2xl border border-[rgba(200,169,110,0.18)] bg-[#141414]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
