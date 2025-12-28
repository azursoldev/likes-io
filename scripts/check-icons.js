
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.iconAsset.count();
    console.log(`Total icons: ${count}`);
    const icons = await prisma.iconAsset.findMany({ take: 5 });
    console.log('First 5 icons:', icons);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
