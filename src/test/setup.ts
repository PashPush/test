import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import './mocks/gsap';
import './mocks/matchMedia';
import './mocks/intersectionObserver';
import './mocks/i18n';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
