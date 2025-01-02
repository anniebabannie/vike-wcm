/*
  Warnings:

  - You are about to drop the column `page_no` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pageNo]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "page_no",
ADD COLUMN     "pageNo" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Page_pageNo_key" ON "Page"("pageNo");
