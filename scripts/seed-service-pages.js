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
  },
  { platform: 'TIKTOK', serviceType: 'LIKES', slug: 'buy-tiktok-likes', heroTitle: 'Buy TikTok Likes', heroSubtitle: 'Get real TikTok likes on your videos.', metaTitle: 'Buy TikTok Likes | Real & Instant', metaDescription: 'Boost your TikTok engagement with real likes.', packages: [{ id: 1, name: '100 Likes', price: 2.99, amount: 100 }, { id: 2, name: '500 Likes', price: 9.99, amount: 500 }], benefits: [{ title: 'Instant Start', description: 'Delivery begins within minutes' }, { title: 'Real Likes', description: 'From real active users' }], howItWorks: [{ title: 'Choose Package', description: 'Select the amount of likes' }, { title: 'Enter Video URL', description: 'Paste your TikTok link' }, { title: 'Watch it Grow', description: 'See the likes coming in' }] },
  { platform: 'TIKTOK', serviceType: 'FOLLOWERS', slug: 'buy-tiktok-followers', heroTitle: 'Buy TikTok Followers', heroSubtitle: 'Grow your TikTok audience.', metaTitle: 'Buy TikTok Followers | Real & Active', metaDescription: 'Get real TikTok followers.', packages: [{ id: 1, name: '100 Followers', price: 3.99, amount: 100 }, { id: 2, name: '500 Followers', price: 12.99, amount: 500 }], benefits: [{ title: 'High Quality', description: 'Real profiles' }, { title: 'Refill Guarantee', description: '30 days refill' }], howItWorks: [{ title: 'Select Package', description: 'Choose follower count' }, { title: 'Enter Username', description: 'Your TikTok @' }, { title: 'Get Followers', description: 'Delivery starts instantly' }] },
  { platform: 'TIKTOK', serviceType: 'VIEWS', slug: 'buy-tiktok-views', heroTitle: 'Buy TikTok Views', heroSubtitle: 'Boost your TikTok video views.', metaTitle: 'Buy TikTok Views | Real & Instant', metaDescription: 'Get more TikTok views on your videos.', packages: [{ id: 1, name: '1000 Views', price: 2.99, amount: 1000 }, { id: 2, name: '5000 Views', price: 9.99, amount: 5000 }], benefits: [{ title: 'Instant Delivery', description: 'Starts immediately' }, { title: 'Real Views', description: 'High quality' }], howItWorks: [{ title: 'Select Package', description: 'Choose views' }, { title: 'Enter Video URL', description: 'Paste your link' }, { title: 'See Results', description: 'Watch views grow' }] },
  { platform: 'YOUTUBE', serviceType: 'VIEWS', slug: 'buy-youtube-views', heroTitle: 'Buy YouTube Views', heroSubtitle: 'Get more views on your YouTube videos.', metaTitle: 'Buy YouTube Views | Real & Instant', metaDescription: 'Boost your YouTube visibility.', packages: [{ id: 1, name: '1000 Views', price: 4.99, amount: 1000 }, { id: 2, name: '5000 Views', price: 14.99, amount: 5000 }], benefits: [{ title: 'Instant Start', description: 'Delivery begins quickly' }, { title: 'Real Views', description: 'From real users' }], howItWorks: [{ title: 'Choose Package', description: 'Select views' }, { title: 'Enter Video URL', description: 'Paste your YouTube link' }, { title: 'Watch it Grow', description: 'See views increase' }] },
  { platform: 'YOUTUBE', serviceType: 'SUBSCRIBERS', slug: 'buy-youtube-subscribers', heroTitle: 'Buy YouTube Subscribers', heroSubtitle: 'Grow your YouTube channel.', metaTitle: 'Buy YouTube Subscribers | Real & Active', metaDescription: 'Get real YouTube subscribers.', packages: [{ id: 1, name: '100 Subscribers', price: 9.99, amount: 100 }, { id: 2, name: '500 Subscribers', price: 39.99, amount: 500 }], benefits: [{ title: 'High Quality', description: 'Real subscribers' }, { title: 'Refill Guarantee', description: '30 days refill' }], howItWorks: [{ title: 'Select Package', description: 'Choose count' }, { title: 'Enter Channel URL', description: 'Your YouTube channel' }, { title: 'Get Subscribers', description: 'Delivery starts instantly' }] },
  { platform: 'YOUTUBE', serviceType: 'LIKES', slug: 'buy-youtube-likes', heroTitle: 'Buy YouTube Likes', heroSubtitle: 'Get more likes on your YouTube videos.', metaTitle: 'Buy YouTube Likes | Real & Instant', metaDescription: 'Boost engagement with real YouTube likes.', packages: [{ id: 1, name: '100 Likes', price: 3.99, amount: 100 }, { id: 2, name: '500 Likes', price: 14.99, amount: 500 }], benefits: [{ title: 'Instant Start', description: 'Delivery begins quickly' }, { title: 'Real Likes', description: 'From real users' }], howItWorks: [{ title: 'Choose Package', description: 'Select likes' }, { title: 'Enter Video URL', description: 'Paste your link' }, { title: 'Watch it Grow', description: 'See likes increase' }] },
];

const payload = (service) => ({
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
  howItWorks: service.howItWorks,
});

async function main() {
  console.log('Seeding service pages...\n');

  let created = 0;
  let updated = 0;

  for (const service of services) {
    const existing = await prisma.servicePageContent.findFirst({
      where: {
        OR: [
          { slug: service.slug },
          { platform: service.platform, serviceType: service.serviceType }
        ]
      },
    });

    try {
      if (existing) {
        await prisma.servicePageContent.update({
          where: { id: existing.id },
          data: payload(service),
        });
        console.log(`[UPDATED] ${service.slug}`);
        updated++;
      } else {
        await prisma.servicePageContent.create({
          data: payload(service),
        });
        console.log(`[CREATED] ${service.slug}`);
        created++;
      }
    } catch (error) {
      console.error(`[FAILED] ${service.slug}:`, error.message);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Updated: ${updated}, Created: ${created}, Total: ${services.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
