'use strict';

const { PrismaClient } = require('@prisma/client');

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

// Singleton Prisma client for the entire backend process.
// This avoids creating multiple connection pools (one per route/controller),
// which can otherwise lead to intermittent 500s on low-connection Postgres tiers.
const prisma = new PrismaClient();

module.exports = prisma;
