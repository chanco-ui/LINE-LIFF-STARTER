'use client';

import { WorkoutRecord } from '@/types/workout.types';
import { X } from 'lucide-react';

interface WorkoutListProps {
  records: WorkoutRecord[];
  onDelete: (id: string) => void;
}

export function WorkoutList({ records, onDelete }: WorkoutListProps) {
  if (records.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">記録がありません</p>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          className="border rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-gray-500">
                {record.startTime} - {record.endTime || '進行中'}
              </div>
              <div className="text-lg font-medium">
                {new Date(record.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <button
              onClick={() => onDelete(record.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {record.workoutSets.map((workoutSet, index) => (
              <div key={index} className="border-t pt-4">
                <div className="font-medium mb-2">{workoutSet.exerciseId}</div>
                <div className="space-y-2">
                  {workoutSet.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex items-center space-x-4 text-sm"
                    >
                      <span className="w-16">
                        {set.weight}kg × {set.reps}回
                      </span>
                      {set.isCompleted && (
                        <span className="text-green-500">完了</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {record.notes && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">メモ</div>
              <div className="text-sm">{record.notes}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 