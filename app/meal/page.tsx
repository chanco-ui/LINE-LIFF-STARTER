'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { MealForm } from '@/components/workout/meal-form';
import { MealList } from '@/components/workout/meal-list';
import { Calendar } from '@/components/workout/calendar';
import { MealRecord, FoodItem, FoodDatabase } from '@/types/workout.types';
import { Plus } from 'lucide-react';

// デフォルトの食品データベース
const DEFAULT_FOOD_DATABASE: FoodDatabase[] = [
  {
    id: 'chicken-breast',
    name: '鶏むね肉',
    nameEn: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: 100,
    unit: 'g',
    category: 'meat',
  },
  {
    id: 'salmon',
    name: 'サーモン',
    nameEn: 'Salmon',
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: 100,
    unit: 'g',
    category: 'fish',
  },
  {
    id: 'rice',
    name: '白米',
    nameEn: 'White Rice',
    calories: 168,
    protein: 2.7,
    carbs: 37,
    fat: 0.3,
    servingSize: 100,
    unit: 'g',
    category: 'grain',
  },
  {
    id: 'broccoli',
    name: 'ブロッコリー',
    nameEn: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    servingSize: 100,
    unit: 'g',
    category: 'vegetable',
  },
  {
    id: 'greek-yogurt',
    name: 'ギリシャヨーグルト',
    nameEn: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    servingSize: 100,
    unit: 'g',
    category: 'dairy',
  },
];

export default function MealPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [records, setRecords] = useLocalStorage<MealRecord[]>('meal-records', []);
  const [foodDatabase] = useLocalStorage<FoodDatabase[]>('food-database', DEFAULT_FOOD_DATABASE);
  const [isAddingMeal, setIsAddingMeal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddMeal = (record: MealRecord) => {
    setRecords([...records, record]);
    setIsAddingMeal(false);
  };

  const handleDeleteMeal = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">食事記録</h1>
        <button
          onClick={() => setIsAddingMeal(!isAddingMeal)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-5 h-5" />
          {isAddingMeal ? '記録を閉じる' : '記録を追加'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            records={records}
          />
        </div>

        <div className="lg:col-span-2">
          {isAddingMeal ? (
            <MealForm
              onSubmit={handleAddMeal}
              onCancel={() => setIsAddingMeal(false)}
              selectedDate={selectedDate}
              foodDatabase={foodDatabase}
            />
          ) : (
            <MealList
              records={records.filter(record => record.date === selectedDate)}
              onDelete={handleDeleteMeal}
              foodDatabase={foodDatabase}
            />
          )}
        </div>
      </div>
    </div>
  );
} 