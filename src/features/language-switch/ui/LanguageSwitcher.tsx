import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

const languages = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    timeoutRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentLang = i18n.resolvedLanguage;
  const alternateLang = languages.find(l => l.code !== currentLang) || languages[1];

  return (
    <div className="lang-switcher">
      {isMobile ? (
        <button onClick={() => handleChange(alternateLang.code)} className="!text-white !text-base">
          {alternateLang.label}
        </button>
      ) : (
        languages.map(({ code, label }) => (
          <button key={code} onClick={() => handleChange(code)} className={currentLang === code ? 'active' : ''}>
            {label}
          </button>
        ))
      )}
    </div>
  );
};

export default LanguageSwitcher;
