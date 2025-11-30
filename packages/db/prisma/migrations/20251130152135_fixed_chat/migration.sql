/*
  Warnings:

  - A unique constraint covering the columns `[fid]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_fid_key" ON "Chat"("fid");
