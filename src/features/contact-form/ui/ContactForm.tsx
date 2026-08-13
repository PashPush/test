import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames';
import { useContactForm } from '../model/useContactForm';

// Toasts and the live region are siblings of <form>, never children: index.css
// styles every `form a` as a full-width white button, which would repaint the
// Telegram fallback link inside the error toast.
const ContactForm = () => {
  const { t } = useTranslation();
  const { formRef, status, form, handleChange, handleSubmit } = useContactForm();

  return (
    <>
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

        <div>
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
    </>
  );
};

export default ContactForm;
