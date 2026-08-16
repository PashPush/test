export interface ExperimentVariant<T = unknown> {
  id: string;
  value: T;
  weight?: number; // defaults to 1
}

export interface ExperimentConfig<T = unknown> {
  id: string;
  enabled: boolean;
  variants: ExperimentVariant<T>[];
}

export type VariantAssignments = Record<string, string>;

const STORAGE_KEY_USER_ID = 'ab_userId';
const STORAGE_KEY_VARIANTS = 'ab_variants';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable — run without persistence
  }
}

function randomId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getOrCreateUserId(): string {
  let userId = safeGet(STORAGE_KEY_USER_ID);
  if (!userId) {
    userId = randomId();
    safeSet(STORAGE_KEY_USER_ID, userId);
  }
  return userId;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function pickVariant<T>(experiment: ExperimentConfig<T>, userId: string): ExperimentVariant<T> {
  const override = getUrlOverride(experiment.id);
  if (override) {
    const found = experiment.variants.find(v => v.id === override);
    if (found) return found;
  }

  const totalWeight = experiment.variants.reduce((sum, v) => sum + (v.weight ?? 1), 0);
  const hash = hashString(userId + experiment.id);
  let bucket = hash % totalWeight;

  for (const variant of experiment.variants) {
    bucket -= variant.weight ?? 1;
    if (bucket < 0) return variant;
  }

  return experiment.variants[0];
}

export function getUrlOverride(experimentId: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(`ab_${experimentId}`);
}

export function resolveVariants(experiments: ExperimentConfig[]): VariantAssignments {
  const userId = getOrCreateUserId();

  // Check for cached assignments (skip if URL overrides exist)
  const hasOverrides = experiments.some(e => e.enabled && getUrlOverride(e.id) !== null);
  if (!hasOverrides) {
    const cached = safeGet(STORAGE_KEY_VARIANTS);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as VariantAssignments;
        const allMatch = experiments.every(e => e.variants.some(v => v.id === parsed[e.id]));
        if (allMatch) return parsed;
      } catch {
        // ignore corrupt data
      }
    }
  }

  const assignments: VariantAssignments = {};
  for (const experiment of experiments) {
    if (!experiment.enabled && !getUrlOverride(experiment.id)) {
      assignments[experiment.id] = experiment.variants[0].id;
      continue;
    }
    assignments[experiment.id] = pickVariant(experiment, userId).id;
  }

  safeSet(STORAGE_KEY_VARIANTS, JSON.stringify(assignments));
  return assignments;
}

export function getVariantConfig<T>(
  experiment: ExperimentConfig<T>,
  variantId: string,
): ExperimentVariant<T> | undefined {
  return experiment.variants.find(v => v.id === variantId);
}
