// Renders `/` in Russian at build time and puts the HTML into dist/index.html, which the
// client then hydrates (src/app/main.tsx). Runs after the client build.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { build } from 'vite';

const outDir = 'node_modules/.cache/prerender';
await build({ logLevel: 'warn', build: { ssr: 'src/app/entry-server.tsx', outDir, emptyOutDir: true } });

const { render } = await import(`../${outDir}/entry-server.js`);
const file = 'dist/index.html';
const html = await readFile(file, 'utf8');
const slot = '<div id="root"></div>';
if (!html.includes(slot)) throw new Error(`${file} has no empty ${slot} to prerender into.`);

await writeFile(file, html.replace(slot, `<div id="root">${render()}</div>`));
await rm(outDir, { recursive: true });
console.log('Prerendered / (ru) into dist/index.html.');
