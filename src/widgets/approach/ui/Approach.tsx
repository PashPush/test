import gsap from 'gsap';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames';

type Principle = { title: string; proof: string };

const Approach = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isSmallMobile = useMediaQuery({ maxWidth: 460 });

  const value = t('approach.principles', { returnObjects: true }) as unknown;
  const principles = Array.isArray(value) ? (value as Principle[]) : [];

  const principleList = (items: Principle[]) =>
    items.map(({ title, proof }, index) => (
      <li key={index} className="flex items-start gap-2">
        <img src="/images/check.png" alt="" />
        <p>
          {title}
          <small className="approach-proof">{proof}</small>
        </p>
      </li>
    ));

  useGSAP(() => {
    gsap.set('.masked-img', { clearProps: 'transform,translate,x,y,xPercent,yPercent,scale' });
    gsap.set('.masked-img', { xPercent: -50, yPercent: -50 });

    const start = isMobile ? 'top 1%' : 'top top';

    const maskTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#approach',
        start,
        end: '+=1400',
        scrub: 1,
        pin: true,
        anticipatePin: isMobile ? 1 : 0,
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: false,
      },
    });

    const contentAnimation = isMobile
      ? { translateX: 20, stagger: 0.8, ease: 'power1.inOut' }
      : { scale: 1.2, stagger: 0.8, ease: 'power1.inOut' };

    const translateY = isSmallMobile ? 100 : 0;

    maskTimeline
      .to('.will-grow', contentAnimation)
      .to({}, { duration: 1 })
      .to('.will-fade', { opacity: 0, stagger: 0.2, ease: 'power1.inOut' })
      .to('.masked-img', {
        scale: 2,
        maskSize: isMobile ? '450% auto' : '300% auto',
        xPercent: -50,
        yPercent: -50,
        y: translateY,
        duration: 1,
        ease: 'power1.inOut ',
      })
      .fromTo('#masked-content', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power1.inOut' })
      .to('.masked-span', { opacity: 1, duration: 1, stagger: 0.3, ease: 'power1.inOut' })
      .to('.masked-p', { opacity: 1, duration: 1, stagger: 0.5, ease: 'power1.inOut' });
  }, []);

  return (
    <div id="approach">
      <div>
        <h2 className="will-fade">
          <span>{t('approach.my')}</span>
          {t('approach.approach')}
        </h2>

        <div className="content">
          <ul className="space-y-4 will-fade will-grow sm:mr-50 z-10">{principleList(principles.slice(0, 3))}</ul>

          <div className={classNames('approach-img', { 'approach-mobile': isMobile })}>
            <img
              src="/images/pavel2.webp"
              alt={t('approach.photoAlt')}
              className={classNames('abs-center masked-img size-full object-contain', {
                'masked-img-mobile': isMobile,
              })}
              decoding="async"
              width={1920}
              height={1683}
            />
          </div>

          <ul className="space-y-4 will-fade will-grow sm:ml-50 z-10">{principleList(principles.slice(3))}</ul>
        </div>

        <div className="masked-container">
          <h2 className="will-fade">
            {t('approach.slogan1')}
            <br />
            {t('approach.slogan2')}
          </h2>
          <div id="masked-content">
            <h3>
              {t('approach.teamTitle')
                .split(' ')
                .map((word, index) => (
                  <span key={index} className="masked-span">
                    {word}
                  </span>
                ))}
            </h3>
            <p className="masked-p">{t('approach.teamText')}</p>
            <figure className="masked-p">
              <blockquote>{t('approach.quote')}</blockquote>
              <figcaption>{t('approach.quoteAuthor')}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Approach;
