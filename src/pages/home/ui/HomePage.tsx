import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/all';

import Navbar from '@/widgets/navbar/ui/Navbar';
import Hero from '@/widgets/hero/ui/Hero';
import Projects from '@/widgets/projects/ui/Projects';
import Experience from '@/widgets/experience/ui/Experience';
import Approach from '@/widgets/approach/ui/Approach';
import Review from '@/widgets/reviews/ui/Review';
import Skills from '@/widgets/skills/ui/Skills';
import Contact from '@/widgets/contact/ui/Contact';
import { useAB, type SectionKey } from '@/features/ab-testing';

const sectionComponents: Record<SectionKey, React.FC> = {
  projects: Projects,
  experience: Experience,
  approach: Approach,
  reviews: Review,
  skills: Skills,
};

const HomePage = () => {
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

export default HomePage;
