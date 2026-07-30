import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'blog', 'demo');

const COVER_WIDTH = 1200;
const COVER_HEIGHT = 750;

/** Distinct Neetrino-adjacent palettes for demo blog covers. */
export const BLOG_DEMO_COVERS = [
  { slug: 'demo-shipping-smaller-releases', colors: ['#0b1f38', '#1a5f9c', '#38b0ff'] },
  { slug: 'demo-design-systems-that-scale', colors: ['#10263f', '#2a6f8f', '#7ed0ff'] },
  { slug: 'demo-api-error-contracts', colors: ['#0d2238', '#164e78', '#4cc9f0'] },
  { slug: 'demo-discovery-before-build', colors: ['#122a48', '#1f6a8a', '#9ad7ff'] },
  { slug: 'demo-neetrino-studio-notes', colors: ['#0a1a2e', '#245a88', '#5eb8ff'] },
  { slug: 'demo-mobile-perf-checklist', colors: ['#132f4f', '#1d6d75', '#6ef3d6'] },
  { slug: 'demo-onboarding-that-converts', colors: ['#101f36', '#3a5f9a', '#8ab4ff'] },
  { slug: 'demo-accessible-forms', colors: ['#0e243c', '#2f6280', '#a8e6ff'] },
  { slug: 'demo-postgres-indexing-basics', colors: ['#0c1c30', '#1b4d6b', '#3dd6c3'] },
  { slug: 'demo-roadmap-rituals', colors: ['#142842', '#2d5f8a', '#ffc857'] },
  { slug: 'demo-brand-motion-principles', colors: ['#0f223a', '#355f8f', '#ff8fab'] },
  { slug: 'demo-secure-session-cookies', colors: ['#0b1b2d', '#1a4568', '#7cf0c3'] },
  { slug: 'demo-hiring-builders', colors: ['#12253f', '#2a5580', '#f4d35e'] },
  { slug: 'demo-content-ops-for-saas', colors: ['#0e2036', '#25607a', '#b8f2e6'] },
  { slug: 'demo-launch-week-playbook', colors: ['#101e34', '#1f5080', '#ff9f1c'] },
];

export function blogDemoCoverPath(slug) {
  return `/blog/demo/${slug}.webp`;
}

function buildCoverSvg(_slug, colors) {
  const [base, mid, accent] = colors;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${COVER_WIDTH}" height="${COVER_HEIGHT}" viewBox="0 0 ${COVER_WIDTH} ${COVER_HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${base}"/>
      <stop offset="55%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.85"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="18%" r="48%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <circle cx="180" cy="560" r="220" fill="${accent}" fill-opacity="0.12"/>
  <circle cx="980" cy="520" r="160" fill="#ffffff" fill-opacity="0.06"/>
  <rect x="72" y="72" width="120" height="6" rx="3" fill="${accent}"/>
</svg>`;
}

export async function generateBlogDemoCovers() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const cover of BLOG_DEMO_COVERS) {
    const svg = Buffer.from(buildCoverSvg(cover.slug, cover.colors));
    const outPath = join(OUT_DIR, `${cover.slug}.webp`);
    await sharp(svg).webp({ quality: 84 }).toFile(outPath);
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  await generateBlogDemoCovers();
  console.log(`Generated ${BLOG_DEMO_COVERS.length} covers in public/blog/demo`);
}
