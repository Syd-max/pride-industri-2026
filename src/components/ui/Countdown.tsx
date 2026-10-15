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

interface DigitBoxProps {
  value: number;
  label: string;
  colorScheme: 'blue' | 'rose' | 'amber' | 'emerald';
}

function DigitBox({ value, label, colorScheme }: DigitBoxProps) {
  const styles = {
    blue: {
      bg: 'bg-blue-50/80',
      border: 'border-blue-200',
      text: 'text-blue-700',
      label: 'text-blue-600',
    },
    rose: {
      bg: 'bg-rose-50/80',
      border: 'border-rose-200',
      text: 'text-rose-700',
      label: 'text-rose-600',
    },
    amber: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
      text: 'text-amber-700',
      label: 'text-amber-600',
    },
    emerald: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      label: 'text-emerald-600',
    },
  }[colorScheme];

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-2 ${styles.border} ${styles.bg} shadow-sm flex items-center justify-center transition-transform hover:scale-105`}
      >
        <span
          className={`font-black text-3xl sm:text-5xl font-mono tabular-nums ${styles.text}`}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span
        className={`mt-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest ${styles.label}`}
      >
        {label}
      </span>
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
      <div className="flex items-center justify-center gap-3 sm:gap-6 py-4 opacity-50">
        <DigitBox value={0} label="Hari" colorScheme="blue" />
        <span className="text-2xl sm:text-4xl font-bold text-slate-300 -mt-6">:</span>
        <DigitBox value={0} label="Jam" colorScheme="rose" />
        <span className="text-2xl sm:text-4xl font-bold text-slate-300 -mt-6">:</span>
        <DigitBox value={0} label="Menit" colorScheme="amber" />
        <span className="text-2xl sm:text-4xl font-bold text-slate-300 -mt-6">:</span>
        <DigitBox value={0} label="Detik" colorScheme="emerald" />
      </div>
    );
  }

  if (state === 'ended') {
    return (
      <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-2xl font-bold text-slate-800">
          PRIDE Industri 2026 Telah Selesai Diselenggarakan
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Terima kasih atas partisipasi seluruh pelaku IKM dan masyarakat Kota Bandung!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {state === 'live' && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mx-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
          Sedang Berlangsung Hari Ini di Braga!
        </div>
      )}

      {/* Countdown Digits */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-5 flex-wrap">
        <DigitBox value={time.days} label="Hari" colorScheme="blue" />
        <span className="text-xl sm:text-3xl font-extrabold text-slate-300 -mt-6 hidden xs:inline">
          :
        </span>
        <DigitBox value={time.hours} label="Jam" colorScheme="rose" />
        <span className="text-xl sm:text-3xl font-extrabold text-slate-300 -mt-6 hidden xs:inline">
          :
        </span>
        <DigitBox value={time.minutes} label="Menit" colorScheme="amber" />
        <span className="text-xl sm:text-3xl font-extrabold text-slate-300 -mt-6 hidden xs:inline">
          :
        </span>
        <DigitBox value={time.seconds} label="Detik" colorScheme="emerald" />
      </div>

      {state === 'upcoming' && (
        <p className="text-xs sm:text-sm font-medium text-slate-500 text-center">
          Menuju pembukaan resmi pada{' '}
          <strong className="text-slate-800">
            Jum&apos;at, 27 November 2026 · 13:30 WIB
          </strong>
        </p>
      )}
    </div>
  );
}
