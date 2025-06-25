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
  id: string;
  name: string;
  description: string;
  type: MealType;
  macros: MacroEntry;
  timestamp: Date;
} 