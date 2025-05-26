'use client';

import { useState } from 'react';
import { Exercise, ExerciseProgress } from '@/types/workout.types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, TrendingUp, Calendar } from 'lucide-react';

interface ProgressTrackingProps {
  exercise: Exercise;
  progress: ExerciseProgress;
  onUpdateProgress: (progress: ExerciseProgress) => void;
}

export function ProgressTracking({ exercise, progress, onUpdateProgress }: ProgressTrackingProps) {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [newGoals, setNewGoals] = useState(progress.goals);

  const handleUpdateGoals = () => {
    onUpdateProgress({
      ...progress,
      goals: newGoals,
    });
    setIsEditingGoals(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="space-y-6">
      {/* パーソナルベスト */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">パーソナルベスト</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">最大重量</div>
            <div className="text-xl font-bold">{progress.personalBests.maxWeight}kg</div>
            <div className="text-xs text-gray-400">
              {formatDate(progress.personalBests.date)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">最大レップ数</div>
            <div className="text-xl font-bold">{progress.personalBests.maxReps}回</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">最大セット数</div>
            <div className="text-xl font-bold">{progress.personalBests.maxSets}セット</div>
          </div>
        </div>
      </div>

      {/* 目標設定 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">目標設定</h3>
          </div>
          <button
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {isEditingGoals ? 'キャンセル' : '編集'}
          </button>
        </div>

        {isEditingGoals ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">目標重量 (kg)</label>
                <input
                  type="number"
                  value={newGoals.targetWeight}
                  onChange={(e) => setNewGoals({ ...newGoals, targetWeight: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">目標レップ数</label>
                <input
                  type="number"
                  value={newGoals.targetReps}
                  onChange={(e) => setNewGoals({ ...newGoals, targetReps: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">目標セット数</label>
                <input
                  type="number"
                  value={newGoals.targetSets}
                  onChange={(e) => setNewGoals({ ...newGoals, targetSets: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">期限</label>
                <input
                  type="date"
                  value={newGoals.deadline}
                  onChange={(e) => setNewGoals({ ...newGoals, deadline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={handleUpdateGoals}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              目標を更新
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">目標重量</div>
                <div className="text-lg font-semibold">{progress.goals.targetWeight}kg</div>
                <div className="text-sm text-gray-400">
                  進捗: {calculateProgress(progress.personalBests.maxWeight, progress.goals.targetWeight)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">目標レップ数</div>
                <div className="text-lg font-semibold">{progress.goals.targetReps}回</div>
                <div className="text-sm text-gray-400">
                  進捗: {calculateProgress(progress.personalBests.maxReps, progress.goals.targetReps)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">目標セット数</div>
                <div className="text-lg font-semibold">{progress.goals.targetSets}セット</div>
                <div className="text-sm text-gray-400">
                  進捗: {calculateProgress(progress.personalBests.maxSets, progress.goals.targetSets)}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>期限: {formatDate(progress.goals.deadline)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 進捗グラフ */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold">進捗グラフ</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progress.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: '重量 (kg)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'レップ数', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                labelFormatter={formatDate}
                formatter={(value: number, name: string) => [
                  `${value}${name === 'weight' ? 'kg' : '回'}`,
                  name === 'weight' ? '重量' : 'レップ数',
                ]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                stroke="#3B82F6"
                name="weight"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="reps"
                stroke="#10B981"
                name="reps"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 