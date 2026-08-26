import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GetBucketCorsCommand, PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const CORS_RULES = [
  {
    AllowedOrigins: [
      'https://www.neetrino.com',
      'https://neetrino.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD'],
    AllowedHeaders: ['Content-Type'],
    ExposeHeaders: ['ETag', 'Content-Type', 'Content-Length'],
    MaxAgeSeconds: 86400,
  },
];

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

async function main() {
  loadEnvFile(join(ROOT, '.env.local'));
  loadEnvFile(join(ROOT, '.env'));

  const accountId = requireEnv('R2_ACCOUNT_ID');
  const bucketName = requireEnv('R2_BUCKET_NAME');
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
  });

  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: { CORSRules: CORS_RULES },
    }),
  );

  const current = await client.send(new GetBucketCorsCommand({ Bucket: bucketName }));
  const methods = current.CORSRules?.flatMap((rule) => rule.AllowedMethods ?? []) ?? [];
  const origins = current.CORSRules?.flatMap((rule) => rule.AllowedOrigins ?? []) ?? [];

  if (!methods.includes('PUT') || !origins.includes('https://www.neetrino.com')) {
    throw new Error('R2 CORS was written but does not allow PUT from https://www.neetrino.com.');
  }

  console.log(`R2 CORS applied on bucket ${bucketName} for browser PUT uploads.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
