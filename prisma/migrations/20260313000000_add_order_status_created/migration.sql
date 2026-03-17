-- Add CREATED to OrderStatus enum (for legacy orders or compatibility)
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'CREATED';
