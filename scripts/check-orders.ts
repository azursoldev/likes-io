
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Verifying fix by fetching ALL orders via Prisma Client...");
    
    const orders = await prisma.order.findMany({
      include: {
        service: true,
        user: true,
        payment: true
      }
    });
    console.log(`Fetched ${orders.length} orders successfully!`);
    console.log("The Admin Orders page should now work correctly.");

  } catch (error) {
    console.error('Fatal Script Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
