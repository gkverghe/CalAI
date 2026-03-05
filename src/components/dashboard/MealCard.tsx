'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Utensils } from 'lucide-react';
import { Meal } from '@/types';
import { formatTime } from '@/lib/utils';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const itemNames = meal.foodItems
    .map((item) => item.name)
    .slice(0, 2)
    .join(', ');
  const extraCount = meal.foodItems.length > 2 ? meal.foodItems.length - 2 : 0;

  return (
    <Link href={`/meal/${meal.id}`}>
      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors active:scale-[0.98]">
        {/* Photo or placeholder */}
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
          {meal.photoPath ? (
            <Image
              src={meal.photoPath}
              alt="Meal photo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <Utensils size={22} className="text-gray-400" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {itemNames}
            {extraCount > 0 && (
              <span className="text-gray-500"> +{extraCount} more</span>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">
            {meal.category.toLowerCase()} &bull; {formatTime(meal.loggedAt)}
          </p>
        </div>

        {/* Calories */}
        <div className="text-right shrink-0">
          <span className="text-sm font-semibold text-gray-900">{meal.totalCals}</span>
          <span className="text-xs text-gray-500 ml-1">kcal</span>
        </div>
      </div>
    </Link>
  );
}
