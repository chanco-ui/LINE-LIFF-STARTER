'use client';

import { MealRecord } from '@/types/user.types';

interface NutritionChartProps {
  meals: MealRecord[];
}

export const NutritionChart = ({ meals }: NutritionChartProps) => {
  // 栄養素の合計を計算
  const totalNutrition = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      fat: acc.fat + meal.totalFat,
      carbs: acc.carbs + meal.totalCarbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  // グラフの最大値を計算（カロリーは別スケール）
  const maxNutrients = Math.max(totalNutrition.protein, totalNutrition.fat, totalNutrition.carbs);
  const maxCalories = totalNutrition.calories;

  // グラフの高さを計算（%）
  const getHeight = (value: number, isCalories: boolean = false) => {
    const max = isCalories ? maxCalories : maxNutrients;
    return `${(value / max) * 100}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">栄養素摂取量</h2>
      
      <div className="space-y-4">
        {/* カロリー */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">カロリー</span>
            <span className="text-sm text-gray-600">{totalNutrition.calories} kcal</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: getHeight(totalNutrition.calories, true) }}
            />
          </div>
        </div>

        {/* タンパク質 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">タンパク質</span>
            <span className="text-sm text-gray-600">{totalNutrition.protein}g</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: getHeight(totalNutrition.protein) }}
            />
          </div>
        </div>

        {/* 脂質 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">脂質</span>
            <span className="text-sm text-gray-600">{totalNutrition.fat}g</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: getHeight(totalNutrition.fat) }}
            />
          </div>
        </div>

        {/* 炭水化物 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">炭水化物</span>
            <span className="text-sm text-gray-600">{totalNutrition.carbs}g</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: getHeight(totalNutrition.carbs) }}
            />
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
          <span>カロリー</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <span>タンパク質</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
          <span>脂質</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
          <span>炭水化物</span>
        </div>
      </div>
    </div>
  );
}; 