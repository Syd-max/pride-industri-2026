'use client';

import { useState, useEffect } from 'react';
import './compact-hero-countdown.css';

/* ============================================================
   5x7 BITMAP FONT MATRIX ENGINE FOR DIGITS '0' THROUGH '9'
   Standard Industrial 5x7 LED / Dot-Matrix Display Pattern
   ============================================================ */
const FONT_5X7: Record<string, string[]> = {
  '0': [
    "01110",
    "10001",
    "10011",
    "10101",
    "11001",
    "10001",
    "01110"
  ],
  '1': [
    "00100",
    "01100",
    "00100",
    "00100",
    "00100",
    "00100",
    "01110"
  ],
  '2': [
    "01110",
    "10001",
    "00001",
    "00110",
    "01000",
    "10000",
    "11111"
  ],
  '3': [
    "11110",
    "00001",
    "00001",
    "01110",
    "00001",
    "10001",
    "01110"
  ],
  '4': [
    "00010",
    "00110",
    "01010",
    "10010",
    "11111",
    "00010",
    "00010"
  ],
  '5': [
    "11111",
    "10000",
    "11110",
    "00001",
    "00001",
    "10001",
    "01110"
  ],
  '6': [
    "01110",
    "10000",
    "10000",
    "11110",
    "10001",
    "10001",
    "01110"
  ],
  '7': [
    "11111",
    "00001",
    "00010",
    "00100",
    "01000",
    "01000",
    "01000"
  ],
  '8': [
    "01110",
    "10001",
    "10001",
    "01110",
    "10001",
    "10001",
    "01110"
  ],
  '9': [
    "01110",
    "10001",
    "10001",
    "01111",
    "00001",
    "00001",
    "01110"
  ]
};

const EVENT_TARGET_MS = new Date('2026-11-27T08:00:00+07:00').getTime();

interface TimeValues {
  hari: string;
  jam: string;
  menit: string;
  detik: string;
}

function calculateTimeLeft(): TimeValues {
  const now = Date.now();
  const diff = Math.max(0, EVENT_TARGET_MS - now);

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  return {
    hari: String(days).padStart(2, '0'),
    jam: String(hours).padStart(2, '0'),
    menit: String(minutes).padStart(2, '0'),
    detik: String(seconds).padStart(2, '0'),
  };
}

export default function CompactHeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeValues>({
    hari: '38',
    jam: '15',
    menit: '21',
    detik: '14'
  });

  useEffect(() => {
    // Immediate calculation
    setTimeLeft(calculateTimeLeft());

    // Live 1-second interval ticker (pure real-time countdown, no scroll needed)
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { key: 'hari' as const, label: 'HARI', val: timeLeft.hari, isDetik: false },
    { key: 'jam' as const, label: 'JAM', val: timeLeft.jam, isDetik: false },
    { key: 'menit' as const, label: 'MENIT', val: timeLeft.menit, isDetik: false },
    { key: 'detik' as const, label: 'DETIK', val: timeLeft.detik, isDetik: true },
  ];

  return (
    <div className="compact-countdown-wrap" aria-label="Hitung Mundur PRIDE Industri 2026">
      <div className="compact-countdown-card">
        {/* Top Header — Human Editorial Design */}
        <div className="compact-header-bar">
          <div className="compact-header-left">
            <span className="compact-human-badge">Hitung Mundur</span>
            <span className="compact-human-sub">Menuju PRIDE Industri 2026</span>
          </div>
          <div className="compact-header-right">
            <span className="compact-human-venue">Braga City Walk · 27–28 Nov 2026</span>
          </div>
        </div>

        {/* 4 Matrix Columns: HARI, JAM, MENIT, DETIK */}
        <div className="compact-matrix-grid">
          {metrics.map((m) => (
            <div
              key={m.key}
              className={`compact-stat-cell ${m.isDetik ? 'compact-cell-detik' : ''}`}
            >
              <span className="compact-stat-title">{m.label}</span>

              <div className="compact-matrix-word">
                {m.val.split('').map((digit, digitIdx) => {
                  const pattern = FONT_5X7[digit] || FONT_5X7['0'];
                  return (
                    <div key={digitIdx} className="compact-matrix-char">
                      {pattern.map((rowStr, r) =>
                        rowStr.split('').map((bit, c) => (
                          <span
                            key={`${r}-${c}`}
                            className={`compact-pixel-dot ${bit === '1' ? 'on' : ''}`}
                          />
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Card Footer */}
        <div className="compact-footer-bar">
          <div className="compact-footer-left">
            <span>Braga City Walk &amp; Koridor Braga</span>
            <span>•</span>
            <span>Festival &amp; Awarding IKM Binaan</span>
          </div>
          <div className="compact-footer-right">
            <span>Disdagin Kota Bandung</span>
          </div>
        </div>
      </div>
    </div>
  );
}
