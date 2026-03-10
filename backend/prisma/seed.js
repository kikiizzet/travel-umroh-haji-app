const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@alanshormulia.com';
  const password = 'admin123';
  const nama = 'Admin Al Anshor';

  const existing = await prisma.admin.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      nama,
    },
  });

  console.log('Seed successful:');
  console.log('Email: ', email);
  console.log('Password: ', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
