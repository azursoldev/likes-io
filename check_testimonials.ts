
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true
      }
    });
    console.log('Approved Testimonials:', JSON.stringify(testimonials, null, 2));
    
    const allTestimonials = await prisma.testimonial.findMany();
    console.log('All Testimonials Count:', allTestimonials.length);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkTestimonials();
