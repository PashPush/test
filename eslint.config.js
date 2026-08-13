import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// FSD layer direction. Each layer bans the layers above it, plus its own
// `@/<layer>/**` — inside a slice imports are relative, so the alias pointing
// back at the same layer always means a cross-slice import. `app` may import
// anything, so it has no entry.
const forbiddenImports = {
  shared: ['@/app/**', '@/pages/**', '@/widgets/**', '@/features/**', '@/entities/**'],
  entities: ['@/app/**', '@/pages/**', '@/widgets/**', '@/features/**', '@/entities/**'],
  features: ['@/app/**', '@/pages/**', '@/widgets/**', '@/features/**'],
  widgets: ['@/app/**', '@/pages/**', '@/widgets/**'],
  pages: ['@/app/**', '@/pages/**'],
};

export default tseslint.config(
  { ignores: ['dist'] },
  ...Object.entries(forbiddenImports).map(([layer, group]) => ({
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group, message: `FSD: ${layer} cannot import from a higher layer or a sibling slice.` },
            { group: ['../../../**'], message: 'FSD: use the @/ alias to cross a slice boundary.' },
          ],
        },
      ],
    },
  })),
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  }
);
