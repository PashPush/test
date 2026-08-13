import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { navLinks } from '@/shared/config/navLinks';
import { classNames } from '@/shared/lib/classNames';
import LanguageSwitcher from '@/features/language-switch/ui/LanguageSwitcher';
import MobileMenu from '@/features/mobile-menu/ui/MobileMenu';
import { useAB } from '@/features/ab-testing';

const navLinkMap = Object.fromEntries(navLinks.map(link => [link.key, link]));

const NavBar = () => {
  const { t } = useTranslation();
  const { sectionOrder } = useAB();
  const [currentLink, setCurrentLink] = useState('#hero');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const orderedNavLinks = useMemo(
    () => sectionOrder.map(key => navLinkMap[key]).filter(Boolean),
    [sectionOrder],
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = orderedNavLinks.map(({ link }) => document.querySelector(link));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visibleSection = entries.find(entry => entry.isIntersecting);
        if (visibleSection) {
          setCurrentLink(`#${visibleSection.target.id}`);
        }
      },
      {
        threshold: 0.2,
      }
    );

    sections.forEach(section => section && observer.observe(section));

    return () => observer.disconnect();
  }, [orderedNavLinks]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lettersClass = classNames('', {
    'text-cyan-200': currentLink === '#projects',
    'text-green-200': currentLink === '#experience',
    'text-violet-200': currentLink === '#approach',
    'text-orange-200': currentLink === '#reviews',
    'text-teal-200': currentLink === '#skills',
    'text-blue-300': currentLink === '#contacts',
  });

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
        <div className="inner">
          <a href="#" onClick={scrollToTop} className="logo">
            <span className={lettersClass}>Pa</span>vel K<span className={lettersClass}>hov</span>alkin
          </a>

          <nav className="desktop">
            <ul>
              {orderedNavLinks.map(({ link, key }) => (
                <li key={key} className="group">
                  <a href={link}>
                    <span>{t(`nav.${key}`)}</span>
                    <span className={classNames('underline', { active: link === currentLink })} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSwitcher />

          <a href="#contacts" className="contact-btn group hidden md:flex">
            <div className={classNames('inner', { active: currentLink === '#contacts' })}>
              <span>{t('nav.contactBtn')}</span>
            </div>
          </a>

          <button
            className={classNames('hamburger md:hidden', { active: menuOpen })}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} currentLink={currentLink} navLinks={orderedNavLinks} />
    </>
  );
};

export default NavBar;
