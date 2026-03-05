import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: { foodItems: true },
  });

  if (!meal) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
  }

  return NextResponse.json({ meal });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const meal = await prisma.meal.findUnique({ where: { id } });
  if (!meal) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
  }

  // Delete photo file if exists
  if (meal.photoPath) {
    try {
      const filepath = path.join(process.cwd(), 'public', meal.photoPath);
      await unlink(filepath);
    } catch {
      // File may not exist, ignore
    }
  }

  await prisma.meal.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
