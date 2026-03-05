export type MealCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence?: number;
}

export interface Meal {
  id: string;
  loggedAt: string;
  category: MealCategory;
  photoPath?: string | null;
  notes?: string | null;
  totalCals: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  foodItems: FoodItem[];
}

export interface Goals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface DailySummary {
  date: string;
  totalCals: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  goals: Goals;
  meals: Meal[];
}

export interface AnalysisFoodItem {
  name: string;
  quantity: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: number;
}

export interface AnalysisResult {
  foodItems: AnalysisFoodItem[];
  overallConfidence: number;
  notes?: string;
}

export interface CreateMealRequest {
  category: MealCategory;
  loggedAt?: string;
  notes?: string;
  photoBase64?: string;
  foodItems: Array<Omit<FoodItem, 'id'>>;
}

export interface DayHistory {
  date: string;
  totalCals: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  mealCount: number;
}
