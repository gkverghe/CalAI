'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { AnalysisFoodItem } from '@/types';

interface FoodItemRowProps {
  item: AnalysisFoodItem;
  index: number;
  onChange: (index: number, field: keyof AnalysisFoodItem, value: string | number) => void;
  onDelete: (index: number) => void;
}

export function FoodItemRow({ item, index, onChange, onDelete }: FoodItemRowProps) {
  const isLowConfidence = (item.confidence ?? 1) < 0.6;

  return (
    <div className="bg-white rounded-xl p-3 flex flex-col gap-2 border border-gray-100">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isLowConfidence && (
            <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          )}
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className="bg-transparent text-[#1a1a2e] text-sm font-medium w-full focus:outline-none focus:ring-0"
            placeholder="Food name"
          />
        </div>
        <button onClick={() => onDelete(index)} className="text-gray-300 hover:text-red-500 shrink-0">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">Portion</label>
          <input
            type="text"
            value={item.quantity}
            onChange={(e) => onChange(index, 'quantity', e.target.value)}
            className="bg-gray-50 text-[#1a1a2e] text-xs rounded-lg px-2 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-blue-400/50 mt-0.5 border border-gray-100"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">Calories</label>
          <input
            type="number"
            value={item.calories}
            onChange={(e) => onChange(index, 'calories', parseInt(e.target.value) || 0)}
            className="bg-gray-50 text-[#1a1a2e] text-xs rounded-lg px-2 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-blue-400/50 mt-0.5 border border-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-blue-400 uppercase tracking-wider">Protein</label>
          <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1.5 mt-0.5 border border-gray-100">
            <input
              type="number"
              value={Math.round(item.proteinG)}
              onChange={(e) => onChange(index, 'proteinG', parseFloat(e.target.value) || 0)}
              className="bg-transparent text-[#1a1a2e] text-xs w-full focus:outline-none"
            />
            <span className="text-gray-400 text-[10px]">g</span>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-amber-400 uppercase tracking-wider">Carbs</label>
          <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1.5 mt-0.5 border border-gray-100">
            <input
              type="number"
              value={Math.round(item.carbsG)}
              onChange={(e) => onChange(index, 'carbsG', parseFloat(e.target.value) || 0)}
              className="bg-transparent text-[#1a1a2e] text-xs w-full focus:outline-none"
            />
            <span className="text-gray-400 text-[10px]">g</span>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-pink-400 uppercase tracking-wider">Fat</label>
          <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1.5 mt-0.5 border border-gray-100">
            <input
              type="number"
              value={Math.round(item.fatG)}
              onChange={(e) => onChange(index, 'fatG', parseFloat(e.target.value) || 0)}
              className="bg-transparent text-[#1a1a2e] text-xs w-full focus:outline-none"
            />
            <span className="text-gray-400 text-[10px]">g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
