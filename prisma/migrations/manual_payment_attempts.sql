CREATE TABLE IF NOT EXISTS "payment_attempts" (
  "id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "provider" TEXT NOT NULL DEFAULT 'ARCA',
  "amount_amd" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AMD',
  "provider_transaction_id" TEXT,
  "redirect_url" TEXT,
  "provider_response" JSONB,
  "failure_message" TEXT,
  "paid_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payment_attempts_product_id_fkey"
    FOREIGN KEY ("product_id")
    REFERENCES "payment_products"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_provider_transaction_id_key"
  ON "payment_attempts"("provider_transaction_id");

CREATE INDEX IF NOT EXISTS "payment_attempts_product_id_idx" ON "payment_attempts"("product_id");
CREATE INDEX IF NOT EXISTS "payment_attempts_status_idx" ON "payment_attempts"("status");
