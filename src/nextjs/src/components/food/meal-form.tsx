'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import type { FoodEntry, FoodItem, MealRecord } from '@/types/user.types';
import { FoodSearch } from './food-search';

interface MealFormProps {
  onSubmit: (data: {
    type: "朝食" | "昼食" | "夕食" | "間食";
    foods: FoodEntry[];
    time: string;
    memo: string;
  }) => void;
  initialData?: MealRecord;
}

export const MealForm = ({ onSubmit, initialData }: MealFormProps) => {
  const [type, setType] = useState<"朝食" | "昼食" | "夕食" | "間食">(initialData?.type || "朝食");
  const [time, setTime] = useState(initialData?.time || "");
  const [memo, setMemo] = useState(initialData?.memo || "");
  const [foods, setFoods] = useState<FoodEntry[]>(initialData?.foods || []);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setTime(initialData.time);
      setMemo(initialData.memo);
      setFoods(initialData.foods);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      foods,
      time,
      memo,
    });
  };

  const handleFoodSelect = (food: FoodItem) => {
    setFoods([
      ...foods,
      {
        foodId: food.id,
        name: food.name,
        quantity: food.servingSize,
        unit: food.servingUnit,
        calories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
      },
    ]);
  };

  const removeFood = (index: number) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  const updateFood = (index: number, field: keyof FoodEntry, value: string | number) => {
    const newFoods = [...foods];
    newFoods[index] = {
      ...newFoods[index],
      [field]: value,
    };
    setFoods(newFoods);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">食事タイプ</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "朝食" | "昼食" | "夕食" | "間食")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="朝食">朝食</option>
          <option value="昼食">昼食</option>
          <option value="夕食">夕食</option>
          <option value="間食">間食</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">時間</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          rows={3}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">食品</label>
        </div>

        <div className="mb-4">
          <FoodSearch onSelect={handleFoodSelect} />
        </div>

        <div className="space-y-4">
          {foods.map((food, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-1 space-y-2">
                <div className="font-medium">{food.name}</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="量"
                    value={food.quantity}
                    onChange={(e) => updateFood(index, "quantity", Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="単位"
                    value={food.unit}
                    onChange={(e) => updateFood(index, "unit", e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {food.calories}kcal (P: {food.protein}g F: {food.fat}g C: {food.carbs}g)
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFood(index)}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full btn btn-primary"
        >
          {initialData ? '更新する' : '記録する'}
        </button>
      </div>
    </form>
  );
}; 