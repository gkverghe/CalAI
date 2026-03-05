import { Meal, MealCategory } from '@/types';
import { MealCard } from './MealCard';
import { getMealCategoryLabel } from '@/lib/utils';

interface MealListProps {
  meals: Meal[];
}

const CATEGORY_ORDER: MealCategory[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

export function MealList({ meals }: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-sm">No meals logged today</p>
        <p className="text-gray-600 text-xs mt-1">Tap + to log your first meal</p>
      </div>
    );
  }

  const grouped = CATEGORY_ORDER.reduce<Record<string, Meal[]>>((acc, cat) => {
    const catMeals = meals.filter((m) => m.category === cat);
    if (catMeals.length > 0) acc[cat] = catMeals;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(grouped).map(([category, catMeals]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {getMealCategoryLabel(category)}
          </h3>
          <div className="flex flex-col gap-2">
            {catMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
