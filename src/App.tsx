import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';

import Navbar from '@/widgets/navbar/ui/Navbar';
import Hero from '@/widgets/hero/ui/Hero';
import Projects from '@/widgets/projects/ui/Projects';
import Experience from '@/widgets/experience/ui/Experience';
import Approach from '@/widgets/approach/ui/Approach';
import Review from '@/widgets/reviews/ui/Review';
import Skills from '@/widgets/skills/ui/Skills';
import Contact from '@/widgets/contact/ui/Contact';
import { useViewportHeight } from '@/shared/lib/useViewportHeight';
import { useAB, type SectionKey } from '@/features/ab-testing';

gsap.registerPlugin(ScrollTrigger, SplitText);

gsap.config({
  nullTargetWarn: false,
  force3D: true,
});

ScrollTrigger.config({
  ignoreMobileResize: true,
});

console.log('%cЗдравствуй, дорогой друг!', 'color: #2cc800; font-weight: bold; font-size: 20px;');

const sectionComponents: Record<SectionKey, React.FC> = {
  projects: Projects,
  experience: Experience,
  approach: Approach,
  reviews: Review,
  skills: Skills,
};

const App = () => {
  useViewportHeight();
  const { sectionOrder } = useAB();

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [sectionOrder]);

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

export default App;
