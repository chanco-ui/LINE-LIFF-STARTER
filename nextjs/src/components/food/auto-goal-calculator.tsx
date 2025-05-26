'use client';

import { useState } from 'react';
import { NutritionGoals } from '@/types/user.types';

interface AutoGoalCalculatorProps {
  onGoalsChange: (goals: NutritionGoals) => void;
  currentGoals: NutritionGoals;
}

export function AutoGoalCalculator({ onGoalsChange, currentGoals }: AutoGoalCalculatorProps) {
  const [weight, setWeight] = useState<number>(60);
  const [activityLevel, setActivityLevel] = useState<number>(1.5);
  const [goal, setGoal] = useState<'maintenance' | 'weight_loss' | 'muscle_gain'>('maintenance');
  const [calculatedGoals, setCalculatedGoals] = useState<NutritionGoals | null>(null);

  const calculateGoals = () => {
    // 基礎代謝量（BMR）の計算（ハリス・ベネディクトの式）
    const bmr = 10 * weight + 6.25 * 170 - 5 * 30 + 5; // 身長170cm、年齢30歳で固定

    // 1日の消費カロリー
    const tdee = bmr * activityLevel;

    // 目標に応じたカロリー調整
    let targetCalories = tdee;
    switch (goal) {
      case 'weight_loss':
        targetCalories = tdee - 500; // 500kcalのカロリー制限
        break;
      case 'muscle_gain':
        targetCalories = tdee + 300; // 300kcalのカロリー増加
        break;
    }

    // PFCバランスの計算
    const protein = Math.round(weight * 2); // 体重の2倍のタンパク質
    const fat = Math.round((targetCalories * 0.25) / 9); // 総カロリーの25%を脂質から
    const carbs = Math.round((targetCalories - (protein * 4 + fat * 9)) / 4); // 残りのカロリーを炭水化物から

    const newGoals: NutritionGoals = {
      calories: Math.round(targetCalories),
      protein,
      fat,
      carbs,
    };

    setCalculatedGoals(newGoals);
    onGoalsChange(newGoals);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">目標値の自動計算</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            体重 (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
            min="30"
            max="200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            活動レベル
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="1.2">ほとんど運動しない</option>
            <option value="1.375">週1-3回の軽い運動</option>
            <option value="1.55">週3-5回の中程度の運動</option>
            <option value="1.725">週6-7回の激しい運動</option>
            <option value="1.9">毎日の激しい運動</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            目標
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="maintenance">体重維持</option>
            <option value="weight_loss">減量</option>
            <option value="muscle_gain">筋肉増加</option>
          </select>
        </div>

        <button
          onClick={calculateGoals}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          目標値を計算
        </button>

        {calculatedGoals && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">計算結果</h3>
            <div className="space-y-1 text-sm">
              <div>カロリー: {calculatedGoals.calories}kcal</div>
              <div>タンパク質: {calculatedGoals.protein}g</div>
              <div>脂質: {calculatedGoals.fat}g</div>
              <div>炭水化物: {calculatedGoals.carbs}g</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 