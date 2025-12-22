-- Migration script to add missing columns to featured_on table
-- Run this in your Neon SQL editor
-- 
-- AFTER running this migration:
-- 1. Uncomment the link and altText fields in prisma/schema.prisma
-- 2. Run: npx prisma generate
-- 3. Restart your dev server

-- Add link column if it doesn't exist
ALTER TABLE "featured_on" 
ADD COLUMN IF NOT EXISTS "link" TEXT;

-- Add altText column if it doesn't exist
ALTER TABLE "featured_on" 
ADD COLUMN IF NOT EXISTS "altText" TEXT;

-- Create featured_on_page_links table if it doesn't exist
CREATE TABLE IF NOT EXISTS "featured_on_page_links" (
  "id" SERIAL PRIMARY KEY,
  "featuredOnId" INTEGER NOT NULL,
  "pagePath" TEXT NOT NULL,
  "link" TEXT,
  "nofollow" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "featured_on_page_links_featuredOnId_fkey" 
    FOREIGN KEY ("featuredOnId") 
    REFERENCES "featured_on"("id") 
    ON DELETE CASCADE
);

-- Create index on featuredOnId for better query performance
CREATE INDEX IF NOT EXISTS "featured_on_page_links_featuredOnId_idx" 
ON "featured_on_page_links"("featuredOnId");

