-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('ctest', 'eiken', 'kyote');

-- CreateEnum
CREATE TYPE "ResourceState" AS ENUM ('ok', 'new');

-- CreateTable
CREATE TABLE "auth_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "full_name" TEXT,
    "display_name" TEXT,
    "email" TEXT,
    "code" TEXT,

    CONSTRAINT "auth_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "active_expires" BIGINT NOT NULL,
    "idle_expires" BIGINT NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_keys" (
    "id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "auth_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "exam_type" "ExamType" NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("exam_type")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "exam_type" "ExamType" NOT NULL,
    "year" INTEGER NOT NULL,
    "publisher" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "num_of" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "short_title" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id","exam_type")
);

-- CreateTable
CREATE TABLE "temp_resources" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "state" "ResourceState" NOT NULL,
    "exam_type" "ExamType" NOT NULL,
    "year" INTEGER NOT NULL,
    "publisher" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "num_of" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "short_title" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "temp_resources_pkey" PRIMARY KEY ("id","session_id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_id_key" ON "auth_users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_username_key" ON "auth_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_users_code_key" ON "auth_users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_id_key" ON "auth_sessions"("id");

-- CreateIndex
CREATE INDEX "auth_sessions_user_id_idx" ON "auth_sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_keys_id_key" ON "auth_keys"("id");

-- CreateIndex
CREATE INDEX "auth_keys_user_id_idx" ON "auth_keys"("user_id");

-- CreateIndex
CREATE INDEX "resources_exam_type_idx" ON "resources"("exam_type");

-- CreateIndex
CREATE INDEX "temp_resources_exam_type_idx" ON "temp_resources"("exam_type");

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_keys" ADD CONSTRAINT "auth_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_resources" ADD CONSTRAINT "temp_resources_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
