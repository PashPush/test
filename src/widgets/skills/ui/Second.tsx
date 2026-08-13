import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import CurvedLine from './icons/CurvedLine';
import { stickers } from '../model/stickers';
import CurvedLineMobile from './icons/CurvedLineMobile';
import Hands from './Hands';

const Sticker = memo(({ title, description }: { title: string; description: string }) => (
  <div className="sticker">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
));

Sticker.displayName = 'Sticker';

const Second = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const smallScreen = useMediaQuery({ maxWidth: 1024 });

  const isSafari = useRef(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  const stickersAnimated = useRef(false);
  const lineAnimated = useRef(false);

  const getRotate = (index: number) => {
    const rotations = [-1, 2, 1];
    return rotations[index] ?? -1;
  };

  useGSAP(() => {
    const triggerEl = sectionRef.current || document.body;
    const skillsEl = document.querySelector('#skills');

    const svg = document.querySelector(smallScreen ? '#curved-line-mobile' : '#curved-line');
    const line = svg?.querySelector('path');

    const setupAnimations = () => {
      if (line && !isSafari.current && skillsEl && !lineAnimated.current) {
        const offsetLineStart = isMobile
          ? skillsEl.scrollWidth / 50
          : smallScreen
            ? skillsEl.scrollWidth / 80
            : skillsEl.scrollWidth / 85;
        const offsetLineEnd = isMobile ? 0 : smallScreen ? skillsEl.scrollWidth / 120 : skillsEl.scrollWidth / 45;

        const lineLength = line.getTotalLength();

        gsap.set(line, { strokeDasharray: lineLength });

        gsap.fromTo(
          line,
          { strokeDashoffset: smallScreen ? lineLength : -lineLength },
          {
            strokeDashoffset: 0,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: triggerEl,
              start: `top+=${offsetLineStart}%`,
              end: `bottom top-=${offsetLineEnd}%`,
              scrub: 1,
              once: true,
              onEnter: () => {
                lineAnimated.current = true;
              },
            },
          }
        );
      }

      if (stickersAnimated.current) return;

      const stickerElements = sectionRef.current?.querySelectorAll('.sticker');
      if (!stickerElements?.length) return;

      const offsetStickers = isMobile ? 800 : 1200;

      const firstSticker = stickerElements[0];
      const rect = firstSticker.getBoundingClientRect();
      const triggerPoint = window.innerHeight - offsetStickers;

      if (rect.top < triggerPoint) {
        stickerElements.forEach((sticker, index) => {
          gsap.set(sticker, {
            x: 0,
            opacity: 1,
            rotate: getRotate(index),
          });
        });
        stickersAnimated.current = true;
        return;
      }

      stickerElements.forEach((sticker, index) => {
        gsap.set(sticker, {
          x: 30,
          opacity: 0,
          rotate: -10,
          transformOrigin: 'center top',
        });

        gsap.to(sticker, {
          x: 0,
          rotate: getRotate(index),
          opacity: 1,
          duration: 0.5,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: sticker,
            start: `top bottom-=${offsetStickers}`,
            once: true,
            onEnter: () => {
              if (index === stickerElements.length - 1) {
                stickersAnimated.current = true;
              }
            },
          },
        });
      });

      stickersAnimated.current = true;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(setupAnimations);
    });
  }, [isMobile, smallScreen]);

  return (
    <section ref={sectionRef} className="w-full flex flex-row justify-between">
      <div className="processes-wrapper">
        {smallScreen ? <CurvedLineMobile /> : <CurvedLine />}
        <div className="processes">
          {stickers.map(({ index }) => (
            <Sticker
              key={index}
              title={t(`stickers.${index}.title`)}
              description={t(`stickers.${index}.description`)}
            />
          ))}
        </div>
      </div>
      <div className="noise sm:w-3/4"></div>
      {!isMobile && <Hands />}
    </section>
  );
};

export default memo(Second);
