import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const isZoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;

/**
 * `resize` is left out of ScrollTrigger's autoRefreshEvents: on iOS a pinch or the
 * collapsing address bar fires it too. Refresh only when the layout viewport really
 * changed — on touch-only devices, only its width.
 */
export const useRefreshOnResize = () => {
  useEffect(() => {
    const size = () => {
      const { clientWidth, clientHeight } = document.documentElement;
      return ScrollTrigger.isTouch === 1 ? `${clientWidth}` : `${clientWidth}x${clientHeight}`;
    };
    let last = size();
    let timeout = 0;

    const measure = () => {
      const next = size();
      if (isZoomed() || next === last) return;
      last = next;
      ScrollTrigger.refresh();
    };
    const schedule = (delay: number) => () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(measure, delay);
    };

    const onResize = schedule(150);
    const onOrientationChange = schedule(300);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onOrientationChange, { passive: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, []);
};
