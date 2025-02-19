/*
  Warnings:

  - You are about to drop the `supportRequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "supportRequests" DROP CONSTRAINT "supportRequests_user_id_fkey";

-- DropTable
DROP TABLE "supportRequests";

-- CreateTable
CREATE TABLE "supportrequests" (
    "id" SERIAL NOT NULL,
    "request" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supportrequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "supportrequests" ADD CONSTRAINT "supportrequests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
