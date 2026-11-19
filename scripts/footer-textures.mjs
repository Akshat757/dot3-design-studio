// Crops one exterior render per property into a tight facade texture for the Footer 2 3D scene.
// Sources: public/images/projects1 (new) and public/images/projects (deck). Output: public/images/footer-3d/<id>.webp
// Run: node scripts/footer-textures.mjs   (prints the aspect ratios to paste into src/components/footer/properties.ts)
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMG = path.resolve("public/images");
const OUT = path.join(IMG, "footer-3d");
const J = "projects1/";
// [id, source, [x0, y0, x1, y1] as fractions of the source image]
const jobs = [
  ["anand-one", J + "anand-one/WhatsApp Image 2026-11-19 at 8.47.26 PM.jpeg", [0.26, 0.02, 0.72, 0.89]],
  ["arch-life", J + "arch-life-hotel/WhatsApp Image 2026-11-19 at 8.50.45 PM.jpeg", [0.29, 0.03, 0.81, 0.87]],
  ["gupt-bhavan", J + "gupt-bhavan/WhatsApp Image 2026-11-19 at 8.49.23 PM.jpeg", [0.16, 0.1, 0.82, 0.82]],
  ["kothari-sadan", J + "kothari-sadan/WhatsApp Image 2026-11-19 at 8.53.23 PM.jpeg", [0.22, 0.15, 0.88, 0.76]],
  ["maru-mansion", J + "maru-mansion/WhatsApp Image 2026-11-19 at 8.45.48 PM.jpeg", [0.31, 0.15, 0.77, 0.8]],
  ["akshay-palace", "projects/akshay-palace-hotel/01.webp", [0.28, 0.05, 0.68, 0.9]],
  ["anandam-farmhouse", "projects/anandam-farmhouse/01.webp", [0.33, 0.0, 0.82, 0.8]],
  ["evara-mansion", "projects/evara-mansion/01.webp", [0.03, 0.13, 0.95, 0.82]],
  ["jain-palace", "projects/jain-palace-khachrod/01.webp", [0.01, 0.05, 0.99, 0.86]],
  ["kalantri-mansion", "projects/kalantri-mansion/01.webp", [0.25, 0.0, 0.82, 0.84]],
  ["panchal-mansion", "projects/panchal-mansion/01.webp", [0.17, 0.02, 0.82, 0.72]],
  ["betma-bungalow", "projects/residential-bungalow-betma/01.webp", [0.13, 0.06, 0.85, 0.86]],
  ["ujjain-bungalow", "projects/residential-bungalow-ujjain/01.webp", [0.15, 0.03, 0.85, 0.87]],
  ["travell-inn", "projects/travell-inn-ujjain/01.webp", [0.0, 0.0, 1, 0.95]],
];

await mkdir(OUT, { recursive: true });
for (const [id, src, [x0, y0, x1, y1]] of jobs) {
  const file = path.join(IMG, src);
  const { width, height } = await sharp(file).metadata();
  const region = {
    left: Math.round(x0 * width),
    top: Math.round(y0 * height),
    width: Math.round((x1 - x0) * width),
    height: Math.round((y1 - y0) * height),
  };
  const info = await sharp(file)
    .extract(region)
    .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, `${id}.webp`));
  console.log(`${id}: ${info.width}x${info.height} aspect ${(info.width / info.height).toFixed(3)} ${Math.round(info.size / 1024)}KB`);
}
