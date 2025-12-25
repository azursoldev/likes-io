
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simulateServicePageFetch() {
  const platform = 'INSTAGRAM'; // Simulating Instagram page
  
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        OR: [
          { platform: 'INSTAGRAM' }, // Enum value would be used here normally
          { platform: null }
        ],
        isApproved: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
    
    console.log(`Found ${testimonials.length} testimonials for INSTAGRAM service page.`);
    if (testimonials.length > 0) {
        console.log('Sample testimonial:', testimonials[0].handle, testimonials[0].text.substring(0, 50) + '...');
    }
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

simulateServicePageFetch();
