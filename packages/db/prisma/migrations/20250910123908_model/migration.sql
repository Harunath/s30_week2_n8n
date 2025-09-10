/*
  Warnings:

  - Added the required column `userId` to the `Credentials` table without a default value. This is not possible if the table is not empty.
  - Made the column `apiKey` on table `Credentials` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Credentials" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "apiKey" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Credentials" ADD CONSTRAINT "Credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
