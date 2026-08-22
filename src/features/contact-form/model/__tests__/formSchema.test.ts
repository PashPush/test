import { describe, it, expect } from 'vitest';
import { LIMITS, sanitizeForm, validate } from '../formSchema';

const chr = (code: number) => String.fromCharCode(code);
const form = (values: Partial<{ name: string; email: string; message: string }>) => ({
  name: '',
  email: '',
  message: '',
  ...values,
});

describe('sanitizeForm', () => {
  it('trims and clamps every field to its limit', () => {
    const result = sanitizeForm(form({ name: `  ${'a'.repeat(150)}  `, email: 'b'.repeat(250) }));

    expect(result.name).toHaveLength(LIMITS.name);
    expect(result.email).toHaveLength(LIMITS.email);
  });

  it('strips control, zero-width and bidi-override characters', () => {
    const nasty = `Jo${chr(0x202e)}hn${chr(0x200b)}${chr(0x0007)}`;

    expect(sanitizeForm(form({ name: nasty })).name).toBe('John');
  });

  it('keeps newlines in the message but drops the other control codes', () => {
    const result = sanitizeForm(form({ message: `line one\r\nline${chr(0x0000)} two` }));

    expect(result.message).toBe('line one\nline two');
  });

  it('collapses runs of blank lines', () => {
    expect(sanitizeForm(form({ message: `a${'\n'.repeat(40)}b` })).message).toBe('a\n\nb');
  });
});

describe('validate', () => {
  it('requires every field', () => {
    expect(validate(form({}))).toEqual({
      name: 'contact.errors.required',
      email: 'contact.errors.required',
      message: 'contact.errors.required',
    });
  });

  it('rejects whitespace-only input', () => {
    expect(validate(form({ name: '   ', email: '  ', message: '   ' })).name).toBe('contact.errors.required');
  });

  it('rejects a message shorter than the minimum', () => {
    expect(validate(form({ message: 'hi' })).message).toBe('contact.errors.messageShort');
  });

  it('rejects a contact too short to reply to', () => {
    expect(validate(form({ email: 'ab' })).email).toBe('contact.errors.contactShort');
  });

  it('accepts a filled-in form', () => {
    expect(validate(form({ name: 'John', email: '@pah0v', message: 'Hello, I have a project' }))).toEqual({});
  });
});
