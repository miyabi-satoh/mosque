/*
  Warnings:

  - You are about to drop the column `last_dir` on the `archives` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `archives` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `archives` table. All the data in the column will be lost.
  - You are about to drop the `exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `temp_resources` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[archiveId,path]` on the table `archive_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `archives` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `archive_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `archives` table without a default value. This is not possible if the table is not empty.
  - Added the required column `root` to the `archives` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "temp_resources" DROP CONSTRAINT "temp_resources_session_id_fkey";

-- DropIndex
DROP INDEX "archives_slug_key";

-- AlterTable
ALTER TABLE "archive_items" ADD COLUMN     "grade" INTEGER,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "section" INTEGER,
ADD COLUMN     "str_grade" TEXT,
ADD COLUMN     "str_section" TEXT,
ADD COLUMN     "str_year" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "archives" DROP COLUMN "last_dir",
DROP COLUMN "module",
DROP COLUMN "slug",
ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "root" TEXT NOT NULL;

-- DropTable
DROP TABLE "exams";

-- DropTable
DROP TABLE "resources";

-- DropTable
DROP TABLE "temp_resources";

-- DropEnum
DROP TYPE "ExamType";

-- DropEnum
DROP TYPE "ResourceState";

-- CreateIndex
CREATE UNIQUE INDEX "archive_items_archiveId_path_key" ON "archive_items"("archiveId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "archives_path_key" ON "archives"("path");
