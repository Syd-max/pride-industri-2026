'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface StatFolderCardProps {
  number: string;
  label: string;
  desc: string;
  theme: 'blue' | 'green' | 'amber' | 'red';
  docBadge: string;
  docTitle: string;
  docItems: string[];
}

export default function StatFolderCard({
  number,
  label,
  desc,
  theme,
  docBadge,
  docTitle,
  docItems,
}: StatFolderCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(number);
  const animFrameRef = useRef<number | null>(null);
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing auto-close timer
  const clearAutoClose = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  // Mechanical Odometer / Rolling Number Animation
  const triggerRoll = useCallback(() => {
    // If number has digits like "200+" or "100" or "2 HARI"
    const digitMatch = number.match(/^(\d+)(.*)$/);
    if (digitMatch) {
      const targetVal = parseInt(digitMatch[1], 10);
      const suffix = digitMatch[2] || '';
      const duration = 600;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * targetVal);
        setDisplayNumber(`${current}${suffix}`);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setDisplayNumber(number);
        }
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(step);
    } else {
      // For non-numeric text: subtle letter scramble roll
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const original = number;
      let iterations = 0;
      const maxIterations = 6;

      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
      scrambleIntervalRef.current = setInterval(() => {
        setDisplayNumber(
          original
            .split('')
            .map((char, index) => {
              if (index < iterations) return original[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iterations >= maxIterations) {
          if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
          setDisplayNumber(original);
        }
        iterations += 1;
      }, 40);
    }
  }, [number]);

  // Touch / Click Handler: Opens folder, holds for 6 seconds, then automatically closes
  const handleTouch = useCallback(() => {
    clearAutoClose();

    setIsOpen((prev) => {
      const willBeOpen = !prev;
      if (willBeOpen) {
        triggerRoll();
        // Hold open for 6 seconds (6000ms), then automatically close itself
        autoCloseTimerRef.current = setTimeout(() => {
          setIsOpen(false);
          autoCloseTimerRef.current = null;
        }, 6000);
      }
      return willBeOpen;
    });
  }, [clearAutoClose, triggerRoll]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTouch();
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`Folder berkas ${label}: ${number}. Sentuh untuk membuka rincian selama 6 detik.`}
      className={`folder-card-wrapper folder-theme-${theme} ${isOpen ? 'is-open' : ''}`}
      onClick={handleTouch}
      onKeyDown={handleKeyDown}
    >
      <div className="folder-assembly">
        
        {/* 1. Folder Back Body with Asymmetrical Top Tab */}
        <div className="folder-back-body">
          <div className="folder-tab-top" />
        </div>

        {/* 2. Inner Document Sheet (Slides OUT automatically on hover) */}
        <div className="folder-document-sheet" aria-hidden={!isOpen}>
          <div className="doc-sheet-content">
            <div className="doc-sheet-badge">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{docBadge}</span>
            </div>

            <div className="doc-sheet-title">{docTitle}</div>

            <div className="doc-sheet-items">
              {docItems.map((item, idx) => (
                <div key={idx} className="doc-sheet-item">
                  <span className="doc-sheet-bullet" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Front Colored Folder Pocket */}
        <div className="folder-front-pocket">
          <div>
            <div className="folder-number-wrap">
              <span className="folder-number-val">{displayNumber}</span>
            </div>
            <h3 className="folder-label">{label}</h3>
            <p className="folder-desc">{desc}</p>
          </div>

          {/* Bottom Action Bar */}
          <div className="folder-action-bar">
            <span className="folder-action-pill">
              <span>{isOpen ? 'Tutup Rincian' : 'Rincian Arsip'}</span>
              <svg className="folder-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>

            <span className="text-[10px] opacity-75 font-mono tracking-wider">
              {isOpen ? 'DOKUMEN TERBUKA' : 'SENTUH UNTUK BUKA'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
