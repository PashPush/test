import i18n from '../i18n';
import { resolveVariants, getVariantConfig } from './engine';
import type { ExperimentConfig, VariantAssignments } from './engine';
import { trackExposure } from './tracking';
import { allExperiments, sectionOrderExperiment } from './experiments';
import type { SectionKey } from './experiments';

/**
 * Converts flat dot-notation keys into a nested object.
 * e.g. { 'feedbacks.0.review': 'text' } → { feedbacks: { '0': { review: 'text' } } }
 */
function unflatten(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current: Record<string, unknown> = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

function applyTextOverrides(variants: VariantAssignments): void {
  for (const experiment of allExperiments) {
    const variantId = variants[experiment.id];
    if (!variantId) continue;

    const config = getVariantConfig(experiment as ExperimentConfig, variantId);
    if (!config) continue;

    const value = config.value as { overrides?: { ru?: Record<string, string>; en?: Record<string, string> } };
    if (!value.overrides) continue;

    for (const [lng, overrides] of Object.entries(value.overrides)) {
      if (!overrides || Object.keys(overrides).length === 0) continue;

      const nested = unflatten(overrides);
      i18n.addResourceBundle(lng, 'translation', nested, true, true);
    }
  }
}

// Resolve everything eagerly before React mounts
export const variants: VariantAssignments = resolveVariants(allExperiments);

// Apply i18n overrides
applyTextOverrides(variants);

// Track exposures (only for enabled experiments)
for (const experiment of allExperiments) {
  if (!experiment.enabled) continue;
  const variantId = variants[experiment.id];
  if (variantId) trackExposure(experiment.id, variantId);
}

// Resolve section order
const sectionOrderVariantId = variants[sectionOrderExperiment.id];
const sectionOrderConfig = getVariantConfig(sectionOrderExperiment, sectionOrderVariantId);
export const sectionOrder: SectionKey[] = sectionOrderConfig?.value ?? [
  'projects', 'experience', 'approach', 'reviews', 'skills',
];
