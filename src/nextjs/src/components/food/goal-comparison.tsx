'use client';

import { MealRecord } from '@/types/user.types';
import { NutritionGoals } from '@/types/user.types';

interface GoalComparisonProps {
  meals: MealRecord[];
  goals: NutritionGoals;
}

export const GoalComparison = ({ meals, goals }: GoalComparisonProps) => {
  // 合計値を計算
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      fat: acc.fat + meal.totalFat,
      carbs: acc.carbs + meal.totalCarbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  // 目標値との比較を計算
  const comparisons = {
    calories: (totals.calories / goals.calories) * 100,
    protein: (totals.protein / goals.protein) * 100,
    fat: (totals.fat / goals.fat) * 100,
    carbs: (totals.carbs / goals.carbs) * 100,
  };

  // 進捗バーの色を決定
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">目標値との比較</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">カロリー</span>
            <span className="text-sm">
              {Math.round(totals.calories)} / {goals.calories} kcal
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                comparisons.calories
              )}`}
              style={{ width: `${Math.min(comparisons.calories, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">タンパク質</span>
            <span className="text-sm">
              {Math.round(totals.protein)} / {goals.protein} g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                comparisons.protein
              )}`}
              style={{ width: `${Math.min(comparisons.protein, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">脂質</span>
            <span className="text-sm">
              {Math.round(totals.fat)} / {goals.fat} g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                comparisons.fat
              )}`}
              style={{ width: `${Math.min(comparisons.fat, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">炭水化物</span>
            <span className="text-sm">
              {Math.round(totals.carbs)} / {goals.carbs} g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(
                comparisons.carbs
              )}`}
              style={{ width: `${Math.min(comparisons.carbs, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 