import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '@/lib/logger';
import {
  convertImageBufferToWebp,
  replaceKeyExtensionWithWebp,
} from '@/lib/images/convert-to-webp';

const R2_ENDPOINT_HOST_SUFFIX = '.r2.cloudflarestorage.com';
const PRESIGNED_PUT_EXPIRES_SECONDS = 30 * 60;
const R2_OBJECT_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const PRESIGNED_UNHOISTABLE_HEADERS = new Set([
  'x-amz-checksum-crc32',
  'x-amz-checksum-crc32c',
  'x-amz-sdk-checksum-algorithm',
  'x-amz-checksum-algorithm',
]);

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
};

type UploadR2ObjectInput = {
  key: string;
  body: Buffer;
  contentType: string;
};

type UploadR2ObjectResult = {
  key: string;
  url: string;
  contentType: string;
  sizeBytes: number;
};

type DeleteR2ObjectInput = {
  key: string;
};

type HeadR2ObjectResult = {
  contentType: string | undefined;
  sizeBytes: number;
};

let browserUploadCorsReady = false;

export class R2ConfigurationError extends Error {
  constructor(name: string) {
    super(`${name} is required for Cloudflare R2 uploads.`);
    this.name = 'R2ConfigurationError';
  }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new R2ConfigurationError(name);
  }

  return value;
}

function getR2Config(): R2Config {
  return {
    accountId: getRequiredEnv('R2_ACCOUNT_ID'),
    accessKeyId: getRequiredEnv('R2_ACCESS_KEY_ID'),
    secretAccessKey: getRequiredEnv('R2_SECRET_ACCESS_KEY'),
    bucketName: getRequiredEnv('R2_BUCKET_NAME'),
    publicUrl: getRequiredEnv('R2_PUBLIC_URL').replace(/\/$/, ''),
  };
}

function createR2Client(config: R2Config): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}${R2_ENDPOINT_HOST_SUFFIX}`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
}

export function getR2PublicObjectUrl(key: string): string {
  return `${getR2Config().publicUrl}/${key}`;
}

async function ensureR2BrowserUploadCors(client: S3Client, config: R2Config): Promise<void> {
  if (browserUploadCorsReady) {
    return;
  }

  try {
    await client.send(
      new PutBucketCorsCommand({
        Bucket: config.bucketName,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: ['*'],
              AllowedMethods: ['GET', 'PUT', 'HEAD'],
              AllowedHeaders: ['*'],
              ExposeHeaders: ['ETag', 'Location'],
              MaxAgeSeconds: 86400,
            },
          ],
        },
      }),
    );
    browserUploadCorsReady = true;
  } catch (error) {
    logger.error('Failed to apply Cloudflare R2 CORS for browser uploads.', { error });
  }
}

export async function uploadR2Object(input: UploadR2ObjectInput): Promise<UploadR2ObjectResult> {
  const config = getR2Config();
  const client = createR2Client(config);

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: R2_OBJECT_CACHE_CONTROL,
    }),
  );

  return {
    key: input.key,
    url: `${config.publicUrl}/${input.key}`,
    contentType: input.contentType,
    sizeBytes: input.body.byteLength,
  };
}

/**
 * Converts a raster image to WebP, then uploads it to R2.
 * The object key extension is forced to `.webp`.
 */
export async function uploadR2ImageAsWebp(input: {
  key: string;
  body: Buffer;
}): Promise<UploadR2ObjectResult> {
  const webp = await convertImageBufferToWebp(input.body);
  const key = replaceKeyExtensionWithWebp(input.key);

  return uploadR2Object({
    key,
    body: webp.body,
    contentType: webp.contentType,
  });
}

export async function deleteR2Object(input: DeleteR2ObjectInput): Promise<void> {
  const config = getR2Config();
  const client = createR2Client(config);

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: input.key,
    }),
  );
}

export async function createR2PresignedPutUrl(input: {
  key: string;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string }> {
  const config = getR2Config();
  const client = createR2Client(config);
  await ensureR2BrowserUploadCors(client, config);

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: input.key,
      ContentType: input.contentType,
    }),
    {
      expiresIn: PRESIGNED_PUT_EXPIRES_SECONDS,
      unhoistableHeaders: PRESIGNED_UNHOISTABLE_HEADERS,
    },
  );

  return {
    uploadUrl,
    publicUrl: `${config.publicUrl}/${input.key}`,
  };
}

export async function headR2Object(key: string): Promise<HeadR2ObjectResult> {
  const config = getR2Config();
  const client = createR2Client(config);
  const result = await client.send(
    new HeadObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    }),
  );

  if (typeof result.ContentLength !== 'number') {
    throw new Error('Uploaded object is missing a size.');
  }

  return {
    contentType: result.ContentType,
    sizeBytes: result.ContentLength,
  };
}

export async function getR2ObjectBuffer(key: string): Promise<Buffer> {
  const config = getR2Config();
  const client = createR2Client(config);
  const result = await client.send(
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    }),
  );

  if (!result.Body) {
    throw new Error('Uploaded object body is empty.');
  }

  return Buffer.from(await result.Body.transformToByteArray());
}
