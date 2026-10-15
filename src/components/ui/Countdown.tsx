'use client';

import { useEffect, useState, useCallback } from 'react';
import { EVENT_CONFIG } from '@/config/event';
import type { CountdownTime, EventState } from '@/types';

function getCountdown(): { time: CountdownTime; state: EventState } {
  const now = new Date();
  const start = EVENT_CONFIG.startDate;
  const end = EVENT_CONFIG.endDate;

  if (now >= end) {
    return { time: { days: 0, hours: 0, minutes: 0, seconds: 0 }, state: 'ended' };
  }

  if (now >= start) {
    const diff = end.getTime() - now.getTime();
    return {
      state: 'live',
      time: {
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      },
    };
  }

  const diff = start.getTime() - now.getTime();
  return {
    state: 'upcoming',
    time: {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    },
  };
}

interface RunwayPodiumProps {
  value: number;
  label: string;
  subLabel: string;
  theme: 'rose' | 'amber' | 'blue' | 'emerald';
  icon: React.ReactNode;
  isSeconds?: boolean;
}

function RunwayPodium({ value, label, subLabel, theme, icon, isSeconds }: RunwayPodiumProps) {
  const styles = {
    rose: {
      border: 'border-rose-500/30 hover:border-rose-400/60',
      glow: 'from-rose-500/20 via-rose-500/5 to-transparent',
      text: 'text-rose-400',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      underglow: 'bg-rose-500/25',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-400/60',
      glow: 'from-amber-500/20 via-amber-500/5 to-transparent',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      underglow: 'bg-amber-500/25',
    },
    blue: {
      border: 'border-blue-500/30 hover:border-blue-400/60',
      glow: 'from-blue-500/20 via-blue-500/5 to-transparent',
      text: 'text-blue-400',
      badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      underglow: 'bg-blue-500/25',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-400/60',
      glow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      underglow: 'bg-emerald-500/25',
    },
  }[theme];

  return (
    <div className="relative group flex flex-col items-center">
      {/* Catwalk Runway Floor Underglow Spotlight */}
      <div className={`absolute -bottom-4 inset-x-4 h-8 rounded-full blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity ${styles.underglow}`} />

      {/* Podium Elevated Glass Platform */}
      <div
        className={`relative w-28 h-36 sm:w-44 sm:h-52 rounded-3xl border-2 ${styles.border} bg-slate-900/90 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-between p-3 sm:p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${isSeconds ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}`}
      >
        {/* Top Runway Stage Spot Accent */}
        <div className={`absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b ${styles.glow} rounded-t-3xl pointer-events-none`} />

        {/* Podium Top Meta Pill */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${styles.badgeBg}`}>
            {icon}
            <span>{label}</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
        </div>

        {/* Big Display Digits with Specular Lighting */}
        <div className="relative z-10 my-auto text-center">
          <span className="font-mono font-black text-4xl sm:text-6xl text-white tracking-tight tabular-nums drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            {String(value).padStart(2, '0')}
          </span>
          {/* Subtle reflection floor line */}
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-1 sm:mt-2" />
        </div>

        {/* Podium Bottom Stage Sub-Label */}
        <div className="relative z-10 text-center">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider">
            {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ time: CountdownTime; state: EventState }>({
    time: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    state: 'upcoming',
  });

  const tick = useCallback(() => {
    setData(getCountdown());
  }, []);

  useEffect(() => {
    setMounted(true);
    setData(getCountdown());
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const { time, state } = data;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2.5 sm:gap-6 py-6 opacity-40">
        <div className="w-28 h-36 sm:w-44 sm:h-52 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        <div className="w-28 h-36 sm:w-44 sm:h-52 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        <div className="w-28 h-36 sm:w-44 sm:h-52 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        <div className="w-28 h-36 sm:w-44 sm:h-52 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (state === 'ended') {
    return (
      <div className="text-center py-8 px-6 bg-slate-900/90 rounded-3xl border border-slate-800 max-w-xl mx-auto backdrop-blur-xl">
        <p className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
          PRIDE Industri 2026 Telah Selesai Diselenggarakan
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Terima kasih atas partisipasi seluruh insan kreatif, desainer binaan, dan wargi Kota Bandung.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Live Runway Alert Beacon if currently ongoing */}
      {state === 'live' && (
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md animate-pulse">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span>Catwalk Runway Sedang Berlangsung Hari Ini di Braga!</span>
        </div>
      )}

      {/* The 4 Catwalk Fashion Show Podiums */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
        <RunwayPodium
          value={time.days}
          label="Hari"
          subLabel="27–28 Nov"
          theme="rose"
          icon={
            <svg className="w-3 h-3 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
          }
        />

        <RunwayPodium
          value={time.hours}
          label="Jam"
          subLabel="WIB / GMT+7"
          theme="amber"
          icon={
            <svg className="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />

        <RunwayPodium
          value={time.minutes}
          label="Menit"
          subLabel="Presisi Runway"
          theme="blue"
          icon={
            <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          }
        />

        <RunwayPodium
          value={time.seconds}
          label="Detik"
          subLabel="Live Ticking"
          theme="emerald"
          isSeconds
          icon={
            <svg className="w-3 h-3 text-emerald-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          }
        />
      </div>

      {/* Stage Status Callout */}
      {state === 'upcoming' && (
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            Panggung Catwalk Fashion Runway dibuka resmi pada{' '}
            <strong className="text-rose-400 font-bold">
              Jum&apos;at, 27 November 2026 · 13:30 WIB
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
