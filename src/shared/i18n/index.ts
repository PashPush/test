import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locales/ru.json';
import en from './locales/en.json';

const STORAGE_KEY = 'i18nextLng';
const supportedLngs = ['ru', 'en'];

// A saved choice first, then the browser's languages; read before init, which sets 'ru'.
const detect = () => {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // storage unavailable
  }
  const codes = [saved, ...navigator.languages].filter(Boolean).map(code => code!.split('-')[0]);
  return codes.find(code => supportedLngs.includes(code)) ?? 'ru';
};

/** The visitor's language. App switches to it after hydration. */
export const preferredLanguage = typeof window === 'undefined' ? 'ru' : detect();

// Browser only: the same module renders the prerendered HTML at build time.
if (typeof document !== 'undefined') {
  // Registered before init so the initial language is applied too.
  i18n.on('languageChanged', () => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'ru';
    document.title = i18n.t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('meta.description'));
  });
}

// Always Russian at start: that is what the prerendered HTML contains, and hydration has to
// match it. Synchronous, so the build-time render gets translated strings.
i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: 'ru',
  supportedLngs,
  fallbackLng: 'ru',
  load: 'languageOnly',
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
});

// After init, so the forced 'ru' above doesn't overwrite a saved 'en'.
if (typeof window !== 'undefined') {
  i18n.on('languageChanged', lng => {
    try {
      localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // storage unavailable
    }
  });
}

export default i18n;
