import type { IconType } from 'react-icons';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiPostman,
  SiGraphql,
  SiGit,
  SiFigma,
  SiStorybook,
  SiTestinglibrary,
  SiJest,
  SiNodedotjs,
  SiMobx,
  SiVite,
  SiHtml5,
  SiCss3,
  SiRedux,
  SiTailwindcss,
  SiNextdotjs,
  SiWebpack,
  SiDocker,
  SiSass,
} from 'react-icons/si';
import { useMediaQuery } from 'react-responsive';
import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import AnimatedGears from './AnimatedGears';
import CICD from './icons/CICD';
import N8n from './icons/N8n';
import Gsap from './icons/Gsap';
import Playwright from './icons/Playwright';

type Skill = {
  id: string;
  name: string;
  Icon: IconType | string;
  color: string;
  colorBack?: string;
};

const frontend: Skill[] = [
  { id: 'react', name: 'React', Icon: SiReact, color: '#76d2ea', colorBack: '#589db0' },
  { id: 'typescript', name: 'TypeScript', Icon: SiTypescript, color: '#4a81b7', colorBack: '#2d4a6c' },
  { id: 'javascript', name: 'JavaScript', Icon: SiJavascript, color: '#e4d445', colorBack: '#b5a326' },
  { id: 'html', name: 'HTML', Icon: SiHtml5, color: '#ca5b3e', colorBack: '#96402a' },
  { id: 'css', name: 'CSS', Icon: SiCss3, color: '#415fcb', colorBack: '#2b3f82' },
  { id: 'react-native', name: 'React Native', Icon: SiReact, color: '#23b1c3', colorBack: '#1b7480' },
  { id: 'tailwind', name: 'Tailwind', Icon: SiTailwindcss, color: '#51b7e2', colorBack: '#35768c' },
  { id: 'scss', name: 'SCSS', Icon: SiSass, color: '#bd7196', colorBack: '#814563' },
  { id: 'gsap', name: 'Gsap', Icon: Gsap as IconType, color: '#2dd45c', colorBack: '#34804b' },
  { id: 'redux', name: 'Redux', Icon: SiRedux, color: '#7757a9', colorBack: '#4d366f' },
  { id: 'mobx', name: 'MobX', Icon: SiMobx, color: '#c86835', colorBack: '#7a4628' },
  { id: 'zustand', name: 'Zustand', Icon: '/images/zustand.webp', color: '#7e60ad', colorBack: '#513f6d' },
];

const backendAndTools: Skill[] = [
  { id: 'next', name: 'Next.js', Icon: SiNextdotjs, color: '#000000', colorBack: '#3a3a3a' },
  { id: 'webpack', name: 'Webpack', Icon: SiWebpack, color: '#99d0e9', colorBack: '#5c98ba' },
  { id: 'vite', name: 'Vite', Icon: SiVite, color: '#8d79e0', colorBack: '#3e3468' },
  { id: 'node', name: 'Node.js', Icon: SiNodedotjs, color: '#517a4b', colorBack: '#385833' },
  { id: 'rest', name: 'REST', Icon: SiPostman, color: '#e87a54', colorBack: '#a85534' },
  { id: 'graphql', name: 'GraphQL', Icon: SiGraphql, color: '#c7228f', colorBack: '#7e1e5b' },
  { id: 'docker', name: 'Docker', Icon: SiDocker, color: '#3f94d3', colorBack: '#295f82' },
  { id: 'ci', name: 'CI/CD', Icon: CICD as IconType, color: '#ea9238', colorBack: '#a76522' },
  { id: 'git', name: 'Git', Icon: SiGit, color: '#d8614c', colorBack: '#863f33' },
  { id: 'n8n', name: 'n8n', Icon: N8n as IconType, color: '#d75c78', colorBack: '#843c4e' },
];

const testing: Skill[] = [
  { id: 'jest', name: 'Jest', Icon: SiJest, color: '#8d4e58', colorBack: '#583238' },
  { id: 'rtl', name: 'RTL', Icon: SiTestinglibrary, color: '#d11b2d', colorBack: '#9f1825' },
  { id: 'playwright', name: 'Playwright', Icon: Playwright as IconType, color: '#3c8dd1', colorBack: '#275783' },
  { id: 'storybook', name: 'Storybook', Icon: SiStorybook, color: '#e75d8c', colorBack: '#a24364' },
  { id: 'figma', name: 'Figma', Icon: SiFigma, color: '#dd8fa9', colorBack: '#ab637d' },
];

const SkillBadge = memo(({ skill, iconSize }: { skill: Skill; iconSize: number }) => {
  const { Icon } = skill;

  return (
    <li
      className="skill-badge opacity-0"
      style={{
        background: skill.colorBack ?? skill.color,
      }}
    >
      <span style={{ background: skill.color }} className="skill-icon">
        {typeof Icon !== 'string' ? (
          <Icon size={iconSize} color="#fff" />
        ) : (
          <img src={Icon} alt="Zustand" width={iconSize} height={iconSize} loading="lazy" />
        )}
      </span>
      <span className="skill-text" style={{ lineHeight: 1 }}>
        {skill.name}
      </span>
    </li>
  );
});

SkillBadge.displayName = 'SkillBadge';

const First = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const horizontal = useMediaQuery({ maxHeight: 600 });
  const iconSize = isMobile || horizontal ? 24 : 40;
  const sectionRef = useRef<HTMLDivElement>(null);
  const frontendRef = useRef<HTMLDivElement>(null);
  const backendRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = [frontendRef, backendRef, componentsRef];

    sections.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          once: true,
          start: 'top bottom-=100',
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      tl.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.1 * i,
        }
      );

      const badges = el.querySelectorAll('.skill-badge');
      tl.fromTo(
        badges,
        { opacity: 0, y: 5 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.07,
          ease: 'power2.out',
        },
        '<0.2'
      );
    });
  }, []);

  return (
    <section className="first-wrapper">
      <AnimatedGears ref={sectionRef} />
      <div className="skills-wrapper">
        <div ref={frontendRef}>
          <div className="skill-list">
            <h2 className="first-title">{t('skills.first.frontend')}</h2>
            <ul>
              {frontend.map(s => (
                <SkillBadge key={s.id} skill={s} iconSize={iconSize} />
              ))}
            </ul>
          </div>
        </div>

        <div ref={backendRef}>
          <div className="skill-list">
            <h2 className="first-title">{t('skills.first.tooling')}</h2>
            <ul>
              {backendAndTools.map(s => (
                <SkillBadge key={s.id} skill={s} iconSize={iconSize} />
              ))}
            </ul>
          </div>
        </div>

        <div ref={componentsRef}>
          <div className="skill-list">
            <h2 className="first-title">{t('skills.first.testing')}</h2>
            <ul>
              {testing.map(s => (
                <SkillBadge key={s.id} skill={s} iconSize={iconSize} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="noise"></div>
    </section>
  );
};

export default First;
