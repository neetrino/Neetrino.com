import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

function loadEnv(filePath) {
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
}

loadEnv(join(ROOT, '.env'));

const publicUrl = (process.env.R2_PUBLIC_URL ?? process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '').replace(
  /\/$/,
  '',
);

if (!publicUrl) {
  throw new Error('R2_PUBLIC_URL is required to seed partner URLs.');
}

const SEED_PARTNERS = [
  { name: 'Marco Group', file: 'marco-group.webp' },
  { name: 'Borbor Aqua', file: 'borbor-aqua.webp' },
  { name: 'Mika Kids Dental Clinic', file: 'mika-kids.webp' },
  { name: 'Avetis', file: 'alatis.webp' },
  { name: 'Hay Masters', file: 'hay-masters.webp' },
];

const prisma = new PrismaClient();

try {
  const existing = await prisma.partner.count();
  if (existing > 0) {
    console.log(`Partners already seeded (${existing}). Skipping.`);
    process.exit(0);
  }

  for (const [index, partner] of SEED_PARTNERS.entries()) {
    const key = `static/figma-home/partners/${partner.file}`;
    const url = `${publicUrl}/${key}`;

    await prisma.partner.create({
      data: {
        name: partner.name,
        alt: partner.name,
        status: 'ACTIVE',
        sortOrder: index,
        key,
        url,
        contentType: 'image/webp',
        sizeBytes: 0,
      },
    });

    console.log('Seeded', partner.name, '→', url);
  }

  console.log('Done.');
} finally {
  await prisma.$disconnect();
}
