import { useRef, useState, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { ProjectModal, projectsData, type ProjectData, type ProjectResult } from '@/entities/project';
import { trackEvent } from '@/shared/lib/analytics';

const caseHash = (slug: string) => `#case/${slug}`;
const idFromHash = () => projectsData.find(p => location.hash === caseHash(p.slug))?.id ?? null;

type CaseLink = { id: string; slug: string };
const [ptCase, indexCase, sagamaCase] = projectsData;

const Projects = () => {
  const { t } = useTranslation();
  const project1Ref = useRef(null);
  const project2Ref = useRef(null);
  const project3Ref = useRef(null);
  const leavingRef = useRef(false);

  const [openId, setOpenId] = useState<string | null>(idFromHash);
  const [transitioningId, setTransitioningId] = useState<string | null>(null);

  const getTransitionStyles = (projectId: string, type: 'image' | 'title') => {
    if (openId !== null) {
      return { viewTransitionName: undefined } as const;
    }

    if (transitioningId !== null && transitioningId !== projectId) {
      return { viewTransitionName: undefined } as const;
    }

    return { viewTransitionName: `project-${type}-${projectId}` } as const;
  };

  const list = <T,>(key: string): T[] => {
    const value = t(key, { returnObjects: true }) as unknown;
    return Array.isArray(value) ? (value as T[]) : [];
  };

  const buildProject = (projectId: string): ProjectData | null => {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return null;
    const key = `projects.${project.id}`;

    return {
      ...project,
      name: t(`${key}.name`),
      aboutTitle: t(`${key}.aboutTitle`),
      description: t(`${key}.description`),
      role: t(`${key}.role`),
      done: list<string>(`${key}.done`),
      results: list<ProjectResult>(`${key}.results`),
      stack: t(`${key}.stack`),
    };
  };

  const switchTo = useCallback(
    (nextId: string | null) => {
      const morphId = nextId ?? openId;

      if (!document.startViewTransition || !morphId) {
        setOpenId(nextId);
        return;
      }

      flushSync(() => {
        setTransitioningId(morphId);
      });

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setOpenId(nextId);
        });
      });

      transition.finished.finally(() => {
        setTransitioningId(null);
      });
    },
    [openId]
  );

  useEffect(() => {
    const id = idFromHash();
    if (id) trackEvent('case_open', { project: id, via: 'link' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      leavingRef.current = false;
      const id = idFromHash();
      if (!id) history.scrollRestoration = 'auto';
      if (id !== openId) switchTo(id);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [openId, switchTo]);

  const openCase = (e: React.MouseEvent | React.KeyboardEvent, { id, slug }: CaseLink) => {
    if ('button' in e && (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
    e.preventDefault();
    history.scrollRestoration = 'manual';
    history.pushState({ case: id }, '', caseHash(slug));
    trackEvent('case_open', { project: id, via: 'card' });
    switchTo(id);
  };

  const closeCase = useCallback(() => {
    if (!idFromHash()) return;

    if (history.state?.case) {
      if (leavingRef.current) return;
      leavingRef.current = true;
      history.back();
      return;
    }

    history.replaceState(null, '', location.pathname + location.search);
    switchTo(null);
  }, [switchTo]);

  const cardProps = (project: CaseLink) => ({
    href: caseHash(project.slug),
    onClick: (e: React.MouseEvent) => openCase(e, project),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === ' ') openCase(e, project);
    },
  });

  const cardText = (projectId: string) => (
    <div className="project-text">
      <h2 style={getTransitionStyles(projectId, 'title')}>{t(`projects.${projectId}.name`)}</h2>
      <p className="project-summary">{t(`projects.${projectId}.summary`)}</p>
      <p className="project-stack">{t(`projects.${projectId}.stackShort`)}</p>
      <span className="project-cta">
        {t('projects.readCase')} <span aria-hidden="true">→</span>
      </span>
    </div>
  );

  useGSAP(() => {
    const cards = [project1Ref.current, project2Ref.current, project3Ref.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.2 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=50',
          },
        }
      );
    });
  }, []);

  return (
    <>
      <div id="projects" className="app-projects">
        <div className="w-full">
          <div className="projects-layout">
            <a ref={project1Ref} className="first-project-wrapper project-card-clickable" {...cardProps(ptCase)}>
              <div className="image-wrapper bg-[#168be8]" style={getTransitionStyles('pt', 'image')}>
                <img src="/images/project-pt.webp" alt="" loading="lazy" decoding="async" width={1400} height={992} />
              </div>
              {cardText('pt')}
            </a>

            <div className="project-list-wrapper overflow-hidden">
              <a className="project project-card-clickable" ref={project2Ref} {...cardProps(indexCase)}>
                <div className="image-wrapper project-index" style={getTransitionStyles('index', 'image')}>
                  <img
                    src="/images/project-index1.webp"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={799}
                    height={500}
                  />
                </div>
                {cardText('index')}
              </a>

              <a className="project project-card-clickable" ref={project3Ref} {...cardProps(sagamaCase)}>
                <div className="image-wrapper project-sagama" style={getTransitionStyles('sagama', 'image')}>
                  <img
                    src="/images/project-sagama1.webp"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={799}
                    height={500}
                  />
                </div>
                {cardText('sagama')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal project={openId ? buildProject(openId) : null} isOpen={openId !== null} onClose={closeCase} />
    </>
  );
};

export default Projects;
