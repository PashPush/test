import { useRef, memo } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import {
  IoSparklesOutline,
  IoRocketOutline,
  IoLanguageSharp,
  IoColorPaletteOutline,
  IoCompassSharp,
  IoReaderOutline,
} from 'react-icons/io5';
import { classNames } from '@/shared/lib/classNames';
import { useMediaQuery } from 'react-responsive';

type Language = {
  flag: string;
  name: string;
  level: string;
  levelText: string;
  percentage: number;
};

type Drive = {
  id: string;
  icon: typeof IoSparklesOutline;
  title: string;
  description: string;
};

const LanguageCard = memo(({ lang }: { lang: Language }) => {
  const horizontal = useMediaQuery({ maxHeight: 600 });

  return (
    <div className="lang-card">
      <div className="flex sm:justify-between justify-center lg:mb-4 mb-2">
        <div className="flex items-center lg:gap-x-4 gap-x-2 flex-wrap">
          <span className="text-4xl">{lang.flag}</span>
          <h4 className="text-xl text-white hidden sm:block">{lang.name}</h4>

          <div className="flex items-center lg:gap-4 gap-2">
            <span className="lang-badge">{lang.level}</span>
            {!horizontal && <span className="lang-level-text hidden sm:block">{lang.levelText}</span>}
          </div>
        </div>
      </div>

      <div className="lang-bar">
        <div className="lang-bar-fill" style={{ width: `${lang.percentage}%` }}></div>
      </div>
    </div>
  );
});

LanguageCard.displayName = 'LanguageCard';

const DriveCard = memo(({ drive }: { drive: Drive }) => {
  const horizontal = useMediaQuery({ maxHeight: 600 });
  const shortScreen = useMediaQuery({ maxHeight: 740 });
  const isMobile = useMediaQuery({ maxWidth: 460 });
  const Icon = drive.icon;

  return (
    <div
      className={classNames('drive-card', {
        hidden: shortScreen && isMobile && drive.id === 'ux',
      })}
    >
      <div className="flex sm:gap-4 gap-2">
        <div className="flex-shrink-0">
          <div className="drive-icon-wrapper">
            <Icon className="drive-icon" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="drive-title">{drive.title}</h4>
          {!horizontal && <p className="drive-text">{drive.description}</p>}
        </div>
      </div>
    </div>
  );
});

DriveCard.displayName = 'DriveCard';

const Beyond = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontal = useMediaQuery({ maxHeight: 600 });

  const languages = [
    { name: 'English', level: 'C1', levelText: t('skills.beyond.langLevels.advanced'), flag: '🇬🇧', percentage: 89 },
    { name: 'Español', level: 'B1', levelText: t('skills.beyond.langLevels.intermediate'), flag: '🇪🇸', percentage: 61 },
    { name: 'Русский', level: 'NS', levelText: t('skills.beyond.langLevels.native'), flag: '🇷🇺', percentage: 100 },
  ];

  const drives: Drive[] = [
    {
      id: 'balance',
      icon: IoCompassSharp,
      title: t('skills.beyond.driveItems.balance.title'),
      description: t('skills.beyond.driveItems.balance.description'),
    },
    {
      id: 'result',
      icon: IoReaderOutline,
      title: t('skills.beyond.driveItems.result.title'),
      description: t('skills.beyond.driveItems.result.description'),
    },
    {
      id: 'learning',
      icon: IoRocketOutline,
      title: t('skills.beyond.driveItems.learning.title'),
      description: t('skills.beyond.driveItems.learning.description'),
    },
    {
      id: 'ux',
      icon: IoColorPaletteOutline,
      title: t('skills.beyond.driveItems.ux.title'),
      description: t('skills.beyond.driveItems.ux.description'),
    },
  ];

  useGSAP(() => {
    gsap.delayedCall(0.2, () => {
      if (!sectionRef.current) return;
      const mainTrigger = ScrollTrigger.getAll().find(st => st.trigger && (st.trigger as HTMLElement).id === 'skills');

      if (!mainTrigger || !sectionRef.current) return;

      const additionals = sectionRef.current.querySelectorAll('.additional > div');
      const beyondCode = sectionRef.current.querySelector('.beyond-code');
      const langEffective = sectionRef.current.querySelector('.lang-effective');
      const callGrow = sectionRef.current.querySelector('.call-grow');
      const langCards = sectionRef.current.querySelectorAll('.lang-card');
      const driveCards = sectionRef.current.querySelectorAll('.drive-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          containerAnimation: mainTrigger.animation,
          start: 'left 80%',
          end: 'left 20%',
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      if (beyondCode) {
        tl.fromTo(
          beyondCode,
          { y: -80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            force3D: true,
          },
          0
        );
      }

      if (additionals.length > 0) {
        tl.fromTo(
          additionals,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            stagger: 0.3,
            force3D: true,
          },
          0.2
        );
      }

      if (langCards.length > 0) {
        tl.fromTo(
          langCards,
          { x: 150, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.2,
            force3D: true,
          },
          0.3
        );
      }

      if (langEffective) {
        tl.fromTo(
          langEffective,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            force3D: true,
          },
          1
        );
      }

      if (driveCards.length > 0) {
        tl.fromTo(
          driveCards,
          { x: 150, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.3,
            force3D: true,
          },
          0.3
        );
      }

      if (callGrow) {
        tl.fromTo(
          callGrow,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            force3D: true,
          },
          '-=0.3'
        );
      }
    });
  }, [sectionRef.current, horizontal]);

  return (
    <section ref={sectionRef} className="beyond-wrapper">
      <div className="max-w-7xl w-full">
        <div className="noise opacity-[0.05]"></div>
        {!horizontal && <h2 className="beyond-code">{t('skills.beyond.title')}</h2>}

        <div className="additional">
          <div className="languages">
            <div className="card-title">
              <IoLanguageSharp className="card-title-icon" />
              <h3>{t('skills.beyond.languages')}</h3>
            </div>

            <div className="flex sm:block flex-row gap-2 justify-between">
              {languages.map(lang => (
                <LanguageCard key={lang.name} lang={lang} />
              ))}
            </div>

            {!horizontal && (
              <div className="lang-effective">
                <p>{t('skills.beyond.langEffective')}</p>
              </div>
            )}
          </div>

          <div className="drive">
            <div className="card-title">
              <IoSparklesOutline className="card-title-icon" />
              <h3>{t('skills.beyond.drives')}</h3>
            </div>

            {drives.map(drive => (
              <DriveCard key={drive.id} drive={drive} />
            ))}
          </div>
        </div>

        <div className="call-grow">
          <div>
            <p>
              {t('skills.beyond.callGrow')}
              <span> {t('skills.beyond.meaningful')}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beyond;
