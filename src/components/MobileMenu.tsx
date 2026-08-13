import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { classNames } from '@/shared/lib/classNames';
import { useMediaQuery } from 'react-responsive';

interface NavLink {
  key: string;
  link: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentLink: string;
  navLinks: NavLink[];
}

const MobileMenu = ({ isOpen, onClose, currentLink, navLinks }: MobileMenuProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.documentElement.classList.add('no-scroll');
    } else {
      onClose();
      document.documentElement.classList.remove('no-scroll');
    }
    return () => document.documentElement.classList.remove('no-scroll');
  }, [isOpen, onClose, isMobile]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      onClose();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!isMobile) return null;

  return (
    <>
      <div className={classNames('mobile-menu-backdrop', { open: isOpen })} onClick={onClose} />

      <div
        className={classNames('mobile-menu', { open: isOpen })}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <nav className="mobile-menu-nav">
          <ul>
            {navLinks.map(({ link, key }) => (
              <li key={key}>
                <a href={link} onClick={handleLinkClick} className={classNames('', { active: link === currentLink })}>
                  <span>{t(`nav.${key}`)}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contact"
          className={classNames('mobile-menu-contact', { active: currentLink === '#contact' })}
          onClick={handleLinkClick}
        >
          {t('nav.contactBtn')}
        </a>
      </div>
    </>
  );
};

export default MobileMenu;
