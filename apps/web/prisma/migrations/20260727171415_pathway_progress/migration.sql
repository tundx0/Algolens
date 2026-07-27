-- CreateTable
CREATE TABLE "PathwayProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pathwayId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathwayProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PathwayProgress_userId_pathwayId_stepId_key" ON "PathwayProgress"("userId", "pathwayId", "stepId");

-- AddForeignKey
ALTER TABLE "PathwayProgress" ADD CONSTRAINT "PathwayProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
