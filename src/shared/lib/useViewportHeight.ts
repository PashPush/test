import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/all';

export const useViewportHeight = () => {
  const maxHeightRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const setViewportHeight = (height: number) => {
      const vh = height * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    if (!isInitializedRef.current) {
      maxHeightRef.current = window.innerHeight;
      setViewportHeight(maxHeightRef.current);
      isInitializedRef.current = true;
    }

    let resizeTimeout: number | null = null;

    const handleResize = () => {
      const currentHeight = window.innerHeight;

      if (currentHeight > maxHeightRef.current) {
        setTimeout(() => {
          maxHeightRef.current = currentHeight;
          setViewportHeight(currentHeight);

          ScrollTrigger.refresh();
        }, 100);
      }
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        const currentHeight = window.innerHeight;
        maxHeightRef.current = currentHeight;
        setViewportHeight(currentHeight);

        ScrollTrigger.refresh();
      }, 200);
    };

    const debouncedResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
};
