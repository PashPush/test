// Verifies the Node version before dependencies are installed.
//
// Runs from `preinstall`, i.e. before node_modules exists — so nothing beyond
// Node's own built-in modules may be used here.
//
// Why: building on a different Node major usually doesn't fail up front, it fails
// somewhere deep inside esbuild or rollup with an unreadable stack trace. Failing
// early with a clear message is cheaper.
//
// Bypass: SKIP_NODE_CHECK=1 npm ci

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.env.SKIP_NODE_CHECK) process.exit(0);
const diagnosticOnly = process.argv.includes('--warn') && !process.env.CI;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const want = readFileSync(join(root, '.nvmrc'), 'utf8').trim();
const have = process.versions.node;

const major = v => Number(v.split('.')[0]);

if (major(have) !== major(want)) {
  const color = (code, value) => (process.stdout.isTTY ? `\x1b[${code}m${value}\x1b[0m` : value);
  const heading = diagnosticOnly
    ? color(33, '⚠ Wrong Node major version; continuing for local diagnostics.')
    : color(31, '✖ Wrong Node major version.');
  const message = `
${heading}

  required:  ${want}   (from .nvmrc)
  running:   ${have}

  Install the required version:

      nvm install && nvm use      # nvm reads .nvmrc for you
      npm ci

  If the mismatch is intentional:

      SKIP_NODE_CHECK=1 npm ci
`;
  if (diagnosticOnly) console.warn(message);
  else {
    console.error(message);
    process.exit(1);
  }
}

if (major(have) === major(want) && have !== want) {
  console.warn(
    `⚠ Running Node ${have}, but this project is built and tested on ${want} ` +
      `(.nvmrc). The major version matches, so continuing.`
  );
}
