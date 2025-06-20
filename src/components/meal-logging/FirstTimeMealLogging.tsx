import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ChefHat, Sparkles, Apple, BookOpen } from 'lucide-react';
import { MealForm } from './MealForm';
import { MacroAnalysis } from './MacroAnalysis';
import type { MealType } from '../../types';

interface FirstTimeMealLoggingProps {
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
  isTrackingEnabled: boolean;
  onMealChange: (field: string, value: string) => void;
  onAnalyzeMeal: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getStatusMessage: () => string;
}

export function FirstTimeMealLogging({
  selectedMeal,
  isTrackingEnabled,
  onMealChange,
  onAnalyzeMeal,
  onSubmit,
  getStatusMessage
}: FirstTimeMealLoggingProps) {
  const headerTitle = "Log Your First Meal!";
  const headerDescription = "Let's see how our AI calculates macros from your meal description";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-3 h-3 text-white" />
            </div>
            <h1 className="text-lg font-bold text-green-700">{headerTitle}</h1>
          </div>
          <p className="text-sm text-gray-600 ml-8">{headerDescription}</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="flex-shrink-0 p-4 bg-green-50 border-b border-green-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Apple className="w-3 h-3 text-green-600" />
                Step 2: Log Your First Meal
              </h3>
              <p className="text-gray-700 text-sm">
                Describe any meal you've had recently and watch our AI calculate the macros automatically. 
                Once you add this meal, it will be saved to your personal meal library for quick reuse!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Column Centered */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <ChefHat className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-green-700">Tell Us About Your Meal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {selectedMeal.macros && (
                <MacroAnalysis
                  macros={selectedMeal.macros}
                  isTrackingEnabled={isTrackingEnabled}
                  onSubmit={() => {}}
                  source={selectedMeal.source}
                  statusMessage={getStatusMessage()}
                />
              )}

              {/* What's Next Info */}
              <Card className="bg-green-50 border border-green-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">What happens next?</h4>
                      <p className="text-sm text-gray-700">
                        After you log this meal, it will be saved to your personal meal library. 
                        Next time you want to log meals, you'll be able to quickly select from your saved meals, 
                        search through your history, or add new meals with the same AI-powered analysis!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
