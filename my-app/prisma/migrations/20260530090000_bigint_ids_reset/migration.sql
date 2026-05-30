-- Reset existing data and recreate ID columns as autoincrementing BigInt.
DROP TABLE IF EXISTS "Wish";
DROP TABLE IF EXISTS "Payment";
DROP TABLE IF EXISTS "Invitation";
DROP TABLE IF EXISTS "Order";

CREATE TABLE "Order" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "guestNameService" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalAmount" INTEGER NOT NULL,
    "editToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Invitation" (
    "id" BIGSERIAL NOT NULL,
    "orderId" BIGINT NOT NULL,
    "templateSlug" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT,
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payment" (
    "id" BIGSERIAL NOT NULL,
    "orderId" BIGINT NOT NULL,
    "sepayRef" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Wish" (
    "id" BIGSERIAL NOT NULL,
    "invitationId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Order_editToken_key" ON "Order"("editToken");
CREATE UNIQUE INDEX "Invitation_slug_key" ON "Invitation"("slug");
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
