import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
  console.log('Seeded default user');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
