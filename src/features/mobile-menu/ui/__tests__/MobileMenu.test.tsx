import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from '../MobileMenu';
import { useMediaQuery } from 'react-responsive';

vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(),
}));

describe('MobileMenu', () => {
  const defaultNavLinks = [
    { key: 'projects', link: '#projects' },
    { key: 'experience', link: '#experience' },
    { key: 'approach', link: '#approach' },
    { key: 'reviews', link: '#reviews' },
    { key: 'skills', link: '#skills' },
  ];

  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    currentLink: '#hero',
    navLinks: defaultNavLinks,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMediaQuery).mockReturnValue(true);
    document.documentElement.classList.remove('no-scroll');
  });

  describe('rendering', () => {
    it('returns null on desktop', () => {
      vi.mocked(useMediaQuery).mockReturnValue(false);
      const { container } = render(<MobileMenu {...defaultProps} isOpen={true} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders menu on mobile', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} />);

      expect(screen.getByText('nav.projects')).toBeInTheDocument();
      expect(screen.getByText('nav.experience')).toBeInTheDocument();
      expect(screen.getByText('nav.approach')).toBeInTheDocument();
      expect(screen.getByText('nav.reviews')).toBeInTheDocument();
      expect(screen.getByText('nav.skills')).toBeInTheDocument();
    });

    it('renders contact button', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} />);
      expect(screen.getByText('nav.contactBtn')).toBeInTheDocument();
    });

    it('applies open class when isOpen is true', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} />);
      const menu = document.querySelector('.mobile-menu');
      expect(menu).toHaveClass('open');
    });

    it('does not apply open class when isOpen is false', () => {
      render(<MobileMenu {...defaultProps} isOpen={false} />);
      const menu = document.querySelector('.mobile-menu');
      expect(menu).not.toHaveClass('open');
    });
  });

  describe('close behavior', () => {
    it('calls onClose when backdrop is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);

      const backdrop = document.querySelector('.mobile-menu-backdrop');
      await user.click(backdrop!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', () => {
      const onClose = vi.fn();
      render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not add Escape listener when closed', () => {
      const onClose = vi.fn();
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      render(<MobileMenu {...defaultProps} isOpen={false} onClose={onClose} />);

      // Escape listener should not be added when menu is closed
      const keydownCalls = addEventListenerSpy.mock.calls.filter(call => call[0] === 'keydown');
      expect(keydownCalls).toHaveLength(0);
    });

    it('calls onClose when nav link is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);

      await user.click(screen.getByText('nav.projects'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when contact button is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);

      await user.click(screen.getByText('nav.contactBtn'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('swipe gesture', () => {
    it('calls onClose on right swipe (> 50px)', () => {
      const onClose = vi.fn();
      render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);

      const menu = document.querySelector('.mobile-menu')!;

      fireEvent.touchStart(menu, {
        touches: [{ clientX: 50 }],
      });
      fireEvent.touchMove(menu, {
        touches: [{ clientX: 150 }],
      });
      fireEvent.touchEnd(menu);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on small swipe (< 50px)', () => {
      const onClose = vi.fn();
      render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);

      const menu = document.querySelector('.mobile-menu')!;

      fireEvent.touchStart(menu, {
        touches: [{ clientX: 50 }],
      });
      fireEvent.touchMove(menu, {
        touches: [{ clientX: 80 }],
      });
      fireEvent.touchEnd(menu);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not close on left swipe', () => {
      const onClose = vi.fn();
      render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);

      const menu = document.querySelector('.mobile-menu')!;

      fireEvent.touchStart(menu, {
        touches: [{ clientX: 150 }],
      });
      fireEvent.touchMove(menu, {
        touches: [{ clientX: 50 }],
      });
      fireEvent.touchEnd(menu);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('scroll lock', () => {
    it('adds no-scroll class when open on mobile', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} />);
      expect(document.documentElement).toHaveClass('no-scroll');
    });

    it('removes no-scroll class when closed', () => {
      const { rerender } = render(<MobileMenu {...defaultProps} isOpen={true} />);
      expect(document.documentElement).toHaveClass('no-scroll');

      rerender(<MobileMenu {...defaultProps} isOpen={false} />);
      expect(document.documentElement).not.toHaveClass('no-scroll');
    });

    it('removes no-scroll class on unmount', () => {
      const { unmount } = render(<MobileMenu {...defaultProps} isOpen={true} />);
      expect(document.documentElement).toHaveClass('no-scroll');

      unmount();
      expect(document.documentElement).not.toHaveClass('no-scroll');
    });
  });

  describe('active link highlighting', () => {
    it('highlights current section link', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} currentLink="#projects" />);

      const projectsLink = screen.getByText('nav.projects').closest('a');
      expect(projectsLink).toHaveClass('active');
    });

    it('highlights contact button when current link is #contacts', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} currentLink="#contacts" />);

      const contactButton = screen.getByText('nav.contactBtn');
      expect(contactButton).toHaveClass('active');
    });

    it('does not highlight other links', () => {
      render(<MobileMenu {...defaultProps} isOpen={true} currentLink="#projects" />);

      const experienceLink = screen.getByText('nav.experience').closest('a');
      expect(experienceLink).not.toHaveClass('active');
    });
  });
});
