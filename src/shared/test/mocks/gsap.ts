import { vi } from 'vitest';

const createTimelineMock = () => ({
  to: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  fromTo: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  add: vi.fn().mockReturnThis(),
  eventCallback: vi.fn().mockReturnThis(),
  kill: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
  progress: vi.fn(),
});

vi.mock('gsap', () => ({
  default: {
    to: vi.fn(),
    from: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => createTimelineMock()),
    registerPlugin: vi.fn(),
    config: vi.fn(),
  },
  gsap: {
    to: vi.fn(),
    from: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => createTimelineMock()),
    registerPlugin: vi.fn(),
  },
}));

vi.mock('gsap/all', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
    kill: vi.fn(),
    config: vi.fn(),
  },
  SplitText: vi.fn(() => ({
    chars: [],
    words: [],
    lines: [],
    revert: vi.fn(),
  })),
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callback) => {
    if (typeof callback === 'function') callback();
  }),
}));
