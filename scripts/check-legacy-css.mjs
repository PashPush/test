import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const assetsDir = fileURLToPath(new URL('../dist/assets/', import.meta.url));
const cssFiles = (await readdir(assetsDir))
  .filter(file => file.endsWith('.css'))
  .map(file => join(assetsDir, file));

if (!cssFiles.length) {
  console.error('Legacy CSS check failed: no CSS asset was found in dist/assets.');
  process.exit(1);
}

const unsupportedSyntax = [
  ['cascade layers (@layer)', /@layer\b/],
  ['registered custom properties (@property)', /@property\b/],
  ['OKLCH colors', /oklch\(/i],
  ['uncompiled Tailwind v4 utilities', /@(utility|theme)\b/],
  ['media-query range syntax', /\(\s*(?:height|width)\s*(?:<=|>=|<|>)/],
  [':has() selectors', /:has\(/],
  ['aspect-ratio outside @supports', /aspect-ratio\s*:/],
  ['text-wrap', /(?:^|[;{])\s*text-wrap\s*:/],
  ['individual translate property', /(?:^|[;{])\s*translate\s*:/],
  ['individual rotate property', /(?:^|[;{])\s*rotate\s*:/],
];

const stripSupports = source => source.replace(/@supports[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, '');

const css = (await Promise.all(cssFiles.map(file => readFile(file, 'utf8'))))
  .map(stripSupports)
  .join('\n');
const found = unsupportedSyntax.filter(([, pattern]) => pattern.test(css)).map(([name]) => name);

if (found.length) {
  console.error(`Legacy CSS check failed: unsupported syntax found: ${found.join(', ')}.`);
  process.exit(1);
}

console.log(`Legacy CSS check passed (${cssFiles.length} stylesheet${cssFiles.length === 1 ? '' : 's'}).`);
