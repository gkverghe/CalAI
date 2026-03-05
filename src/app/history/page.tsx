'use client';

import { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import Image from 'next/image';
import { DayHistory, DailySummary, Meal } from '@/types';
import { formatTime } from '@/lib/utils';

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DayHistory[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDaySummary, setSelectedDaySummary] = useState<DailySummary | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingDay, setIsLoadingDay] = useState(true);

  const selectedDateString = toDateString(selectedDate);
  const isToday = selectedDateString === toDateString(new Date());
  const canGoForward = selectedDateString < toDateString(new Date());

  // Load last 7 days history list
  useEffect(() => {
    fetch('/api/history?limit=7')
      .then((r) => r.json())
      .then((d) => setHistory(d.days ?? []))
      .finally(() => setIsLoadingHistory(false));
  }, []);

  // Load selected day summary whenever date changes
  useEffect(() => {
    setIsLoadingDay(true);
    setSelectedDaySummary(null);
    fetch(`/api/daily-summary?date=${selectedDateString}`)
      .then((r) => r.json())
      .then((d: DailySummary) => {
        if (d.meals && d.meals.length > 0) {
          setSelectedDaySummary(d);
        }
      })
      .finally(() => setIsLoadingDay(false));
  }, [selectedDateString]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">History</h1>
        <p className="text-sm text-gray-500">Your nutrition journey</p>
      </div>

      {/* Date Navigator */}
      <div className="bg-white rounded-3xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900">
              {isToday
                ? 'Today'
                : selectedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
            </span>
          </div>

          <button
            onClick={() => changeDate(1)}
            disabled={!canGoForward}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Selected Day Content */}
      {isLoadingDay ? (
        <div className="bg-white rounded-3xl shadow-sm p-12 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      ) : selectedDaySummary ? (
        <>
          {/* Gradient Summary Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Calories</p>
                <p className="text-4xl font-bold mt-1">{selectedDaySummary.totalCals}</p>
                <p className="text-sm opacity-90 mt-1">kcal consumed</p>
              </div>
              <div className="text-right space-y-2">
                <div>
                  <p className="text-xs opacity-75">Carbs</p>
                  <p className="font-semibold">{Math.round(selectedDaySummary.totalCarbsG)}g</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Protein</p>
                  <p className="font-semibold">{Math.round(selectedDaySummary.totalProteinG)}g</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Fat</p>
                  <p className="font-semibold">{Math.round(selectedDaySummary.totalFatG)}g</p>
                </div>
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Meals ({selectedDaySummary.meals.length})
            </h2>
            <div className="space-y-4">
              {selectedDaySummary.meals.map((meal) => (
                <MealHistoryItem key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm p-12">
          <div className="flex flex-col items-center text-center">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">No data for this day</p>
          </div>
        </div>
      )}

      {/* Last 7 Days */}
      {!isLoadingHistory && history.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days</h2>
          <div className="space-y-2">
            {history.map((day) => {
              // Use noon time to avoid timezone edge cases
              const date = new Date(day.date + 'T12:00:00');
              const isSelectedDay = day.date === selectedDateString;

              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(new Date(day.date + 'T12:00:00'))}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                    isSelectedDay
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-left">
                    <p className={`font-medium ${isSelectedDay ? 'text-blue-900' : 'text-gray-900'}`}>
                      {date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {day.mealCount} {day.mealCount === 1 ? 'meal' : 'meals'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isSelectedDay ? 'text-blue-900' : 'text-gray-900'}`}>
                      {day.totalCals}
                    </p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MealHistoryItem({ meal }: { meal: Meal }) {
  const itemNames = meal.foodItems
    .map((item) => item.name)
    .slice(0, 2)
    .join(', ');
  const extraCount = meal.foodItems.length > 2 ? meal.foodItems.length - 2 : 0;

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
        {meal.photoPath ? (
          <Image
            src={meal.photoPath}
            alt="Meal photo"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <Utensils className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {itemNames}
              {extraCount > 0 && (
                <span className="text-gray-500"> +{extraCount} more</span>
              )}
            </p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">
              {meal.category.toLowerCase()} &bull; {formatTime(meal.loggedAt)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-gray-900">{meal.totalCals}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-gray-600">C: {Math.round(meal.totalCarbsG)}g</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-gray-600">P: {Math.round(meal.totalProteinG)}g</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-gray-600">F: {Math.round(meal.totalFatG)}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
