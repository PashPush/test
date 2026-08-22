export const DRAFT_KEY = 'contact-form-draft';

export const LIMITS = { name: 100, email: 200, message: 2000 } as const;
export const MESSAGE_MIN = 10;

export type FormValues = { name: string; email: string; message: string };
export type FieldName = keyof FormValues;
export type FormErrors = Partial<Record<FieldName, string>>;

export const FIELD_ORDER: FieldName[] = ['name', 'email', 'message'];
export const EMPTY_FORM: FormValues = { name: '', email: '', message: '' };

const LF = 0x0a;

const isInvisible = (code: number) =>
  code <= 0x1f ||
  (code >= 0x7f && code <= 0x9f) ||
  (code >= 0x200b && code <= 0x200f) ||
  (code >= 0x202a && code <= 0x202e) ||
  (code >= 0x2060 && code <= 0x2064) ||
  code === 0xfeff;

const strip = (value: string, keepNewlines = false) =>
  [...value]
    .filter(char => {
      const code = char.codePointAt(0) as number;
      return (keepNewlines && code === LF) || !isInvisible(code);
    })
    .join('');

export const sanitizeForm = (values: FormValues): FormValues => ({
  name: strip(values.name).trim().slice(0, LIMITS.name),
  email: strip(values.email).trim().slice(0, LIMITS.email),
  message: strip(values.message, true)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, LIMITS.message),
});

export const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};
  const email = values.email.trim();
  const message = values.message.trim();

  if (!values.name.trim()) errors.name = 'contact.errors.required';

  if (!email) errors.email = 'contact.errors.required';
  else if (email.length < 3) errors.email = 'contact.errors.contactShort';

  if (!message) errors.message = 'contact.errors.required';
  else if (message.length < MESSAGE_MIN) errors.message = 'contact.errors.messageShort';

  return errors;
};
