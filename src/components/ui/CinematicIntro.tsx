'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const INTRO_KEY = 'pride2026_intro_seen_v1';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<
    'idle' | 'focus' | 'shutter' | 'reveal' | 'done'
  >('idle');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Respect reduced-motion — skip immediately
    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // Check if already seen this session
    const alreadySeen = sessionStorage.getItem(INTRO_KEY) === '1';

    if (prefersReduced || alreadySeen) {
      onComplete();
      return;
    }

    // Cinematic sequence
    // Phase timeline: idle → focus (0.4s) → shutter (0.8s) → reveal (1.2s) → done (2.0s)
    const t1 = setTimeout(() => setPhase('focus'), 400);
    const t2 = setTimeout(() => setPhase('shutter'), 900);
    const t3 = setTimeout(() => setPhase('reveal'), 1300);
    const t4 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem(INTRO_KEY, '1');
      onComplete();
    }, 2200);

    // Safety valve — never leave user stuck
    const safety = setTimeout(() => {
      onComplete();
      sessionStorage.setItem(INTRO_KEY, '1');
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(safety);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className="intro-overlay"
      aria-hidden="true"
      style={{
        opacity: phase === 'reveal' ? 0 : 1,
        transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: phase === 'reveal' ? 'none' : 'all',
      }}
    >
      {/* Camera aperture ring */}
      <div
        style={{
          position: 'relative',
          width: 'min(280px, 60vw)',
          height: 'min(280px, 60vw)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer aperture ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            transform:
              phase === 'focus' || phase === 'shutter' || phase === 'reveal'
                ? 'scale(1)'
                : 'scale(0.7)',
            opacity:
              phase === 'focus' || phase === 'shutter' || phase === 'reveal'
                ? 1
                : 0,
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {/* Inner aperture ring */}
        <div
          style={{
            position: 'absolute',
            inset: '20%',
            borderRadius: '50%',
            border: '1px solid rgba(200, 169, 110, 0.6)',
            transform:
              phase === 'focus' || phase === 'shutter' || phase === 'reveal'
                ? 'scale(1) rotate(45deg)'
                : 'scale(0.5) rotate(0deg)',
            opacity:
              phase === 'focus' || phase === 'shutter' || phase === 'reveal'
                ? 1
                : 0,
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        />

        {/* Viewfinder corners */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
          const isTop = pos.startsWith('top');
          const isLeft = pos.endsWith('left');
          return (
            <div
              key={pos}
              style={{
                position: 'absolute',
                width: '1.5rem',
                height: '1.5rem',
                [isTop ? 'top' : 'bottom']: '0.75rem',
                [isLeft ? 'left' : 'right']: '0.75rem',
                borderTop: isTop ? '2px solid var(--pride-gold)' : 'none',
                borderBottom: !isTop ? '2px solid var(--pride-gold)' : 'none',
                borderLeft: isLeft ? '2px solid var(--pride-gold)' : 'none',
                borderRight: !isLeft ? '2px solid var(--pride-gold)' : 'none',
                opacity: phase === 'focus' || phase === 'shutter' || phase === 'reveal' ? 1 : 0,
                transition: 'opacity 0.4s ease 0.2s',
              }}
            />
          );
        })}

        {/* Logo in center */}
        <div
          style={{
            position: 'relative',
            width: '55%',
            height: '55%',
            transform:
              phase === 'focus' || phase === 'shutter' || phase === 'reveal'
                ? 'scale(1)'
                : 'scale(0.6)',
            opacity:
              phase === 'focus' || phase === 'shutter' || phase === 'reveal'
                ? 1
                : 0,
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            filter: 'brightness(1.1)',
          }}
        >
          <Image
            src="/LOGO_PRIDE_INDUSTRI.png"
            alt="PRIDE Industri 2026"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Shutter flash */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#fff',
          opacity: phase === 'shutter' ? 0.85 : 0,
          transition: phase === 'shutter'
            ? 'opacity 0.05s ease'
            : 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Event wordmark */}
      <div
        style={{
          marginTop: '2.5rem',
          textAlign: 'center',
          opacity:
            phase === 'focus' || phase === 'shutter' || phase === 'reveal'
              ? 1
              : 0,
          transform:
            phase === 'focus' || phase === 'shutter' || phase === 'reveal'
              ? 'translateY(0)'
              : 'translateY(1rem)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
        }}
      >
        <p
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--pride-text-muted)',
            marginBottom: '0.375rem',
          }}
        >
          27–28 November 2026
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--pride-gold)',
            fontFamily: 'var(--font-playfair), serif',
            fontStyle: 'italic',
          }}
        >
          Braga City Walk · Bandung
        </p>
      </div>
    </div>
  );
}
