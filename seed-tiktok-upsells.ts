
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const upsells = [
    {
      title: "50 likes x 10 posts",
      description: "Boost 10 posts with 50 likes each",
      basePrice: 7.99,
      discountType: "PERCENT",
      discountValue: 25,
      platform: "TIKTOK",
      serviceType: "VIEWS",
      isActive: true,
      sortOrder: 1,
      badgeText: "25%",
      badgeColor: "green",
      badgeIcon: "heart"
    },
    {
      title: "100 likes x 10 posts",
      description: "Boost 10 posts with 100 likes each",
      basePrice: 14.99,
      discountType: "PERCENT",
      discountValue: 25,
      platform: "TIKTOK",
      serviceType: "VIEWS",
      isActive: true,
      sortOrder: 2,
      badgeText: "25%",
      badgeColor: "green",
      badgeIcon: "heart"
    },
    {
      title: "1K followers",
      description: "Get 1K followers instantly",
      basePrice: 14.99,
      discountType: "PERCENT",
      discountValue: 25,
      platform: "TIKTOK",
      serviceType: "VIEWS",
      isActive: true,
      sortOrder: 3,
      badgeText: "25%",
      badgeColor: "pink",
      badgeIcon: "link"
    }
  ];

  console.log('Seeding TikTok Views upsells...');

  for (const upsell of upsells) {
    // Check if exists to avoid duplicates (optional, but good practice)
    const exists = await prisma.upsell.findFirst({
      where: {
        platform: upsell.platform as any,
        serviceType: upsell.serviceType as any,
        title: upsell.title
      }
    });

    if (!exists) {
      await prisma.upsell.create({
        data: {
          ...upsell,
          platform: upsell.platform as any,
          serviceType: upsell.serviceType as any,
          discountType: upsell.discountType as any
        }
      });
      console.log(`Created: ${upsell.title}`);
    } else {
      console.log(`Skipped (exists): ${upsell.title}`);
    }
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
