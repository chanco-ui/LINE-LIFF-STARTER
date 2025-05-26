'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { WorkoutRecord, WorkoutRoutine, Exercise, ExerciseProgress } from '@/types/workout.types';
import { Calendar } from '@/components/workout/calendar';
import { WorkoutForm } from '@/components/workout/workout-form';
import { WorkoutList } from '@/components/workout/workout-list';
import { RoutineList } from '@/components/workout/routine-list';
import { ExerciseLibrary } from '@/components/workout/exercise-library';
import { ProgressTracking } from '@/components/workout/progress-tracking';
import { Loader2 } from 'lucide-react';

// デフォルトのルーティン
const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: '1',
    name: 'ベンチプレス',
    description: '胸の筋肉を鍛える基本的なエクササイズ',
    workoutSets: [
      {
        exerciseId: 'bench-press',
        sets: [
          { weight: 60, reps: 10, isCompleted: false },
          { weight: 70, reps: 8, isCompleted: false },
          { weight: 80, reps: 6, isCompleted: false },
        ],
      },
    ],
    targetMuscleGroups: ['chest'],
    estimatedDuration: 30,
    difficulty: 'intermediate',
    isPublic: true,
  },
  {
    id: '2',
    name: 'スクワット',
    description: '下半身全体を鍛える基本的なエクササイズ',
    workoutSets: [
      {
        exerciseId: 'squat',
        sets: [
          { weight: 80, reps: 10, isCompleted: false },
          { weight: 100, reps: 8, isCompleted: false },
          { weight: 120, reps: 6, isCompleted: false },
        ],
      },
    ],
    targetMuscleGroups: ['legs'],
    estimatedDuration: 30,
    difficulty: 'intermediate',
    isPublic: true,
  },
];

// デフォルトのエクササイズ
const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'bench-press',
    name: 'ベンチプレス',
    nameEn: 'Bench Press',
    muscleGroup: 'chest',
    type: 'strength',
    difficulty: 'intermediate',
    description: '胸の筋肉を鍛える基本的なエクササイズです。',
    instructions: [
      'ベンチに仰向けになります',
      'バーベルを肩幅より少し広めに握ります',
      'バーベルを胸の位置まで下ろします',
      '胸の筋肉を使ってバーベルを押し上げます',
    ],
    tips: [
      '肩甲骨を寄せて胸を張ります',
      '肘は45度程度に開きます',
      '呼吸を意識して行います',
    ],
    equipment: ['バーベル', 'ベンチ'],
    videoUrl: 'https://example.com/bench-press.mp4',
  },
  {
    id: 'squat',
    name: 'スクワット',
    nameEn: 'Squat',
    muscleGroup: 'legs',
    type: 'strength',
    difficulty: 'intermediate',
    description: '下半身全体を鍛える基本的なエクササイズです。',
    instructions: [
      '肩幅に足を開いて立ちます',
      '胸を張り、背筋を伸ばします',
      'お尻を後ろに突き出すように腰を下ろします',
      '太ももが地面と平行になるまで下ろします',
      '足の力で元の姿勢に戻ります',
    ],
    tips: [
      '膝がつま先より前に出ないようにします',
      '背中は常に真っ直ぐに保ちます',
      '重心は足の中心に置きます',
    ],
    equipment: ['バーベル', 'ラック'],
    videoUrl: 'https://example.com/squat.mp4',
  },
];

// デフォルトの進捗データ
const DEFAULT_PROGRESS: Record<string, ExerciseProgress> = {
  'bench-press': {
    exerciseId: 'bench-press',
    personalBests: {
      maxWeight: 80,
      maxReps: 12,
      maxSets: 4,
      date: new Date().toISOString(),
    },
    goals: {
      targetWeight: 100,
      targetReps: 10,
      targetSets: 5,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
    },
    history: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 70,
        reps: 10,
        sets: 3,
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 65,
        reps: 12,
        sets: 3,
      },
    ],
  },
  'squat': {
    exerciseId: 'squat',
    personalBests: {
      maxWeight: 120,
      maxReps: 10,
      maxSets: 4,
      date: new Date().toISOString(),
    },
    goals: {
      targetWeight: 150,
      targetReps: 8,
      targetSets: 5,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
    },
    history: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 100,
        reps: 10,
        sets: 3,
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 90,
        reps: 12,
        sets: 3,
      },
    ],
  },
};

// 日付を日本時間のYYYY-MM-DD形式に変換する関数
const getJSTDate = (date: Date): string => {
  const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
  return jstDate.toISOString().split('T')[0];
};

export default function WorkoutPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showRoutines, setShowRoutines] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const [records, setRecords] = useLocalStorage<WorkoutRecord[]>('workout-records', []);
  const [routines, setRoutines] = useLocalStorage<WorkoutRoutine[]>('workout-routines', DEFAULT_ROUTINES);
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('exercises', DEFAULT_EXERCISES);
  const [progress, setProgress] = useLocalStorage<Record<string, ExerciseProgress>>('exercise-progress', DEFAULT_PROGRESS);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddWorkout = (record: WorkoutRecord) => {
    setRecords([...records, record]);
    setShowAddWorkout(false);
  };

  const handleDeleteWorkout = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseLibrary(false);
  };

  const handleUpdateProgress = (updatedProgress: ExerciseProgress) => {
    setProgress({
      ...progress,
      [updatedProgress.exerciseId]: updatedProgress,
    });
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">ワークアウト記録</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowExerciseLibrary(!showExerciseLibrary)}
            className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600"
          >
            {showExerciseLibrary ? 'エクササイズライブラリを閉じる' : 'エクササイズライブラリを開く'}
          </button>
          <button
            onClick={() => setShowRoutines(!showRoutines)}
            className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600"
          >
            {showRoutines ? 'ルーティンを閉じる' : 'ルーティンを開く'}
          </button>
          <button
            onClick={() => setShowAddWorkout(!showAddWorkout)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            {showAddWorkout ? '記録を閉じる' : '記録を追加'}
          </button>
        </div>
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
          {showExerciseLibrary && (
            <div className="mb-8">
              <ExerciseLibrary
                exercises={exercises}
                onSelectExercise={handleSelectExercise}
              />
            </div>
          )}

          {showRoutines && (
            <div className="mb-8">
              <RoutineList
                routines={routines}
                onSelectRoutine={(routine) => {
                  // ルーティンの選択処理
                }}
              />
            </div>
          )}

          {selectedExercise && (
            <div className="mb-8">
              <ProgressTracking
                exercise={selectedExercise}
                progress={progress[selectedExercise.id]}
                onUpdateProgress={handleUpdateProgress}
              />
            </div>
          )}

          {showAddWorkout ? (
            <WorkoutForm
              onSubmit={handleAddWorkout}
              onCancel={() => setShowAddWorkout(false)}
              selectedDate={selectedDate}
              exercises={exercises}
            />
          ) : (
            <WorkoutList
              records={records.filter(record => record.date === selectedDate)}
              onDelete={handleDeleteWorkout}
            />
          )}
        </div>
      </div>
    </div>
  );
} 