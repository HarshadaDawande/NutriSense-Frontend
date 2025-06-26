import { useEffect, useState } from 'react';
import { Beef, Coffee, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import type { Meal, MealType } from '../types';
import { RegularMealLogging } from '../components/meal-logging/RegularMealLogging';
import { createMeal } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { useMealLogging } from '../hooks/useMealLogging';

interface MealLoggingProps {
  meals: Meal[];
  onAddMeal: (meal: Omit<Meal, 'id'> & { timestamp?: Date }) => void;
  onDeleteMeal: (mealId: string) => void;
  onBack: () => void;
  isFirstTime?: boolean;
  onFirstMealComplete?: () => void;
  initialDate?: Date;
  userId?: string;
}

interface SelectedMeal {
  mealName: string;
  mealType: string;
  mealDescription: string;
  proteins: string;
  carbs: string;
  fats: string;
  calories: string;
  mealDate: string;
  source: 'manual' | 'saved' | 'example';
  isAnalyzing?: boolean;
  userId: string;
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export function MealLogging({ onAddMeal, onDeleteMeal, onBack, isFirstTime = false, onFirstMealComplete, initialDate, userId }: MealLoggingProps) {
  const [selectedMeal, setSelectedMeal] = useState<SelectedMeal>({
    mealName: '',
    mealType: '',
    mealDescription: '',
    proteins: '',
    carbs: '',
    fats: '',
    calories: '',
    mealDate: '',
    source: 'manual',
    userId: '',
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  // Use our custom hook for meal logging
    const { 
      meals: hookMeals,
      fetchMeals 
    } = useMealLogging({ userId: userId || '' });
  
    // Fetch meals on component mount
    useEffect(() => {
      if (userId) {
        fetchMeals();
      }
    }, [userId, fetchMeals]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Quick meal examples
  const quickMeals = [
    {
      mealType: 'lunch' as MealType,
      mealDescription: '150g grilled chicken breast with 100g steamed broccoli and 80g brown rice',
      macros: { calories: 420, protein: 45, carbs: 35, fats: 8 },
      icon: Beef,
      mealDate: new Date().toISOString()
    },
    {
      mealType: 'dinner' as MealType,
      mealDescription: '140g baked salmon with 100g quinoa, 80g roasted vegetables, and 1 tbsp olive oil',
      macros: { calories: 550, protein: 40, carbs: 45, fats: 22 },
      icon: Utensils,
      mealDate: new Date().toISOString()
    },
    {
      mealType: 'breakfast' as MealType,
      mealDescription: '200g Greek yogurt with 50g mixed berries, 30g granola, and 1 tbsp honey',
      macros: { calories: 280, protein: 20, carbs: 35, fats: 6 },
      icon: Coffee,
      mealDate: new Date().toISOString()
    }
  ];

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Get today's meals
  const todaysMeals = hookMeals.filter(meal => 
    isSameDay(new Date(meal.mealDate), new Date())
  );

  // Get previous meals (all meals that are not today's meals)
  const previousMeals = hookMeals.filter(meal => 
    !isSameDay(new Date(meal.mealDate), new Date())
  );

  // Use the API service for meal analysis
  const analyzeMeal = async () => {
    if (!selectedMeal.mealDescription) return;

    setSelectedMeal(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      // Call the backend API to analyze the meal description
      //const result = await analyzeMealDescription(selectedMeal.mealDescription);
      
      // Calculate macro values
      const calculatedMacros = {
        calories: 370,
        protein: 20,
        carbs: 30,
        fats: 15
      };
      
      // Update the meal with the analyzed macros
      setSelectedMeal(prev => ({
        ...prev,
        // Set both the macros object and individual properties
        macros: calculatedMacros,
        proteins: calculatedMacros.protein.toString(),
        carbs: calculatedMacros.carbs.toString(),
        fats: calculatedMacros.fats.toString(),
        calories: calculatedMacros.calories.toString(),
        // Set the meal date to the selected date if it's not already set
        mealDate: prev.mealDate || selectedDate.toISOString(),
        userId: userId || '',
        isAnalyzing: false
      }));
    } catch (error) {
      console.error('Error analyzing meal:', error);
      toast.error('Failed to analyze meal. Using estimated values instead.');
      
      // Fallback to basic estimation if API fails
      const macros = {
        calories: 360,
        protein: 20,
        carbs: 30,
        fats: 15
      };
      
      setSelectedMeal(prev => ({
        ...prev,
        macros,
        proteins: macros.protein.toString(),
        carbs: macros.carbs.toString(),
        fats: macros.fats.toString(),
        calories: macros.calories.toString(),
        // Set the meal date to the selected date if it's not already set
        mealDate: prev.mealDate || selectedDate.toISOString(),
        isAnalyzing: false
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMeal.mealType && selectedMeal.mealDescription && selectedMeal.mealDate) {
      try {
        // Check if user data is stored in localStorage
        // const userDataStr = localStorage.getItem('userData');
        // if (userDataStr) {
        //   try {
        //     const userData = JSON.parse(userDataStr);
        //     setUserId(userData.userId);
        //   } catch (error) {
        //     console.error('Error parsing user data from localStorage:', error);
        //   }
        // }
        
        // if (!userId) {
        //   toast.error('User not authenticated. Please log in again.');
        //   return;
        // }
        
        // Prepare meal data for API
        const mealData = {
          userId: userId || '',
          mealType: selectedMeal.mealType,
          mealDescription: selectedMeal.mealDescription,
          proteins: selectedMeal.proteins,
          carbs: selectedMeal.carbs,
          fats: selectedMeal.fats,
          calories: selectedMeal.calories,
          mealDate: selectedDate.toISOString(),
          mealId: uuidv4()
        };
        
        // Call API to create meal
        await createMeal(mealData);
        
        // Use the onAddMeal callback to update local state
        onAddMeal({
          mealName: selectedMeal.mealName || selectedMeal.mealDescription,
          mealType: selectedMeal.mealType as MealType,
          mealDescription: selectedMeal.mealDescription,
          proteins: selectedMeal.proteins,
          carbs: selectedMeal.carbs,
          fats: selectedMeal.fats,
          calories: selectedMeal.calories,
          mealDate: selectedDate.toISOString(),
          mealId: uuidv4()
        });
        
        toast.success('Meal logged successfully!');
        
        // Reset form
        setSelectedMeal({
          mealName: '',
          mealType: '',
          mealDescription: '',
          proteins: '',
          carbs: '',
          fats: '',
          calories: '',
          mealDate: '',
          source: 'manual',
          userId: userId || ''
        });
        
        if (isFirstTime && onFirstMealComplete) {
          onFirstMealComplete();
        } else {
          onBack();
        }
      } catch (error) {
        console.error('Error logging meal:', error);
        toast.error('Failed to log meal. Please try again.');
      }
    }
  };

  const handleManualMealChange = (field: string, value: string) => {
    setSelectedMeal(prev => ({
      ...prev,
      // Map 'name' to 'mealName', 'type' to 'mealType', and 'description' to 'mealDescription'
      ...(field === 'type' ? { mealType: value } : 
         field === 'name' ? { mealName: value } :
         field === 'description' ? { 
           mealDescription: value, 
           // Clear all macro values when description changes
           macros: undefined,
           proteins: '',
           carbs: '',
           fats: '',
           calories: ''
         } : 
         { [field]: value })
    }));
  };

  const handleSelectSavedMeal = (meal: Meal) => {
    setSelectedMeal({
      mealName: meal.mealName,
      mealType: meal.mealType,
      mealDescription: meal.mealDescription,
      proteins: meal.proteins,
      carbs: meal.carbs,
      fats: meal.fats,
      calories: meal.calories,
      mealDate: meal.mealDate,
      source: 'saved',
      userId: userId || ''
    });
  };

  const handleSelectExampleMeal = (meal: typeof quickMeals[0]) => {
    setSelectedMeal({
      mealName: meal.mealType,
      mealType: meal.mealType,
      mealDescription: meal.mealDescription,
      proteins: meal.macros?.protein.toString() || '0',
      carbs: meal.macros?.carbs.toString() || '0',
      fats: meal.macros?.fats.toString() || '0',
      calories: meal.macros?.calories.toString() || '0',
      mealDate: meal.mealDate,
      source: 'example',
      userId: userId || ''
    });
  };

  const isTrackingEnabled = Boolean(
    selectedMeal.mealType && 
    selectedMeal.mealDescription && 
    selectedMeal.mealDate && 
    selectedMeal.proteins && 
    selectedMeal.carbs && 
    selectedMeal.fats && 
    selectedMeal.calories && 
    !selectedMeal.isAnalyzing);

  const getStatusMessage = () => {
    if (!selectedMeal.mealType) return 'Select a meal type';
    if (!selectedMeal.mealDescription) return 'Add a meal description';
    if (!selectedMeal.mealDate) return 'Select a meal date';
    if (selectedMeal.isAnalyzing) return 'Waiting for AI analysis...';
    if (!selectedMeal.proteins || !selectedMeal.carbs || !selectedMeal.fats || !selectedMeal.calories) return 'Macros are being calculated...';
    return 'Ready to track!';
  };

  // // First-time user simplified layout
  // if (isFirstTime) {
  //   // Transform selectedMeal to match FirstTimeMealLogging props structure
  //   const transformedMeal = {
  //     name: selectedMeal.mealName || '',
  //     description: selectedMeal.mealDescription,
  //     type: selectedMeal.mealType as MealType | '',
  //     source: selectedMeal.source,
  //     isAnalyzing: selectedMeal.isAnalyzing,
  //     macros: selectedMeal.calories ? {
  //       calories: Number(selectedMeal.calories),
  //       protein: Number(selectedMeal.proteins),
  //       carbs: Number(selectedMeal.carbs),
  //       fats: Number(selectedMeal.fats),
  //     } : undefined,
  //   };

  //   return (
  //     <FirstTimeMealLogging
  //       selectedMeal={transformedMeal}
  //       isTrackingEnabled={isTrackingEnabled}
  //       onMealChange={handleManualMealChange}
  //       onAnalyzeMeal={analyzeMeal}
  //       onSubmit={handleSubmit}
  //       getStatusMessage={getStatusMessage}
  //     />
  //   );
  // }

  // Regular user layout (existing two-column layout)
  return (
    <RegularMealLogging
      selectedMeal={{
        name: selectedMeal.mealName || '',
        description: selectedMeal.mealDescription,
        type: selectedMeal.mealType as MealType | '',
        source: selectedMeal.source,
        isAnalyzing: selectedMeal.isAnalyzing,
        macros: selectedMeal.calories ? {
          calories: Number(selectedMeal.calories),
          protein: Number(selectedMeal.proteins),
          carbs: Number(selectedMeal.carbs),
          fats: Number(selectedMeal.fats),
        } : undefined,
      }}
      meals={previousMeals.map(meal => ({
        ...meal,
        mealType: meal.mealType as MealType, // Explicitly cast to MealType
        mealName: meal.mealType // Use mealType as mealName if mealName is not available
      }))}
      todaysMeals={todaysMeals.map(meal => ({
        ...meal,
        mealType: meal.mealType as MealType,
        mealName: meal.mealType
      }))}
      quickMeals={quickMeals.map(meal => ({
        name: meal.mealType,
        description: meal.mealDescription,
        type: meal.mealType,
        macros: meal.macros,
        icon: meal.icon
      }))}
      isTrackingEnabled={isTrackingEnabled}
      onMealChange={handleManualMealChange}
      onAnalyzeMeal={analyzeMeal}
      onSelectSavedMeal={handleSelectSavedMeal}
      onSelectExampleMeal={handleSelectExampleMeal}
      onDeleteMeal={onDeleteMeal}
      onBack={onBack}
      onSubmit={handleSubmit}
      getStatusMessage={getStatusMessage}
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
    />
  );
}