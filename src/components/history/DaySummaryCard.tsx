import { DayHistory } from '@/types';
import { formatDate } from '@/lib/utils';

interface DaySummaryCardProps {
  day: DayHistory;
  goal: number;
}

export function DaySummaryCard({ day, goal }: DaySummaryCardProps) {
  const pct = Math.min((day.totalCals / goal) * 100, 100);
  const isOver = day.totalCals > goal;

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
      {/* Date & calorie total */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#1a1a2e] font-medium">{formatDate(day.date + 'T12:00:00')}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {day.mealCount} meal{day.mealCount !== 1 ? 's' : ''} logged
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isOver ? 'text-red-500' : 'text-[#1a1a2e]'}`}>
            {day.totalCals.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">/ {goal.toLocaleString()} kcal</p>
        </div>
      </div>

      {/* Calorie bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: isOver ? '#ef4444' : '#2563eb',
          }}
        />
      </div>

      {/* Macro pills */}
      <div className="flex gap-3">
        <span className="text-xs text-blue-400">
          P: {Math.round(day.totalProteinG)}g
        </span>
        <span className="text-xs text-amber-400">
          C: {Math.round(day.totalCarbsG)}g
        </span>
        <span className="text-xs text-pink-400">
          F: {Math.round(day.totalFatG)}g
        </span>
      </div>
    </div>
  );
}
