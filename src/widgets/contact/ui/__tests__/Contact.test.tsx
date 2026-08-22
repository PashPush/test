import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../Contact';

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

import emailjs from '@emailjs/browser';

const VALID = {
  name: 'John',
  email: 'john@test.com',
  message: 'Hello there, I have a project for you',
};

const fillForm = async (user: ReturnType<typeof userEvent.setup>, values = VALID) => {
  await user.type(screen.getByLabelText('contact.name'), values.name);
  await user.type(screen.getByLabelText('contact.email'), values.email);
  await user.type(screen.getByLabelText('contact.message'), values.message);
};

const submitForm = () => {
  fireEvent.submit(screen.getByLabelText('contact.name').closest('form') as HTMLFormElement);
};

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders all form fields', () => {
      render(<Contact />);

      expect(screen.getByLabelText('contact.name')).toBeInTheDocument();
      expect(screen.getByLabelText('contact.email')).toBeInTheDocument();
      expect(screen.getByLabelText('contact.message')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<Contact />);
      expect(screen.getByRole('button', { name: /contact.send/i })).toBeInTheDocument();
    });

    it('caps the length of every field', () => {
      render(<Contact />);

      expect(screen.getByLabelText('contact.name')).toHaveAttribute('maxLength', '100');
      expect(screen.getByLabelText('contact.email')).toHaveAttribute('maxLength', '200');
      expect(screen.getByLabelText('contact.message')).toHaveAttribute('maxLength', '2000');
    });

    it('renders social links with correct hrefs', () => {
      render(<Contact />);

      const telegramLink = screen.getByLabelText('telegram');
      const whatsappLink = screen.getByLabelText('whatsapp');
      const emailLink = screen.getByLabelText('email');

      expect(telegramLink).toHaveAttribute('href', 'https://t.me/pah0v');
      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/79934690793');
      expect(emailLink).toHaveAttribute('href', 'mailto:pahovdev@gmail.com');
    });

    it('renders copyright with current year', () => {
      render(<Contact />);
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
    });
  });

  describe('form input handling', () => {
    it('updates name field on input', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const nameInput = screen.getByLabelText('contact.name');
      await user.type(nameInput, 'John Doe');

      expect(nameInput).toHaveValue('John Doe');
    });

    it('updates email field on input', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const emailInput = screen.getByLabelText('contact.email');
      await user.type(emailInput, 'john@example.com');

      expect(emailInput).toHaveValue('john@example.com');
    });

    it('updates message field on input', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const messageInput = screen.getByLabelText('contact.message');
      await user.type(messageInput, 'Hello there');

      expect(messageInput).toHaveValue('Hello there');
    });

    it('truncates typing at the field limit', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      const nameInput = screen.getByLabelText('contact.name');
      await user.type(nameInput, 'a'.repeat(120));

      expect(nameInput).toHaveValue('a'.repeat(100));
    });
  });

  describe('validation', () => {
    it('blocks submission and shows an error per empty field', () => {
      render(<Contact />);
      submitForm();

      expect(emailjs.send).not.toHaveBeenCalled();
      expect(screen.getAllByText('contact.errors.required')).toHaveLength(3);
    });

    it('marks invalid fields with aria-invalid and describes them', () => {
      render(<Contact />);
      submitForm();

      const nameInput = screen.getByLabelText('contact.name');
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAccessibleDescription('contact.errors.required');
    });

    it('focuses the first invalid field', () => {
      render(<Contact />);
      submitForm();

      expect(screen.getByLabelText('contact.name')).toHaveFocus();
    });

    it('rejects a message that is too short', () => {
      render(<Contact />);

      fireEvent.change(screen.getByLabelText('contact.name'), { target: { value: VALID.name } });
      fireEvent.change(screen.getByLabelText('contact.email'), { target: { value: VALID.email } });
      fireEvent.change(screen.getByLabelText('contact.message'), { target: { value: 'hi' } });
      submitForm();

      expect(emailjs.send).not.toHaveBeenCalled();
      expect(screen.getByText('contact.errors.messageShort')).toBeInTheDocument();
      expect(screen.getByLabelText('contact.message')).toHaveFocus();
    });

    it('clears a field error as soon as the user fixes it', async () => {
      const user = userEvent.setup();
      render(<Contact />);
      submitForm();

      expect(screen.getByLabelText('contact.name')).toHaveAttribute('aria-invalid', 'true');

      await user.type(screen.getByLabelText('contact.name'), 'John');

      expect(screen.getByLabelText('contact.name')).toHaveAttribute('aria-invalid', 'false');
    });

    it('does not show errors before the first submit', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      await user.type(screen.getByLabelText('contact.name'), 'J');
      await user.clear(screen.getByLabelText('contact.name'));

      expect(screen.queryByText('contact.errors.required')).not.toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('sends the sanitized values', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);
      await fillForm(user, { ...VALID, name: '  John  ' });
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      expect(vi.mocked(emailjs.send).mock.calls[0][2]).toEqual({
        name: 'John',
        email: VALID.email,
        message: VALID.message,
      });
    });

    it('shows loading text and locks the fields during submission', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.send).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ status: 200, text: 'OK' }), 100))
      );

      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      expect(screen.getByText('contact.sending')).toBeInTheDocument();
      expect(screen.getByLabelText('contact.name')).toHaveAttribute('readonly');
      expect(screen.getByLabelText('contact.message')).toHaveAttribute('readonly');
    });

    it('shows success message after successful submission', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        const successToast = screen
          .getAllByText('contact.success')
          .find(el => el.tagName === 'P')
          ?.closest('div');
        expect(successToast?.className).toContain('opacity-100');
      });
    });

    it('announces submission result in the live region', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('contact.success');
      });
    });

    it('clears the fields as soon as the send succeeds', async () => {
      vi.useFakeTimers();
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);

      const nameInput = screen.getByLabelText('contact.name');
      fireEvent.change(nameInput, { target: { value: VALID.name } });
      fireEvent.change(screen.getByLabelText('contact.email'), { target: { value: VALID.email } });
      fireEvent.change(screen.getByLabelText('contact.message'), { target: { value: VALID.message } });
      submitForm();

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByRole('status')).toHaveTextContent('contact.success');
      expect(nameInput).toHaveValue('');
      expect(screen.getByLabelText('contact.message')).toHaveValue('');
    });

    it('keeps the button locked through the success hold, then restores it', async () => {
      vi.useFakeTimers();
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);

      fireEvent.change(screen.getByLabelText('contact.name'), { target: { value: VALID.name } });
      fireEvent.change(screen.getByLabelText('contact.email'), { target: { value: VALID.email } });
      fireEvent.change(screen.getByLabelText('contact.message'), { target: { value: VALID.message } });
      submitForm();

      await act(async () => {
        await Promise.resolve();
      });
      expect(screen.getByRole('button', { name: /contact.sent/i })).toBeDisabled();

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.getByText('contact.send').closest('button')).toBeEnabled();
    });

    it('ignores a repeat submit while the success state holds', async () => {
      vi.useFakeTimers();
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);

      fireEvent.change(screen.getByLabelText('contact.name'), { target: { value: VALID.name } });
      fireEvent.change(screen.getByLabelText('contact.email'), { target: { value: VALID.email } });
      fireEvent.change(screen.getByLabelText('contact.message'), { target: { value: VALID.message } });
      submitForm();

      await act(async () => {
        await Promise.resolve();
      });
      submitForm();

      expect(emailjs.send).toHaveBeenCalledTimes(1);
    });

    it('shows error toast with Telegram fallback link on failure', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(emailjs.send).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('contact.error');
      });

      const errorToast = screen.getByText('contact.error').closest('div');
      expect(errorToast?.className).toContain('opacity-100');
      expect(screen.getByRole('link', { name: 'Telegram' })).toHaveAttribute('href', 'https://t.me/pah0v');
    });

    it('keeps the values and offers a retry after a failure', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(emailjs.send).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      const retryButton = await screen.findByRole('button', { name: /contact.retry/i });
      expect(retryButton).toBeEnabled();
      expect(screen.getByLabelText('contact.message')).toHaveValue(VALID.message);
    });

    it('hides the error toast on dismiss', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(emailjs.send).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await screen.findByRole('button', { name: 'contact.dismiss' });
      await user.click(screen.getByRole('button', { name: 'contact.dismiss' }));

      const errorToast = screen.getByText('contact.error').closest('div');
      expect(errorToast?.className).not.toContain('opacity-100');
    });

    it('hides error toast after timeout', async () => {
      vi.useFakeTimers();
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(emailjs.send).mockRejectedValue(new Error('Network error'));

      render(<Contact />);

      const nameInput = screen.getByLabelText('contact.name');
      fireEvent.change(nameInput, { target: { value: VALID.name } });
      fireEvent.change(screen.getByLabelText('contact.email'), { target: { value: VALID.email } });
      fireEvent.change(screen.getByLabelText('contact.message'), { target: { value: VALID.message } });
      submitForm();

      await act(async () => {
        await Promise.resolve();
      });
      expect(screen.getByRole('status')).toHaveTextContent('contact.error');

      act(() => {
        vi.advanceTimersByTime(8000);
      });
      const errorToast = screen.getByText('contact.error').closest('div');
      expect(errorToast?.className).not.toContain('opacity-100');
      expect(nameInput).toHaveValue(VALID.name);
    });

    it('logs error on submission failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(emailjs.send).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('EmailJS Error:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('draft persistence', () => {
    it('stores what the user typed in sessionStorage', async () => {
      const user = userEvent.setup();
      render(<Contact />);

      await user.type(screen.getByLabelText('contact.name'), 'John');

      await waitFor(() => {
        expect(JSON.parse(sessionStorage.getItem('contact-form-draft') as string)).toMatchObject({ name: 'John' });
      });
    });

    it('restores the draft on mount', () => {
      sessionStorage.setItem('contact-form-draft', JSON.stringify(VALID));
      render(<Contact />);

      expect(screen.getByLabelText('contact.name')).toHaveValue(VALID.name);
      expect(screen.getByLabelText('contact.message')).toHaveValue(VALID.message);
    });

    it('ignores a corrupted draft', () => {
      sessionStorage.setItem('contact-form-draft', 'not json');
      render(<Contact />);

      expect(screen.getByLabelText('contact.name')).toHaveValue('');
    });

    it('drops the draft once the message is sent', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);
      await fillForm(user);
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        expect(sessionStorage.getItem('contact-form-draft')).toBeNull();
      });
    });
  });
});
