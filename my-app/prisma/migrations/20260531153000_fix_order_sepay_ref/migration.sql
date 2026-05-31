-- Keep migration history aligned with the current Prisma schema.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "sepayRef" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Order_sepayRef_key" ON "Order"("sepayRef");

ALTER TABLE "Payment" DROP COLUMN IF EXISTS "sepayRef";
