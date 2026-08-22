import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const isZoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;

export const useViewportHeight = () => {
  const maxHeightRef = useRef(0);
  const widthRef = useRef(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const setViewportHeight = (height: number) => {
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    };

    if (!isInitializedRef.current) {
      maxHeightRef.current = window.innerHeight;
      widthRef.current = document.documentElement.clientWidth;
      setViewportHeight(maxHeightRef.current);
      isInitializedRef.current = true;
    }

    const apply = (height: number) => {
      maxHeightRef.current = height;
      widthRef.current = document.documentElement.clientWidth;
      setViewportHeight(height);
      ScrollTrigger.refresh();
    };

    const measure = () => {
      if (isZoomed()) return;

      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      if (width !== widthRef.current || height > maxHeightRef.current) apply(height);
    };

    let resizeTimeout: number | null = null;
    const schedule = (delay: number) => () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(measure, delay);
    };

    const onResize = schedule(150);
    const onOrientationChange = schedule(300);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onOrientationChange, { passive: true });

    return () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, []);
};
