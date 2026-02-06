
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orderId = 'cmlav3kj0007dqfsendlc9oqz';
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    console.log('Order found:', order);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
