import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export interface ProjectData {
  id: string;
  name: string;
  stack: string;
  description: string;
  role: string;
  screenshots: string[];
  color: string;
  mainImage: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      contentRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen || !project) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="project-modal-overlay"
      style={{ viewTransitionName: 'modal-overlay' }}
      onClick={e => {
        if (e.target === modalRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        className="project-modal-content"
        tabIndex={-1}
        style={{ viewTransitionName: `project-modal-${project.id}` }}
      >
        <button
          className="project-modal-close"
          onClick={onClose}
          aria-label={t('modal.close', 'Close')}
          style={{ viewTransitionName: 'modal-close-button' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="project-modal-scroll">
          <div
            className="project-modal-hero"
            style={{
              background: project.color,
              viewTransitionName: `project-image-${project.id}`,
            }}
          >
            <img src={project.mainImage} alt={project.name} />
          </div>

          <div className="project-modal-body">
            <h2 id="modal-title" style={{ viewTransitionName: `project-title-${project.id}` }}>
              {project.name}
            </h2>

            <p className="project-modal-stack">{project.stack}</p>

            <section className="project-modal-section">
              <h3>{t('modal.description', 'About the project')}</h3>
              <p>{project.description}</p>
            </section>

            <section className="project-modal-section">
              <h3>{t('modal.role', 'My role')}</h3>
              <p>{project.role}</p>
            </section>

            <section className="project-modal-section">
              <h3>{t('modal.screenshots', 'Screenshots')}</h3>
              <div className="project-modal-screenshots">
                {project.screenshots.map((src, index) => (
                  <div key={index} className="project-modal-screenshot">
                    <img src={src} alt={`${project.name} screenshot ${index + 1}`} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
