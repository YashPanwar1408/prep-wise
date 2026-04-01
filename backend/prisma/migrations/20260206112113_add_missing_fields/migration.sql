/*
  Warnings:

  - You are about to drop the column `functionName` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `errorInfo` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `passed` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `LearnTopic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey (idempotent)
ALTER TABLE "LearnCategory" DROP CONSTRAINT IF EXISTS "LearnCategory_domainId_fkey";

-- DropForeignKey (idempotent)
ALTER TABLE "LearnTopic" DROP CONSTRAINT IF EXISTS "LearnTopic_categoryId_fkey";

-- DropIndex (idempotent — the index may not exist)
DROP INDEX IF EXISTS "LearnTopic_categoryId_slug_key";

-- AlterTable
ALTER TABLE "LearnCategory" ALTER COLUMN "order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "LearnDomain" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LearnTopic" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "LearnTopic" ALTER COLUMN "order" DROP DEFAULT;

-- NOTE: Skipping DROP COLUMN "functionName" on Problem — it is added back by migration 20260302000000

-- AlterTable (idempotent)
ALTER TABLE "Submission" DROP COLUMN IF EXISTS "errorInfo";
ALTER TABLE "Submission" DROP COLUMN IF EXISTS "passed";
ALTER TABLE "Submission" DROP COLUMN IF EXISTS "total";

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "LearnCategory_domainId_idx" ON "LearnCategory"("domainId");

-- CreateIndex (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "LearnTopic_slug_key" ON "LearnTopic"("slug");

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "LearnTopic_categoryId_idx" ON "LearnTopic"("categoryId");

-- AddForeignKey (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LearnCategory_domainId_fkey') THEN
    ALTER TABLE "LearnCategory" ADD CONSTRAINT "LearnCategory_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "LearnDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LearnTopic_categoryId_fkey') THEN
    ALTER TABLE "LearnTopic" ADD CONSTRAINT "LearnTopic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LearnCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
