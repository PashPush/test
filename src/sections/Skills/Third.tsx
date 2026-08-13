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
  icon: typeof IoSparklesOutline;
  title: string;
  description: string;
};

const LanguageCard = memo(({ lang, index }: { lang: Language; index: number }) => {
  const horizontal = useMediaQuery({ maxHeight: 600 });

  return (
    <div className="group lang-card">
      <div className="flex sm:justify-between justify-center lg:mb-4 mb-2">
        <div className="flex items-center lg:gap-x-4 gap-x-2 flex-wrap">
          <span className="text-4xl">{lang.flag}</span>
          <h4 className="text-xl text-white hidden sm:block">{lang.name}</h4>

          <div className="flex items-center lg:gap-4 gap-2">
            <span
              className={classNames('lang-badge group-hover:border-white/80', {
                'bg-green-400/40': index === 0,
                'bg-yellow-300/40': index === 1,
                'bg-blue-400/40': index === 2,
              })}
            >
              {lang.level}
            </span>
            {!horizontal && <span className="text-slate-100 text-sm hidden sm:block">{lang.levelText}</span>}
          </div>
        </div>
      </div>

      <div className="relative h-2 bg-[#4b1c54] rounded-full overflow-hidden">
        <div
          className={classNames(
            'absolute inset-y-0 left-0 bg-gradient-to-r rounded-full transition-all duration-1000',
            {
              'from-[#42857b] to-[#26ccb7]': index === 0,
              'from-[#b6784b] to-[#f3c925]': index === 1,
              'from-[#2555b1] to-[#d0e2ff]': index === 2,
            }
          )}
          style={{ width: `${lang.percentage}%` }}
        ></div>
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
      className={classNames('group drive-card', {
        hidden: shortScreen && isMobile && drive.title === 'UX/UI дизайн и внимание к деталям',
      })}
    >
      <div className="flex sm:gap-4 gap-2">
        <div className="flex-shrink-0">
          <div className="drive-icon-wrapper group-hover:border-white/80">
            <Icon className="drive-icon group-hover:text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="drive-title group-hover:text-white">{drive.title}</h4>
          {!horizontal && (
            <p className="text-slate-200 md:text-sm xl:text-base text-xs leading-relaxed">{drive.description}</p>
          )}
        </div>
      </div>
    </div>
  );
});

DriveCard.displayName = 'DriveCard';

const Third = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontal = useMediaQuery({ maxHeight: 600 });

  const languages = [
    { name: 'English', level: 'C1', levelText: t('skills.third.langLevels.advanced'), flag: '🇬🇧', percentage: 89 },
    { name: 'Español', level: 'B1', levelText: t('skills.third.langLevels.intermediate'), flag: '🇪🇸', percentage: 61 },
    { name: 'Русский', level: 'NS', levelText: t('skills.third.langLevels.native'), flag: '🇷🇺', percentage: 100 },
  ];

  const drives = [
    {
      icon: IoCompassSharp,
      title: t('skills.third.driveItems.balance.title'),
      description: t('skills.third.driveItems.balance.description'),
    },
    {
      icon: IoReaderOutline,
      title: t('skills.third.driveItems.result.title'),
      description: t('skills.third.driveItems.result.description'),
    },
    {
      icon: IoRocketOutline,
      title: t('skills.third.driveItems.learning.title'),
      description: t('skills.third.driveItems.learning.description'),
    },
    {
      icon: IoColorPaletteOutline,
      title: t('skills.third.driveItems.ux.title'),
      description: t('skills.third.driveItems.ux.description'),
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
    <section ref={sectionRef} className="third-wrapper">
      <div className="max-w-7xl w-full">
        <div className="noise opacity-[0.03]"></div>
        {!horizontal && <h2 className="beyond-code">{t('skills.third.beyondCode')}</h2>}

        <div className="additional">
          <div className="languages">
            <div className="card-title">
              <div className="lang-title-icon">
                <IoLanguageSharp className="sm:size-6 size-5 text-blue-200" />
              </div>
              <h3>{t('skills.third.languages')}</h3>
            </div>

            <div className="flex sm:block flex-row gap-2 justify-between">
              {languages.map((lang, index) => (
                <LanguageCard key={lang.name} lang={lang} index={index} />
              ))}
            </div>

            {!horizontal && (
              <div className="lang-effective">
                <p>{t('skills.third.langEffective')}</p>
              </div>
            )}
          </div>

          <div className="drive">
            <div className="card-title">
              <div className="drive-title-icon">
                <IoSparklesOutline className="sm:size-6 size-5 text-purple-300" />
              </div>
              <h3>{t('skills.third.drives')}</h3>
            </div>

            {drives.map((drive, index) => (
              <DriveCard key={index} drive={drive} />
            ))}
          </div>
        </div>

        <div className="call-grow">
          <div>
            <p>
              {t('skills.third.callGrow')}
              <span> {t('skills.third.meaningful')}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Third;
