export type MuscleGroup = 
  | 'chest'      // 胸
  | 'back'       // 背中
  | 'shoulders'  // 肩
  | 'arms'       // 腕
  | 'legs'       // 脚
  | 'core'       // 体幹
  | 'full_body'; // 全身

export type ExerciseType = 
  | 'strength'   // 筋力
  | 'cardio'     // 有酸素
  | 'stretch';   // ストレッチ

export type Difficulty = 
  | 'beginner'     // 初心者
  | 'intermediate' // 中級者
  | 'advanced';    // 上級者

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;        // 英語名
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  difficulty: Difficulty;
  description: string;
  instructions: string[]; // 手順
  tips: string[];        // コツ
  videoUrl?: string;     // 動画URL
  imageUrl?: string;     // 画像URL
  equipment?: string[];  // 必要な器具
  variations?: string[]; // バリエーション
}

export interface Set {
  weight: number;    // kg
  reps: number;      // 回数
  isCompleted: boolean;
  notes?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutRecord {
  id: string;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string;  // HH:mm
  workoutSets: WorkoutSet[];
  notes?: string;
  rating?: number;   // 1-5
  photos?: string[]; // 写真のURL
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description?: string;
  workoutSets: {
    exerciseId: string;
    exerciseName: string;
    weight: number;
    reps: number;
    completed: boolean;
  }[];
  targetMuscleGroups: MuscleGroup[];
  estimatedDuration: number; // 分
  difficulty: Difficulty;
  isPublic: boolean;
}

export interface WorkoutGoal {
  id: string;
  name: string;
  targetMuscleGroups: MuscleGroup[];
  targetDate: string;  // YYYY-MM-DD
  currentWeight?: number;
  targetWeight?: number;
  currentMeasurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  targetMeasurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  notes?: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  personalBests: {
    maxWeight: number;
    maxReps: number;
    maxSets: number;
    date: string;
  };
  goals: {
    targetWeight: number;
    targetReps: number;
    targetSets: number;
    deadline: string;
    isCompleted: boolean;
  };
  history: {
    date: string;
    weight: number;
    reps: number;
    sets: number;
  }[];
}

export type MealType = 
  | 'breakfast'  // 朝食
  | 'lunch'      // 昼食
  | 'dinner'     // 夕食
  | 'snack';     // 間食

export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  calories: number;
  protein: number;    // タンパク質 (g)
  carbs: number;      // 炭水化物 (g)
  fat: number;        // 脂質 (g)
  servingSize: number; // 1食分の量 (g)
  unit: string;       // 単位 (g, ml, 個など)
}

export interface MealRecord {
  id: string;
  date: string;      // YYYY-MM-DD
  mealType: MealType;
  time: string;      // HH:mm
  foodItems: {
    foodId: string;
    amount: number;  // 実際に食べた量
    notes?: string;  // メモ（例：調理方法、味付けなど）
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  photos?: string[]; // 写真のURL
  notes?: string;    // メモ
}

export interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  records: (WorkoutRecord | MealRecord)[];
}

export interface FoodDatabase {
  id: string;
  name: string;
  nameEn: string;
  calories: number;
  protein: number;    // タンパク質 (g)
  carbs: number;      // 炭水化物 (g)
  fat: number;        // 脂質 (g)
  servingSize: number; // 1食分の量 (g)
  unit: string;       // 単位 (g, ml, 個など)
  category: 'meat' | 'fish' | 'vegetable' | 'fruit' | 'grain' | 'dairy' | 'other';
} 