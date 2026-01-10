
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const searchTerm = 'a9400632';
  console.log(`Fixing broken image reference "${searchTerm}" in HomepageContent...`);

  // Find the record
  const homepage = await prisma.homepageContent.findFirst({
      where: { 
          heroProfileImage: { contains: searchTerm }
      }
  });

  if (homepage) {
      console.log('Found record:', homepage.id);
      console.log('Current heroProfileImage:', homepage.heroProfileImage);
      
      const updated = await prisma.homepageContent.update({
          where: { id: homepage.id },
          data: {
              heroProfileImage: null
          }
      });
      
      console.log('Updated record. New heroProfileImage:', updated.heroProfileImage);
  } else {
      console.log('No record found with that image reference.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
