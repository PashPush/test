import { useEffect, useRef, useState } from 'react';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const useContactForm = () => {
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
      const { default: emailjs } = await import('@emailjs/browser');
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

  return { formRef, status, form, handleChange, handleSubmit };
};

export { useContactForm };
