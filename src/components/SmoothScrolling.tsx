'use client';

import { createContext, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import Lenis from 'lenis';

export const SmoothScrollContext = createContext<RefObject<Lenis | null> | null>(null);

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const instance = useRef<Lenis | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia(
      '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );

    const syncScrollLock = () => {
      if (!instance.current) return;
      // Existing menus and the welcome banner lock scrolling on the body.
      const locked = ['hidden', 'clip'].includes(getComputedStyle(document.body).overflowY);
      if (locked === instance.current.isStopped) return;
      if (locked) instance.current.stop();
      else instance.current.start();
    };

    const syncDesktop = () => {
      if (desktop.matches && !instance.current) {
        instance.current = new Lenis({
          lerp: 0.1,
          wheelMultiplier: 1,
          smoothWheel: true,
          syncTouch: false,
          autoRaf: true,
          anchors: true,
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
        });
        syncScrollLock();
      } else if (!desktop.matches && instance.current) {
        instance.current.destroy();
        instance.current = null;
      }
    };

    const observer = new MutationObserver(syncScrollLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    desktop.addEventListener('change', syncDesktop);
    syncDesktop();

    return () => {
      observer.disconnect();
      desktop.removeEventListener('change', syncDesktop);
      instance.current?.destroy();
      instance.current = null;
    };
  }, []);

  return <SmoothScrollContext.Provider value={instance}>{children}</SmoothScrollContext.Provider>;
}
