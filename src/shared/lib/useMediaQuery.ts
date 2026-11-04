import { useSyncExternalStore } from 'react';

/**
 * `undefined` while hydrating — the prerendered HTML can't know the viewport — then the live
 * match. Markup treats it as false (the prerendered variant); effects that build layout-
 * dependent animations wait for a boolean so they run once, not once per value.
 * First-screen differences belong in CSS media queries, or they flash after hydration.
 */
export const useMediaQuery = (query: string): boolean | undefined =>
  useSyncExternalStore(
    onChange => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => undefined
  );
