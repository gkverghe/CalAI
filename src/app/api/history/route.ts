import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SINGLE_USER_ID } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') ?? '7', 10);

  // Get the last `limit` days
  const days: Array<{
    date: string;
    totalCals: number;
    totalProteinG: number;
    totalCarbsG: number;
    totalFatG: number;
    mealCount: number;
  }> = [];

  const today = new Date();

  for (let i = 0; i < limit; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const localStart = new Date(dateStr + 'T00:00:00');
    const localEnd = new Date(dateStr + 'T23:59:59');

    const meals = await prisma.meal.findMany({
      where: {
        userId: SINGLE_USER_ID,
        loggedAt: { gte: localStart, lte: localEnd },
      },
      select: {
        totalCals: true,
        totalProteinG: true,
        totalCarbsG: true,
        totalFatG: true,
      },
    });

    if (meals.length > 0) {
      days.push({
        date: dateStr,
        totalCals: meals.reduce((sum, m) => sum + m.totalCals, 0),
        totalProteinG: meals.reduce((sum, m) => sum + m.totalProteinG, 0),
        totalCarbsG: meals.reduce((sum, m) => sum + m.totalCarbsG, 0),
        totalFatG: meals.reduce((sum, m) => sum + m.totalFatG, 0),
        mealCount: meals.length,
      });
    }
  }

  return NextResponse.json({ days });
}
