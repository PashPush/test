import { existsSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const manifestPath = join(process.cwd(), 'dist/.vite/manifest.json');
if (!existsSync(manifestPath)) {
  throw new Error('Bundle manifest is missing. Run vite build before checking the budget.');
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entry = Object.values(manifest).find(item => item.isEntry);
if (!entry) throw new Error('Could not find the application entry in the bundle manifest.');

const files = new Set();
const collect = item => {
  if (!item || files.has(item.file)) return;
  files.add(item.file);
  (item.imports || []).forEach(key => collect(manifest[key]));
};
collect(entry);

const bytes = [...files]
  .filter(file => file.endsWith('.js'))
  .reduce((total, file) => total + gzipSync(readFileSync(join(process.cwd(), 'dist', file))).length, 0);
const limit = Number(process.env.BUNDLE_BUDGET_GZIP_KB || 200) * 1024;

console.log(
  `Initial JavaScript: ${(bytes / 1024).toFixed(2)} KB gzip across ${files.size} entry files (budget ${(limit / 1024).toFixed(0)} KB).`
);
if (bytes > limit) {
  console.error('✖ Initial JavaScript bundle budget exceeded. Set BUNDLE_BUDGET_GZIP_KB only with a reviewed reason.');
  process.exit(1);
}
