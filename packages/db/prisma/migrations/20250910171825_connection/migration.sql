/*
  Warnings:

  - You are about to drop the column `integrationId` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Workflow` table. All the data in the column will be lost.
  - You are about to drop the column `triggerType` on the `Workflow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workflowId,idx]` on the table `Node` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `AvaliableIntegrations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AvaliableIntegrationsId` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credentialsId` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowId` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."NodeType" AS ENUM ('TRIGGER_MANUAL', 'TRIGGER_WEBHOOK', 'ACTION');

-- DropForeignKey
ALTER TABLE "public"."Node" DROP CONSTRAINT "Node_integrationId_fkey";

-- AlterTable
ALTER TABLE "public"."AvaliableIntegrations" ADD COLUMN     "type" "public"."NodeType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Node" DROP COLUMN "integrationId",
ADD COLUMN     "AvaliableIntegrationsId" TEXT NOT NULL,
ADD COLUMN     "credentialsId" TEXT NOT NULL,
ADD COLUMN     "idx" INTEGER,
ADD COLUMN     "workflowId" TEXT NOT NULL,
ADD COLUMN     "x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "y" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."Workflow" DROP COLUMN "icon",
DROP COLUMN "triggerType",
ADD COLUMN     "canvasX" DOUBLE PRECISION,
ADD COLUMN     "canvasY" DOUBLE PRECISION,
ADD COLUMN     "canvasZoom" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."triggerType";

-- CreateTable
CREATE TABLE "public"."Connection" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "fromPort" TEXT,
    "fromIndex" INTEGER,
    "toPort" TEXT,
    "toIndex" INTEGER,
    "condition" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Connection_workflowId_fromNodeId_idx" ON "public"."Connection"("workflowId", "fromNodeId");

-- CreateIndex
CREATE INDEX "Connection_workflowId_toNodeId_idx" ON "public"."Connection"("workflowId", "toNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_workflowId_fromNodeId_fromPort_fromIndex_toNodeI_key" ON "public"."Connection"("workflowId", "fromNodeId", "fromPort", "fromIndex", "toNodeId", "toPort", "toIndex");

-- CreateIndex
CREATE INDEX "AvaliableIntegrations_name_idx" ON "public"."AvaliableIntegrations"("name");

-- CreateIndex
CREATE INDEX "Node_workflowId_idx" ON "public"."Node"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "Node_workflowId_idx_key" ON "public"."Node"("workflowId", "idx");

-- CreateIndex
CREATE INDEX "Workflow_name_idx" ON "public"."Workflow"("name");

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Node" ADD CONSTRAINT "Node_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Node" ADD CONSTRAINT "Node_credentialsId_fkey" FOREIGN KEY ("credentialsId") REFERENCES "public"."Credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Node" ADD CONSTRAINT "Node_AvaliableIntegrationsId_fkey" FOREIGN KEY ("AvaliableIntegrationsId") REFERENCES "public"."AvaliableIntegrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "public"."Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "public"."Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
