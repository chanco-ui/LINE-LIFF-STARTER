'use client';

import { useState } from 'react';
import { MealRecord, MealType, FoodItem } from '@/types/workout.types';
import { Plus, X, Camera } from 'lucide-react';

interface MealFormProps {
  onSubmit: (record: MealRecord) => void;
  onCancel: () => void;
  selectedDate: string;
  foodItems: FoodItem[];
}

export function MealForm({ onSubmit, onCancel, selectedDate, foodItems }: MealFormProps) {
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [time, setTime] = useState<string>('');
  const [selectedFoods, setSelectedFoods] = useState<{ foodId: string; amount: number; notes?: string }[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);

  const mealTypes: { value: MealType; label: string }[] = [
    { value: 'breakfast', label: '朝食' },
    { value: 'lunch', label: '昼食' },
    { value: 'dinner', label: '夕食' },
    { value: 'snack', label: '間食' },
  ];

  const handleAddFood = () => {
    setSelectedFoods([...selectedFoods, { foodId: '', amount: 0 }]);
  };

  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleFoodChange = (index: number, field: 'foodId' | 'amount' | 'notes', value: string | number) => {
    const newFoods = [...selectedFoods];
    newFoods[index] = { ...newFoods[index], [field]: value };
    setSelectedFoods(newFoods);
  };

  const calculateTotals = () => {
    return selectedFoods.reduce(
      (acc, food) => {
        const foodItem = foodItems.find(f => f.id === food.foodId);
        if (!foodItem) return acc;

        const ratio = food.amount / foodItem.servingSize;
        return {
          calories: acc.calories + foodItem.calories * ratio,
          protein: acc.protein + foodItem.protein * ratio,
          carbs: acc.carbs + foodItem.carbs * ratio,
          fat: acc.fat + foodItem.fat * ratio,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totals = calculateTotals();
    const record: MealRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      mealType,
      time,
      foodItems: selectedFoods,
      ...totals,
      notes,
      photos,
    };
    onSubmit(record);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">食事タイプ</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {mealTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">時間</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">食べたもの</h3>
          <button
            type="button"
            onClick={handleAddFood}
            className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            追加
          </button>
        </div>

        {selectedFoods.map((food, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <select
                value={food.foodId}
                onChange={(e) => handleFoodChange(index, 'foodId', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">食品を選択</option>
                {foodItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <input
                type="number"
                value={food.amount}
                onChange={(e) => handleFoodChange(index, 'amount', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="量"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFood(index)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">メモ</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          placeholder="メモを入力..."
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          記録を保存
        </button>
      </div>
    </form>
  );
} 