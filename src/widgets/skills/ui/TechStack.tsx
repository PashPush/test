import { useMediaQuery } from '@/shared/lib/useMediaQuery';
import { useRef, memo, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import AnimatedGears from './AnimatedGears';

type Skill = {
  id: string;
  name: string;
  /** Static white icons (public/icons/skills): kept out of the JS bundle and the HTML. */
  icon: string;
  color: string;
  colorBack?: string;
};

const frontend: Skill[] = [
  { id: 'react', name: 'React', icon: '/icons/skills/react.svg', color: '#76d2ea', colorBack: '#589db0' },
  { id: 'typescript', name: 'TypeScript', icon: '/icons/skills/typescript.svg', color: '#4a81b7', colorBack: '#2d4a6c' },
  { id: 'javascript', name: 'JavaScript', icon: '/icons/skills/javascript.svg', color: '#e4d445', colorBack: '#b5a326' },
  { id: 'html', name: 'HTML', icon: '/icons/skills/html.svg', color: '#ca5b3e', colorBack: '#96402a' },
  { id: 'css', name: 'CSS', icon: '/icons/skills/css.svg', color: '#415fcb', colorBack: '#2b3f82' },
  { id: 'react-native', name: 'React Native', icon: '/icons/skills/react.svg', color: '#23b1c3', colorBack: '#1b7480' },
  { id: 'tailwind', name: 'Tailwind', icon: '/icons/skills/tailwind.svg', color: '#51b7e2', colorBack: '#35768c' },
  { id: 'scss', name: 'SCSS', icon: '/icons/skills/scss.svg', color: '#bd7196', colorBack: '#814563' },
  { id: 'gsap', name: 'GSAP', icon: '/icons/skills/gsap.svg', color: '#2dd45c', colorBack: '#34804b' },
  { id: 'redux', name: 'Redux', icon: '/icons/skills/redux.svg', color: '#7757a9', colorBack: '#4d366f' },
  { id: 'mobx', name: 'MobX', icon: '/icons/skills/mobx.svg', color: '#c86835', colorBack: '#7a4628' },
  { id: 'zustand', name: 'Zustand', icon: '/images/zustand.webp', color: '#7e60ad', colorBack: '#513f6d' },
];

const backendAndTools: Skill[] = [
  { id: 'next', name: 'Next.js', icon: '/icons/skills/next.svg', color: '#000000', colorBack: '#3a3a3a' },
  { id: 'webpack', name: 'Webpack', icon: '/icons/skills/webpack.svg', color: '#99d0e9', colorBack: '#5c98ba' },
  { id: 'vite', name: 'Vite', icon: '/icons/skills/vite.svg', color: '#8d79e0', colorBack: '#3e3468' },
  { id: 'node', name: 'Node.js', icon: '/icons/skills/node.svg', color: '#517a4b', colorBack: '#385833' },
  { id: 'rest', name: 'REST', icon: '/icons/skills/rest.svg', color: '#e87a54', colorBack: '#a85534' },
  { id: 'graphql', name: 'GraphQL', icon: '/icons/skills/graphql.svg', color: '#c7228f', colorBack: '#7e1e5b' },
  { id: 'docker', name: 'Docker', icon: '/icons/skills/docker.svg', color: '#3f94d3', colorBack: '#295f82' },
  { id: 'ci', name: 'CI/CD', icon: '/icons/skills/ci.svg', color: '#ea9238', colorBack: '#a76522' },
  { id: 'git', name: 'Git', icon: '/icons/skills/git.svg', color: '#d8614c', colorBack: '#863f33' },
  // { id: 'n8n', name: 'n8n', icon: '/icons/skills/n8n.svg', color: '#d75c78', colorBack: '#843c4e' },
];

const testing: Skill[] = [
  { id: 'jest', name: 'Jest', icon: '/icons/skills/jest.svg', color: '#8d4e58', colorBack: '#583238' },
  { id: 'rtl', name: 'RTL', icon: '/icons/skills/rtl.svg', color: '#d11b2d', colorBack: '#9f1825' },
  { id: 'playwright', name: 'Playwright', icon: '/icons/skills/playwright.svg', color: '#3c8dd1', colorBack: '#275783' },
  { id: 'storybook', name: 'Storybook', icon: '/icons/skills/storybook.svg', color: '#e75d8c', colorBack: '#a24364' },
  { id: 'figma', name: 'Figma', icon: '/icons/skills/figma.svg', color: '#dd8fa9', colorBack: '#ab637d' },
];

const SkillBadge = memo(({ skill, iconSize }: { skill: Skill; iconSize: number }) => {
  return (
    <li
      className="skill-badge opacity-0"
      style={
        {
          '--skill-color': skill.color,
          '--skill-back': skill.colorBack ?? skill.color,
        } as CSSProperties
      }
    >
      {/* Decorative: the name sits right next to it. */}
      <span className="skill-icon" aria-hidden="true">
        <img src={skill.icon} alt="" width={iconSize} height={iconSize} loading="lazy" decoding="async" />
      </span>
      <span className="skill-text" style={{ lineHeight: 1 }}>
        {skill.name}
      </span>
    </li>
  );
});

SkillBadge.displayName = 'SkillBadge';

const TechStack = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const horizontal = useMediaQuery('(max-height: 600px)');
  const iconSize = isMobile || horizontal ? 24 : 40;
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
    <section className="tech-stack-wrapper">
      <AnimatedGears />
      <div className="skills-wrapper">
        <div ref={frontendRef}>
          <div className="skill-list">
            <h2 className="tech-stack-title">{t('skills.techStack.frontend')}</h2>
            <ul>
              {frontend.map(s => (
                <SkillBadge key={s.id} skill={s} iconSize={iconSize} />
              ))}
            </ul>
          </div>
        </div>

        <div ref={backendRef}>
          <div className="skill-list">
            <h2 className="tech-stack-title">{t('skills.techStack.tooling')}</h2>
            <ul>
              {backendAndTools.map(s => (
                <SkillBadge key={s.id} skill={s} iconSize={iconSize} />
              ))}
            </ul>
          </div>
        </div>

        <div ref={componentsRef}>
          <div className="skill-list">
            <h2 className="tech-stack-title">{t('skills.techStack.testing')}</h2>
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

export default TechStack;
