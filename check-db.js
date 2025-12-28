const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
    const settings = await prisma.adminSettings.findFirst();
    console.log('Settings found:', !!settings);
  } catch (e) {
    console.error('Connection error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
