
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const searchTerm = 'a9400632';
  console.log(`Searching for "${searchTerm}" in database...`);

  // 1. FeaturedOn
  const featured = await prisma.featuredOn.findMany({
    where: {
      logoUrl: { contains: searchTerm }
    }
  });
  if (featured.length > 0) {
    console.log('Found in FeaturedOn:', featured);
  }

  // 2. AdminSettings
  // Note: fields might be optional or different in actual schema, using findFirst to check
  const settings = await prisma.adminSettings.findFirst();
  if (settings) {
    const s = JSON.stringify(settings);
    if (s.includes(searchTerm)) {
        console.log('Found in AdminSettings:', settings);
    }
  }

  // 3. HomepageContent
  const homepage = await prisma.homepageContent.findFirst({
      where: { isActive: true }
  });
  if (homepage) {
      const s = JSON.stringify(homepage);
      if (s.includes(searchTerm)) {
          console.log('Found in HomepageContent:', homepage);
      }
  }
  
  // 4. Testimonial
    // Some testimonials might have images
  try {
      // Check if Testimonial model has image fields or if it's in JSON
      // Based on schema, Testimonial has handle, text, rating, role, etc. No explicit image url field shown in snippet
      // But let's check generic find
      const testimonials = await prisma.testimonial.findMany();
      const matchingTestimonials = testimonials.filter(t => JSON.stringify(t).includes(searchTerm));
      if (matchingTestimonials.length > 0) {
          console.log('Found in Testimonial:', matchingTestimonials);
      }
  } catch (e) {
      console.log('Error checking Testimonial:', e.message);
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
