'use client';

import { WorkoutRoutine } from '@/types/workout.types';

interface RoutineListProps {
  routines: WorkoutRoutine[];
  onSelectRoutine: (routine: WorkoutRoutine) => void;
}

export function RoutineList({ routines, onSelectRoutine }: RoutineListProps) {
  if (routines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ルーティンがありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {routines.map((routine) => (
        <div
          key={routine.id}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectRoutine(routine)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{routine.name}</h3>
              {routine.description && (
                <p className="text-gray-600 mt-1">{routine.description}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {routine.estimatedDuration}分
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">対象部位</div>
            <div className="flex flex-wrap gap-2">
              {routine.targetMuscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {muscle === 'chest' ? '胸' :
                   muscle === 'back' ? '背中' :
                   muscle === 'shoulders' ? '肩' :
                   muscle === 'arms' ? '腕' :
                   muscle === 'legs' ? '脚' :
                   muscle === 'core' ? '体幹' : '全身'}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">エクササイズ</div>
            <div className="space-y-2">
              {routine.workoutSets.map((set, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="text-sm">{set.exerciseName}</div>
                  <div className="text-sm text-gray-500">
                    {set.weight}kg × {set.reps}回
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 