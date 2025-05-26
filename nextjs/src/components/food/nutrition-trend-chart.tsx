'use client';

import { MealRecord } from '@/types/user.types';

interface NutritionTrendChartProps {
  meals: MealRecord[];
  selectedDate: string;
}

export const NutritionTrendChart = ({
  meals,
  selectedDate,
}: NutritionTrendChartProps) => {
  // 過去30日分のデータを取得
  const getPast30Days = () => {
    const date = new Date(selectedDate);
    const dates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });
    return dates;
  };

  // 日付ごとの栄養素データを集計
  const dailyData = getPast30Days().map(date => {
    const dayMeals = meals.filter(meal => meal.date === date);
    return {
      date,
      calories: dayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0),
      protein: dayMeals.reduce((sum, meal) => sum + meal.totalProtein, 0),
      fat: dayMeals.reduce((sum, meal) => sum + meal.totalFat, 0),
      carbs: dayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0),
    };
  });

  // 最大値を計算（グラフのスケーリング用）
  const maxCalories = Math.max(...dailyData.map(d => d.calories));
  const maxNutrients = Math.max(
    ...dailyData.map(d => Math.max(d.protein, d.fat, d.carbs))
  );

  // 日付をフォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">栄養素摂取量の推移（過去30日）</h2>

      <div className="h-64">
        <div className="relative h-full">
          {/* カロリーのグラフ */}
          <div className="absolute inset-0">
            <div className="h-full flex items-end space-x-1">
              {dailyData.map((day, index) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-yellow-500/20 rounded-t"
                    style={{
                      height: `${(day.calories / maxCalories) * 100}%`,
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {index % 5 === 0 ? formatDate(day.date) : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PFCのグラフ */}
          <div className="absolute inset-0">
            <div className="h-full flex items-end space-x-1">
              {dailyData.map((day) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="w-full flex flex-col space-y-0.5">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{
                        height: `${(day.protein / maxNutrients) * 100}%`,
                      }}
                    />
                    <div
                      className="w-full bg-red-500 rounded-t"
                      style={{
                        height: `${(day.fat / maxNutrients) * 100}%`,
                      }}
                    />
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{
                        height: `${(day.carbs / maxNutrients) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500/20 rounded-full mr-2" />
          <span className="text-sm">カロリー</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <span className="text-sm">タンパク質</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
          <span className="text-sm">脂質</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
          <span className="text-sm">炭水化物</span>
        </div>
      </div>
    </div>
  );
}; 