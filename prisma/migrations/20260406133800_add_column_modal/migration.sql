/*
  Warnings:

  - Added the required column `columnId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ColumnType" AS ENUM ('column_todo', 'column_inprogress', 'column_done');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "columnId" "ColumnType" NOT NULL;
