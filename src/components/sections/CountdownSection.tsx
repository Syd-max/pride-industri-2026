'use client';

import Countdown from '@/components/ui/Countdown';

export default function CountdownSection() {
  return (
    <section
      id="countdown"
      className="relative py-16 sm:py-20 bg-slate-50/80 border-y border-slate-200/80"
      aria-label="Hitung Mundur PRIDE Industri 2026"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Colorful Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200 shadow-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Waktu Indonesia Barat (WIB / GMT+7)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Hitung Mundur Menuju Perhelatan Akbar
        </h2>
        
        <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
          Persiapkan diri Anda untuk menyaksikan pameran IKM binaan Kota Bandung,
          fashion runway, dan kompetisi kreatif berhadiah jutaan rupiah.
        </p>
        
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-200/50 max-w-3xl mx-auto">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
