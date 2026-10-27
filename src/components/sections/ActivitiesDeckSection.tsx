'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import './activities-deck.css';

interface CardItem {
  id: string;
  index: number;
  isCover?: boolean;
  theme?: string;
  num?: string;
  verb?: string;
  subject?: string;
}

/* ==========================================================
   ORIGINAL PRIDE 2026 TUJUAN KEGIATAN CARDS DATA
   Exact content, wording, numbering, and color theme preserved
   ========================================================== */
const BASE_CARDS: CardItem[] = [
  {
    id: 'cover',
    index: 0,
    isCover: true,
  },
  {
    id: 'goal-1',
    index: 1,
    theme: 'theme-red',
    num: '01.',
    verb: 'Meningkatkan',
    subject: 'Eksposur IKM',
  },
  {
    id: 'goal-2',
    index: 2,
    theme: 'theme-green',
    num: '02.',
    verb: 'Membangun',
    subject: 'Ruang Interaksi',
  },
  {
    id: 'goal-3',
    index: 3,
    theme: 'theme-orange',
    num: '03.',
    verb: 'Mendorong',
    subject: 'Kolaborasi',
  },
  {
    id: 'goal-4',
    index: 4,
    theme: 'theme-yellow',
    num: '04.',
    verb: 'Mendorong',
    subject: 'Akses Pasar dan Transaksi',
  },
  {
    id: 'goal-5',
    index: 5,
    theme: 'theme-blue',
    num: '05.',
    verb: 'Mengapresiasi',
    subject: 'Kreativitas dan Inovasi',
  },
  {
    id: 'goal-6',
    index: 6,
    theme: 'theme-purple',
    num: '06.',
    verb: 'Meningkatkan',
    subject: 'Awareness Industri Kota Bandung',
  },
];

const SETS_COUNT = 3;
const TOTAL_BASE = BASE_CARDS.length; // 7 cards (Cover + 6 Goals)

