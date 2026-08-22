import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames';
import { LIMITS, MESSAGE_MIN } from '../model/formSchema';
import { useContactForm } from '../model/useContactForm';

const TOAST_BASE =
  'absolute flex-center gap-3 rounded-2xl px-4 py-2 text-lg transition-all duration-300 ease-in-out opacity-0 invisible bottom-0 z-50';

const ContactForm = () => {
  const { t } = useTranslation();
  const { formRef, status, form, errors, handleChange, handleSubmit, dismissToast } = useContactForm();

  const isSending = status === 'sending';
  const isLocked = isSending || status === 'success';
  const buttonLabel = {
    idle: t('contact.send'),
    sending: t('contact.sending'),
    success: t('contact.sent'),
    error: t('contact.retry'),
  }[status];

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSending}
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
            spellCheck={false}
            maxLength={LIMITS.name}
            readOnly={isSending}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          {errors.name && (
            <p id="name-error" className="form-error">
              {t(errors.name)}
            </p>
          )}
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
            spellCheck={false}
            autoCapitalize="none"
            maxLength={LIMITS.email}
            readOnly={isSending}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />
          {errors.email && (
            <p id="email-error" className="form-error">
              {t(errors.email)}
            </p>
          )}
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
            maxLength={LIMITS.message}
            readOnly={isSending}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            required
          />
          {errors.message && (
            <p id="message-error" className="form-error">
              {t(errors.message, { min: MESSAGE_MIN })}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLocked}
          className={classNames('disabled:opacity-70 transition-opacity duration-300', {
            'disabled:cursor-wait': isSending,
            'disabled:cursor-default': status === 'success',
          })}
        >
          <div className="cta-button group">
            <div className="bg-circle" />
            <p className="text">{buttonLabel}</p>
            <div className="arrow-wrapper">
              <img src="/images/mail-login.svg" alt="email" className={isSending ? 'animate-pulse' : undefined} />
            </div>
          </div>
        </button>
      </form>
      <span className="sr-only" role="status">
        {status === 'success' && t('contact.success')}
        {status === 'error' && `${t('contact.error')} Telegram`}
      </span>
      <div
        className={classNames(`${TOAST_BASE} bg-[#50a2ff]`, {
          'opacity-100': status === 'success',
          'translate-y-5': status === 'success',
          visible: status === 'success',
        })}
      >
        <p>{t('contact.success')}</p>
      </div>
      <div
        className={classNames(`${TOAST_BASE} bg-[#e5484d]`, {
          'opacity-100': status === 'error',
          'translate-y-5': status === 'error',
          visible: status === 'error',
        })}
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
        <button
          type="button"
          onClick={dismissToast}
          aria-label={t('contact.dismiss')}
          tabIndex={status === 'error' ? 0 : -1}
          className="shrink-0 leading-none opacity-80 hover:opacity-100 transition-opacity"
        >
          &times;
        </button>
      </div>
    </>
  );
};

export default ContactForm;
