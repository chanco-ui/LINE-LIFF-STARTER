export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Goal = "maintenance" | "weight_loss" | "muscle_gain";

export interface UserProfile {
  name: string;
  height: number;  // cm
  weight: number;  // kg
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface WeightRecord {
  date: string;  // "YYYY-MM-DD" 形式
  value: number;  // kg
}

export interface MealRecord {
  id: string;
  date: string;
  type: string;
  time: string;
  foods: Food[];
  memo?: string;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export interface FoodEntry {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;  // g
  fat: number;  // g
  carbs: number;  // g
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;  // g
  fat: number;  // g
  carbs: number;  // g
  servingSize: number;
  servingUnit: string;
}

export interface Food {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
} 