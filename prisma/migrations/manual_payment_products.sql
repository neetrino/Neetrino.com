CREATE TABLE IF NOT EXISTS "payment_products" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price_amd" INTEGER NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'ONE_TIME',
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "secret_slug" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payment_products_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_products_secret_slug_key" ON "payment_products"("secret_slug");
