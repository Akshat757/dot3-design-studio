// Converts the client's deck images into web-ready WebP files and records their sizes.
// Source: assets/portfolio-pdf (gitignored, kept locally). Output: public/images + src/data/image-sizes.generated.json
// Run: npm run images
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { projects, projectImageSrc } from "../src/data/projects";

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "assets/portfolio-pdf");
const PUBLIC = path.join(ROOT, "public");
const MAX_WIDTH = 2000;

const studioImages: Record<string, string> = {
  "/images/studio/hero-sketch.webp": "v2-latest/p01-1.png",
  "/images/studio/about-detail.webp": "v2-latest/p02-1.jpeg",
  "/images/studio/vision.webp": "v2-latest/p06-1.jpeg",
  "/images/studio/interior.webp": "v2-latest/p05-4.jpeg",
  "/images/studio/stair.webp": "v2-latest/p05-3.jpeg",
  "/images/studio/spiral.webp": "v2-latest/p20-1.jpeg",
};

async function convert(source: string, publicPath: string) {
  const out = path.join(PUBLIC, publicPath);
  await mkdir(path.dirname(out), { recursive: true });
  const info = await sharp(path.join(SOURCE, source))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  return { width: info.width, height: info.height };
}

async function main() {
  const jobs: [string, string][] = Object.entries(studioImages).map(([dest, src]) => [src, dest]);
  for (const p of projects) p.images.forEach((img, i) => jobs.push([img.source, projectImageSrc(p.slug, i)]));

  const sizes: Record<string, { width: number; height: number }> = {};
  for (const [src, dest] of jobs) {
    sizes[dest] = await convert(src, dest);
    console.log(`${src} -> ${dest}`);
  }
  await writeFile(path.join(ROOT, "src/data/image-sizes.generated.json"), JSON.stringify(sizes, null, 2) + "\n");
  console.log(`${jobs.length} images written`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
