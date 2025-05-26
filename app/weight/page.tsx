'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { WeightRecord } from '@/types/user.types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeightPage() {
  const [records, setRecords] = useLocalStorage<WeightRecord[]>('weight-records', []);
  const [isEditing, setIsEditing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    const newRecord: WeightRecord = {
      date: selectedDate,
      value: Number(newWeight),
    };

    setRecords([...records, newRecord].sort((a, b) => a.date.localeCompare(b.date)));
    setNewWeight('');
    setIsEditing(false);
  };

  const handleDelete = (date: string) => {
    setRecords(records.filter(record => record.date !== date));
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">体重記録</h1>
      
      {/* 体重グラフ */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">体重推移</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={records}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}kg`, '体重']}
                labelFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 体重記録フォーム */}
      {!isEditing ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">記録一覧</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              新規記録
            </button>
          </div>
          <div className="space-y-4">
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-4">記録がありません</p>
            ) : (
              records.map((record) => (
                <div
                  key={record.date}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <div className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-lg font-medium">{record.value}kg</div>
                  </div>
                  <button
                    onClick={() => handleDelete(record.date)}
                    className="text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">新規記録</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日付
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                体重 (kg)
              </label>
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min="30"
                max="200"
                step="0.1"
                required
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
      )}
    </div>
  );
} 