import gsap from 'gsap';
import { useLayoutEffect, useRef, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import TechStack from './TechStack';
import Process from './Process';
import Beyond from './Beyond';

const Skills = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const horizontal = useMediaQuery({ maxHeight: 600 });
  const skillsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const currentScrollY = useRef<number>(0);
  const isHorizontalSwipe = useRef<boolean>(false);
  const latestDiffX = useRef<number>(0);
  const touchRafId = useRef<number | null>(null);
  const setNeuroVisible = (visible: boolean) => {
    const canvas = document.querySelector('canvas#neuro');
    if (!canvas) return;
    if (visible) canvas.setAttribute('data-visible', 'true');
    else canvas.removeAttribute('data-visible');
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const horizontalSections = gsap.utils.toArray('.horizontal-section');
      const xPercent = isMobile ? -112.52 : -100;
      const skillsElement = skillsRef.current;

      const endPause = isMobile || horizontal ? 0.04 : 0.1;

      if (!skillsElement) return;

      setNeuroVisible(false);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: skillsElement,
          pin: true,
          scrub: 1,
          anticipatePin: isMobile ? 1 : 0,
          fastScrollEnd: true,
          preventOverlaps: true,
          end: () => `+=${skillsElement.scrollWidth - document.documentElement.clientWidth}`,
          onLeave: () => setNeuroVisible(true),
          onEnterBack: () => setNeuroVisible(false),
          onEnter: () => setNeuroVisible(false),
          onLeaveBack: () => setNeuroVisible(false),
        },
      });

      tl.to({}, { duration: 0.07 });

      tl.to(horizontalSections, {
        xPercent: xPercent * (horizontalSections.length - 1),
        ease: 'none',
        force3D: true,
      });

      tl.to({}, { duration: endPause });
    });

    return () => ctx.revert();
  }, [isMobile, horizontal]);

  useEffect(() => {
    if (!(isMobile || horizontal) || !skillsRef.current) return;

    const skillsElement = skillsRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      currentScrollY.current = window.scrollY;
      isHorizontalSwipe.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current && !touchStartY.current) return;

      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;

      const diffX = touchStartX.current - touchCurrentX;
      const diffY = touchStartY.current - touchCurrentY;

      if (!isHorizontalSwipe.current && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
        isHorizontalSwipe.current = true;
      }

      if (isHorizontalSwipe.current) {
        e.preventDefault();
        latestDiffX.current = diffX;

        if (touchRafId.current === null) {
          touchRafId.current = requestAnimationFrame(() => {
            window.scrollTo(0, currentScrollY.current + latestDiffX.current * 2);
            touchRafId.current = null;
          });
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = 0;
      touchStartY.current = 0;
      isHorizontalSwipe.current = false;

      if (touchRafId.current !== null) {
        cancelAnimationFrame(touchRafId.current);
        touchRafId.current = null;
      }
    };

    skillsElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    skillsElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    skillsElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      skillsElement.removeEventListener('touchstart', handleTouchStart);
      skillsElement.removeEventListener('touchmove', handleTouchMove);
      skillsElement.removeEventListener('touchend', handleTouchEnd);

      if (touchRafId.current !== null) {
        cancelAnimationFrame(touchRafId.current);
        touchRafId.current = null;
      }
    };
  }, [isMobile, horizontal]);

  return (
    <main id="skills" ref={skillsRef}>
      <div className="skills-word">
        <h1>
          <span>S</span>
          <span>K</span>
          <span>I</span>
          <span>L</span>
          <span>L</span>
          <span>S</span>
        </h1>
      </div>
      <section className="horizontal-section">
        <TechStack />
      </section>

      <section className="horizontal-section">
        <Process />
      </section>

      <section className="horizontal-section">
        <Beyond />
      </section>
    </main>
  );
};

export default Skills;
