
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const upsells = await prisma.upsell.findMany({
    where: {
        platform: 'TIKTOK',
        serviceType: 'VIEWS',
        isActive: true
    }
  });
  console.log('TIKTOK VIEWS Upsells:', JSON.stringify(upsells, null, 2));

  const allUpsells = await prisma.upsell.findMany();
  console.log('All Upsells count:', allUpsells.length);
  if (allUpsells.length > 0 && upsells.length === 0) {
      console.log('First 3 upsells:', JSON.stringify(allUpsells.slice(0, 3), null, 2));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
