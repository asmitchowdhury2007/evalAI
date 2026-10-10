/*
  Warnings:

  - You are about to drop the column `filePath` on the `Upload` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "filePath",
ADD COLUMN     "error" TEXT,
ADD COLUMN     "rawText" TEXT;
