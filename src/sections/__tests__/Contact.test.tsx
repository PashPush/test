import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../Contact';

vi.mock('@emailjs/browser', () => ({
  default: {
    sendForm: vi.fn(),
  },
}));

import emailjs from '@emailjs/browser';

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  describe('form submission', () => {
    it('calls emailjs.sendForm on submit', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.sendForm).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);

      await user.type(screen.getByLabelText('contact.name'), 'John');
      await user.type(screen.getByLabelText('contact.email'), 'john@test.com');
      await user.type(screen.getByLabelText('contact.message'), 'Message');
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
    });

    it('shows loading text during submission', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.sendForm).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ status: 200, text: 'OK' }), 100))
      );

      render(<Contact />);

      await user.type(screen.getByLabelText('contact.name'), 'John');
      await user.type(screen.getByLabelText('contact.email'), 'john@test.com');
      await user.type(screen.getByLabelText('contact.message'), 'Message');
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      expect(screen.getByText('contact.sending')).toBeInTheDocument();
    });

    it('shows success message after successful submission', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.sendForm).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);

      await user.type(screen.getByLabelText('contact.name'), 'John');
      await user.type(screen.getByLabelText('contact.email'), 'john@test.com');
      await user.type(screen.getByLabelText('contact.message'), 'Message');
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        const successElement = screen.getByText('contact.success').closest('div');
        expect(successElement?.className).toContain('opacity-100');
      });
    });

    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      vi.mocked(emailjs.sendForm).mockResolvedValue({ status: 200, text: 'OK' });

      render(<Contact />);

      const nameInput = screen.getByLabelText('contact.name');
      await user.type(nameInput, 'John');
      await user.type(screen.getByLabelText('contact.email'), 'john@test.com');
      await user.type(screen.getByLabelText('contact.message'), 'Message');
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        expect(nameInput).toHaveValue('');
      });
    });

    it('logs error on submission failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(emailjs.sendForm).mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      render(<Contact />);

      await user.type(screen.getByLabelText('contact.name'), 'John');
      await user.type(screen.getByLabelText('contact.email'), 'john@test.com');
      await user.type(screen.getByLabelText('contact.message'), 'Message');
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('EmailJS Error:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('resets loading state after error', async () => {
      vi.mocked(emailjs.sendForm).mockRejectedValue(new Error('Network error'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const user = userEvent.setup();
      render(<Contact />);

      await user.type(screen.getByLabelText('contact.name'), 'John');
      await user.type(screen.getByLabelText('contact.email'), 'john@test.com');
      await user.type(screen.getByLabelText('contact.message'), 'Message');
      await user.click(screen.getByRole('button', { name: /contact.send/i }));

      await waitFor(() => {
        expect(screen.getByText('contact.send')).toBeInTheDocument();
      });
    });
  });
});
