'use client';

import { MealRecord, FoodItem } from '@/types/workout.types';
import { X } from 'lucide-react';

interface MealListProps {
  records: MealRecord[];
  foodItems: FoodItem[];
  onDelete: (id: string) => void;
}

export function MealList({ records, foodItems, onDelete }: MealListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        記録がありません
      </div>
    );
  }

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: '朝食',
      lunch: '昼食',
      dinner: '夕食',
      snack: '間食',
    };
    return labels[type] || type;
  };

  const formatTime = (time: string) => {
    return time.padStart(5, '0');
  };

  return (
    <div className="space-y-6">
      {records.map(record => (
        <div key={record.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-lg font-semibold">{getMealTypeLabel(record.mealType)}</div>
              <div className="text-sm text-gray-500">{formatTime(record.time)}</div>
            </div>
            <button
              onClick={() => onDelete(record.id)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">カロリー</div>
                <div className="text-lg font-semibold">{record.totalCalories}kcal</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">タンパク質</div>
                <div className="text-lg font-semibold">{record.totalProtein}g</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">炭水化物</div>
                <div className="text-lg font-semibold">{record.totalCarbs}g</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">脂質</div>
                <div className="text-lg font-semibold">{record.totalFat}g</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">食べたもの</div>
              <div className="space-y-2">
                {record.foodItems.map((food, index) => {
                  const foodItem = foodItems.find(f => f.id === food.foodId);
                  if (!foodItem) return null;

                  return (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{foodItem.name}</div>
                        {food.notes && (
                          <div className="text-sm text-gray-500">{food.notes}</div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {food.amount}{foodItem.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {record.notes && (
              <div>
                <div className="text-sm text-gray-500 mb-1">メモ</div>
                <div className="text-sm">{record.notes}</div>
              </div>
            )}

            {record.photos && record.photos.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-2">写真</div>
                <div className="grid grid-cols-2 gap-2">
                  {record.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`食事写真 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 