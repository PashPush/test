import { useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { ProjectModal, projectsData, type ProjectData } from '@/entities/project';

const Projects = () => {
  const { t } = useTranslation();
  const project1Ref = useRef(null);
  const project2Ref = useRef(null);
  const project3Ref = useRef(null);

  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transitioningId, setTransitioningId] = useState<string | null>(null);

  const getTransitionStyles = (projectId: string, type: 'image' | 'title') => {
    if (isModalOpen) {
      return { viewTransitionName: undefined } as const;
    }

    if (transitioningId !== null && transitioningId !== projectId) {
      return { viewTransitionName: undefined } as const;
    }

    return { viewTransitionName: `project-${type}-${projectId}` } as const;
  };

  const openModal = useCallback(
    (projectId: string) => {
      const project = projectsData.find(p => p.id === projectId);
      if (!project) return;

      const projectData: ProjectData = {
        ...project,
        name: t(`projects.${project.id}.name`),
        stack: t(`projects.${project.id}.stack`),
        description: t(`projects.${project.id}.description`),
        role: t(`projects.${project.id}.role`),
      };

      if (document.startViewTransition) {
        flushSync(() => {
          setTransitioningId(projectId);
        });

        const transition = document.startViewTransition(() => {
          flushSync(() => {
            setSelectedProject(projectData);
            setIsModalOpen(true);
          });
        });

        transition.finished.finally(() => {
          setTransitioningId(null);
        });
      } else {
        setSelectedProject(projectData);
        setIsModalOpen(true);
      }
    },
    [t]
  );

  const closeModal = useCallback(() => {
    const currentProjectId = selectedProject?.id;

    if (document.startViewTransition && currentProjectId) {
      flushSync(() => {
        setTransitioningId(currentProjectId);
      });

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        });
      });

      transition.finished.finally(() => {
        setTransitioningId(null);
      });
    } else {
      setIsModalOpen(false);
      setSelectedProject(null);
    }
  }, [selectedProject?.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, projectId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(projectId);
      }
    },
    [openModal]
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
            <div
              ref={project1Ref}
              className="first-project-wrapper project-card-clickable"
              onClick={() => openModal('pt')}
              onKeyDown={e => handleKeyDown(e, 'pt')}
              role="button"
              tabIndex={0}
              aria-label={t('projects.pt.name')}
            >
              <div className="image-wrapper bg-[#168be8]" style={getTransitionStyles('pt', 'image')}>
                <img src="/images/project-pt.webp" alt="Power Thesaurus" loading="lazy" />
              </div>
              <div className="text-content">
                <h2 style={getTransitionStyles('pt', 'title')}>{t('projects.pt.name')}</h2>
                <p className="text-white-50 md:text-xl">{t('projects.pt.stack')}</p>
              </div>
            </div>

            <div className="project-list-wrapper overflow-hidden">
              <div
                className="project project-card-clickable"
                ref={project2Ref}
                onClick={() => openModal('index')}
                onKeyDown={e => handleKeyDown(e, 'index')}
                role="button"
                tabIndex={0}
                aria-label={t('projects.index.name')}
              >
                <div className="image-wrapper project-index" style={getTransitionStyles('index', 'image')}>
                  <img src="/images/project-index1.webp" alt="Index Marketing" loading="lazy" />
                </div>
                <h2 style={getTransitionStyles('index', 'title')}>{t('projects.index.name')}</h2>
              </div>

              <div
                className="project project-card-clickable"
                ref={project3Ref}
                onClick={() => openModal('sagama')}
                onKeyDown={e => handleKeyDown(e, 'sagama')}
                role="button"
                tabIndex={0}
                aria-label={t('projects.sagama.name')}
              >
                <div className="image-wrapper project-sagama" style={getTransitionStyles('sagama', 'image')}>
                  <img src="/images/project-sagama1.webp" alt="Sagama" loading="lazy" />
                </div>
                <h2 style={getTransitionStyles('sagama', 'title')}>{t('projects.sagama.name')}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Projects;
