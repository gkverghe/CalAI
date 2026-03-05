import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.user.upsert({
  where: { id: 'default-user' },
  update: {},
  create: {
    id: 'default-user',
    dailyCalGoal: 2000,
    dailyProteinG: 150,
    dailyCarbsG: 250,
    dailyFatG: 65,
  },
});

await prisma.$disconnect();
console.log('Seeded default user');
