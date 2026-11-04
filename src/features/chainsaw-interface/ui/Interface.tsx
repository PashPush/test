import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Chainsaw from './Chainsaw';
import gsap from 'gsap';
import { classNames } from '@/shared/lib/classNames';
import Chips from './Chips';
import { trackEvent } from '@/shared/lib/analytics';

const Interface = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [isActivated, setIsActivated] = useState(true);
  const containerRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const isPlayingRef = useRef(false);
  const activeTimelinesRef = useRef<gsap.core.Timeline[]>([]);
  const reactivateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    reactivateTimerRef.current = setTimeout(() => {
      setIsActivated(false);
    }, 1500);
    return () => {
      activeTimelinesRef.current.forEach(tl => {
        try {
          tl.kill();
        } catch {
          // skip
        }
      });
      activeTimelinesRef.current = [];

      if (reactivateTimerRef.current) {
        clearTimeout(reactivateTimerRef.current);
      }
    };
  }, []);

  // The button is a fixed w-48, the plaque's width depends on the language: keep the hint 16px past the plaque.
  useEffect(() => {
    const button = containerRef.current;
    const hint = hintRef.current;
    const faces = button?.querySelector<HTMLElement>('.faces');
    if (!button || !hint || !faces) return;

    // -1: .faces' own translate(-1px, 4px).
    const place = () => {
      hint.style.marginLeft = `${faces.offsetLeft + faces.offsetWidth - 1 - button.offsetWidth + 16}px`;
    };
    const observer = new ResizeObserver(place);
    button.querySelectorAll('.inter, .faces').forEach(el => observer.observe(el));
    // .inter drops its margin at this width, which moves the plaque without resizing it.
    const narrow = window.matchMedia('(max-width: 460px)');
    narrow.addEventListener('change', place);
    return () => {
      observer.disconnect();
      narrow.removeEventListener('change', place);
    };
  }, []);

  const runStage = (stage: number) => {
    const container = containerRef.current;
    if (!container) return Promise.resolve();

    const chainsaw = container.querySelector('.chainsaw');
    const faces = container.querySelector('.faces');
    const chips = container.querySelector('.wood-chips');
    const below = document.querySelector('.hero-below');

    const tlToPromise = (tl: gsap.core.Timeline) =>
      new Promise<void>(resolve => {
        tl.eventCallback('onComplete', () => {
          resolve();
        });
        tl.eventCallback('onInterrupt', () => {
          resolve();
        });
      });

    const createdTimelines = [];

    if (stage === 0) {
      const tl = gsap.timeline();
      createdTimelines.push(tl);

      tl.to(chainsaw, {
        translateY: -110,
        translateX: 100,
        rotate: 210,
        width: 170,
        duration: 1,
        ease: 'power2.inOut',
      })
        .to(
          below,
          {
            translateY: 54,
            duration: 1,
            ease: 'power2.inOut',
          },
          '<'
        )
        .to(container, {
          'clip-path': 'polygon(-200% -500%, 160% -300%, 150% 300%, 0 300%)',
          duration: 0,
        })
        .to(chainsaw, {
          translateY: -77,
          translateX: 60,
          rotate: 178,
          width: 260,
          duration: 0.8,
          ease: 'power2.inOut',
        })
        .to(chainsaw, {
          translateY: -75,
          translateX: 70,
          rotate: 169,
          duration: 1.6,
          ease: 'ease-in-out',
        })
        .to(faces, { rotate: 1, translateY: 5, duration: 0.3 });

      const chipsTl = gsap.timeline();
      createdTimelines.push(chipsTl);
      chipsTl
        .to({}, { duration: 1.7 })
        .to(chips, { opacity: 1, duration: 0.1 })
        .to(chips, { translateY: -65, duration: 1.5 });

      activeTimelinesRef.current.push(tl);
      return tlToPromise(tl);
    }

    if (stage === 1) {
      const tl = gsap.timeline();
      createdTimelines.push(tl);

      tl.to(chainsaw, {
        translateY: -70,
        translateX: 60,
        rotate: 160,
        duration: 0.9,
        ease: 'power2.inOut',
      })
        .to(chainsaw, {
          translateY: -40,
          translateX: 90,
          rotate: 205,
          duration: 1.3,
          ease: 'power2.inOut',
        })
        .to(chainsaw, {
          translateY: -35,
          rotate: 195,
          duration: 0.9,
          ease: 'power2.inOut',
        });

      const chipsTl = gsap.timeline();
      createdTimelines.push(chipsTl);
      chipsTl
        .to(chips, { translateY: -60, rotate: -5, duration: 0.9 })
        .to(chips, { translateY: -55, translateX: 0, rotate: 25, duration: 1.3 })
        .to(chips, { translateY: -52, translateX: -6, rotate: 18, duration: 0.9 });

      const facesTl = gsap.timeline();
      createdTimelines.push(facesTl);
      facesTl.to({}, { duration: 2.5 }).to(faces, { rotate: 3, translateY: 7, duration: 1 });

      activeTimelinesRef.current.push(...createdTimelines);
      return Promise.all([tlToPromise(tl), tlToPromise(facesTl)]);
    }

    if (stage === 2) {
      const maskTl = gsap.timeline();
      createdTimelines.push(maskTl);
      maskTl
        .to(chainsaw, {
          translateY: -12,
          translateX: 70,
          rotate: 172,
          duration: 1.2,
          ease: 'power3.inOut',
        })
        .to(chainsaw, {
          translateX: 66,
          rotate: 180,
          duration: 0.5,
          ease: 'ease-in-out',
        });

      const chipsTl = gsap.timeline();
      createdTimelines.push(chipsTl);
      chipsTl.to(chips, { translateY: -30, rotate: 10, duration: 0.75 }).to(chips, { display: 'none', duration: 0 });

      const facesTl = gsap.timeline();
      createdTimelines.push(facesTl);
      facesTl
        .to({}, { duration: 0.5 })
        .to(faces, { rotate: 9, translateY: 80, translateX: 5, duration: 0.5 })
        .to(faces, { rotate: 0, rotateX: 10, translateY: 71, duration: 0.2 })
        .to(faces, { rotateX: 45, translateY: 69, translateX: 8, skewX: -10, duration: 0.5 });

      activeTimelinesRef.current.push(...createdTimelines);
      return Promise.all([tlToPromise(maskTl), tlToPromise(facesTl)]);
    }

    return Promise.resolve();
  };

  const handleClick = () => {
    if (isPlayingRef.current) return;
    if (count > 2) return;

    setIsActivated(true);
    isPlayingRef.current = true;
    trackEvent('chainsaw_click');

    runStage(count)
      .then(() => {
        setCount(prev => prev + 1);
      })
      .catch(err => {
        console.error('Animation error', err);
      })
      .finally(() => {
        isPlayingRef.current = false;
      });

    if (reactivateTimerRef.current) {
      clearTimeout(reactivateTimerRef.current);
    }

    if (count < 2) {
      reactivateTimerRef.current = setTimeout(() => {
        setIsActivated(false);
        reactivateTimerRef.current = null;
      }, 6000);
    }
  };

  return (
    <>
      <button
        type="button"
        ref={containerRef}
        onClick={handleClick}
        aria-label={t('hero.chainsawLabel')}
        className={classNames('interface', { done: count > 2, 'animate-wiggle': !isActivated })}
      >
        <span className="inter">{t('hero.inter')}</span>
        <Chips />
        <Chainsaw />
        <span className="faces">{t('hero.faces')}</span>
      </button>
      <span
        ref={hintRef}
        aria-hidden="true"
        onClick={handleClick}
        className={classNames('click-it', {
          'opacity-0': isActivated || count > 1,
        })}
      >
        <span className="hover-only">{t('hero.clickIt')}</span>
        <span className="touch-only">{t('hero.tapIt')}</span>
      </span>
    </>
  );
};

export default Interface;
