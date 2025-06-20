import React from 'react';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ChefHat } from 'lucide-react';
import { MealForm } from './MealForm';
import { MacroAnalysis } from './MacroAnalysis';
import { MealLibrary } from './MealLibrary';
import { QuickAddMeals } from './QuickAddMeals';
import type { Meal, MealType } from '../../types';

interface RegularMealLoggingProps {
  selectedMeal: {
    name: string;
    description: string;
    type: MealType | '';
    source: 'manual' | 'saved' | 'example';
    isAnalyzing?: boolean;
    macros?: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
  };
  meals: Meal[];
  quickMeals: Array<{
    name: string;
    description: string;
    type: MealType;
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
    icon: React.ElementType;
  }>;
  isTrackingEnabled: boolean;
  onMealChange: (field: string, value: string) => void;
  onAnalyzeMeal: () => void;
  onSelectSavedMeal: (meal: Meal) => void;
  onSelectExampleMeal: (meal: any) => void;
  onDeleteMeal: (mealId: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getStatusMessage: () => string;
}

export function RegularMealLogging({
  selectedMeal,
  meals,
  quickMeals,
  isTrackingEnabled,
  onMealChange,
  onAnalyzeMeal,
  onSelectSavedMeal,
  onSelectExampleMeal,
  onDeleteMeal,
  onBack,
  onSubmit,
  getStatusMessage
}: RegularMealLoggingProps) {
  const headerTitle = "Add Meal";
  const headerDescription = "Add a meal and get AI-powered macro analysis";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-green-200 hover:bg-green-100 text-green-700 h-10 sm:h-9"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-lg font-bold text-green-700">{headerTitle}</h1>
            </div>
            <p className="text-sm text-gray-600 ml-8">{headerDescription}</p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout with fixed overflow */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 h-full">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              
              {/* Left Column - Selected Meal Details */}
              <div className="flex flex-col space-y-4 h-full min-h-0">
                <form onSubmit={onSubmit} className="flex flex-col h-full space-y-4 min-h-0">
                  <MealForm
                    name={selectedMeal.name}
                    description={selectedMeal.description}
                    type={selectedMeal.type}
                    source={selectedMeal.source}
                    isAnalyzing={selectedMeal.isAnalyzing}
                    hasMacros={!!selectedMeal.macros}
                    onMealChange={onMealChange}
                    onAnalyzeMeal={onAnalyzeMeal}
                  />

                  {/* Analysis Results - Always show if available */}
                  {selectedMeal.macros && (
                    <MacroAnalysis
                      macros={selectedMeal.macros}
                      isTrackingEnabled={isTrackingEnabled}
                      onSubmit={() => {}}
                      source={selectedMeal.source}
                      statusMessage={getStatusMessage()}
                    />
                  )}
                </form>
              </div>

              {/* Right Column - Split between Meal Library and Examples */}
              <div className="flex flex-col space-y-4 h-full min-h-0">
                {/* Your Meal Library - Top Half */}
                <MealLibrary
                  meals={meals}
                  onSelectMeal={onSelectSavedMeal}
                  onDeleteMeal={onDeleteMeal}
                  selectedMeal={selectedMeal}
                />

                {/* Try These Examples - Bottom Half */}
                <QuickAddMeals
                  quickMeals={quickMeals}
                  selectedMeal={selectedMeal}
                  onSelectMeal={onSelectExampleMeal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
