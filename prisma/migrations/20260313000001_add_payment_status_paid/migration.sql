-- Add PAID to PaymentStatus enum (legacy / compatibility)
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'PAID';
