/*
  Warnings:

  - The primary key for the `resource_temp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `session` on the `resource_temp` table. All the data in the column will be lost.
  - Added the required column `session_id` to the `resource_temp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'STAFF';

-- AlterTable
ALTER TABLE "resource_temp" DROP CONSTRAINT "resource_temp_pkey",
DROP COLUMN "session",
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD CONSTRAINT "resource_temp_pkey" PRIMARY KEY ("id", "session_id");

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "sei" TEXT NOT NULL,
    "mei" TEXT NOT NULL,
    "sei_kana" TEXT NOT NULL,
    "mei_kana" TEXT NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_user_link" (
    "id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "staff_user_link_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resource_temp" ADD CONSTRAINT "resource_temp_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_user_link" ADD CONSTRAINT "staff_user_link_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_user_link" ADD CONSTRAINT "staff_user_link_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
