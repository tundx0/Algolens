-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('VIEWED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlgorithmProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "algorithmId" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'VIEWED',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlgorithmProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlgorithmProgress_userId_algorithmId_key" ON "AlgorithmProgress"("userId", "algorithmId");

-- AddForeignKey
ALTER TABLE "AlgorithmProgress" ADD CONSTRAINT "AlgorithmProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
