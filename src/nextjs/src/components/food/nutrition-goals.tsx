'use client';

import { useState, useEffect } from 'react';
import type { NutritionGoals } from '@/types/user.types';

interface NutritionGoalsProps {
  onGoalsChange: (goals: NutritionGoals) => void;
}

const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 60,
  fat: 55,
  carbs: 250,
};

export function NutritionGoals({ onGoalsChange }: NutritionGoalsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [goals, setGoals] = useState<NutritionGoals>(DEFAULT_GOALS);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
    const savedGoals = localStorage.getItem('nutrition-goals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
        onGoalsChange(parsedGoals);
      } catch (error) {
        console.error('Failed to parse saved goals:', error);
      }
    }
  }, [onGoalsChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGoalsChange(goals);
    setIsEditing(false);
    localStorage.setItem('nutrition-goals', JSON.stringify(goals));
  };

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return null;
  }

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">栄養素目標値</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            編集
          </button>
        </div>
        <div className="space-y-2">
          <div>カロリー: {goals.calories}kcal</div>
          <div>タンパク質: {goals.protein}g</div>
          <div>脂質: {goals.fat}g</div>
          <div>炭水化物: {goals.carbs}g</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">栄養素目標値を設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カロリー (kcal)
          </label>
          <input
            type="number"
            value={goals.calories}
            onChange={(e) =>
              setGoals({ ...goals, calories: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-md"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タンパク質 (g)
          </label>
          <input
            type="number"
            value={goals.protein}
            onChange={(e) =>
              setGoals({ ...goals, protein: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-md"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            脂質 (g)
          </label>
          <input
            type="number"
            value={goals.fat}
            onChange={(e) =>
              setGoals({ ...goals, fat: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-md"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            炭水化物 (g)
          </label>
          <input
            type="number"
            value={goals.carbs}
            onChange={(e) =>
              setGoals({ ...goals, carbs: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-md"
            min="0"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
} 