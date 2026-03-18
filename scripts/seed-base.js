/**
 * Seed base data after a DB reset.
 * Run: npm run seed   (runs this + service pages + icons via seed-all.js)
 *
 * Restores: admin_settings, navigation, homepage_content.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding base data (admin_settings, navigation, homepage)...\n');

  const existingSettings = await prisma.adminSettings.findFirst();
  if (existingSettings) {
    console.log('AdminSettings already exists. Skipping.');
  } else {
    await prisma.adminSettings.create({
      data: {
        homeMetaTitle: 'Likes.io: Buy Instagram, TikTok & YouTube Engagement',
        homeMetaDescription: 'Buy real Instagram, TikTok & YouTube likes, followers, and views. Instant delivery.',
        defaultCurrency: 'USD',
        systemStatus: 'Operational',
        systemStatusEnabled: true,
        systemStatusMessage: 'All Systems Operational',
        sitemapEnabled: true,
        robotsTxtContent: 'User-agent: *\nAllow: /',
      },
    });
    console.log('Created AdminSettings.');
  }

  const existingNav = await prisma.navigation.findFirst();
  if (existingNav) {
    console.log('Navigation already exists. Skipping.');
  } else {
    await prisma.navigation.create({
      data: {
        headerMenu: [],
        footerMenu: [],
        headerColumnMenus: [],
        footerColumnMenus: [],
      },
    });
    console.log('Created Navigation.');
  }

  const existingHomepage = await prisma.homepageContent.findFirst();
  if (existingHomepage) {
    console.log('HomepageContent already exists. Skipping.');
  } else {
    await prisma.homepageContent.create({
      data: {
        heroTitle: 'Buy Instagram, TikTok & YouTube Likes, Followers & Views',
        heroSubtitle: 'Real engagement, instant delivery. Safe and secure.',
        isActive: true,
      },
    });
    console.log('Created HomepageContent.');
  }

  console.log('\nBase seed done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
