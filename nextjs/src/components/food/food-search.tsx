'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { FoodItem } from '@/types/user.types';

// サンプルデータ
const SAMPLE_FOODS: FoodItem[] = [
  {
    id: '1',
    name: '白米',
    calories: 168,
    protein: 2.5,
    fat: 0.3,
    carbs: 37.1,
    servingSize: 100,
    servingUnit: 'g',
  },
  {
    id: '2',
    name: '鶏むね肉',
    calories: 191,
    protein: 31.1,
    fat: 6.2,
    carbs: 0,
    servingSize: 100,
    servingUnit: 'g',
  },
  {
    id: '3',
    name: 'ブロッコリー',
    calories: 33,
    protein: 2.8,
    fat: 0.4,
    carbs: 6.6,
    servingSize: 100,
    servingUnit: 'g',
  },
];

interface FoodSearchProps {
  onSelect: (food: FoodItem) => void;
}

export const FoodSearch = ({ onSelect }: FoodSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchFoods = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      // 実際のアプリケーションでは、ここでAPIを呼び出して検索結果を取得します
      const results = SAMPLE_FOODS.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(searchFoods, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="食品を検索..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg p-2">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg">
          <ul className="max-h-60 overflow-auto">
            {searchResults.map((food) => (
              <li
                key={food.id}
                onClick={() => {
                  onSelect(food);
                  setSearchTerm('');
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{food.name}</div>
                <div className="text-sm text-gray-500">
                  {food.calories}kcal / {food.servingSize}{food.servingUnit}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 