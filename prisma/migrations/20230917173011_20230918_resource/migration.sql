-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('ctest', 'eiken');

-- CreateEnum
CREATE TYPE "ResourceState" AS ENUM ('ok', 'new', 'missing');

-- CreateTable
CREATE TABLE "exam" (
    "exam_type" "ExamType" NOT NULL,
    "short_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("exam_type")
);

-- CreateTable
CREATE TABLE "resource" (
    "id" TEXT NOT NULL,
    "exam_type" "ExamType" NOT NULL,
    "year" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "num_of" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_temp" (
    "id" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "state" "ResourceState" NOT NULL,
    "exam_type" "ExamType" NOT NULL,
    "year" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "num_of" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "resource_temp_pkey" PRIMARY KEY ("id","session")
);

-- CreateIndex
CREATE INDEX "resource_exam_type_idx" ON "resource"("exam_type");

-- CreateIndex
CREATE INDEX "resource_temp_exam_type_idx" ON "resource_temp"("exam_type");
