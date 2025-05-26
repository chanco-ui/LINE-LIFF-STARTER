'use client';

import { MealRecord } from '@/types/user.types';

interface PFCPieChartProps {
  meals: MealRecord[];
}

export const PFCPieChart = ({ meals }: PFCPieChartProps) => {
  // PFCの合計を計算
  const totalPFC = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + meal.totalProtein,
      fat: acc.fat + meal.totalFat,
      carbs: acc.carbs + meal.totalCarbs,
    }),
    { protein: 0, fat: 0, carbs: 0 }
  );

  // 合計を計算
  const total = totalPFC.protein + totalPFC.fat + totalPFC.carbs;

  // 割合を計算
  const percentages = {
    protein: (totalPFC.protein / total) * 100 || 0,
    fat: (totalPFC.fat / total) * 100 || 0,
    carbs: (totalPFC.carbs / total) * 100 || 0,
  };

  // 円グラフのパスを生成
  const getPath = (start: number, end: number) => {
    const radius = 50;
    const startAngle = (start / 100) * 360;
    const endAngle = (end / 100) * 360;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">PFCバランス</h2>

      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* タンパク質 */}
            <path
              d={getPath(0, percentages.protein)}
              fill="#3B82F6"
              className="transition-all duration-500"
            />
            {/* 脂質 */}
            <path
              d={getPath(percentages.protein, percentages.protein + percentages.fat)}
              fill="#EF4444"
              className="transition-all duration-500"
            />
            {/* 炭水化物 */}
            <path
              d={getPath(
                percentages.protein + percentages.fat,
                percentages.protein + percentages.fat + percentages.carbs
              )}
              fill="#22C55E"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(total)}g</div>
              <div className="text-sm text-gray-600">合計</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <span className="text-sm font-medium">タンパク質</span>
          </div>
          <div className="text-lg font-bold">{Math.round(percentages.protein)}%</div>
          <div className="text-sm text-gray-600">{Math.round(totalPFC.protein)}g</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
            <span className="text-sm font-medium">脂質</span>
          </div>
          <div className="text-lg font-bold">{Math.round(percentages.fat)}%</div>
          <div className="text-sm text-gray-600">{Math.round(totalPFC.fat)}g</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <span className="text-sm font-medium">炭水化物</span>
          </div>
          <div className="text-lg font-bold">{Math.round(percentages.carbs)}%</div>
          <div className="text-sm text-gray-600">{Math.round(totalPFC.carbs)}g</div>
        </div>
      </div>
    </div>
  );
}; 