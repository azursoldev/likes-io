-- SQL script to add assuranceCardText column to service_page_content table
-- Run this in your PostgreSQL database

ALTER TABLE service_page_content 
ADD COLUMN IF NOT EXISTS "assuranceCardText" TEXT;


