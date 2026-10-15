// One-off media optimization (SEO audit F06 / O04 / About video poster).
// Re-run after replacing the source logo or hero:  node scripts/optimize-images.mjs
// Sources live in scripts/source-images/ (originals, not served); outputs go to public/.
import sharp from "sharp";
import { existsSync, mkdirSync, copyFileSync, statSync } from "fs";

const SRC = "scripts/source-images";
const OUT = "public";
const PURPLE_DEEP = "#170720";

mkdirSync(SRC, { recursive: true });
// Keep the original high-resolution files out of /public so they are never served directly.
for (const f of ["logo.png", "hero.png"]) {
  if (!existsSync(`${SRC}/${f}`) && existsSync(`${OUT}/${f}`)) copyFileSync(`${OUT}/${f}`, `${SRC}/${f}`);
}

const report = (f) => console.log(`${f}: ${statSync(`${OUT}/${f}`).size.toLocaleString()} bytes`);

// Logo: header renders at 64px tall and footer at 80px; 240px tall covers 3x displays.
await sharp(`${SRC}/logo.png`)
  .resize({ height: 240 })
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(`${OUT}/logo.png`);
report("logo.png");

// Hero: photographic, no transparency -> JPEG master. next/image serves AVIF/WebP per device.
await sharp(`${SRC}/hero.png`).jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/hero.jpg`);
report("hero.jpg");

// Founder portrait: palette PNG keeps transparency at a fraction of the size.
await sharp(`${OUT}/founder-ricardo.png`)
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer()
  .then((buf) => sharp(buf).toFile(`${OUT}/founder-ricardo.png`));
report("founder-ricardo.png");

// Shared social preview image (1200x630): hero photo + darkening overlay + centred logo.
const logoForOg = await sharp(`${SRC}/logo.png`).resize({ width: 640 }).png().toBuffer();
await sharp(`${SRC}/hero.png`)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([
    {
      input: Buffer.from(
        `<svg width="1200" height="630"><rect width="1200" height="630" fill="${PURPLE_DEEP}" fill-opacity="0.72"/></svg>`
      ),
    },
    { input: logoForOg, gravity: "centre" },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${OUT}/og-image.jpg`);
report("og-image.jpg");

// About-page video poster at the video's own aspect ratio (1274x720).
const logoForPoster = await sharp(`${SRC}/logo.png`).resize({ width: 760 }).png().toBuffer();
await sharp({ create: { width: 1274, height: 720, channels: 3, background: PURPLE_DEEP } })
  .composite([{ input: logoForPoster, gravity: "centre" }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${OUT}/serenity-intro-poster.jpg`);
report("serenity-intro-poster.jpg");
