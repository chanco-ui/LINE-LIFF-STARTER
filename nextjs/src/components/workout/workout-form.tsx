'use client';

import { useState } from 'react';
import { WorkoutRecord, Exercise } from '@/types/workout.types';
import { X, Plus } from 'lucide-react';

interface WorkoutFormProps {
  onSubmit: (record: WorkoutRecord) => void;
  onCancel: () => void;
  selectedDate: string;
  exercises: Exercise[];
}

export function WorkoutForm({ onSubmit, onCancel, selectedDate, exercises }: WorkoutFormProps) {
  const [workoutSets, setWorkoutSets] = useState<{
    id: string;
    exerciseId: string;
    exerciseName: string;
    weight: number;
    reps: number;
    completed: boolean;
  }[]>([]);

  const handleAddSet = () => {
    setWorkoutSets([
      ...workoutSets,
      {
        id: Date.now().toString(),
        exerciseId: '',
        exerciseName: '',
        weight: 0,
        reps: 0,
        completed: false,
      },
    ]);
  };

  const handleRemoveSet = (index: number) => {
    setWorkoutSets(workoutSets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index: number, field: string, value: string | number) => {
    const newSets = [...workoutSets];
    if (field === 'exerciseId') {
      const exercise = exercises.find(e => e.id === value);
      if (exercise) {
        newSets[index] = {
          ...newSets[index],
          exerciseId: value as string,
          exerciseName: exercise.name,
        };
      }
    } else {
      newSets[index] = {
        ...newSets[index],
        [field]: value,
      };
    }
    setWorkoutSets(newSets);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const record: WorkoutRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime: now.toTimeString().slice(0, 5),
      workoutSets,
    };
    onSubmit(record);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">記録を追加</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {workoutSets.map((set, index) => (
          <div key={index} className="flex items-center gap-4">
            <select
              value={set.exerciseId}
              onChange={(e) => handleSetChange(index, 'exerciseId', e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            >
              <option value="">エクササイズを選択</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={set.weight || ''}
              onChange={(e) => handleSetChange(index, 'weight', Number(e.target.value))}
              placeholder="重量"
              className="w-24 p-2 border rounded"
              required
            />

            <input
              type="number"
              value={set.reps || ''}
              onChange={(e) => handleSetChange(index, 'reps', Number(e.target.value))}
              placeholder="回数"
              className="w-24 p-2 border rounded"
              required
            />

            <button
              type="button"
              onClick={() => handleRemoveSet(index)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSet}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <Plus className="w-5 h-5" />
          セットを追加
        </button>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </form>
  );
} 