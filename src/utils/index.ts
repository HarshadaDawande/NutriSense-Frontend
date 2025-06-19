// Utility functions for the application

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const calculateMacroTotals = (meals: any[]) => {
  return meals.reduce(
    (total, meal) => ({
      calories: total.calories + meal.macros.calories,
      protein: total.protein + meal.macros.protein,
      carbs: total.carbs + meal.macros.carbs,
      fats: total.fats + meal.macros.fats
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
}; 