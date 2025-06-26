export type Screen = 'welcome' | 'login' | 'signup' | 'dashboard' | 'targets' | 'meals';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MacroEntry {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  mealName: string;
  mealId: string;
  mealType: MealType;
  mealDescription: string;
  proteins: string;
  carbs: string;
  fats: string;
  calories: string;
  mealDate: string;
} 

export interface Params {
  initialDate?: Date;
  [key: string]: any;
}