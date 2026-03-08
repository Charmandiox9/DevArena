/*
  Warnings:

  - You are about to drop the column `expectedSolution` on the `challenges` table. All the data in the column will be lost.
  - You are about to drop the column `isCorrect` on the `submissions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'EVALUATING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "challenges" DROP COLUMN "expectedSolution",
ADD COLUMN     "referenceSolution" TEXT;

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "isCorrect",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "test_cases" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "challengeId" TEXT NOT NULL,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_cases_challengeId_idx" ON "test_cases"("challengeId");

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
