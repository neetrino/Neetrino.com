/**
 * Convert local raster images to WebP.
 *
 * Usage:
 *   pnpm convert:webp path/to/image.png
 *   pnpm convert:webp path/to/image.jpg ./out/image.webp
 *   pnpm convert:webp path/to/folder
 *   pnpm convert:webp path/to/folder --in-place
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const WEBP_QUALITY = 85;
const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.tif', '.tiff', '.avif', '.webp']);

function printUsage() {
  console.log(`Usage:
  node scripts/convert-to-webp.mjs <input-file-or-dir> [output-file-or-dir] [--in-place]

Examples:
  node scripts/convert-to-webp.mjs ./photo.png
  node scripts/convert-to-webp.mjs ./photo.png ./photo.webp
  node scripts/convert-to-webp.mjs ./images
  node scripts/convert-to-webp.mjs ./images --in-place
`);
}

function walkFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
      continue;
    }
    results.push(fullPath);
  }
  return results;
}

async function convertFile(inputPath, outputPath, { inPlace }) {
  const inputBytes = statSync(inputPath).size;
  const body = await sharp(inputPath, { failOn: 'none' })
    .webp({ quality: WEBP_QUALITY, alphaQuality: 100, effort: 4 })
    .toBuffer();

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, body);

  if (inPlace && resolve(inputPath) !== resolve(outputPath) && existsSync(inputPath)) {
    unlinkSync(inputPath);
  }

  console.log(
    `OK  ${inputPath}  ${inputBytes}B → ${body.length}B  →  ${outputPath}`,
  );
}

function defaultOutputFor(inputPath) {
  return inputPath.replace(/\.[^.]+$/i, '.webp');
}

async function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.length === 0 || rawArgs.includes('--help') || rawArgs.includes('-h')) {
    printUsage();
    process.exitCode = rawArgs.length === 0 ? 1 : 0;
    return;
  }

  const args = rawArgs.filter((arg) => arg !== '--in-place');
  const inPlace = rawArgs.includes('--in-place');

  const inputPath = resolve(args[0]);
  if (!existsSync(inputPath)) {
    throw new Error(`Input not found: ${inputPath}`);
  }

  const inputStat = statSync(inputPath);

  if (inputStat.isFile()) {
    const outputPath = resolve(args[1] ?? defaultOutputFor(inputPath));
    await convertFile(inputPath, outputPath, { inPlace });
    return;
  }

  if (!inputStat.isDirectory()) {
    throw new Error(`Unsupported input: ${inputPath}`);
  }

  const outputRoot = args[1] ? resolve(args[1]) : inputPath;
  const files = walkFiles(inputPath).filter((filePath) =>
    RASTER_EXTENSIONS.has(extname(filePath).toLowerCase()),
  );

  if (files.length === 0) {
    console.log('No raster images found.');
    return;
  }

  for (const filePath of files) {
    const relativeName = filePath.slice(inputPath.length).replace(/^[/\\]/, '');
    const outputPath = inPlace
      ? defaultOutputFor(filePath)
      : join(outputRoot, relativeName.replace(/\.[^.]+$/i, '.webp'));

    // Skip rewriting an identical webp onto itself unless quality re-encode is wanted.
    if (
      extname(filePath).toLowerCase() === '.webp' &&
      resolve(filePath) === resolve(outputPath) &&
      !inPlace
    ) {
      continue;
    }

    await convertFile(filePath, outputPath, {
      inPlace: inPlace && extname(filePath).toLowerCase() !== '.webp',
    });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
