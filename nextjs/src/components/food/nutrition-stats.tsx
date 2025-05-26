'use client';

import { MealRecord, NutritionGoals } from '@/types/user.types';

interface NutritionStatsProps {
  meals: MealRecord[];
  goals: NutritionGoals;
}

export function NutritionStats({ meals, goals }: NutritionStatsProps) {
  // 過去30日間の食事記録を取得
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentMeals = meals.filter(meal => new Date(meal.date) >= thirtyDaysAgo);

  // 日付ごとの栄養素合計を計算
  const dailyTotals = recentMeals.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) {
      acc[date] = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
      };
    }
    acc[date].calories += meal.totalCalories;
    acc[date].protein += meal.totalProtein;
    acc[date].fat += meal.totalFat;
    acc[date].carbs += meal.totalCarbs;
    return acc;
  }, {} as Record<string, { calories: number; protein: number; fat: number; carbs: number }>);

  // 統計情報を計算
  const stats = {
    calories: {
      avg: 0,
      max: 0,
      min: Infinity,
      goal: goals.calories,
    },
    protein: {
      avg: 0,
      max: 0,
      min: Infinity,
      goal: goals.protein,
    },
    fat: {
      avg: 0,
      max: 0,
      min: Infinity,
      goal: goals.fat,
    },
    carbs: {
      avg: 0,
      max: 0,
      min: Infinity,
      goal: goals.carbs,
    },
  };

  // 各栄養素の統計情報を計算
  Object.values(dailyTotals).forEach(totals => {
    Object.entries(totals).forEach(([key, value]) => {
      const nutrient = key as keyof typeof totals;
      stats[nutrient].avg += value;
      stats[nutrient].max = Math.max(stats[nutrient].max, value);
      stats[nutrient].min = Math.min(stats[nutrient].min, value);
    });
  });

  // 平均値を計算
  const daysCount = Object.keys(dailyTotals).length || 1;
  Object.keys(stats).forEach(key => {
    const nutrient = key as keyof typeof stats;
    stats[nutrient].avg = Math.round(stats[nutrient].avg / daysCount);
  });

  // グラフの高さを計算する関数
  const getBarHeight = (value: number, max: number) => {
    return `${(value / max) * 100}%`;
  };

  // 最大値を取得
  const maxCalories = Math.max(stats.calories.max, goals.calories);
  const maxNutrients = Math.max(
    stats.protein.max,
    stats.fat.max,
    stats.carbs.max,
    goals.protein,
    goals.fat,
    goals.carbs
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">栄養素の統計情報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* カロリーの統計 */}
        <div>
          <h3 className="font-medium mb-4">カロリー</h3>
          <div className="h-48 flex items-end space-x-4">
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{ height: getBarHeight(stats.calories.avg, maxCalories) }}
                />
                <div className="text-center text-sm mt-2">平均</div>
                <div className="text-center text-sm">{stats.calories.avg}kcal</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-green-500 rounded-t"
                  style={{ height: getBarHeight(stats.calories.max, maxCalories) }}
                />
                <div className="text-center text-sm mt-2">最大</div>
                <div className="text-center text-sm">{stats.calories.max}kcal</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-yellow-500 rounded-t"
                  style={{ height: getBarHeight(stats.calories.min, maxCalories) }}
                />
                <div className="text-center text-sm mt-2">最小</div>
                <div className="text-center text-sm">{stats.calories.min}kcal</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-red-500 rounded-t"
                  style={{ height: getBarHeight(goals.calories, maxCalories) }}
                />
                <div className="text-center text-sm mt-2">目標</div>
                <div className="text-center text-sm">{goals.calories}kcal</div>
              </div>
            </div>
          </div>
        </div>

        {/* PFCの統計 */}
        <div>
          <h3 className="font-medium mb-4">PFCバランス</h3>
          <div className="h-48 flex items-end space-x-4">
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{ height: getBarHeight(stats.protein.avg, maxNutrients) }}
                />
                <div className="text-center text-sm mt-2">平均</div>
                <div className="text-center text-sm">P: {stats.protein.avg}g</div>
                <div className="text-center text-sm">F: {stats.fat.avg}g</div>
                <div className="text-center text-sm">C: {stats.carbs.avg}g</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-green-500 rounded-t"
                  style={{ height: getBarHeight(Math.max(stats.protein.max, stats.fat.max, stats.carbs.max), maxNutrients) }}
                />
                <div className="text-center text-sm mt-2">最大</div>
                <div className="text-center text-sm">P: {stats.protein.max}g</div>
                <div className="text-center text-sm">F: {stats.fat.max}g</div>
                <div className="text-center text-sm">C: {stats.carbs.max}g</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-yellow-500 rounded-t"
                  style={{ height: getBarHeight(Math.min(stats.protein.min, stats.fat.min, stats.carbs.min), maxNutrients) }}
                />
                <div className="text-center text-sm mt-2">最小</div>
                <div className="text-center text-sm">P: {stats.protein.min}g</div>
                <div className="text-center text-sm">F: {stats.fat.min}g</div>
                <div className="text-center text-sm">C: {stats.carbs.min}g</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-full flex flex-col justify-end">
                <div
                  className="bg-red-500 rounded-t"
                  style={{ height: getBarHeight(Math.max(goals.protein, goals.fat, goals.carbs), maxNutrients) }}
                />
                <div className="text-center text-sm mt-2">目標</div>
                <div className="text-center text-sm">P: {goals.protein}g</div>
                <div className="text-center text-sm">F: {goals.fat}g</div>
                <div className="text-center text-sm">C: {goals.carbs}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 