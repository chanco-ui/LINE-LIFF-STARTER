'use client';

import { useState } from 'react';
import { Exercise, MuscleGroup, ExerciseType, Difficulty } from '@/types/workout.types';
import { ChevronDown, ChevronRight, Play, Image } from 'lucide-react';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
}

export function ExerciseLibrary({ exercises, onSelectExercise }: ExerciseLibraryProps) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ExerciseType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const muscleGroups: { value: MuscleGroup | 'all'; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'chest', label: '胸' },
    { value: 'back', label: '背中' },
    { value: 'shoulders', label: '肩' },
    { value: 'arms', label: '腕' },
    { value: 'legs', label: '脚' },
    { value: 'core', label: '体幹' },
    { value: 'full_body', label: '全身' },
  ];

  const exerciseTypes: { value: ExerciseType | 'all'; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'strength', label: '筋力' },
    { value: 'cardio', label: '有酸素' },
    { value: 'stretch', label: 'ストレッチ' },
  ];

  const difficulties: { value: Difficulty | 'all'; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'beginner', label: '初心者' },
    { value: 'intermediate', label: '中級者' },
    { value: 'advanced', label: '上級者' },
  ];

  const filteredExercises = exercises.filter(exercise => {
    if (selectedMuscleGroup !== 'all' && exercise.muscleGroup !== selectedMuscleGroup) return false;
    if (selectedType !== 'all' && exercise.type !== selectedType) return false;
    if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleExerciseClick = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  return (
    <div className="space-y-6">
      {/* フィルター */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={selectedMuscleGroup}
          onChange={(e) => setSelectedMuscleGroup(e.target.value as MuscleGroup | 'all')}
          className="px-3 py-2 border rounded-lg"
        >
          {muscleGroups.map(group => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ExerciseType | 'all')}
          className="px-3 py-2 border rounded-lg"
        >
          {exerciseTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
          className="px-3 py-2 border rounded-lg"
        >
          {difficulties.map(difficulty => (
            <option key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </option>
          ))}
        </select>
      </div>

      {/* エクササイズ一覧 */}
      <div className="space-y-4">
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => handleExerciseClick(exercise.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{exercise.name}</div>
                <div className="text-sm text-gray-500">{exercise.nameEn}</div>
              </div>
              {expandedExercise === exercise.id ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedExercise === exercise.id && (
              <div className="px-4 py-3 border-t bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">説明</div>
                    <div className="mt-1">{exercise.description}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">手順</div>
                    <ul className="mt-1 list-decimal list-inside space-y-1">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">コツ</div>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {exercise.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-500">必要な器具</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {exercise.equipment.map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {exercise.videoUrl && (
                      <a
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        動画を見る
                      </a>
                    )}
                    {exercise.imageUrl && (
                      <a
                        href={exercise.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <Image className="w-4 h-4 mr-1" />
                        画像を見る
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectExercise(exercise)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    このエクササイズを選択
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 