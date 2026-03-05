'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FoodItemRow } from './FoodItemRow';
import { AnalysisFoodItem, AnalysisResult, MealCategory } from '@/types';
import { cn, getDefaultMealCategory } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES: MealCategory[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const CATEGORY_LABELS: Record<MealCategory, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
};

interface MealReviewFormProps {
  analysis: AnalysisResult;
  imageBase64?: string;
  onRetake: () => void;
}

export function MealReviewForm({ analysis, imageBase64, onRetake }: MealReviewFormProps) {
  const router = useRouter();
  const [category, setCategory] = useState<MealCategory>(getDefaultMealCategory());
  const [items, setItems] = useState<AnalysisFoodItem[]>(analysis.foodItems);
  const [isSaving, setIsSaving] = useState(false);

  const totalCals = items.reduce((s, i) => s + (i.calories || 0), 0);
  const totalProtein = items.reduce((s, i) => s + (i.proteinG || 0), 0);
  const totalCarbs = items.reduce((s, i) => s + (i.carbsG || 0), 0);
  const totalFat = items.reduce((s, i) => s + (i.fatG || 0), 0);

  function updateItem(index: number, field: keyof AnalysisFoodItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function deleteItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { name: 'New item', quantity: '1 serving', calories: 0, proteinG: 0, carbsG: 0, fatG: 0, confidence: 1 },
    ]);
  }

  async function handleSave() {
    if (items.length === 0) {
      toast.error('Add at least one food item');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          photoBase64: imageBase64,
          foodItems: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            calories: item.calories,
            proteinG: item.proteinG,
            carbsG: item.carbsG,
            fatG: item.fatG,
            confidence: item.confidence,
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to save meal');
      toast.success('Meal logged!');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Failed to save meal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a2e]">
          {items.length} item{items.length !== 1 ? 's' : ''} found
        </h2>
        {analysis.notes && (
          <p className="text-xs text-gray-500 mt-0.5">{analysis.notes}</p>
        )}
      </div>

      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
              category === cat
                ? 'bg-[#2563eb] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Food items */}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <FoodItemRow
            key={i}
            item={item}
            index={i}
            onChange={updateItem}
            onDelete={deleteItem}
          />
        ))}
      </div>

      {/* Add item button */}
      <button
        onClick={addItem}
        className="flex items-center justify-center gap-2 py-3 border border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-all"
      >
        <Plus size={16} />
        <span className="text-sm">Add item</span>
      </button>

      {/* Totals */}
      <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold text-[#1a1a2e]">{totalCals}</p>
          <p className="text-xs text-gray-500">kcal</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-blue-400">{Math.round(totalProtein)}g</p>
          <p className="text-xs text-gray-500">Protein</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-amber-400">{Math.round(totalCarbs)}g</p>
          <p className="text-xs text-gray-500">Carbs</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-pink-400">{Math.round(totalFat)}g</p>
          <p className="text-xs text-gray-500">Fat</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-semibold h-12 rounded-xl"
        >
          {isSaving ? (
            <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</>
          ) : (
            'Log Meal'
          )}
        </Button>
        <button
          onClick={onRetake}
          className="text-sm text-gray-400 hover:text-gray-600 text-center py-2"
        >
          Retake photo
        </button>
      </div>
    </div>
  );
}
