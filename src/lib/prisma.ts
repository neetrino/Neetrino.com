import { Prisma, PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error'],
  });
}

function generatedClientHasContactQuoteFields(): boolean {
  const model = Prisma.dmmf.datamodel.models.find((entry) => entry.name === 'ContactMessage');
  if (!model) {
    return false;
  }

  const fieldNames = new Set(model.fields.map((field) => field.name));
  return (
    fieldNames.has('phone') &&
    fieldNames.has('projectType') &&
    fieldNames.has('projectGoal') &&
    fieldNames.has('budget') &&
    fieldNames.has('timeline')
  );
}

/**
 * In dev, Next can keep a cached PrismaClient across HMR. After schema changes
 * (e.g. new Partner model / ContactMessage quote fields), recreate the client
 * so delegates stay in sync with the generated Prisma Client.
 */
function getPrismaClient(): PrismaClient {
  const existing = globalForPrisma.prisma;
  const isCompatible =
    generatedClientHasContactQuoteFields() && typeof existing?.partner?.findMany === 'function';

  if (existing && isCompatible) {
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
