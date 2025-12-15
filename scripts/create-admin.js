// Usage:
//   node scripts/create-admin.js
//   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPass123! node scripts/create-admin.js
//
// Creates an admin user if one does not already exist with the same email.

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('.prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  errorFormat: 'colorless',
});

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const name = process.env.ADMIN_NAME || 'Admin User';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User already exists: ${email} (role: ${existing.role})`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', { email: user.email, role: user.role });
  console.log('IMPORTANT: Change the password after first login.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

