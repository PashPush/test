import { useEffect, useRef, useState } from 'react';
import type { FieldName, FormErrors, FormValues } from './formSchema';
import { DRAFT_KEY, EMPTY_FORM, FIELD_ORDER, sanitizeForm, validate } from './formSchema';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const SUCCESS_HOLD = 4000;
const ERROR_HOLD = 8000;

const readDraft = (): FormValues => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_FORM;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return EMPTY_FORM;

    const draft = parsed as Partial<Record<FieldName, unknown>>;
    return sanitizeForm({
      name: typeof draft.name === 'string' ? draft.name : '',
      email: typeof draft.email === 'string' ? draft.email : '',
      message: typeof draft.message === 'string' ? draft.message : '',
    });
  } catch {
    return EMPTY_FORM;
  }
};

const useContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const statusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [form, setForm] = useState<FormValues>(readDraft);
  const [errors, setErrors] = useState<FormErrors>({});
  const [liveValidation, setLiveValidation] = useState(false);

  useEffect(() => {
    return () => {
      if (statusTimeout.current) clearTimeout(statusTimeout.current);
    };
  }, []);

  useEffect(() => {
    try {
      if (form.name || form.email || form.message) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      else sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable — drafts are optional */
    }
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    const next = { ...form, [name]: e.target.value };
    setForm(next);
    if (liveValidation) setErrors(prev => ({ ...prev, [name]: validate(next)[name] }));
  };

  const dismissToast = () => {
    if (statusTimeout.current) clearTimeout(statusTimeout.current);
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending' || status === 'success') return;

    const honeypot = formRef.current?.querySelector<HTMLInputElement>('[name="website"]');
    if (honeypot?.value) return;

    const values = sanitizeForm(form);
    const nextErrors = validate(values);
    setLiveValidation(true);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find(field => nextErrors[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setForm(values);
    if (statusTimeout.current) clearTimeout(statusTimeout.current);
    setStatus('sending');

    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        values,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      setForm(EMPTY_FORM);
      setErrors({});
      setLiveValidation(false);
      setStatus('success');
      statusTimeout.current = setTimeout(() => setStatus('idle'), SUCCESS_HOLD);
    } catch (error) {
      console.error('EmailJS Error:', error);
      // Values stay put: the message is the expensive part to retype.
      setStatus('error');
      statusTimeout.current = setTimeout(() => setStatus('idle'), ERROR_HOLD);
    }
  };

  return { formRef, status, form, errors, handleChange, handleSubmit, dismissToast };
};

export { useContactForm };
