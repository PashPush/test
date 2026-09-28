import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { classNames } from '@/shared/lib/classNames';

const languages = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      {/* Both variants are rendered and CSS picks one: the prerendered HTML can't know the width. */}
      <button onClick={() => handleChange(alternateLang.code)} className="md:hidden !text-white !text-base">
        {alternateLang.label}
      </button>
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          className={classNames('hidden md:inline-block', { active: currentLang === code })}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
