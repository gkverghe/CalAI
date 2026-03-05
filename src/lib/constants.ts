export const SINGLE_USER_ID = 'default-user';

export const DEFAULT_GOALS = {
  calories: 2000,
  proteinG: 150,
  carbsG: 250,
  fatG: 65,
};

export const MEAL_CATEGORIES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;

export type MealCategory = (typeof MEAL_CATEGORIES)[number];
