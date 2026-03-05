'use client';

import { CalorieRing } from '@/components/dashboard/CalorieRing';
import { MacroBars } from '@/components/dashboard/MacroBar';
import { MealList } from '@/components/dashboard/MealList';
import { Skeleton } from '@/components/ui/skeleton';
import { useDailySummary } from '@/hooks/useDailySummary';
import { getTodayString } from '@/lib/utils';
import { Flame } from 'lucide-react';

export default function DashboardPage() {
  const { summary, isLoading } = useDailySummary(getTodayString());

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Today&apos;s Progress</h1>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      {/* Calorie Gauge Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Calories</h2>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Skeleton className="w-full h-[240px] rounded-2xl" />
          </div>
        ) : (
          <CalorieRing
            consumed={summary?.totalCals ?? 0}
            goal={summary?.goals.calories ?? 2000}
          />
        )}
      </div>

      {/* Macros Card */}
      {isLoading ? (
        <Skeleton className="h-52 rounded-3xl" />
      ) : (
        <MacroBars
          protein={summary?.totalProteinG ?? 0}
          carbs={summary?.totalCarbsG ?? 0}
          fat={summary?.totalFatG ?? 0}
          goals={{
            proteinG: summary?.goals.proteinG ?? 150,
            carbsG: summary?.goals.carbsG ?? 250,
            fatG: summary?.goals.fatG ?? 65,
          }}
        />
      )}

      {/* Today's Meals Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Meals</h2>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <MealList meals={summary?.meals ?? []} />
        )}
      </div>
    </div>
  );
}
