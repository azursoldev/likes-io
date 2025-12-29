-- Migration: Add Cryptomus, BigPay, Exit Intent, and other settings fields to admin_settings table
-- Run this SQL script in your database to add the new columns
-- Note: Each ALTER TABLE statement must be run separately in PostgreSQL

-- Add Cryptomus settings fields
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "cryptomusMerchantId" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "cryptomusApiKey" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "cryptomusDisplayName" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "cryptomusTestMode" BOOLEAN DEFAULT false;

-- Add BigPay settings fields
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "bigPayMerchantId" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "bigPayDisplayName" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "bigPayApiSecret" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "bigPayTestMode" BOOLEAN DEFAULT false;

-- Add Exit Intent settings fields
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "exitIntentEnabled" BOOLEAN DEFAULT false;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "exitIntentTitle" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "exitIntentSubtitle" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "exitIntentDiscountCode" TEXT;

-- Add Feature Flags
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "newServiceIndicator" BOOLEAN DEFAULT true;

-- Add Site Configuration
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "supportEmail" TEXT;

-- Add Authentication keys
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "recaptchaSiteKey" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "recaptchaSecretKey" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "googleClientId" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "googleClientSecret" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "facebookClientId" TEXT;
ALTER TABLE "admin_settings" ADD COLUMN IF NOT EXISTS "facebookClientSecret" TEXT;

