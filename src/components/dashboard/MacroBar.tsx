interface MacroBarProps {
  label: string;
  consumed: number;
  goal: number;
  color: string;
  unit?: string;
}

function MacroBar({ label, consumed, goal, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min((consumed / goal) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {Math.round(consumed)}{unit} / {goal}{unit}
        </span>
      </div>
      <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface MacroBarsProps {
  protein: number;
  carbs: number;
  fat: number;
  goals: {
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
}

export function MacroBars({ protein, carbs, fat, goals }: MacroBarsProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        {/* Target icon inline SVG to avoid extra import */}
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900">Macros</h2>
      </div>
      <div className="space-y-6">
        <MacroBar label="Carbs"   consumed={carbs}   goal={goals.carbsG}   color="#F59E0B" />
        <MacroBar label="Protein" consumed={protein} goal={goals.proteinG} color="#10B981" />
        <MacroBar label="Fat"     consumed={fat}     goal={goals.fatG}     color="#EF4444" />
      </div>
    </div>
  );
}
