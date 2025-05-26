'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { WorkoutRecord, MealRecord } from '@/types/workout.types';
import { Dumbbell, Utensils, Calendar, TrendingUp } from 'lucide-react';

export default function Home() {
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutRecord[]>([]);
  const [recentMeals, setRecentMeals] = useState<MealRecord[]>([]);

  useEffect(() => {
    // ローカルストレージからデータを読み込む
    const storedWorkouts = localStorage.getItem('workoutRecords');
    const storedMeals = localStorage.getItem('mealRecords');

    if (storedWorkouts) {
      const workouts = JSON.parse(storedWorkouts);
      // 最新の5件を取得
      setRecentWorkouts(workouts.slice(-5).reverse());
    }

    if (storedMeals) {
      const meals = JSON.parse(storedMeals);
      // 最新の5件を取得
      setRecentMeals(meals.slice(-5).reverse());
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Workout Tracker</h1>

        {/* クイックアクセス */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/workout"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Dumbbell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">トレーニング記録</h2>
                <p className="text-gray-600">ワークアウトの記録と管理</p>
              </div>
            </div>
          </Link>

          <Link
            href="/meal"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">食事記録</h2>
                <p className="text-gray-600">食事と栄養の管理</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 最近の記録 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 最近のトレーニング */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">最近のトレーニング</h2>
            </div>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{workout.date}</div>
                        <div className="text-sm text-gray-600">
                          {workout.workoutSets.map((set) => set.exerciseName).join(', ')}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {workout.workoutSets.length}種目
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">記録がありません</p>
            )}
          </div>

          {/* 最近の食事 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">最近の食事</h2>
            </div>
            {recentMeals.length > 0 ? (
              <div className="space-y-4">
                {recentMeals.map((meal) => (
                  <div key={meal.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{meal.date}</div>
                        <div className="text-sm text-gray-600">
                          {meal.mealType === 'breakfast' ? '朝食' :
                           meal.mealType === 'lunch' ? '昼食' :
                           meal.mealType === 'dinner' ? '夕食' : '間食'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {meal.totalCalories}kcal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">記録がありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 