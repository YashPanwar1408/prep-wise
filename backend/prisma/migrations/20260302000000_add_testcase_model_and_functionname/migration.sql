-- Migration: add_testcase_model_and_functionname
-- Generated: 2026-03-02
-- Adds:
--   1. functionName (nullable) column to "Problem"
--   2. "TestCase" table with isSample flag and composite index

-- 1. Add functionName to Problem
ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "functionName" TEXT;

-- 2. Create TestCase table
CREATE TABLE IF NOT EXISTS "TestCase" (
    "id"        TEXT         NOT NULL,
    "problemId" TEXT         NOT NULL,
    "input"     TEXT         NOT NULL,
    "output"    TEXT         NOT NULL,
    "isSample"  BOOLEAN      NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- 3. Foreign key to Problem
ALTER TABLE "TestCase"
    ADD CONSTRAINT "TestCase_problemId_fkey"
    FOREIGN KEY ("problemId")
    REFERENCES "Problem"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 4. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS "TestCase_problemId_idx"          ON "TestCase" ("problemId");
CREATE INDEX IF NOT EXISTS "TestCase_problemId_isSample_idx" ON "TestCase" ("problemId", "isSample");
