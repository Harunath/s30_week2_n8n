/*
  Warnings:

  - You are about to drop the column `CredentialsId` on the `CredentialsObjects` table. All the data in the column will be lost.
  - Added the required column `CredentialsId` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CredentialsObjects" DROP CONSTRAINT "CredentialsObjects_CredentialsId_fkey";

-- AlterTable
ALTER TABLE "public"."Credentials" ADD COLUMN     "CredentialsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."CredentialsObjects" DROP COLUMN "CredentialsId";

-- AddForeignKey
ALTER TABLE "public"."Credentials" ADD CONSTRAINT "Credentials_CredentialsId_fkey" FOREIGN KEY ("CredentialsId") REFERENCES "public"."CredentialsObjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
