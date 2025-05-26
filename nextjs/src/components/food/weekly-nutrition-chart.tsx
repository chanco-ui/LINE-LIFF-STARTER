'use client';

import { MealRecord } from '@/types/user.types';

interface WeeklyNutritionChartProps {
  meals: MealRecord[];
  selectedDate: string;
}

export const WeeklyNutritionChart = ({ meals, selectedDate }: WeeklyNutritionChartProps) => {
  // 週の開始日と終了日を計算
  const getWeekDates = (date: string) => {
    const currentDate = new Date(date);
    const day = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - day);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // 日付ごとの栄養素を集計
  const getDailyNutrition = (date: string) => {
    const dayMeals = meals.filter(meal => meal.date === date);
    return dayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalCalories,
        protein: acc.protein + meal.totalProtein,
        fat: acc.fat + meal.totalFat,
        carbs: acc.carbs + meal.totalCarbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };

  const weekDates = getWeekDates(selectedDate);
  const weeklyData = weekDates.map(date => ({
    date,
    ...getDailyNutrition(date),
  }));

  // グラフの最大値を計算
  const maxCalories = Math.max(...weeklyData.map(d => d.calories));
  const maxNutrients = Math.max(
    ...weeklyData.map(d => Math.max(d.protein, d.fat, d.carbs))
  );

  // グラフの高さを計算（%）
  const getHeight = (value: number, isCalories: boolean = false) => {
    const max = isCalories ? maxCalories : maxNutrients;
    return `${(value / max) * 100}%`;
  };

  // 日付をフォーマット
  const formatDate = (date: string) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">週間栄養素摂取量</h2>
      
      <div className="h-64 flex items-end space-x-2">
        {weeklyData.map((day) => (
          <div key={day.date} className="flex-1 flex flex-col items-center">
            {/* カロリー */}
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-24 bg-gray-100 rounded-t overflow-hidden relative">
                <div
                  className="w-full bg-yellow-500 transition-all duration-500 absolute bottom-0"
                  style={{ height: getHeight(day.calories, true) }}
                />
              </div>
              <span className="text-xs mt-1">{day.calories} kcal</span>
            </div>

            {/* 栄養素 */}
            <div className="w-full flex space-x-1 mt-2">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-16 bg-gray-100 rounded-t overflow-hidden relative">
                  <div
                    className="w-full bg-blue-500 transition-all duration-500 absolute bottom-0"
                    style={{ height: getHeight(day.protein) }}
                  />
                </div>
                <span className="text-xs mt-1">{day.protein}g</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-16 bg-gray-100 rounded-t overflow-hidden relative">
                  <div
                    className="w-full bg-red-500 transition-all duration-500 absolute bottom-0"
                    style={{ height: getHeight(day.fat) }}
                  />
                </div>
                <span className="text-xs mt-1">{day.fat}g</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-16 bg-gray-100 rounded-t overflow-hidden relative">
                  <div
                    className="w-full bg-green-500 transition-all duration-500 absolute bottom-0"
                    style={{ height: getHeight(day.carbs) }}
                  />
                </div>
                <span className="text-xs mt-1">{day.carbs}g</span>
              </div>
            </div>

            {/* 日付 */}
            <div className="mt-2 text-xs text-gray-600">
              {formatDate(day.date)}
            </div>
          </div>
        ))}
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