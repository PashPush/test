import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const required = ['VITE_APP_EMAILJS_SERVICE_ID', 'VITE_APP_EMAILJS_TEMPLATE_ID', 'VITE_APP_EMAILJS_PUBLIC_KEY'];
const modeIndex = process.argv.indexOf('--mode');
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : 'production';
const envFiles = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
const fileValues = {};

for (const name of envFiles) {
  const path = join(process.cwd(), name);
  if (!existsSync(path)) continue;

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    fileValues[key.trim()] = rawValue.trim().replace(/^(['"])(.*)\1$/, '$2');
  }
}

const missing = required.filter(key => !(process.env[key]?.trim() || fileValues[key]?.trim()));

if (missing.length) {
  console.error(
    `\n✖ Production build requires EmailJS configuration.\n\n  Missing: ${missing.join(', ')}\n  Copy .env.example to .env and provide the public EmailJS values, or set them in CI.\n`
  );
  process.exit(1);
}
