'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './activities-deck.css';

export default function ActivitiesDeckSection() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const activeCardIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoPlayRafRef = useRef<number | null>(null);
  const animationRafRef = useRef<number | null>(null);
  const currentProgressRef = useRef(0);

  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* ==========================================================
     STACKED DECK PEEL-DOWN SCROLL CHOREOGRAPHY (ILIA DELIN ENGINE)
     ========================================================== */
  const updateDeck = useCallback((scrollProgress: number) => {
    const container = deckContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.activities-card'));
    cards.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
    const totalCards = cards.length; // 7 cards (0..6)
    if (totalCards === 0) return;

    currentProgressRef.current = scrollProgress;

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const PEEK_STEP_Y = isMobile ? 12 : 18;
    const SCALE_STEP = isMobile ? 0.020 : 0.026;

    // 7 cards total (0..6). 6 peel transitions across scrollProgress 0..1
    const peelStages = totalCards - 1; // 6
    const stageProgress = scrollProgress * peelStages;

    // Update active index
    const activeIdx = clamp(Math.round(stageProgress), 0, totalCards - 1);
    if (activeIdx !== activeCardIndexRef.current) {
      activeCardIndexRef.current = activeIdx;
    }

    cards.forEach((card, i) => {
      // Set z-index so card 0 is on top (70), card 6 is at bottom (10)
      card.style.zIndex = String((totalCards - i) * 10);

      // Relative depth from current active top card
      // Final card (Card 6) rests on stage and never peels off
      const isFinalCard = i === totalCards - 1;
      const depth = isFinalCard ? Math.max(0, i - stageProgress) : (i - stageProgress);

      const isActive = activeIdx === i;
      card.classList.toggle('is-active', isActive);

      if (depth < 0) {
        // This card is currently peeling down or has already peeled off the bottom of the screen
        const peelAmount = clamp(-depth, 0, 1);
        const easedPeel = easeInOutCubic(peelAmount);
        const translateYPercent = easedPeel * 140; // Slides smoothly past bottom viewport edge
        card.style.transform = `translate3d(0, ${translateYPercent.toFixed(2)}%, 0) scale(1)`;
        card.style.pointerEvents = peelAmount > 0.15 ? 'none' : 'auto';
        card.classList.add('is-peeled');
        card.classList.remove('is-stacked');
        card.setAttribute('aria-hidden', 'true');
      } else {
        // This card is waiting in the stack (or is currently the active front card at depth == 0)
        // Cap visible stack depth offset so all background rims are neatly visible at the top
        const effectiveDepth = Math.min(depth, 5.5);
        const yOffset = -effectiveDepth * PEEK_STEP_Y;
        const scale = 1 - effectiveDepth * SCALE_STEP;

        card.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        card.style.pointerEvents = depth < 0.35 ? 'auto' : 'none';
        card.classList.remove('is-peeled');
        card.classList.toggle('is-stacked', depth >= 0.35);
        card.setAttribute('aria-hidden', depth < 0.35 ? 'false' : 'true');
      }
    });
  }, []);

  const stopAutoPlay = useCallback(() => {
    setIsPlaying(false);
    if (autoPlayRafRef.current) {
      cancelAnimationFrame(autoPlayRafRef.current);
      autoPlayRafRef.current = null;
    }
    if (animationRafRef.current) {
      cancelAnimationFrame(animationRafRef.current);
      animationRafRef.current = null;
    }
  }, []);

  /* ==========================================================
     AUTO-PLAY VIDEO SEQUENCE (REPRODUCES ILIA DELIN 00:00 -> 00:16 FLOW)
     ========================================================== */
  const runVideoTour = useCallback(() => {
    if (isPlaying) {
      stopAutoPlay();
      return;
    }

    setIsPlaying(true);

    const driver = scrollDriverRef.current;
    const totalScroll = driver ? driver.offsetHeight - window.innerHeight : 0;
    const driverTop = driver ? window.scrollY + driver.getBoundingClientRect().top : 0;
    const startTime = performance.now();
    const totalDuration = 14000; // 14s full tour: peel all down -> hold on Card 6 -> un-peel back up

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = clamp(elapsed / totalDuration, 0, 1);

      let targetProgress = 0;
      if (t < 0.44) {
        // 00:00 -> 00:06: Peel all 6 cards down to reveal Card 6
        targetProgress = easeInOutCubic(t / 0.44);
      } else if (t < 0.56) {
        // 00:06 -> 00:08: Hold on Card 6
        targetProgress = 1;
      } else if (t < 0.94) {
        // 00:08 -> 00:13: Un-peel cards back up one by one to Cover
        targetProgress = 1 - easeInOutCubic((t - 0.56) / 0.38);
      } else {
        // 00:13 -> 00:14: Back at Cover
        targetProgress = 0;
      }

      if (totalScroll > 0) {
        window.scrollTo(0, driverTop + targetProgress * totalScroll);
      }
      updateDeck(targetProgress);

      if (t < 1) {
        autoPlayRafRef.current = requestAnimationFrame(tick);
      } else {
        stopAutoPlay();
      }
    }

    autoPlayRafRef.current = requestAnimationFrame(tick);
  }, [isPlaying, stopAutoPlay, updateDeck]);

  const toggleAutoPlay = () => {
    runVideoTour();
  };

  /* ==========================================================
     INTERACTIVE JUMP TO SPECIFIC CARD (WITH DUAL ANIMATION + SCROLL)
     ========================================================== */
  const goToCard = useCallback((targetIndex: number) => {
    stopAutoPlay();

    const clampedTarget = clamp(targetIndex, 0, 6);
    const targetProgress = clampedTarget / 6;

    const driver = scrollDriverRef.current;
    if (driver) {
      const totalScroll = driver.offsetHeight - window.innerHeight;
      const rect = driver.getBoundingClientRect();
      const driverTop = window.scrollY + rect.top;
      if (totalScroll > 0) {
        window.scrollTo({
          top: driverTop + targetProgress * totalScroll,
          behavior: 'smooth',
        });
      }
    }

    // Direct smooth animation of card transforms in case scroll is delayed
    const startProgress = currentProgressRef.current;
    const startTime = performance.now();
    const duration = 480;

    if (animationRafRef.current) cancelAnimationFrame(animationRafRef.current);

    function step(now: number) {
      const elapsed = now - startTime;
      const t = clamp(elapsed / duration, 0, 1);
      const eased = easeInOutCubic(t);
      const p = startProgress + (targetProgress - startProgress) * eased;
      updateDeck(p);

      if (t < 1) {
        animationRafRef.current = requestAnimationFrame(step);
      } else {
        animationRafRef.current = null;
      }
    }

    animationRafRef.current = requestAnimationFrame(step);
  }, [stopAutoPlay, updateDeck]);

  // Scroll listener that scrubs through cards in real time
  useEffect(() => {
    const driver = scrollDriverRef.current;
    if (!driver) return;

    let ticking = false;

    function getScrollProgress(): number {
      const rect = driver!.getBoundingClientRect();
      const totalScroll = driver!.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return 0;
      const current = -rect.top;
      return clamp(current / totalScroll, 0, 1);
    }

    const onScroll = () => {
      if (autoPlayRafRef.current !== null || animationRafRef.current !== null) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDeck(getScrollProgress());
          ticking = false;
        });
        ticking = true;
      }
    };

    const onResize = () => {
      if (autoPlayRafRef.current === null && animationRafRef.current === null) {
        updateDeck(getScrollProgress());
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial render calls on mount to guarantee perfect positioning
    updateDeck(getScrollProgress());
    requestAnimationFrame(() => {
      updateDeck(getScrollProgress());
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      stopAutoPlay();
    };
  }, [updateDeck, stopAutoPlay]);

  // Stop autoplay on user interaction
  useEffect(() => {
    const onWheel = () => {
      if (autoPlayRafRef.current) stopAutoPlay();
    };
    const onTouchStart = () => {
      if (autoPlayRafRef.current) stopAutoPlay();
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, [stopAutoPlay]);

  // Touch Swipe for Mobile
  useEffect(() => {
    const container = deckContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          if (activeCardIndexRef.current < 6) goToCard(activeCardIndexRef.current + 1);
        } else {
          if (activeCardIndexRef.current > 0) goToCard(activeCardIndexRef.current - 1);
        }
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [goToCard]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const driver = scrollDriverRef.current;
      if (!driver) return;
      const rect = driver.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (activeCardIndexRef.current < 6) {
          e.preventDefault();
          goToCard(activeCardIndexRef.current + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (activeCardIndexRef.current > 0) {
          e.preventDefault();
          goToCard(activeCardIndexRef.current - 1);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToCard]);

  return (
    <div className="activities-scroll-driver" id="programUnggulan" ref={scrollDriverRef}>
      <section className="activities-stage" aria-label="Tujuan Kegiatan PRIDE 2026">

        {/* 7-Card Stack Deck Container: Cover (0) + 6 Tujuan Kegiatan (1..6) */}
        <div className="activities-deck-container" ref={deckContainerRef}>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 0 (Frontmost): COVER CARD ("TUJUAN KEGIATAN")
              Centerpiece with bespoke Editorial Font Mix
              ════════════════════════════════════════════════════════════════ */}
          <section
            className="activities-card deck-cover-card"
            data-index="0"
            onClick={() => goToCard(1)}
            style={{ cursor: 'pointer' }}
          >
            {/* Playful Colorful Background Accents */}
            <div className="deck-cover-decorations" aria-hidden="true">
              <div className="decor-circle decor-red" />
              <div className="decor-circle decor-yellow" />
              <div className="decor-circle decor-blue" />
              <div className="decor-circle decor-green" />
              <div className="decor-circle decor-orange" />
            </div>

            {/* Center Focal Point: Simple & Aesthetic Font Mix Title */}
            <div className="deck-cover-center">
              <h2 className="deck-cover-mix-title">
                <span className="deck-mix-sans">TUJUAN</span>
                <span className="deck-mix-serif">Kegiatan</span>
              </h2>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 1 (Card 1): 01. Meningkatkan Eksposur IKM
              Theme: Red (#e51937)
              ════════════════════════════════════════════════════════════════ */}
          <article
            className="activities-card deck-festival-card theme-red"
            data-index="1"
            onClick={() => goToCard(2)}
            style={{ cursor: 'pointer' }}
          >
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner-centered">
              <div className="deck-goal-mix-block">
                <div className="deck-goal-top-row">
                  <span className="deck-goal-num">01.</span>
                  <span className="deck-goal-verb">Meningkatkan</span>
                </div>
                <h3 className="deck-goal-subject">Eksposur IKM</h3>
              </div>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 2 (Card 2): 02. Membangun Ruang Interaksi
              Theme: Emerald Green (#009e49)
              ════════════════════════════════════════════════════════════════ */}
          <article
            className="activities-card deck-festival-card theme-green"
            data-index="2"
            onClick={() => goToCard(3)}
            style={{ cursor: 'pointer' }}
          >
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner-centered">
              <div className="deck-goal-mix-block">
                <div className="deck-goal-top-row">
                  <span className="deck-goal-num">02.</span>
                  <span className="deck-goal-verb">Membangun</span>
                </div>
                <h3 className="deck-goal-subject">Ruang Interaksi</h3>
              </div>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 3 (Card 3): 03. Mendorong Kolaborasi
              Theme: Warm Orange (#f69321)
              ════════════════════════════════════════════════════════════════ */}
          <article
            className="activities-card deck-festival-card theme-orange"
            data-index="3"
            onClick={() => goToCard(4)}
            style={{ cursor: 'pointer' }}
          >
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner-centered">
              <div className="deck-goal-mix-block">
                <div className="deck-goal-top-row">
                  <span className="deck-goal-num">03.</span>
                  <span className="deck-goal-verb">Mendorong</span>
                </div>
                <h3 className="deck-goal-subject">Kolaborasi</h3>
              </div>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 4 (Card 4): 04. Mendorong Akses Pasar dan Transaksi
              Theme: Golden Yellow (#ffb800)
              ════════════════════════════════════════════════════════════════ */}
          <article
            className="activities-card deck-festival-card theme-yellow"
            data-index="4"
            onClick={() => goToCard(5)}
            style={{ cursor: 'pointer' }}
          >
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner-centered">
              <div className="deck-goal-mix-block">
                <div className="deck-goal-top-row">
                  <span className="deck-goal-num">04.</span>
                  <span className="deck-goal-verb">Mendorong</span>
                </div>
                <h3 className="deck-goal-subject">Akses Pasar dan Transaksi</h3>
              </div>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 5 (Card 5): 05. Mengapresiasi Kreativitas dan Inovasi
              Theme: Royal Bandung Blue (#1652f0)
              ════════════════════════════════════════════════════════════════ */}
          <article
            className="activities-card deck-festival-card theme-blue"
            data-index="5"
            onClick={() => goToCard(6)}
            style={{ cursor: 'pointer' }}
          >
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner-centered">
              <div className="deck-goal-mix-block">
                <div className="deck-goal-top-row">
                  <span className="deck-goal-num">05.</span>
                  <span className="deck-goal-verb">Mengapresiasi</span>
                </div>
                <h3 className="deck-goal-subject">Kreativitas dan Inovasi</h3>
              </div>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 6 (Card 6): 06. Meningkatkan Awareness Industri Kota Bandung
              Theme: Creative Purple (#8b5cf6)
              ════════════════════════════════════════════════════════════════ */}
          <article
            className="activities-card deck-festival-card theme-purple"
            data-index="6"
            onClick={() => goToCard(0)}
            style={{ cursor: 'pointer' }}
          >
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner-centered">
              <div className="deck-goal-mix-block">
                <div className="deck-goal-top-row">
                  <span className="deck-goal-num">06.</span>
                  <span className="deck-goal-verb">Meningkatkan</span>
                </div>
                <h3 className="deck-goal-subject">Awareness Industri Kota Bandung</h3>
              </div>
            </div>
          </article>

        </div>

      </section>

    </div>
  );
}
