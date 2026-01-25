import { vi } from 'vitest';

const mockIntersectionObserver = vi.fn();

mockIntersectionObserver.mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

window.IntersectionObserver = mockIntersectionObserver;
