import { AlertTriangle } from 'lucide-react';
import { FoodItem } from '@/types';

interface FoodBreakdownTableProps {
  items: FoodItem[];
}

export function FoodBreakdownTable({ items }: FoodBreakdownTableProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-500">Item</span>
        <span className="text-xs text-gray-500 text-right">Cal</span>
        <span className="text-xs text-blue-400 text-right">P</span>
        <span className="text-xs text-amber-400 text-right">C</span>
        <span className="text-xs text-pink-400 text-right">F</span>
      </div>

      {/* Rows */}
      {items.map((item, i) => {
        const isLow = (item.confidence ?? 1) < 0.6;
        return (
          <div
            key={item.id ?? i}
            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-4 py-3 border-b border-gray-50 last:border-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {isLow && <AlertTriangle size={11} className="text-amber-400 shrink-0" />}
                <span className="text-sm text-[#1a1a2e] truncate">{item.name}</span>
              </div>
              <span className="text-xs text-gray-500">{item.quantity}</span>
            </div>
            <span className="text-sm text-[#1a1a2e] font-medium text-right self-center">
              {item.calories}
            </span>
            <span className="text-sm text-blue-400 text-right self-center">
              {Math.round(item.proteinG)}g
            </span>
            <span className="text-sm text-amber-400 text-right self-center">
              {Math.round(item.carbsG)}g
            </span>
            <span className="text-sm text-pink-400 text-right self-center">
              {Math.round(item.fatG)}g
            </span>
          </div>
        );
      })}
    </div>
  );
}
