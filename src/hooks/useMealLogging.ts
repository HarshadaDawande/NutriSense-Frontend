import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Meal, MacroEntry } from '../types';
import { createMeal, getMealsByUserId, deleteMeal, analyzeMealDescription, MealPayload } from '../services/api';

interface UseMealLoggingProps {
  userId: string;
}

export function useMealLogging({ userId }: UseMealLoggingProps) {
  const [meals, setMeals] = useState<MealPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch user's meals
  const fetchMeals = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const fetchedMeals = await getMealsByUserId(userId);
      setMeals(fetchedMeals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast.error('Failed to load your meals');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Add a new meal
  const addMeal = useCallback(async (mealData: Omit<Meal, 'id'>) => {
    if (!userId) {
      toast.error('User not authenticated');
      return null;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        userId,
        mealType: mealData.mealType,
        mealDescription: mealData.mealDescription,
        proteins: mealData.proteins,
        carbs: mealData.carbs,
        fats: mealData.fats,
        calories: mealData.calories,
        mealDate: mealData.mealDate,
        mealId: mealData.mealId
      };
      
      const newMeal = await createMeal(payload);
      
      // Update local state
      setMeals(prev => [...prev, newMeal]);
      
      toast.success('Meal logged successfully');
      return newMeal;
    } catch (error) {
      console.error('Error adding meal:', error);
      toast.error('Failed to log meal');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Remove a meal
  const removeMeal = useCallback(async (mealId: string) => {
    setIsLoading(true);
    try {
      await deleteMeal(mealId);
      
      // Update local state locally to keep UI in sync
      setMeals(prev => prev.filter(meal => meal.mealId !== mealId));
      
      toast.success('Meal deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze meal description
  const analyzeMeal = useCallback(async (description: string): Promise<MacroEntry | null> => {
    if (!description) return null;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeMealDescription(description);
      return result.macros;
    } catch (error) {
      console.error('Error analyzing meal:', error);
      toast.error('Failed to analyze meal');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    meals,
    isLoading,
    isAnalyzing,
    fetchMeals,
    addMeal,
    removeMeal,
    analyzeMeal
  };
}
