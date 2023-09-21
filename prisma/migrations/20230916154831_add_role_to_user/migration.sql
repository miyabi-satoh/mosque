-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "auth_user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
