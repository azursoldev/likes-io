const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const services = [
  {
    platform: 'INSTAGRAM',
    serviceType: 'VIEWS',
    slug: 'buy-instagram-views',
    heroTitle: 'Buy Instagram Views',
    heroSubtitle: 'Boost your visibility with real Instagram views.',
    metaTitle: 'Buy Instagram Views | Real & Instant Delivery',
    metaDescription: 'Get high-quality Instagram views instantly. Safe, secure, and cheap.',
    packages: [
      { id: 1, name: '500 Views', price: 1.99, amount: 500 },
      { id: 2, name: '1000 Views', price: 2.99, amount: 1000 },
      { id: 3, name: '2500 Views', price: 4.99, amount: 2500 },
      { id: 4, name: '5000 Views', price: 8.99, amount: 5000 },
    ],
    benefits: [
      { title: 'Instant Delivery', description: 'Starts immediately' },
      { title: 'Real Users', description: 'High quality views' },
    ],
    howItWorks: [
       { title: 'Select Package', description: 'Choose the number of views you need.' },
       { title: 'Enter Details', description: 'Provide your post URL.' },
       { title: 'See Results', description: 'Watch your views grow.' }
    ]
  },
  {
    platform: 'INSTAGRAM',
    serviceType: 'LIKES',
    slug: 'buy-instagram-likes',
    heroTitle: 'Buy Instagram Likes',
    heroSubtitle: 'Get real likes on your posts instantly.',
    metaTitle: 'Buy Instagram Likes | Real & Instant',
    metaDescription: 'Boost your engagement with real Instagram likes.',
    packages: [
      { id: 1, name: '100 Likes', price: 2.99, amount: 100 },
      { id: 2, name: '250 Likes', price: 5.99, amount: 250 },
      { id: 3, name: '500 Likes', price: 9.99, amount: 500 },
    ],
    benefits: [
        { title: 'Instant Start', description: 'Delivery begins within minutes' },
        { title: 'Real Likes', description: 'From real active users' },
    ],
    howItWorks: [
        { title: 'Choose Package', description: 'Select the amount of likes' },
        { title: 'Enter Details', description: 'Provide username or post link' },
        { title: 'Watch it Grow', description: 'See the likes coming in' }
    ]
  },
  {
    platform: 'INSTAGRAM',
    serviceType: 'FOLLOWERS',
    slug: 'buy-instagram-followers',
    heroTitle: 'Buy Instagram Followers',
    heroSubtitle: 'Grow your audience with real followers.',
    metaTitle: 'Buy Instagram Followers | Real & Active',
    metaDescription: 'Get real Instagram followers to boost your profile.',
    packages: [
      { id: 1, name: '100 Followers', price: 3.99, amount: 100 },
      { id: 2, name: '500 Followers', price: 12.99, amount: 500 },
    ],
    benefits: [
        { title: 'High Quality', description: 'Real looking profiles' },
        { title: 'Refill Guarantee', description: '30 days refill' },
    ],
    howItWorks: [
        { title: 'Select Package', description: 'Choose follower count' },
        { title: 'Enter Username', description: 'No password required' },
        { title: 'Get Followers', description: 'Delivery starts instantly' }
    ]
  }
];

async function main() {
  console.log('Seeding service pages...');

  for (const service of services) {
    // Check if a page with this slug OR platform/serviceType already exists
    const existing = await prisma.servicePageContent.findFirst({
      where: {
        OR: [
          { slug: service.slug },
          { 
            platform: service.platform,
            serviceType: service.serviceType
          }
        ]
      },
    });

    if (existing) {
      console.log(`Page for ${service.platform} ${service.serviceType} (slug: ${service.slug}) already exists. Skipping.`);
      continue;
    }

    try {
      await prisma.servicePageContent.create({
        data: {
          platform: service.platform,
          serviceType: service.serviceType,
          slug: service.slug,
          heroTitle: service.heroTitle,
          heroSubtitle: service.heroSubtitle,
          metaTitle: service.metaTitle,
          metaDescription: service.metaDescription,
          packages: service.packages,
          isActive: true,
          benefits: service.benefits,
          howItWorks: service.howItWorks
        },
      });
      console.log(`Successfully created page: ${service.slug}`);
    } catch (error) {
      console.error(`Failed to create page ${service.slug}:`, error);
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
