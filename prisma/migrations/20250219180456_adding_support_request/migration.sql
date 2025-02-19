-- CreateTable
CREATE TABLE "supportRequests" (
    "id" SERIAL NOT NULL,
    "request" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supportRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "supportRequests" ADD CONSTRAINT "supportRequests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
