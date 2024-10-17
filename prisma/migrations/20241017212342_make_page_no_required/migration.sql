/*
  Warnings:

  - Made the column `pageNo` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "pageNo" SET NOT NULL;
