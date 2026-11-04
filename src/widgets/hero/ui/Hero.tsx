import { lazy, Suspense, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Button from '@/shared/ui/Button';
import ErrorBoundary from '@/shared/ui/ErrorBoundary';
import { useCvLink } from '@/shared/lib/useCvLink';
import Interface from '@/features/chainsaw-interface/ui/Interface';
import { classNames } from '@/shared/lib/classNames';

// @ts-expect-error ShaderPhoto remains JSX until its Three.js migration is complete.
const ShaderPhoto = lazy(() => import('@/shared/webgl/ShaderPhoto'));

// Same breakpoint as ShaderPhoto's old mobile config; below it, and for touch or reduced
// motion, three.js is never loaded and the static render of the portrait stays.
const WEBGL_QUERY = '(min-width: 641px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

// Without a GPU (software GL) every frame would run on the CPU: keep the static render.
// failIfMajorPerformanceCaveat catches Chrome's own fallback; the renderer name catches software
// GL that is not flagged (SwiftShader chosen explicitly, llvmpipe, Windows' WARP).
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render/i;
const hasGpuWebGL = () => {
  const gl = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
  if (!gl) return false;
  let renderer = String(gl.getParameter(gl.RENDERER));
  // Chrome and Safari mask it; Firefox reports it here and warns on the debug extension.
  if (renderer === 'WebKit WebGL') {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
  }
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return !SOFTWARE_GL.test(renderer);
};

const Hero = () => {
  const { t } = useTranslation();
  const cvLink = useCvLink('hero');
  const [webgl, setWebgl] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(WEBGL_QUERY);
    const requestIdle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    let idleId = 0;
    let gpu: boolean | undefined;

    const update = () => {
      cancelIdle(idleId);
      if (!query.matches) {
        setWebgl(false);
        setWebglReady(false);
        return;
      }
      idleId = requestIdle(() => setWebgl((gpu ??= hasGpuWebGL())), { timeout: 1200 });
    };

    update();
    query.addEventListener('change', update);
    return () => {
      cancelIdle(idleId);
      query.removeEventListener('change', update);
    };
  }, []);

  return (
    <>
      <section id="hero" className="flex flex-col">
        <div className={classNames('hero-portrait', { ready: webglReady })}>
          <picture>
            <source media="(max-width: 640px)" type="image/avif" srcSet="/images/hero-portrait-mobile.avif" />
            <source media="(max-width: 640px)" srcSet="/images/hero-portrait-mobile.webp" />
            <source type="image/avif" srcSet="/images/hero-portrait-desktop.avif" />
            <img src="/images/hero-portrait-desktop.webp" alt="" width={1426} height={1426} fetchPriority="high" />
          </picture>
        </div>
        <ErrorBoundary>
          <Suspense fallback={null}>{webgl ? <ShaderPhoto onReady={() => setWebglReady(true)} /> : null}</Suspense>
        </ErrorBoundary>
        <div className="hero-layout">
          <h1 className="title">
            <span>{t('hero.title1')}</span> <span>{t('hero.title2')}</span>
          </h1>
        </div>
        <div className="hero-text">
          <div className="subtitle">
            <span className="hero-line">{t('hero.greeting')}</span>
            <br />
            <span className="hero-line">
              {t('hero.loveToBuild')} <br className="min-[461px]:hidden" />
              <Interface />
            </span>
          </div>
          <div className="hero-below">
            <ul className="hero-line hero-chips">
              {[0, 1].map(i => (
                <li key={i}>
                  <Trans i18nKey={`hero.chips.${i}`} components={{ b: <strong /> }} />
                </li>
              ))}
            </ul>
            <div className="hero-line hero-actions">
              <Button text={t('cv.download')} className="hero-button" {...cvLink} />
              <a href="#contacts" className="hero-contact">
                {t('hero.contactCta')}
              </a>
            </div>
            <p className="hero-line hero-status">{t('hero.status')}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
