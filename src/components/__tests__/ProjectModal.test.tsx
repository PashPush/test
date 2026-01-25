import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectModal, type ProjectData } from '../ProjectModal';

const mockProject: ProjectData = {
  id: 'test-project',
  name: 'Test Project',
  stack: 'React, TypeScript',
  description: 'A test project description',
  role: 'Lead Developer',
  screenshots: ['/screenshot1.png', '/screenshot2.png'],
  color: 'linear-gradient(90deg, #000, #fff)',
  mainImage: '/main.png',
};

describe('ProjectModal', () => {
  const defaultProps = {
    project: mockProject,
    isOpen: false,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    document.documentElement.classList.remove('no-scroll');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('returns null when closed', () => {
      render(<ProjectModal {...defaultProps} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('returns null when no project', () => {
      render(<ProjectModal {...defaultProps} project={null} isOpen={true} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders modal when open with project', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders project name', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('renders project stack', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByText('React, TypeScript')).toBeInTheDocument();
    });

    it('renders project description', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByText('A test project description')).toBeInTheDocument();
    });

    it('renders project role', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByText('Lead Developer')).toBeInTheDocument();
    });

    it('renders all screenshots', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      const screenshotImages = screen.getAllByAltText(/Test Project screenshot/);
      expect(screenshotImages).toHaveLength(2);
    });

    it('renders main image', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByAltText('Test Project')).toBeInTheDocument();
    });

    it('renders section headers', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByText('modal.description')).toBeInTheDocument();
      expect(screen.getByText('modal.role')).toBeInTheDocument();
      expect(screen.getByText('modal.screenshots')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('close button has aria-label', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByLabelText('modal.close')).toBeInTheDocument();
    });

    it('modal title has correct id', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(screen.getByText('Test Project')).toHaveAttribute('id', 'modal-title');
    });
  });

  describe('close behavior', () => {
    it('calls onClose when close button clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      await user.click(screen.getByLabelText('modal.close'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      const overlay = document.querySelector('.project-modal-overlay');
      await user.click(overlay!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when content clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      const content = document.querySelector('.project-modal-content')!;
      await user.click(content);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key pressed', () => {
      const onClose = vi.fn();
      render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('removes escape listener on unmount', () => {
      const onClose = vi.fn();
      const { unmount } = render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      unmount();
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(0);
    });
  });

  describe('touch gesture', () => {
    it('closes on downward swipe (> 100px) when at scroll top', () => {
      const onClose = vi.fn();
      render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      const scrollArea = document.querySelector('.project-modal-scroll')!;
      Object.defineProperty(scrollArea, 'scrollTop', { value: 0, writable: true });

      fireEvent.touchStart(scrollArea, {
        touches: [{ clientY: 100 }],
      });
      fireEvent.touchEnd(scrollArea, {
        changedTouches: [{ clientY: 250 }],
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on small swipe (< 100px)', () => {
      const onClose = vi.fn();
      render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      const scrollArea = document.querySelector('.project-modal-scroll')!;
      Object.defineProperty(scrollArea, 'scrollTop', { value: 0, writable: true });

      fireEvent.touchStart(scrollArea, {
        touches: [{ clientY: 100 }],
      });
      fireEvent.touchEnd(scrollArea, {
        changedTouches: [{ clientY: 150 }],
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not close on upward swipe', () => {
      const onClose = vi.fn();
      render(<ProjectModal {...defaultProps} isOpen={true} onClose={onClose} />);

      const scrollArea = document.querySelector('.project-modal-scroll')!;
      Object.defineProperty(scrollArea, 'scrollTop', { value: 0, writable: true });

      fireEvent.touchStart(scrollArea, {
        touches: [{ clientY: 250 }],
      });
      fireEvent.touchEnd(scrollArea, {
        changedTouches: [{ clientY: 100 }],
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('scroll lock', () => {
    it('adds no-scroll class when open', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(document.documentElement).toHaveClass('no-scroll');
    });

    it('removes no-scroll class when closed with delay', async () => {
      const { rerender } = render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(document.documentElement).toHaveClass('no-scroll');

      rerender(<ProjectModal {...defaultProps} isOpen={false} />);

      vi.advanceTimersByTime(250);

      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('no-scroll');
      });
    });

    it('removes no-scroll class on unmount', () => {
      const { unmount } = render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(document.documentElement).toHaveClass('no-scroll');

      unmount();
      expect(document.documentElement).not.toHaveClass('no-scroll');
    });
  });

  describe('portal rendering', () => {
    it('renders into document.body', () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);
      expect(document.body.querySelector('.project-modal-overlay')).toBeInTheDocument();
    });
  });

  describe('focus management', () => {
    it('focuses content on open', async () => {
      render(<ProjectModal {...defaultProps} isOpen={true} />);

      await waitFor(() => {
        const content = document.querySelector('.project-modal-content');
        expect(document.activeElement).toBe(content);
      });
    });
  });
});
