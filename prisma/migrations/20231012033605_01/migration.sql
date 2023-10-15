/*
  Warnings:

  - You are about to drop the column `password` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "password",
DROP COLUMN "username";
