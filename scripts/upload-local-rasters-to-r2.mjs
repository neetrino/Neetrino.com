import { readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const WEBP_QUALITY = 85;
const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif']);

function loadEnvFile(filePath) {
  try {
    const text = readFileSync(filePath, 'utf8');
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }

      const eq = line.indexOf('=');
      if (eq <= 0) {
        continue;
      }

      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // optional
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
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

function createR2Client() {
  const accountId = requireEnv('R2_ACCOUNT_ID');
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
  });
}

async function toWebpBuffer(inputPath) {
  const image = sharp(inputPath, { failOn: 'none' });
  const meta = await image.metadata();
  const pipeline = image.webp({
    quality: WEBP_QUALITY,
    alphaQuality: 100,
    effort: 4,
  });

  if (meta.hasAlpha) {
    return pipeline.ensureAlpha().toBuffer();
  }

  return pipeline.toBuffer();
}

async function main() {
  loadEnvFile(join(ROOT, '.env.local'));
  loadEnvFile(join(ROOT, '.env'));

  const bucket = requireEnv('R2_BUCKET_NAME');
  const publicUrl = requireEnv('R2_PUBLIC_URL').replace(/\/$/, '');
  const client = createR2Client();

  const rasters = walkFiles(PUBLIC_DIR).filter((filePath) =>
    RASTER_EXTENSIONS.has(extname(filePath).toLowerCase()),
  );

  if (rasters.length === 0) {
    console.log('No local raster images found under public/.');
    return;
  }

  console.log(`Found ${rasters.length} raster file(s). Converting to WebP and uploading…`);

  for (const filePath of rasters) {
    const rel = relative(PUBLIC_DIR, filePath).replaceAll('\\', '/');
    const webpRel = rel.replace(/\.[^.]+$/i, '.webp');
    const r2Key = `static/${webpRel}`;
    const originalBytes = statSync(filePath).size;

    const webpBody = await toWebpBuffer(filePath);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: r2Key,
        Body: webpBody,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    const cdnUrl = `${publicUrl}/${r2Key}`;
    console.log(
      `OK  /${rel}  ${originalBytes}B → ${webpBody.length}B  →  ${cdnUrl}`,
    );

    // Keep a local webp only if needed for offline; prefer CDN. Remove original raster.
    unlinkSync(filePath);
  }

  console.log('Done. Local raster originals removed; use staticAsset("/…webp") in code.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
