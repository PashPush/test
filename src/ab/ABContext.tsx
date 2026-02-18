import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { VariantAssignments } from './engine.ts';
import type { SectionKey } from './experiments.ts';
import { variants, sectionOrder } from './init.ts';

interface ABContextValue {
  variants: VariantAssignments;
  sectionOrder: SectionKey[];
  getVariant: (experimentId: string) => string;
}

const ABContext = createContext<ABContextValue | null>(null);

const contextValue: ABContextValue = {
  variants,
  sectionOrder,
  getVariant: (experimentId: string) => variants[experimentId] ?? 'control',
};

export function ABProvider({ children }: { children: ReactNode }) {
  return <ABContext value={contextValue}>{children}</ABContext>;
}

export function useAB(): ABContextValue {
  const ctx = useContext(ABContext);
  if (!ctx) throw new Error('useAB must be used within ABProvider');
  return ctx;
}
