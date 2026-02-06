import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Trans, useTranslation } from 'react-i18next';

import Button from '../components/Button';
// @ts-expect-error jsx
import ShaderPhoto from '../components/ShaderPhoto';
import Interface from '../components/active/Interface';
import { useMediaQuery } from 'react-responsive';

const Hero = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 460 });
  useGSAP(() => {
    gsap.fromTo('.title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.4, duration: 1, ease: 'power2.inOut' });
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
            {t('hero.greeting')}
            <br />
            {t('hero.myName')}
            <br />
            {t('hero.loveToBuild')}
            {isMobile ? <br /> : ' '}
            <Interface />
            <br />
            <span className="strong-team">{t('hero.readyToJoin')}</span>
            <br />
            <span className="h-2 w-2 block"></span>
            <span className="hero-stats">
              <Trans i18nKey="hero.stats" components={{ b: <strong /> }} />
            </span>
          </div>
          <Button text={t('hero.cta')} className="hero-button" id="work" />
        </div>
      </section>
      <ShaderPhoto />
    </>
  );
};

export default Hero;
