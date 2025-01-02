/*
  Warnings:

  - Made the column `slug` on table `Chapter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Chapter_slug_idx" ON "Chapter"("slug");
