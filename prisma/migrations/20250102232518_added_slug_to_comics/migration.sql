/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Comic` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comic" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Comic_slug_key" ON "Comic"("slug");