export default function ActivitiesDeckSection() {
  const stageRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeLogicalIndex, setActiveLogicalIndex] = useState(0);
  const [isAutoMotionActive, setIsAutoMotionActive] = useState(true);

  // Physics & Animation State Refs
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const velocityXRef = useRef(0);
  const currentSlotRef = useRef(TOTAL_BASE); // Start at middle set (Slot 7 = Cover of Set 1)

  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const isSnappingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isAutoPlayingRef = useRef(true);

  const stepWidthRef = useRef(404);
  const cardWidthRef = useRef(380);
  const gapWidthRef = useRef(24);
  const centerOffsetRef = useRef(0);
  const singleSetWidthRef = useRef(TOTAL_BASE * 404);

  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const pointerVelocityRef = useRef(0);
  const totalDragDistanceRef = useRef(0);
  const isHorizontalDragRef = useRef(false);

  const rafRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeLogicalRef = useRef(0);

  // Triple set of cards for seamless infinite horizontal rail
  const clonedCards = useMemo(() => {
    const list: Array<{ item: CardItem; globalSlot: number }> = [];
    for (let setIdx = 0; setIdx < SETS_COUNT; setIdx++) {
      BASE_CARDS.forEach((item, baseIdx) => {
        list.push({
          item,
          globalSlot: setIdx * TOTAL_BASE + baseIdx,
        });
      });
    }
    return list;
  }, []);

  // Update layout metrics (card width, gap, step width, center offset)
  const updateLayout = useCallback((snapImmediately = false) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const firstCard = track.querySelector<HTMLElement>('.activities-card');
    if (!firstCard) return;

    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    const cardW = firstCard.offsetWidth || 380;
    const step = cardW + gap;

    gapWidthRef.current = gap;
    cardWidthRef.current = cardW;
    stepWidthRef.current = step;
    singleSetWidthRef.current = TOTAL_BASE * step;

    const vpWidth = viewport.clientWidth;
    const centerOffset = (vpWidth - cardW) / 2;
    centerOffsetRef.current = centerOffset;

    targetXRef.current = centerOffset - currentSlotRef.current * step;

    if (snapImmediately) {
      currentXRef.current = targetXRef.current;
      velocityXRef.current = 0;
      track.style.transform = `translate3d(${currentXRef.current.toFixed(2)}px, 0, 0)`;
    }
  }, []);

  // Recenter infinite loop when slot drifts outside middle set
  const recenterIfNeeded = useCallback(() => {
    const total = TOTAL_BASE;
    const setWidth = singleSetWidthRef.current;
    if (setWidth <= 0) return;

    const minSlot = total;
    const maxSlot = (SETS_COUNT - 1) * total;

    if (currentSlotRef.current < minSlot) {
      currentSlotRef.current += total;
      currentXRef.current -= setWidth;
      targetXRef.current -= setWidth;
    } else if (currentSlotRef.current >= maxSlot) {
      currentSlotRef.current -= total;
      currentXRef.current += setWidth;
      targetXRef.current += setWidth;
    }
  }, []);

  // Smoothly move by delta cards (with optional throw velocity injection)
  const moveBySteps = useCallback((delta: number, initialThrowVelocity = 0) => {
    recenterIfNeeded();
    currentSlotRef.current += delta;
    targetXRef.current = centerOffsetRef.current - currentSlotRef.current * stepWidthRef.current;
    velocityXRef.current += initialThrowVelocity;
    isSnappingRef.current = true;
  }, [recenterIfNeeded]);

  // Go to a specific logical card index (0..6)
  const goToLogicalIndex = useCallback((targetLogical: number) => {
    recenterIfNeeded();
    const currentLogical = ((currentSlotRef.current % TOTAL_BASE) + TOTAL_BASE) % TOTAL_BASE;
    let diff = targetLogical - currentLogical;
    if (diff > TOTAL_BASE / 2) diff -= TOTAL_BASE;
    if (diff < -TOTAL_BASE / 2) diff += TOTAL_BASE;
    moveBySteps(diff, -diff * 4);
  }, [moveBySteps, recenterIfNeeded]);

  // Pause auto-motion during active user interaction
  const pauseAutoPlay = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  // Resume auto-motion after idle period
  const resumeAutoPlayDelayed = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isAutoPlayingRef.current = true;
    }, 2800);
  }, []);

  // Main physics loop (Spring-damper physics + subtle auto-glide)
  useEffect(() => {
    const STIFFNESS = 0.088;
    const DAMPING = 0.77;
    const AUTO_SPEED = -0.45; // Gentle, smooth continuous drift

    // Check reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      isAutoPlayingRef.current = false;
      setIsAutoMotionActive(false);
    }

    function loop() {
      if (!isDraggingRef.current) {
        if (isSnappingRef.current) {
          const force = (targetXRef.current - currentXRef.current) * STIFFNESS;
          velocityXRef.current = (velocityXRef.current + force) * DAMPING;
          currentXRef.current += velocityXRef.current;

          if (Math.abs(targetXRef.current - currentXRef.current) < 0.1 && Math.abs(velocityXRef.current) < 0.08) {
            currentXRef.current = targetXRef.current;
            velocityXRef.current = 0;
            isSnappingRef.current = false;
            recenterIfNeeded();
          }
        } else if (isAutoPlayingRef.current && !isHoveredRef.current && !prefersReducedMotion) {
          currentXRef.current += AUTO_SPEED;
          recenterIfNeeded();
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentXRef.current.toFixed(2)}px, 0, 0)`;
      }

      // Update active slot and active class
      const step = stepWidthRef.current || 404;
      const slotFloat = (centerOffsetRef.current - currentXRef.current) / step;
      const nearestSlot = Math.round(slotFloat);
      const logical = ((nearestSlot % TOTAL_BASE) + TOTAL_BASE) % TOTAL_BASE;

      if (logical !== activeLogicalRef.current) {
        activeLogicalRef.current = logical;
        setActiveLogicalIndex(logical);

        // Update card active classes
        if (trackRef.current) {
          const cards = trackRef.current.querySelectorAll('.activities-card');
          cards.forEach((card, idx) => {
            const isCardActive = idx === nearestSlot;
            card.classList.toggle('is-active', isCardActive);
          });
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [recenterIfNeeded]);

  // Initial layout measurement & window resize listener
  useEffect(() => {
    updateLayout(true);

    const onResize = () => {
      updateLayout(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateLayout]);

  // Pointer Drag Handlers (Unified mouse and touch with fluid momentum)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only primary mouse button or touch
    pauseAutoPlay();
    isPointerDownRef.current = true;
    isHorizontalDragRef.current = false;
    isDraggingRef.current = false;
    isSnappingRef.current = false;

    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    lastPointerXRef.current = e.clientX;
    pointerVelocityRef.current = 0;
    totalDragDistanceRef.current = 0;
    velocityXRef.current = 0;

    viewportRef.current?.classList.add('is-dragging');
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - lastPointerXRef.current;
    const dy = e.clientY - dragStartYRef.current;
    const totalDx = e.clientX - dragStartXRef.current;

    // Check if gesture is horizontal vs vertical on initial movement
    if (!isHorizontalDragRef.current) {
      if (Math.abs(totalDx) > 6 && Math.abs(totalDx) >= Math.abs(dy)) {
        isHorizontalDragRef.current = true;
        isDraggingRef.current = true;
      } else if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(totalDx)) {
        // Safe release to let browser scroll vertically
        isPointerDownRef.current = false;
        viewportRef.current?.classList.remove('is-dragging');
        resumeAutoPlayDelayed();
        return;
      }
    }

    if (isHorizontalDragRef.current) {
      lastPointerXRef.current = e.clientX;
      currentXRef.current += dx;
      totalDragDistanceRef.current += dx;
      pointerVelocityRef.current = dx;
      recenterIfNeeded();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    viewportRef.current?.classList.remove('is-dragging');

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}

    const step = stepWidthRef.current || 404;
    const centerOffset = centerOffsetRef.current;

    if (isHorizontalDragRef.current && Math.abs(totalDragDistanceRef.current) > 5) {
      // Release with momentum throw projection & magnetic spring snap
      const v = pointerVelocityRef.current;
      const projectedX = currentXRef.current + v * 9.5;
      let nextSlot = Math.round((centerOffset - projectedX) / step);

      if (
        nextSlot === currentSlotRef.current &&
        Math.abs(totalDragDistanceRef.current) > 24 &&
        Math.abs(v) > 2
      ) {
        nextSlot += v < 0 ? 1 : -1;
      }

      currentSlotRef.current = nextSlot;
      targetXRef.current = centerOffset - nextSlot * step;
      velocityXRef.current = v * 0.85;
      isSnappingRef.current = true;
    } else {
      // Snap to nearest slot
      const nearestSlot = Math.round((centerOffset - currentXRef.current) / step);
      currentSlotRef.current = nearestSlot;
      targetXRef.current = centerOffset - nearestSlot * step;
      isSnappingRef.current = true;
    }

    isDraggingRef.current = false;
    resumeAutoPlayDelayed();
  };

  // Prevent card click if user was dragging
  const handleCardClick = (targetLogical: number, e: React.MouseEvent) => {
    if (Math.abs(totalDragDistanceRef.current) > 6) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    goToLogicalIndex(targetLogical);
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    resumeAutoPlayDelayed();
  };

  const toggleAutoMotion = () => {
    const nextState = !isAutoMotionActive;
    setIsAutoMotionActive(nextState);
    isAutoPlayingRef.current = nextState;
  };

  return (
    <div className="activities-scroll-driver" id="programUnggulan">
      <section
        className="activities-stage activities-carousel-stage"
        aria-label="Tujuan Kegiatan PRIDE 2026"
        ref={stageRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Subtle Edge Fades (Left & Right) */}
        <div className="deck-edge-fade left" aria-hidden="true" />
        <div className="deck-edge-fade right" aria-hidden="true" />

        {/* Carousel Viewport (Handles Fluid Drag & Touch Swiping) */}
        <div
          className="activities-carousel-viewport"
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Horizontal Track of Infinite Seamless Cards */}
          <div className="activities-carousel-track" ref={trackRef}>
            {clonedCards.map(({ item, globalSlot }) => {
              const isActive = globalSlot === currentSlotRef.current;

              if (item.isCover) {
                return (
                  <div
                    key={globalSlot}
                    className={`activities-card deck-cover-card ${isActive ? 'is-active' : ''}`}
                    data-slot={globalSlot}
                    data-index="0"
                    onClick={(e) => handleCardClick(1, e)}
                  >
                    {/* Center Focal Point: Simple & Aesthetic Font Mix Title */}
                    <div className="deck-cover-center">
                      <h3 className="deck-cover-mix-title">
                        <span className="deck-mix-sans">TUJUAN</span>
                        <span className="deck-mix-serif">Kegiatan</span>
                      </h3>
                    </div>
                  </div>
                );
              }

              const nextLogical = (item.index % TOTAL_BASE) + 1;

              return (
                <article
                  key={globalSlot}
                  className={`activities-card deck-festival-card ${item.theme} ${isActive ? 'is-active' : ''}`}
                  data-slot={globalSlot}
                  data-index={item.index}
                  onClick={(e) => handleCardClick(nextLogical < TOTAL_BASE ? nextLogical : 0, e)}
                >
                  <div className="deck-card-inner-centered">
                    <div className="deck-goal-mix-block">
                      <div className="deck-goal-top-row">
                        <span className="deck-goal-num">{item.num}</span>
                        <span className="deck-goal-verb">{item.verb}</span>
                      </div>
                      <h3 className="deck-goal-subject">{item.subject}</h3>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Carousel Controls Footer: [Tombol Kiri] - [Gambar 2: Dots] - [Tombol Kanan] */}
        <div className="activities-carousel-footer">
          <div className="deck-controls-cluster">
            {/* Tombol Kiri (Prev) */}
            <button
              type="button"
              className="deck-arrow-btn prev"
              onClick={() => moveBySteps(-1, 6)}
              aria-label="Tujuan Kegiatan Sebelumnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Gambar 2: Pagination Dots (7 cards: 0..6) */}
            <div className="deck-pagination-dots" role="tablist" aria-label="Indikator Tujuan Kegiatan">
              {BASE_CARDS.map((card, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activeLogicalIndex === idx}
                  aria-label={`Pilih ${card.isCover ? 'Tujuan Kegiatan' : `Tujuan ${card.num}`}`}
                  className={`deck-dot-btn ${activeLogicalIndex === idx ? 'active' : ''}`}
                  onClick={() => goToLogicalIndex(idx)}
                />
              ))}
            </div>

            {/* Tombol Kanan (Next) */}
            <button
              type="button"
              className="deck-arrow-btn next"
              onClick={() => moveBySteps(1, -6)}
              aria-label="Tujuan Kegiatan Selanjutnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
