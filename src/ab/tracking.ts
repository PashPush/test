import type { VariantAssignments } from './engine.ts';

const SESSION_KEY = 'ab_exposed';

function getExposed(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markExposed(key: string): void {
  const set = getExposed();
  set.add(key);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set]));
}

export function trackExposure(experimentId: string, variantId: string): void {
  const key = `${experimentId}:${variantId}`;
  if (getExposed().has(key)) return;

  markExposed(key);

  console.log(
    `%c[A/B] ${experimentId}: ${variantId}`,
    'color: #2cc800; font-weight: bold;',
  );

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'ab_exposure', {
      experiment_id: experimentId,
      variant_id: variantId,
    });
  }

  // Yandex Metrica
  const ymCounter = Number(import.meta.env.VITE_YM_COUNTER);
  if (ymCounter && typeof window.ym === 'function') {
    window.ym(ymCounter, 'params', {
      ab: { [experimentId]: variantId },
    });
  }
}

export function getExposureSummary(assignments: VariantAssignments): string {
  return Object.entries(assignments)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');
}

// Extend Window for analytics globals
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}
