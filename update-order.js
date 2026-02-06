
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orderId = 'cmlav3kj0007dqfsendlc9oqz';
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
    });
    console.log('Order updated:', updatedOrder);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
