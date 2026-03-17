-- AlterEnum: Add ZIINA to PaymentGateway
ALTER TYPE "PaymentGateway" ADD VALUE 'ZIINA';

-- Add Ziina settings columns to admin_settings
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "ziinaApiKey" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "ziinaTestMode" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "ziinaWebhookSecret" TEXT;
