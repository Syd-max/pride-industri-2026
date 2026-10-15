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
    // Live — count down to end
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

  // Upcoming
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

function Digit({ value, label }: { value: number; label: string }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlip(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '4rem' }}>
      <div
        className="countdown-digit"
        style={{
          transform: flip ? 'scale(0.85)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="countdown-label">{label}</div>
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
    // Only run on client after mount to prevent SSR new Date() prerender blocking in Next.js 16
    setMounted(true);
    setData(getCountdown());
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const { time, state } = data;

  if (!mounted) {
    // Return deterministic skeleton state during prerender
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 'clamp(1rem, 3vw, 2.5rem)',
          flexWrap: 'wrap',
          opacity: 0.6,
        }}
      >
        <Digit value={0} label="Hari" />
        <div className="countdown-digit" style={{ opacity: 0.3, paddingBottom: '1.5rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}>:</div>
        <Digit value={0} label="Jam" />
        <div className="countdown-digit" style={{ opacity: 0.3, paddingBottom: '1.5rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}>:</div>
        <Digit value={0} label="Menit" />
        <div className="countdown-digit" style={{ opacity: 0.3, paddingBottom: '1.5rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}>:</div>
        <Digit value={0} label="Detik" />
      </div>
    );
  }

  if (state === 'ended') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'var(--pride-glass-bg)',
          border: '1px solid var(--pride-glass-border)',
          borderRadius: '4px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: 'var(--pride-gold)',
            fontStyle: 'italic',
          }}
        >
          PRIDE Industri 2026 telah selesai.
        </p>
        <p style={{ color: 'var(--pride-text-muted)', marginTop: '0.5rem' }}>
          Terima kasih atas partisipasi Anda!
        </p>
      </div>
    );
  }

  return (
    <div>
      {state === 'live' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#34d399',
              animation: 'pulse-live 1.5s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#34d399',
              fontWeight: '600',
            }}
          >
            LIVE SEKARANG
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 'clamp(1rem, 3vw, 2.5rem)',
          flexWrap: 'wrap',
        }}
      >
        <Digit value={time.days} label="Hari" />
        <div className="countdown-digit" style={{ opacity: 0.3, paddingBottom: '1.5rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}>:</div>
        <Digit value={time.hours} label="Jam" />
        <div className="countdown-digit" style={{ opacity: 0.3, paddingBottom: '1.5rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}>:</div>
        <Digit value={time.minutes} label="Menit" />
        <div className="countdown-digit" style={{ opacity: 0.3, paddingBottom: '1.5rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}>:</div>
        <Digit value={time.seconds} label="Detik" />
      </div>

      {state === 'upcoming' && (
        <p
          style={{
            textAlign: 'center',
            marginTop: '1.25rem',
            fontSize: '0.875rem',
            color: 'var(--pride-text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          Menuju pembukaan PRIDE Industri 2026 —{' '}
          <span style={{ color: 'var(--pride-text-secondary)' }}>
            27 November 2026, Braga City Walk, Bandung
          </span>
        </p>
      )}

      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
