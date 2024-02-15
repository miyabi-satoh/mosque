/*
  Warnings:

  - You are about to drop the column `active_expires` on the `auth_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `idle_expires` on the `auth_sessions` table. All the data in the column will be lost.
  - You are about to drop the `auth_keys` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expires_at` to the `auth_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashed_password` to the `auth_users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArchiveModule" AS ENUM ('common', 'exam', 'kentei');

-- DropForeignKey
ALTER TABLE "auth_keys" DROP CONSTRAINT "auth_keys_user_id_fkey";

-- DropIndex
DROP INDEX "auth_sessions_id_key";

-- AlterTable
ALTER TABLE "auth_sessions" DROP COLUMN "active_expires",
DROP COLUMN "idle_expires",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "auth_users" ADD COLUMN     "hashed_password" TEXT NOT NULL;

-- DropTable
DROP TABLE "auth_keys";

-- CreateTable
CREATE TABLE "archives" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "module" "ArchiveModule" NOT NULL DEFAULT 'common',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "last_dir" TEXT,

    CONSTRAINT "archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archive_items" (
    "id" TEXT NOT NULL,
    "archiveId" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "archive_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "archives_slug_key" ON "archives"("slug");

-- AddForeignKey
ALTER TABLE "archive_items" ADD CONSTRAINT "archive_items_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "archives"("id") ON DELETE CASCADE ON UPDATE CASCADE;
