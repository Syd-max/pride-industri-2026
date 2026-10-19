'use client';

import { useState, useEffect } from 'react';
import './compact-hero-countdown.css';

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
    jam: '14',
    menit: '09',
    detik: '48',
  });

  useEffect(() => {
    // Initial live calculation
    setTimeLeft(calculateTimeLeft());

    // Continuous 1-second interval live ticker
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { key: 'hari', label: 'HARI', value: timeLeft.hari },
    { key: 'jam', label: 'JAM', value: timeLeft.jam },
    { key: 'menit', label: 'MENIT', value: timeLeft.menit },
    { key: 'detik', label: 'DETIK', value: timeLeft.detik },
  ];

  return (
    <div className="launch-countdown-container countdown countdown-container" aria-label="Menghitung Mundur PRIDE Industri">
      {/* Top Header Row */}
      <div className="launch-header-row">
        {/* Left Stepped Geometric Bars */}
        <div className="launch-stepped-bars-left" aria-hidden="true">
          <span className="step-bar step-1" />
          <span className="step-bar step-2" />
          <span className="step-bar step-3" />
        </div>

        {/* Right Header Text: Menghitung Mundur / PRIDE INDUSTRI */}
        <div className="launch-header-text">
          <span className="launch-label-lead">Menghitung Mundur</span>
          <span className="launch-label-target">PRIDE INDUSTRI</span>
        </div>
      </div>

      {/* Main 4-Column Digits Display Box — Gambar 5 Unobstructed Digits */}
      <div className="launch-digits-box">
        {timeUnits.map((unit) => (
          <div key={unit.key} className="launch-stat-col countdown-item">
            <div className="launch-col-inner">
              <span className="launch-number-val countdown-number">{unit.value}</span>
              <div className="launch-unit-meta">
                <span className="launch-unit-diamond" aria-hidden="true" />
                <span className="launch-unit-label countdown-label">{unit.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Row — Tagline removed per user request */}
      <div className="launch-footer-row">
        <div className="launch-footer-spacer" />
        {/* Right Stepped Blue Geometric Bars */}
        <div className="launch-stepped-bars-right" aria-hidden="true">
          <span className="step-bar-blue step-b1" />
          <span className="step-bar-blue step-b2" />
          <span className="step-bar-blue step-b3" />
          <span className="step-bar-blue step-b4" />
        </div>
      </div>
    </div>
  );
}
