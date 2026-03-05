'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CalorieRingProps {
  consumed: number;
  goal: number;
}

export function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const remaining = Math.max(goal - consumed, 0);
  const isOver = consumed > goal;
  const percentage = Math.min(Math.round((consumed / goal) * 100), 100);

  const gaugeData = [
    { value: Math.min(consumed, goal), fill: '#3B82F6' },
    { value: Math.max(remaining, isOver ? 0 : remaining), fill: '#E5E7EB' },
  ];

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="90%"
              dataKey="value"
              stroke="none"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="text-4xl font-bold text-gray-900">
            {percentage}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {consumed.toLocaleString()} / {goal.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">kcal</div>
        </div>
      </div>

      {/* Status message below gauge */}
      {isOver ? (
        <p className="text-center text-sm text-orange-600 mt-2">
          <span className="font-semibold">{(consumed - goal).toLocaleString()} kcal</span> over target
        </p>
      ) : (
        <p className="text-center text-sm text-gray-600 mt-2">
          <span className="font-semibold text-blue-600">{remaining.toLocaleString()} kcal</span> remaining
        </p>
      )}
    </div>
  );
}
