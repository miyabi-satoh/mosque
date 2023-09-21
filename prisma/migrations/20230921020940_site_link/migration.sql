/*
  Warnings:

  - Added the required column `label_grade` to the `exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_numof` to the `exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short_title` to the `resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short_title` to the `resource_temp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exam" ADD COLUMN     "label_grade" TEXT NOT NULL,
ADD COLUMN     "label_numof" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "resource" ADD COLUMN     "short_title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "resource_temp" ADD COLUMN     "short_title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "site_link" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "site_link_pkey" PRIMARY KEY ("id")
);
