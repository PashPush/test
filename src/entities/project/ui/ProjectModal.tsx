import { useEffect, useRef, useCallback, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import type { ProjectData } from '../model/types';

interface ProjectModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 100;

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current !== null && (scrollRef.current?.scrollTop ?? 1) <= 0) {
        const diff = e.changedTouches[0].clientY - touchStartY.current;
        if (diff > SWIPE_THRESHOLD) {
          onClose();
        }
      }
      touchStartY.current = null;
    },
    [onClose]
  );

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('no-scroll');
      document.addEventListener('keydown', handleEscape);
      contentRef.current?.focus();
    } else {
      setTimeout(() => {
        document.documentElement.classList.remove('no-scroll');
      }, 250);
    }

    return () => {
      document.documentElement.classList.remove('no-scroll');
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

        <div
          ref={scrollRef}
          className="project-modal-scroll"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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
              <h3>{t('modal.description')}</h3>
              <p>{project.description}</p>
            </section>

            <section className="project-modal-section">
              <h3>{t('modal.role')}</h3>
              <p>{project.role}</p>
            </section>

            <section className="project-modal-section">
              <h3>{t('modal.screenshots')}</h3>
              <div className="project-modal-screenshots">
                {project.screenshots.map((src, index) => (
                  <Fragment key={index}>
                    <p>{t(`projects.${project.id}.screenshots.${index}`)}</p>
                    <div className="project-modal-screenshot">
                      <img src={src} alt={`${project.name} screenshot ${index + 1}`} />
                    </div>
                  </Fragment>
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
