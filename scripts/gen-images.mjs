// One-off: generates responsive variants into public/images. Output is committed;
// rerun only when a source image changes:  node scripts/gen-images.mjs
import sharp from 'sharp';

const dir = new URL('../public/images/', import.meta.url).pathname;

const responsive = {
  pavel2: [640, 960, 1280, 1920],
  'project-pt': [600, 1000, 1400],
};

for (const [name, widths] of Object.entries(responsive)) {
  const source = `${dir}${name}.webp`;
  const { width: full } = await sharp(source).metadata();
  for (const width of widths) {
    const image = () => sharp(source).resize({ width });
    await image().avif({ quality: 60, effort: 9 }).toFile(`${dir}${name}-${width}.avif`);
    // The full-size webp is the source itself; re-encoding it would only lose quality.
    if (width !== full) await image().webp({ quality: 82 }).toFile(`${dir}${name}-${width}.webp`);
  }
}

await sharp(`${dir}paper-3.png`).webp({ quality: 60, alphaQuality: 60, effort: 6 }).toFile(`${dir}paper-3.webp`);
