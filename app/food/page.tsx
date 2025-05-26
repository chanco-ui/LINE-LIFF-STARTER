'use client';

import { useState, useEffect } from 'react';
import { MealForm } from '@/components/food/meal-form';
import { MealRecord, NutritionGoals } from '@/types/user.types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Calendar } from '@/components/food/calendar';
import { WeeklyNutritionChart } from '@/components/food/weekly-nutrition-chart';
import { PFCPieChart } from '@/components/food/pfc-pie-chart';
import { MonthlyNutritionChart } from '@/components/food/monthly-nutrition-chart';
import { NutritionGoals as NutritionGoalsComponent } from '@/components/food/nutrition-goals';
import { GoalComparison } from '@/components/food/goal-comparison';
import { NutritionTrendChart } from '@/components/food/nutrition-trend-chart';
import { GoalAchievementHistory } from '@/components/food/goal-achievement-history';
import { AutoGoalCalculator } from '@/components/food/auto-goal-calculator';
import { NutritionStats } from '@/components/food/nutrition-stats';

export default function FoodPage() {
  const [meals, setMeals] = useLocalStorage<MealRecord[]>('meals', []);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [editingMeal, setEditingMeal] = useState<MealRecord | null>(null);
  const [goals, setGoals] = useLocalStorage<NutritionGoals>('nutrition-goals', {
    calories: 2000,
    protein: 60,
    fat: 55,
    carbs: 250,
  });

  // 選択された日付の食事をフィルタリング
  const selectedDateMeals = meals.filter(meal => meal.date === selectedDate);

  const handleSubmit = (data: { type: "朝食" | "昼食" | "夕食" | "間食"; foods: FoodEntry[]; time: string; memo: string; }) => {
    const meal: MealRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      mealType: data.type,
      time: data.time,
      foodItems: data.foods,
      totalCalories: 0, // 計算ロジックを追加
      totalProtein: 0,  // 計算ロジックを追加
      totalCarbs: 0,    // 計算ロジックを追加
      totalFat: 0,      // 計算ロジックを追加
      notes: data.memo,
      photos: [],
    };
    if (editingMeal) {
      // 編集モードの場合
      setMeals(meals.map(m => (m.id === meal.id ? meal : m)));
      setEditingMeal(null);
    } else {
      // 新規追加の場合
      setMeals([...meals, meal]);
    }
  };

  const handleDelete = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleEdit = (meal: MealRecord) => {
    setEditingMeal(meal);
  };

  const handleGoalsChange = (newGoals: NutritionGoals) => {
    setGoals(newGoals);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">食事記録</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左カラム：食事入力フォームと目標値設定 */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              {editingMeal ? '食事を編集' : '食事を記録'}
            </h2>
            <MealForm
              onSubmit={handleSubmit}
              initialData={editingMeal}
              selectedDate={selectedDate}
            />
          </div>

          <NutritionGoalsComponent onGoalsChange={handleGoalsChange} />
          <AutoGoalCalculator onGoalsChange={handleGoalsChange} currentGoals={goals} />
        </div>

        {/* 右カラム：カレンダーと食事記録 */}
        <div className="lg:col-span-2 space-y-8">
          {/* カレンダー */}
          <Calendar
            meals={meals}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* 推移グラフ */}
          <NutritionTrendChart meals={meals} selectedDate={selectedDate} />

          {/* 月間グラフ */}
          <MonthlyNutritionChart meals={meals} selectedDate={selectedDate} />

          {/* 週間グラフ */}
          <WeeklyNutritionChart meals={meals} selectedDate={selectedDate} />

          {/* PFCバランス */}
          <PFCPieChart meals={selectedDateMeals} />

          {/* 目標値との比較 */}
          <GoalComparison meals={selectedDateMeals} goals={goals} />

          {/* 栄養素の統計情報 */}
          <NutritionStats meals={meals} goals={goals} />

          {/* 目標達成率の履歴 */}
          <GoalAchievementHistory
            meals={meals}
            goals={goals}
            selectedDate={selectedDate}
          />

          {/* 食事記録一覧 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              {selectedDate}の食事記録
            </h2>
            {selectedDateMeals.length === 0 ? (
              <p className="text-gray-500">この日の食事記録はありません</p>
            ) : (
              <div className="space-y-4">
                {selectedDateMeals.map(meal => (
                  <div
                    key={meal.id}
                    className="border rounded-lg p-4 flex justify-between items-start"
                  >
                    <div>
                      <div className="font-medium">{meal.type}</div>
                      <div className="text-sm text-gray-600">{meal.time}</div>
                      <div className="mt-2">
                        {meal.foods.map((food, index) => (
                          <div key={index} className="text-sm">
                            {food.name} - {food.amount}g
                          </div>
                        ))}
                      </div>
                      {meal.memo && (
                        <div className="mt-2 text-sm text-gray-600">
                          メモ: {meal.memo}
                        </div>
                      )}
                      <div className="mt-2 text-sm">
                        <div>カロリー: {meal.totalCalories}kcal</div>
                        <div>P: {meal.totalProtein}g</div>
                        <div>F: {meal.totalFat}g</div>
                        <div>C: {meal.totalCarbs}g</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(meal)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 