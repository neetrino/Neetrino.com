import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const R2_ENDPOINT_HOST_SUFFIX = '.r2.cloudflarestorage.com';

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
};

type DeleteR2ObjectInput = {
  key: string;
};

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
  });
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
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return {
    key: input.key,
    url: `${config.publicUrl}/${input.key}`,
  };
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
