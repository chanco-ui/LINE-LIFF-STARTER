 'use client';

import { MealRecord } from '@/types/user.types';
import { NutritionGoals } from '@/types/user.types';

interface GoalAchievementHistoryProps {
  meals: MealRecord[];
  goals: NutritionGoals;
  selectedDate: string;
}

export const GoalAchievementHistory = ({
  meals,
  goals,
  selectedDate,
}: GoalAchievementHistoryProps) => {
  // 過去7日分のデータを取得
  const getPast7Days = () => {
    const date = new Date(selectedDate);
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    return dates;
  };

  // 日付ごとの達成率を計算
  const dailyAchievements = getPast7Days().map(date => {
    const dayMeals = meals.filter(meal => meal.date === date);
    const totals = dayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalCalories,
        protein: acc.protein + meal.totalProtein,
        fat: acc.fat + meal.totalFat,
        carbs: acc.carbs + meal.totalCarbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    return {
      date,
      calories: (totals.calories / goals.calories) * 100,
      protein: (totals.protein / goals.protein) * 100,
      fat: (totals.fat / goals.fat) * 100,
      carbs: (totals.carbs / goals.carbs) * 100,
    };
  });

  // 日付をフォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 達成率の色を決定
  const getAchievementColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-500';
    if (percentage >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">目標達成率の履歴（過去7日）</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">日付</th>
              <th className="text-center py-2 px-4">カロリー</th>
              <th className="text-center py-2 px-4">タンパク質</th>
              <th className="text-center py-2 px-4">脂質</th>
              <th className="text-center py-2 px-4">炭水化物</th>
            </tr>
          </thead>
          <tbody>
            {dailyAchievements.map(day => (
              <tr key={day.date} className="border-b">
                <td className="py-2 px-4">{formatDate(day.date)}</td>
                <td
                  className={`text-center py-2 px-4 ${getAchievementColor(
                    day.calories
                  )}`}
                >
                  {Math.round(day.calories)}%
                </td>
                <td
                  className={`text-center py-2 px-4 ${getAchievementColor(
                    day.protein
                  )}`}
                >
                  {Math.round(day.protein)}%
                </td>
                <td
                  className={`text-center py-2 px-4 ${getAchievementColor(
                    day.fat
                  )}`}
                >
                  {Math.round(day.fat)}%
                </td>
                <td
                  className={`text-center py-2 px-4 ${getAchievementColor(
                    day.carbs
                  )}`}
                >
                  {Math.round(day.carbs)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
          <span>100%以上</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
          <span>80-99%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
          <span>80%未満</span>
        </div>
      </div>
    </div>
  );
};