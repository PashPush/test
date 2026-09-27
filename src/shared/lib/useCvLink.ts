import { useTranslation } from 'react-i18next';
import { trackEvent, type CvPlace } from './analytics';

/** Props for an `<a>` that downloads the CV in the current site language. */
export const useCvLink = (place: CvPlace) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'ru';
  const file = `Pavel_Khovalkin_Frontend_CV_${lang.toUpperCase()}.pdf`;

  return {
    href: `/cv/${file}`,
    download: file,
    title: t('cv.updated'),
    onClick: () => trackEvent('cv_download', { lang, place }),
  };
};
