import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { SINGLE_USER_ID } from '@/lib/constants';
import { CreateMealRequest } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0];

  const localStart = new Date(date + 'T00:00:00');
  const localEnd = new Date(date + 'T23:59:59');

  const meals = await prisma.meal.findMany({
    where: {
      userId: SINGLE_USER_ID,
      loggedAt: {
        gte: localStart,
        lte: localEnd,
      },
    },
    include: { foodItems: true },
    orderBy: { loggedAt: 'asc' },
  });

  return NextResponse.json({ meals });
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateMealRequest = await req.json();
    const { category, loggedAt, notes, photoBase64, foodItems } = body;

    if (!category || !foodItems?.length) {
      return NextResponse.json({ error: 'category and foodItems are required' }, { status: 400 });
    }

    // Ensure the default user exists
    await prisma.user.upsert({
      where: { id: SINGLE_USER_ID },
      update: {},
      create: {
        id: SINGLE_USER_ID,
        dailyCalGoal: 2000,
        dailyProteinG: 150,
        dailyCarbsG: 250,
        dailyFatG: 65,
      },
    });

    let photoPath: string | undefined;

    if (photoBase64) {
      const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `meals/${crypto.randomUUID()}.jpg`;
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      photoPath = blob.url;
    }

    const totalCals = foodItems.reduce((sum, item) => sum + item.calories, 0);
    const totalProteinG = foodItems.reduce((sum, item) => sum + item.proteinG, 0);
    const totalCarbsG = foodItems.reduce((sum, item) => sum + item.carbsG, 0);
    const totalFatG = foodItems.reduce((sum, item) => sum + item.fatG, 0);

    const meal = await prisma.meal.create({
      data: {
        userId: SINGLE_USER_ID,
        category,
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
        notes,
        photoPath,
        totalCals,
        totalProteinG,
        totalCarbsG,
        totalFatG,
        foodItems: {
          create: foodItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            calories: item.calories,
            proteinG: item.proteinG,
            carbsG: item.carbsG,
            fatG: item.fatG,
            confidence: item.confidence,
          })),
        },
      },
      include: { foodItems: true },
    });

    return NextResponse.json({ meal }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create meal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
