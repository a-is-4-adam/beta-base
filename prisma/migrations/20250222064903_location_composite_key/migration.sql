/*
  Warnings:

  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `locationId` on the `Route` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationOrganizationId` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationSlug` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_locationId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("organizationId", "slug");

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "locationId",
ADD COLUMN     "locationOrganizationId" TEXT NOT NULL,
ADD COLUMN     "locationSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE INDEX "Route_locationOrganizationId_locationSlug_idx" ON "Route"("locationOrganizationId", "locationSlug");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_locationOrganizationId_locationSlug_fkey" FOREIGN KEY ("locationOrganizationId", "locationSlug") REFERENCES "Location"("organizationId", "slug") ON DELETE RESTRICT ON UPDATE CASCADE;
