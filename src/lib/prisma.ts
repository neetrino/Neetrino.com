import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
  });
}

/**
 * In dev, Next can keep a cached PrismaClient across HMR. After schema changes
 * (e.g. new Partner model), recreate the client so delegates stay in sync.
 */
function getPrismaClient(): PrismaClient {
  const existing = globalForPrisma.prisma;

  if (existing && typeof existing.partner?.findMany === 'function') {
    return existing;
  }

  if (existing) {
    void existing.$disconnect().catch(() => undefined);
  }

  const client = createPrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
}

export const prisma = getPrismaClient();
