import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SINGLE_USER_ID } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0];

  const localStart = new Date(date + 'T00:00:00');
  const localEnd = new Date(date + 'T23:59:59');

  const [user, meals] = await Promise.all([
    prisma.user.findUnique({ where: { id: SINGLE_USER_ID } }),
    prisma.meal.findMany({
      where: {
        userId: SINGLE_USER_ID,
        loggedAt: { gte: localStart, lte: localEnd },
      },
      include: { foodItems: true },
      orderBy: { loggedAt: 'asc' },
    }),
  ]);

  const totalCals = meals.reduce((sum, m) => sum + m.totalCals, 0);
  const totalProteinG = meals.reduce((sum, m) => sum + m.totalProteinG, 0);
  const totalCarbsG = meals.reduce((sum, m) => sum + m.totalCarbsG, 0);
  const totalFatG = meals.reduce((sum, m) => sum + m.totalFatG, 0);

  return NextResponse.json({
    date,
    totalCals,
    totalProteinG,
    totalCarbsG,
    totalFatG,
    goals: {
      calories: user?.dailyCalGoal ?? 2000,
      proteinG: user?.dailyProteinG ?? 150,
      carbsG: user?.dailyCarbsG ?? 250,
      fatG: user?.dailyFatG ?? 65,
    },
    meals,
  });
}
