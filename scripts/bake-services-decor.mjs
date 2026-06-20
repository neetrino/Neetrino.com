import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

import { chromium } from 'playwright';
import sharp from 'sharp';

const BAKE_PORT = Number(process.env.BAKE_PORT ?? 3456);
const USE_RUNNING_SERVER = process.env.BAKE_USE_RUNNING_SERVER === '1';
const BAKE_PATH = '/services-decor-bake';
const BAKE_SELECTOR = '.services-decor-bake-root';
const BAKE_VIEWPORT_HEIGHT = 2095;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(scriptDir, '..');
const outputDir = path.join(projectRoot, 'public', 'services', 'optimized');
const outputWebp = path.join(outputDir, 'decor-stack.webp');

async function waitForServer(baseUrl, attempts = 90) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${BAKE_PATH}`);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still booting.
    }

    await delay(1000);
  }

  throw new Error(`Dev server did not become ready at ${baseUrl}${BAKE_PATH}`);
}

function startDevServer() {
  return spawn('npx', ['next', 'dev', '--turbopack', '--port', String(BAKE_PORT)], {
    cwd: projectRoot,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, PORT: String(BAKE_PORT) },
  });
}

async function bakeDecorStack() {
  fs.mkdirSync(outputDir, { recursive: true });

  const baseUrl = `http://127.0.0.1:${BAKE_PORT}`;
  const server = USE_RUNNING_SERVER ? null : startDevServer();

  try {
    await waitForServer(baseUrl);

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1440, height: BAKE_VIEWPORT_HEIGHT },
      deviceScaleFactor: 1,
    });

    await page.goto(`${baseUrl}${BAKE_PATH}`, { waitUntil: 'networkidle', timeout: 120_000 });
    await page.waitForSelector(BAKE_SELECTOR, { timeout: 30_000 });
    await page.waitForTimeout(1500);

    const screenshot = await page.locator(BAKE_SELECTOR).screenshot({ type: 'png' });
    await browser.close();

    await sharp(screenshot).webp({ quality: 92, effort: 6 }).toFile(outputWebp);
    console.log(`Wrote ${path.relative(projectRoot, outputWebp)}`);
  } finally {
    server?.kill('SIGTERM');
  }
}

bakeDecorStack().catch((error) => {
  console.error(error);
  process.exit(1);
});
