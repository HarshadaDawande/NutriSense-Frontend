import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Apple, Check } from 'lucide-react';
import type { MealType } from '../../types';
import { getMealTypeIcon, getMealTypeColor } from './MealTypeUtils';

interface QuickMeal {
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
}

interface QuickAddMealsProps {
  quickMeals: QuickMeal[];
  selectedMeal?: {
    name: string;
    source: 'manual' | 'saved' | 'example';
  };
  onSelectMeal: (meal: QuickMeal) => void;
}

export function QuickAddMeals({ quickMeals, selectedMeal, onSelectMeal }: QuickAddMealsProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg flex-1 flex flex-col min-h-0">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Apple className="w-4 h-4 text-green-600" />
          Quick Add
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {quickMeals.map((meal, index) => {
            const IconComponent = meal.icon;
            const MealTypeIcon = getMealTypeIcon(meal.type);
            const isSelected = selectedMeal?.source === 'example' && 
                             selectedMeal.name === meal.name;
            
            return (
              <div
                key={index}
                className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-green-100 border-2 border-green-400 shadow-md' 
                    : 'bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-200'
                }`}
                onClick={() => onSelectMeal(meal)}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
                
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-green-200' : 'bg-green-100'
                  }`}>
                    <IconComponent className={`w-4 h-4 transition-colors ${
                      isSelected ? 'text-green-700' : 'text-green-600'
                    }`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium text-sm transition-colors truncate ${
                      isSelected ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {meal.name}
                    </h4>
                    <Badge className={`text-xs ${getMealTypeColor(meal.type)}`}>
                      <MealTypeIcon className="w-2 h-2 mr-1" />
                      {meal.type}
                    </Badge>
                  </div>
                  <p className={`text-xs mt-1 transition-colors line-clamp-2 ${
                    isSelected ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {meal.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-medium text-sm transition-colors ${
                    isSelected ? 'text-green-700' : 'text-green-600'
                  }`}>
                    {meal.macros.calories} cal
                  </div>
                  <div className={`text-xs transition-colors ${
                    isSelected ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    P: {meal.macros.protein}g | C: {meal.macros.carbs}g | F: {meal.macros.fats}g
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
