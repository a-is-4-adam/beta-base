/*
  Warnings:

  - Added the required column `updatedAt` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('SEND', 'FLASH');

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "status" "LogStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
