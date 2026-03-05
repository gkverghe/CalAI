'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FoodBreakdownTable } from '@/components/meal-detail/FoodBreakdownTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Meal } from '@/types';
import { formatTime, getMealCategoryLabel } from '@/lib/utils';
import { toast } from 'sonner';

export default function MealDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/meals/${id}`)
      .then((r) => r.json())
      .then((d) => setMeal(d.meal))
      .catch(() => toast.error('Could not load meal'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/meals/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Meal deleted');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Failed to delete meal');
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-[#1a1a2e]" />
        </button>
        <h1 className="text-lg font-semibold text-[#1a1a2e]">Meal Detail</h1>
        <button
          onClick={() => setShowDelete(true)}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4 px-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : meal ? (
        <>
          {/* Photo */}
          {meal.photoPath && (
            <div className="relative w-full aspect-[4/3] mb-4">
              <Image
                src={meal.photoPath}
                alt="Meal photo"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-4 px-4">
            {/* Category & time */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {getMealCategoryLabel(meal.category)} · {formatTime(meal.loggedAt)}
              </span>
            </div>

            {/* Calorie total */}
            <div>
              <p className="text-5xl font-bold text-[#1a1a2e]">{meal.totalCals}</p>
              <p className="text-sm text-gray-500 mt-1">calories</p>
            </div>

            {/* Macro pills */}
            <div className="flex gap-3">
              <div className="flex-1 bg-blue-400/10 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-blue-400">{Math.round(meal.totalProteinG)}g</p>
                <p className="text-xs text-gray-500">Protein</p>
              </div>
              <div className="flex-1 bg-amber-400/10 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-amber-400">{Math.round(meal.totalCarbsG)}g</p>
                <p className="text-xs text-gray-500">Carbs</p>
              </div>
              <div className="flex-1 bg-pink-400/10 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-pink-400">{Math.round(meal.totalFatG)}g</p>
                <p className="text-xs text-gray-500">Fat</p>
              </div>
            </div>

            {/* Food breakdown */}
            <div>
              <h2 className="text-base font-semibold text-[#1a1a2e] mb-3">Food Breakdown</h2>
              <FoodBreakdownTable items={meal.foodItems} />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Meal not found</p>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="bg-white border-gray-200 text-[#1a1a2e] max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Delete Meal</DialogTitle>
            <DialogDescription className="text-gray-500">
              This will permanently delete this meal and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDelete(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
