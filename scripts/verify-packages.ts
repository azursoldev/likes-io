
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'buy-instagram-likes';
  const content = await prisma.servicePageContent.findFirst({
    where: { slug },
  });

  if (!content) {
    console.log(`No content found for slug: ${slug}`);
    return;
  }

  console.log('Packages found in DB:');
  console.log(JSON.stringify(content.packages, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
