import { useState } from 'react';
import { Beef, Coffee, Utensils } from 'lucide-react';
import type { Meal, MealType } from '../types';
import { FirstTimeMealLogging } from '../components/meal-logging/FirstTimeMealLogging';
import { RegularMealLogging } from '../components/meal-logging/RegularMealLogging';

interface MealLoggingProps {
  meals: Meal[];
  onAddMeal: (meal: Omit<Meal, 'id' | 'timestamp'>) => void;
  onDeleteMeal: (mealId: string) => void;
  onBack: () => void;
  isFirstTime?: boolean;
  onFirstMealComplete?: () => void;
}

interface SelectedMeal {
  name: string;
  description: string;
  type: MealType | '';
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  source: 'manual' | 'saved' | 'example';
  isAnalyzing?: boolean;
}

export function MealLogging({ meals, onAddMeal, onDeleteMeal, onBack, isFirstTime = false, onFirstMealComplete }: MealLoggingProps) {
  const [selectedMeal, setSelectedMeal] = useState<SelectedMeal>({
    name: '',
    description: '',
    type: '',
    source: 'manual'
  });

  // Quick meal examples
  const quickMeals = [
    {
      name: 'Grilled Chicken Breast',
      description: '150g grilled chicken breast with 100g steamed broccoli and 80g brown rice',
      type: 'lunch' as MealType,
      macros: { calories: 420, protein: 45, carbs: 35, fats: 8 },
      icon: Beef,
    },
    {
      name: 'Salmon & Quinoa Bowl',
      description: '140g baked salmon with 100g quinoa, 80g roasted vegetables, and 1 tbsp olive oil',
      type: 'dinner' as MealType,
      macros: { calories: 550, protein: 40, carbs: 45, fats: 22 },
      icon: Utensils,
    },
    {
      name: 'Greek Yogurt Parfait',
      description: '200g Greek yogurt with 50g mixed berries, 30g granola, and 1 tbsp honey',
      type: 'breakfast' as MealType,
      macros: { calories: 280, protein: 20, carbs: 35, fats: 6 },
      icon: Coffee,
    }
  ];

  // Mock AI analysis function
  const analyzeMeal = async () => {
    if (!selectedMeal.description) return;

    setSelectedMeal(prev => ({ ...prev, isAnalyzing: true }));
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock macro calculation based on meal description
    const words = selectedMeal.description.toLowerCase().split(' ');
    let baseCals = 200;
    let baseProtein = 15;
    let baseCarbs = 20;
    let baseFats = 8;

    // Simple keyword-based estimation
    if (words.some(w => ['chicken', 'beef', 'fish', 'salmon', 'tuna'].includes(w))) {
      baseCals += 150;
      baseProtein += 25;
      baseFats += 5;
    }
    
    if (words.some(w => ['rice', 'pasta', 'bread', 'potato', 'oats'].includes(w))) {
      baseCals += 200;
      baseCarbs += 45;
    }
    
    if (words.some(w => ['avocado', 'nuts', 'oil', 'butter', 'cheese'].includes(w))) {
      baseCals += 100;
      baseFats += 12;
    }
    
    if (words.some(w => ['large', 'big', 'double'].includes(w))) {
      baseCals *= 1.5;
      baseProtein *= 1.5;
      baseCarbs *= 1.5;
      baseFats *= 1.5;
    }

    const macros = {
      calories: Math.round(baseCals),
      protein: Math.round(baseProtein),
      carbs: Math.round(baseCarbs),
      fats: Math.round(baseFats)
    };

    setSelectedMeal(prev => ({
      ...prev,
      macros,
      isAnalyzing: false
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMeal.name && selectedMeal.description && selectedMeal.type && selectedMeal.macros) {
      onAddMeal({
        name: selectedMeal.name,
        description: selectedMeal.description,
        type: selectedMeal.type as MealType,
        macros: selectedMeal.macros
      });
      
      // Reset form
      setSelectedMeal({
        name: '',
        description: '',
        type: '',
        source: 'manual'
      });
      
      if (isFirstTime && onFirstMealComplete) {
        onFirstMealComplete();
      } else {
        onBack();
      }
    }
  };

  const handleManualMealChange = (field: string, value: string) => {
    setSelectedMeal(prev => ({
      ...prev,
      [field]: value,
      source: 'manual',
      // Clear macros when manually editing (will be recalculated)
      ...(field === 'description' && { macros: undefined })
    }));
  };

  const handleSelectSavedMeal = (meal: Meal) => {
    setSelectedMeal({
      name: meal.name,
      description: meal.description,
      type: meal.type,
      macros: meal.macros,
      source: 'saved'
    });
  };

  const handleSelectExampleMeal = (meal: typeof quickMeals[0]) => {
    setSelectedMeal({
      name: meal.name,
      description: meal.description,
      type: meal.type,
      macros: meal.macros,
      source: 'example'
    });
  };

  const isTrackingEnabled = Boolean(
    selectedMeal.name && 
    selectedMeal.description && 
    selectedMeal.type && 
    selectedMeal.macros && 
    !selectedMeal.isAnalyzing);

  const getStatusMessage = () => {
    if (!selectedMeal.name) return 'Enter a meal name';
    if (!selectedMeal.description) return 'Add a meal description';
    if (!selectedMeal.type) return 'Select a meal type';
    if (selectedMeal.isAnalyzing) return 'Waiting for AI analysis...';
    if (!selectedMeal.macros) return 'Macros are being calculated...';
    return 'Ready to track!';
  };

  // First-time user simplified layout
  if (isFirstTime) {
    return (
      <FirstTimeMealLogging
        selectedMeal={selectedMeal}
        isTrackingEnabled={isTrackingEnabled}
        onMealChange={handleManualMealChange}
        onAnalyzeMeal={analyzeMeal}
        onSubmit={handleSubmit}
        getStatusMessage={getStatusMessage}
      />
    );
  }

  // Regular user layout (existing two-column layout)
  return (
    <RegularMealLogging
      selectedMeal={selectedMeal}
      meals={meals}
      quickMeals={quickMeals}
      isTrackingEnabled={isTrackingEnabled}
      onMealChange={handleManualMealChange}
      onAnalyzeMeal={analyzeMeal}
      onSelectSavedMeal={handleSelectSavedMeal}
      onSelectExampleMeal={handleSelectExampleMeal}
      onDeleteMeal={onDeleteMeal}
      onBack={onBack}
      onSubmit={handleSubmit}
      getStatusMessage={getStatusMessage}
    />
  );
}