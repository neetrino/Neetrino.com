/**
 * One-off: upload new portfolio banners to R2 and upsert PortfolioAsset rows.
 *
 * Usage: node scripts/seed-new-portfolio-banners.mjs
 */
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const ASSETS = join(
  process.env.USERPROFILE ?? '',
  '.cursor/projects/d-Neetrino/assets',
);
const WEBP_QUALITY = 85;

const BANNERS = [
  {
    title: 'Avetis',
    alt: 'Avetis handmade jewelry website',
    projectUrl: 'https://avetis.am/',
    file: 'c__Users_ROG_AppData_Roaming_Cursor_User_workspaceStorage_79b54ca705d2ee77c9a9b440b98f94bc_images_Avetis_Banner-b5ca7c0a-0a94-4ca1-ace7-661a35675a15.png',
    match: /avetis/i,
  },
  {
    title: 'Hay Masters',
    alt: 'Hay Masters portfolio website',
    projectUrl: 'https://haymasters.am/',
    file: 'c__Users_ROG_AppData_Roaming_Cursor_User_workspaceStorage_79b54ca705d2ee77c9a9b440b98f94bc_images_Hay_Masters_Banner-33ea49e1-d3f0-4355-af68-6e69a9230b2f.png',
    match: /hay\s*masters/i,
  },
  {
    title: 'Lilis Flowers',
    alt: 'Lilis Flowers website',
    projectUrl: 'https://lilisflowers.am/',
    file: 'c__Users_ROG_AppData_Roaming_Cursor_User_workspaceStorage_79b54ca705d2ee77c9a9b440b98f94bc_images_LILIS_BANNER-464a8167-af8d-4373-8e6b-ae529255b6e5.png',
    match: /lilis/i,
  },
  {
    title: 'Ncie',
    alt: 'National Center for Innovation and Entrepreneurship',
    projectUrl: 'https://ncie.am/en/',
    file: 'c__Users_ROG_AppData_Roaming_Cursor_User_workspaceStorage_79b54ca705d2ee77c9a9b440b98f94bc_images_ncie_banner-a3dc8811-ead8-4e2a-8a21-7b4f7bc896aa.png',
    match: /ncie/i,
  },
  {
    title: 'Qualitech Machinery',
    alt: 'Qualitech Machinery website',
    projectUrl: 'https://www.instrument.am/',
    file: 'c__Users_ROG_AppData_Roaming_Cursor_User_workspaceStorage_79b54ca705d2ee77c9a9b440b98f94bc_images_Qualitech_Banner-0cf7a150-1c1a-4b18-8371-99641f70b199.png',
    match: /qualitech/i,
  },
];

function loadEnv(filePath) {
  try {
    for (const rawLine of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
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

function createObjectKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `portfolio/${year}/${month}/${randomUUID()}.webp`;
}

async function toWebpBuffer(inputPath) {
  return sharp(inputPath, { failOn: 'none' }).webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
}

async function main() {
  loadEnv(join(ROOT, '.env'));
  loadEnv(join(ROOT, '.env.local'));

  const bucket = requireEnv('R2_BUCKET_NAME');
  const publicUrl = requireEnv('R2_PUBLIC_URL').replace(/\/$/, '');
  const client = createR2Client();
  const prisma = new PrismaClient();

  try {
    const existing = await prisma.portfolioAsset.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, sortOrder: true, key: true },
    });
    let nextSort =
      existing.length > 0 ? Math.max(...existing.map((row) => row.sortOrder)) + 1 : 0;

    for (const banner of BANNERS) {
      const inputPath = join(ASSETS, banner.file);
      const webp = await toWebpBuffer(inputPath);
      const key = createObjectKey();

      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: webp,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );

      const url = `${publicUrl}/${key}`;
      const match = existing.find((row) => banner.match.test(row.title));

      if (match) {
        await prisma.portfolioAsset.update({
          where: { id: match.id },
          data: {
            title: banner.title,
            alt: banner.alt,
            projectUrl: banner.projectUrl,
            key,
            url,
            contentType: 'image/webp',
            sizeBytes: webp.byteLength,
            assetType: 'IMAGE',
            status: 'ACTIVE',
          },
        });
        console.log(`updated\t${banner.title}\t${url}`);
      } else {
        await prisma.portfolioAsset.create({
          data: {
            title: banner.title,
            alt: banner.alt,
            projectUrl: banner.projectUrl,
            key,
            url,
            contentType: 'image/webp',
            sizeBytes: webp.byteLength,
            assetType: 'IMAGE',
            status: 'ACTIVE',
            sortOrder: nextSort,
          },
        });
        console.log(`created\t${banner.title}\tsort=${nextSort}\t${url}`);
        nextSort += 1;
      }
    }

    const finalRows = await prisma.portfolioAsset.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { title: true, sortOrder: true, status: true, projectUrl: true },
    });
    console.log('\nPortfolio assets:');
    console.log(JSON.stringify(finalRows, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
