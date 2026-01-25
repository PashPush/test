import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from '../Navbar';

vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(() => false),
}));

vi.mock('../LanguageSwitcher', () => ({
  default: () => <div data-testid="lang-switcher">LanguageSwitcher</div>,
}));

vi.mock('../MobileMenu', () => ({
  default: ({ isOpen, onClose, currentLink }: { isOpen: boolean; onClose: () => void; currentLink: string }) => (
    <div data-testid="mobile-menu" data-open={isOpen} data-current={currentLink} onClick={onClose}>
      MobileMenu
    </div>
  ),
}));

describe('NavBar', () => {
  let intersectionCallback: IntersectionObserverCallback;
  let mockObserve: Mock;
  let mockDisconnect: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    class MockIntersectionObserver implements IntersectionObserver {
      root: Element | Document | null = null;
      rootMargin: string = '';
      thresholds: ReadonlyArray<number> = [];

      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe = mockObserve;
      unobserve = vi.fn();
      disconnect = mockDisconnect;
      takeRecords = (): IntersectionObserverEntry[] => [];
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });

    document.body.innerHTML = `
      <div id="hero"></div>
      <div id="projects"></div>
      <div id="experience"></div>
      <div id="approach"></div>
      <div id="reviews"></div>
      <div id="skills"></div>
      <div id="contact"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  describe('rendering', () => {
    it('renders logo', () => {
      render(<NavBar />);
      const logo = document.querySelector('.logo');
      expect(logo).toBeInTheDocument();
      expect(logo?.textContent).toContain('alkin');
    });

    it('renders all navigation links', () => {
      render(<NavBar />);

      expect(screen.getByText('nav.projects')).toBeInTheDocument();
      expect(screen.getByText('nav.experience')).toBeInTheDocument();
      expect(screen.getByText('nav.approach')).toBeInTheDocument();
      expect(screen.getByText('nav.reviews')).toBeInTheDocument();
      expect(screen.getByText('nav.skills')).toBeInTheDocument();
    });

    it('renders language switcher', () => {
      render(<NavBar />);
      expect(screen.getByTestId('lang-switcher')).toBeInTheDocument();
    });

    it('renders contact button', () => {
      render(<NavBar />);
      expect(screen.getByText('nav.contactBtn')).toBeInTheDocument();
    });

    it('renders hamburger button', () => {
      render(<NavBar />);
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('renders mobile menu component', () => {
      render(<NavBar />);
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });
  });

  describe('scroll behavior', () => {
    it('has not-scrolled class initially', () => {
      render(<NavBar />);
      const header = document.querySelector('header');
      expect(header).toHaveClass('not-scrolled');
    });

    it('adds scrolled class when scrolled past threshold', async () => {
      render(<NavBar />);

      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true });
        fireEvent.scroll(window);
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const header = document.querySelector('header');
      expect(header).toHaveClass('scrolled');
    });

    it('removes scrolled class when scrolled back to top', async () => {
      render(<NavBar />);

      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true });
        fireEvent.scroll(window);
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 5, writable: true, configurable: true });
        fireEvent.scroll(window);
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const header = document.querySelector('header');
      expect(header).toHaveClass('not-scrolled');
    });

    it('logo click scrolls to top', async () => {
      const scrollToMock = vi.fn();
      vi.stubGlobal('scrollTo', scrollToMock);

      const user = userEvent.setup();
      render(<NavBar />);

      const logo = document.querySelector('.logo') as HTMLElement;
      await user.click(logo);

      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  describe('active section tracking', () => {
    it('updates currentLink when section becomes visible', () => {
      render(<NavBar />);

      act(() => {
        intersectionCallback(
          [
            {
              isIntersecting: true,
              target: { id: 'projects' } as Element,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        );
      });

      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toHaveAttribute('data-current', '#projects');
    });

    it('highlights active section link', () => {
      render(<NavBar />);

      act(() => {
        intersectionCallback(
          [
            {
              isIntersecting: true,
              target: { id: 'experience' } as Element,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        );
      });

      const experienceLink = screen.getByText('nav.experience').closest('a');
      const underline = experienceLink?.querySelector('.underline');
      expect(underline).toHaveClass('active');
    });

    it('changes logo color based on active section', () => {
      render(<NavBar />);

      act(() => {
        intersectionCallback(
          [
            {
              isIntersecting: true,
              target: { id: 'projects' } as Element,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        );
      });

      const logo = document.querySelector('.logo');
      const coloredSpans = logo?.querySelectorAll('span.text-cyan-200');
      expect(coloredSpans?.length).toBeGreaterThan(0);
    });
  });

  describe('hamburger menu', () => {
    it('toggles mobile menu on hamburger click', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const hamburger = screen.getByLabelText('Open menu');
      const mobileMenu = screen.getByTestId('mobile-menu');

      expect(mobileMenu).toHaveAttribute('data-open', 'false');

      await user.click(hamburger);

      expect(mobileMenu).toHaveAttribute('data-open', 'true');
    });

    it('closes menu on hamburger click when open', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const hamburger = screen.getByLabelText('Open menu');
      const mobileMenu = screen.getByTestId('mobile-menu');

      await user.click(hamburger);
      expect(mobileMenu).toHaveAttribute('data-open', 'true');

      await user.click(hamburger);
      expect(mobileMenu).toHaveAttribute('data-open', 'false');
    });

    it('updates aria-label when menu is open', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const hamburger = screen.getByLabelText('Open menu');
      await user.click(hamburger);

      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    it('has correct aria-expanded attribute', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const hamburger = screen.getByLabelText('Open menu');
      expect(hamburger).toHaveAttribute('aria-expanded', 'false');

      await user.click(hamburger);
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    });

    it('adds active class to hamburger when menu is open', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const hamburger = screen.getByLabelText('Open menu');
      expect(hamburger).not.toHaveClass('active');

      await user.click(hamburger);
      expect(hamburger).toHaveClass('active');
    });
  });

  describe('mobile menu integration', () => {
    it('passes isOpen prop to MobileMenu', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const hamburger = screen.getByLabelText('Open menu');
      await user.click(hamburger);

      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toHaveAttribute('data-open', 'true');
    });

    it('closes menu when MobileMenu calls onClose', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const hamburger = screen.getByLabelText('Open menu');
      await user.click(hamburger);

      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toHaveAttribute('data-open', 'true');

      await user.click(mobileMenu);

      expect(mobileMenu).toHaveAttribute('data-open', 'false');
    });

    it('passes currentLink to MobileMenu', () => {
      render(<NavBar />);

      act(() => {
        intersectionCallback(
          [
            {
              isIntersecting: true,
              target: { id: 'skills' } as Element,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        );
      });

      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toHaveAttribute('data-current', '#skills');
    });
  });

  describe('cleanup', () => {
    it('removes scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<NavBar />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('disconnects IntersectionObserver on unmount', () => {
      const { unmount } = render(<NavBar />);
      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
