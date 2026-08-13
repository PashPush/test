import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SiTelegram, SiWhatsapp } from 'react-icons/si';
import { MdMail } from 'react-icons/md';
import ContactForm from '@/features/contact-form/ui/ContactForm';

const Contact = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={sectionRef} className="contacts" id="contacts">
      <div className="title">{t('contact.title')}</div>
      <div className="form-wrapper">
        <div className="form-body">
          <ContactForm />
          <span className="absolute text-base -bottom-2 md:-bottom-3 px-3 py-1 rounded-2xl border-[1px] bg-black/60 border-[#404245] text-white-50">
            {t('contact.prefer')}
          </span>
        </div>
      </div>

      <div className="socials">
        <span className="absolute text-base left-3.5 -top-5 md:-top-7 ">
          <img src="/images/arrow-white.svg" alt="arrow" className="animate-bounce" />
        </span>

        <a
          href="https://t.me/pah0v"
          aria-label="telegram"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#00aaff]"
        >
          <SiTelegram size={44} color="#fff" />
        </a>
        <a
          href={atob('aHR0cHM6Ly93YS5tZS83OTkzNDY5MDc5Mw==')}
          aria-label="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#4ac959]"
        >
          <SiWhatsapp size={44} color="#fff" />
        </a>
        <a
          href="mailto:pahovdev@gmail.com"
          aria-label="email"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#2e2d38]"
        >
          <MdMail size={24} color="#fff" />
        </a>
      </div>
      <div className="flex-center md:pb-4 pb-2">Pavel Khovalkin © {new Date().getFullYear()}</div>
    </div>
  );
};

export default Contact;
