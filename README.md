# pahov.ru

Portfolio landing page. React 19 + TypeScript + Vite + Tailwind CSS v4, GSAP-driven
animations, WebGL background on Three.js.

## Getting started

```bash
nvm install && nvm use     # Node version comes from .nvmrc
cp .env.example .env       # fill in the EmailJS keys
npm ci                     # ci, not install — see below
npm run dev
```

Without nvm: `brew install nvm`, or any Node from the major line pinned in `.nvmrc`.

Fill in `.env` before building — Vite inlines `import.meta.env` at build time, and a
missing key ships a broken contact form without failing the build.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run build` | `tsc -b` + production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest, watch mode) |
| `npm run test:run` | Unit tests, single run |
| `npm run test:e2e` | E2E tests (Playwright), starts the dev server itself |
| `npm run test:e2e:install` | Download Playwright browsers |

## Reproducible installs

**Use `npm ci`, not `npm install`.** `npm ci` wipes `node_modules` and installs
exactly what `package-lock.json` records, ignoring version ranges entirely.
`npm install` is free to re-resolve the tree and rewrite the lockfile.

**Dependencies are pinned to exact versions.** No `^` or `~` anywhere:
`"vite": "6.4.3"`, not `"^6.3.5"`. This keeps `package.json` honest about what the
project actually builds against. It only covers the 36 direct dependencies out of
~450 in the tree, though — the rest is held by `package-lock.json`, which must stay
committed.

**`.npmrc` sets `save-exact=true`** so a future `npm i <pkg>` doesn't reintroduce `^`.

**Node is pinned via `.nvmrc`**, and `scripts/check-node.mjs` verifies the major
version on `preinstall`. A mismatched major usually fails deep inside esbuild or
rollup with an unreadable stack trace, so failing early with a clear message is
cheaper. To bypass deliberately: `SKIP_NODE_CHECK=1 npm ci`.

`engine-strict` is intentionally left off in `.npmrc`: it applies to the whole
dependency tree, so any transitive package with a narrow `engines` field turns into
a hard install failure.

**`.github/workflows/canary.yml`** runs `npm ci`, build, lint and tests on a clean
machine monthly, catching dependency rot that a warm local `node_modules` hides.

### Updating dependencies

One group at a time:

```bash
npm outdated                       # see what has drifted
npm i vite@latest                  # .npmrc records the exact version
npm run build && npm run test:run && npm run test:e2e
git commit package.json package-lock.json
```

Packages that must move together, or npm will raise `ERESOLVE`:
`react` + `react-dom` + `@types/react` + `@types/react-dom`,
`gsap` + `@gsap/react`, `tailwindcss` + `@tailwindcss/vite`,
`vitest` + `@vitest/ui`, `eslint` + `@eslint/js` + `typescript-eslint`.

### Playwright browser errors

Browsers live in a global cache (`~/Library/Caches/ms-playwright`) rather than in
`node_modules`, and are tied to the `@playwright/test` version. After a machine
rebuild or a cache clean:

```bash
npm run test:e2e:install
```

## Project structure

`src/` follows Feature-Sliced Design. A layer may only import from the layers below it,
never from a sibling slice of its own layer — `eslint.config.js` enforces this.

- `src/app/` — entry (`main.tsx`), `App.tsx` shell, `gsap.ts`, `styles/index.css`
- `src/pages/home/` — the single page: Navbar + Hero + A/B-ordered sections + Contact
- `src/widgets/` — navbar, hero, projects, experience, approach, reviews, skills, contact
- `src/features/` — ab-testing, contact-form, language-switch, mobile-menu, chainsaw-interface
- `src/entities/project/` — projects data, `ProjectModal`
- `src/shared/` — `ui/`, `lib/`, `config/`, `i18n/`, `webgl/` (incl. GLSL shaders), `test/`
- `e2e/` — Playwright specs

Cross-slice imports use the `@/` alias; inside a slice they stay relative. Only
`@/features/ab-testing` and `@/entities/project` expose a barrel — everything else is
imported by direct path.
