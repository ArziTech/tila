-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 3;
