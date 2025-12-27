const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Creating legal_pages table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "legal_pages" (
        "id" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "sections" JSONB NOT NULL,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "legal_pages_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log("Creating unique index on slug...");
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "legal_pages_slug_key" ON "legal_pages"("slug");
    `);
    
    console.log("Database setup complete.");
  } catch (e) {
    console.error("Error setting up database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
