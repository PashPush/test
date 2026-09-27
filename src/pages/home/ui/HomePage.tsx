import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '@/widgets/navbar/ui/Navbar';
import Hero from '@/widgets/hero/ui/Hero';
import Projects from '@/widgets/projects/ui/Projects';
import Experience from '@/widgets/experience/ui/Experience';
import Approach from '@/widgets/approach/ui/Approach';
import Reviews from '@/widgets/reviews/ui/Reviews';
import Skills from '@/widgets/skills/ui/Skills';
import Contact from '@/widgets/contact/ui/Contact';
import { useAB, type SectionKey } from '@/features/ab-testing';

const sectionComponents: Record<SectionKey, React.FC> = {
  projects: Projects,
  experience: Experience,
  approach: Approach,
  reviews: Reviews,
  skills: Skills,
};

const HomePage = () => {
  const { sectionOrder } = useAB();

  useEffect(() => {
    let disposed = false;
    let disposeNeuro: (() => void) | undefined;
    const targets = ['skills', 'contacts']
      .map(id => document.getElementById(id))
      .filter((target): target is HTMLElement => target !== null);

    const loadNeuro = () => {
      observer?.disconnect();
      void import('@/shared/webgl/neuro')
        .then(({ initNeuro }) => {
          if (!disposed) disposeNeuro = initNeuro();
        })
        .catch(error => {
          document.getElementById('contacts')?.classList.add('fallback-bg');
          console.warn('Contact WebGL could not be loaded; using the static fallback.', error);
        });
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            entries => {
              if (entries.some(entry => entry.isIntersecting)) loadNeuro();
            },
            { rootMargin: '800px 0px' }
          )
        : null;

    if (observer && targets.length) {
      targets.forEach(target => observer.observe(target));
    } else {
      loadNeuro();
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      disposeNeuro?.();
    };
  }, []);

  // Web fonts change text metrics: measure trigger positions once, after they are in.
  useEffect(() => {
    let active = true;
    void document.fonts?.ready.then(() => active && ScrollTrigger.refresh());
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      {sectionOrder.map(key => {
        const Section = sectionComponents[key];
        return <Section key={key} />;
      })}
      <Contact />
    </>
  );
};

export default HomePage;
