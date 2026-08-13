import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { SiTelegram, SiWhatsapp } from 'react-icons/si';
import { MdMail } from 'react-icons/md';
import { classNames } from '@/shared/lib/classNames';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const Contact = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hideToastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    return () => {
      if (hideToastTimeout.current) clearTimeout(hideToastTimeout.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    const honeypot = formRef.current?.querySelector<HTMLInputElement>('[name="website"]');
    if (honeypot?.value) return;

    if (hideToastTimeout.current) clearTimeout(hideToastTimeout.current);
    setStatus('sending');

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current as HTMLFormElement,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      hideToastTimeout.current = setTimeout(() => {
        setForm({ name: '', email: '', message: '' });
        formRef.current?.reset();
        setStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      hideToastTimeout.current = setTimeout(() => {
        setStatus('idle');
      }, 6000);
    }
  };

  return (
    <div ref={sectionRef} className="contacts" id="contacts">
      <div className="title">{t('contact.title')}</div>
      <div className="form-wrapper">
        <div className="form-body">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            aria-busy={status === 'sending'}
            className="w-full flex flex-col sm:gap-7 gap-4"
          >
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div>
              <label htmlFor="name">{t('contact.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('contact.namePlaceholder')}
                autoComplete="name"
                required
              />
            </div>

            <div id="contact">
              <label htmlFor="email">{t('contact.email')}</label>
              <input
                type="text"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('contact.emailPlaceholder')}
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>

            <div>
              <label htmlFor="message">{t('contact.message')}</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t('contact.messagePlaceholder')}
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="disabled:opacity-70 disabled:cursor-wait transition-opacity duration-300"
            >
              <div className="cta-button group">
                <div className="bg-circle" />
                <p className="text">{status === 'sending' ? t('contact.sending') : t('contact.send')}</p>
                <div className="arrow-wrapper">
                  <img src="/images/mail-login.svg" alt="email" className="animate-pulse" />
                </div>
              </div>
            </button>
          </form>
          <span className="absolute text-base -bottom-2 md:-bottom-3 px-3 py-1 rounded-2xl border-[1px] bg-black/60 border-[#404245] text-white-50">
            {t('contact.prefer')}
          </span>
          <span className="sr-only" role="status">
            {status === 'success' && t('contact.success')}
            {status === 'error' && `${t('contact.error')} Telegram`}
          </span>
          <div
            className={classNames(
              'absolute flex-center rounded-2xl px-4 py-2 bg-[#50a2ff] text-lg transition-all duration-300 ease-in-out opacity-0 invisible bottom-0 z-50',
              {
                'opacity-100': status === 'success',
                'translate-y-5': status === 'success',
                visible: status === 'success',
              }
            )}
          >
            <p>{t('contact.success')}</p>
          </div>
          <div
            className={classNames(
              'absolute flex-center rounded-2xl px-4 py-2 bg-[#e5484d] text-lg transition-all duration-300 ease-in-out opacity-0 invisible bottom-0 z-50',
              {
                'opacity-100': status === 'error',
                'translate-y-5': status === 'error',
                visible: status === 'error',
              }
            )}
          >
            <p>
              {t('contact.error')}{' '}
              <a
                href="https://t.me/pah0v"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 font-semibold"
              >
                Telegram
              </a>
            </p>
          </div>
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
