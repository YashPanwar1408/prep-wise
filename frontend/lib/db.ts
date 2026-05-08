import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrlError() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return 'DATABASE_URL is missing.';
  }

  if (databaseUrl.includes('prisma_migrate_shadow_db_')) {
    return 'DATABASE_URL points to a Prisma shadow database. Replace it with your main Neon database connection string.';
  }

  return null;
}

const databaseUrlError = getDatabaseUrlError();

if (databaseUrlError) {
  throw new Error(`Prisma configuration error: ${databaseUrlError}`);
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
