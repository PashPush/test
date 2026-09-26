import { trackEvent } from '@/shared/lib/analytics';

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
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set]));
  } catch {
    // storage unavailable — skip persistence
  }
}

export function trackExposure(experimentId: string, variantId: string): void {
  const key = `${experimentId}:${variantId}`;
  if (getExposed().has(key)) return;

  markExposed(key);
  trackEvent('ab_exposure', { experiment_id: experimentId, variant_id: variantId });
}
