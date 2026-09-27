import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SiTelegram, SiWhatsapp } from 'react-icons/si';
import { MdMail } from 'react-icons/md';
import ContactForm from '@/features/contact-form/ui/ContactForm';
import { trackEvent } from '@/shared/lib/analytics';
import { useCvLink } from '@/shared/lib/useCvLink';
import { SITE_REPO_URL } from '@/shared/config/siteRepo';

type Channel = 'telegram' | 'whatsapp' | 'email';

const channels: Record<Channel, { href: string; bg: string; icon: ReactNode }> = {
  telegram: { href: 'https://t.me/pah0v', bg: 'bg-[#00aaff]', icon: <SiTelegram size={44} color="#fff" /> },
  whatsapp: {
    href: atob('aHR0cHM6Ly93YS5tZS83OTkzNDY5MDc5Mw=='),
    bg: 'bg-[#4ac959]',
    icon: <SiWhatsapp size={44} color="#fff" />,
  },
  email: { href: 'mailto:pahovdev@gmail.com', bg: 'bg-[#2e2d38]', icon: <MdMail size={24} color="#fff" /> },
};

// Recruiters abroad reach for email before WhatsApp, so in English it sits next to Telegram.
const channelOrder: Record<'ru' | 'en', Channel[]> = {
  ru: ['telegram', 'whatsapp', 'email'],
  en: ['telegram', 'email', 'whatsapp'],
};

const Contact = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cvLink = useCvLink('contacts');
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'ru';

  return (
    <div ref={sectionRef} className="contacts" id="contacts">
      <div className="contacts-head">
        <div className="title">{t('contact.title')}</div>
        {/* Wraps only between the parts, never inside one. */}
        <p className="contacts-status">
          {t('hero.status')
            .split(' · ')
            .map((part, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                <span className="whitespace-nowrap">{part}</span>
              </span>
            ))}
        </p>
      </div>
      <div className="form-wrapper">
        <div className="form-body">
          <ContactForm />
          <span className="absolute sm:text-base text-sm -bottom-2 md:-bottom-3 px-3 py-1 rounded-2xl border-[1px] bg-black/60 border-[#404245] text-white-50">
            {t('contact.prefer')}
          </span>
        </div>
      </div>

      <div className="socials">
        <span className="absolute text-base left-3.5 -top-5 md:-top-7 ">
          <img src="/images/arrow-white.svg" alt="arrow" className="animate-bounce" />
        </span>

        {channelOrder[lang].map(channel => (
          <a
            key={channel}
            href={channels[channel].href}
            aria-label={channel}
            onClick={() => trackEvent('contact_click', { channel })}
            target="_blank"
            rel="noopener noreferrer"
            className={channels[channel].bg}
          >
            {channels[channel].icon}
          </a>
        ))}
      </div>

      <a {...cvLink} className="contacts-cv">
        <span>
          {t('cv.download')} <span aria-hidden="true">↓</span>
        </span>
        <span className="contacts-cv-meta">{t('cv.updated')}</span>
      </a>
      <footer className="contacts-footer">
        <span>Pavel Khovalkin © {new Date().getFullYear()}</span>
        {SITE_REPO_URL && (
          <a
            href={SITE_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('contact_click', { channel: 'github' })}
          >
            {t('contact.source')}
          </a>
        )}
      </footer>
    </div>
  );
};

export default Contact;
