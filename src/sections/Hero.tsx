import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Trans, useTranslation } from 'react-i18next';

import Button from '@/shared/ui/Button';
// @ts-expect-error jsx
import ShaderPhoto from '@/shared/webgl/ShaderPhoto';
import Interface from '../components/active/Interface';
import { useMediaQuery } from 'react-responsive';

const Hero = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 460 });
  useGSAP(() => {
    gsap.fromTo('.title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.4, duration: 1, ease: 'power2.inOut' });
    gsap.fromTo(
      '.hero-line',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out', delay: 0.3 }
    );
  });

  return (
    <>
      <section className="h-[92vh]">
        <div id="hero"></div>
        <div className="hero-layout">
          <h1 className="title">
            <span>{t('hero.title1')}</span> <span>{t('hero.title2')}</span>
          </h1>
        </div>
        <div className="hero-text">
          <div className="subtitle">
            <span className="hero-line">{t('hero.greeting')}</span>
            <br />
            <span className="hero-line">{t('hero.myName')}</span>
            <br />
            <span className="hero-line">
              {t('hero.loveToBuild')}
              {isMobile ? <br /> : ' '}
              <Interface />
            </span>
            <br />
            <span className="hero-line strong-team">{t('hero.readyToJoin')}</span>
            <br />
            <span className="h-2 w-2 block"></span>
            <span className="hero-line hero-stats">
              <Trans i18nKey="hero.stats" components={{ b: <strong /> }} />
            </span>
          </div>
          <Button text={t('hero.cta')} className="hero-line hero-button" id="work" />
        </div>
      </section>
      <ShaderPhoto />
    </>
  );
};

export default Hero;
