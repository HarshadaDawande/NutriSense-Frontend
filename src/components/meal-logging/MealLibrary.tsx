import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Search, Check, Trash2, Clock } from 'lucide-react';
import type { Meal, MealType } from '../../types';
import { getMealTypeIcon, getMealTypeColor, mealTypeFilters } from './MealTypeUtils';
import { deleteMeal } from '../../services/api';
import { toast } from 'sonner';

interface MealLibraryProps {
  meals: Meal[];
  todaysMeals?: Meal[];
  onSelectMeal: (meal: Meal) => void;
  onDeleteMeal: (mealId: string) => void;
  selectedMeal?: {
    name: string;
    description: string;
    source: 'manual' | 'saved' | 'example';
  };
}

export function MealLibrary({ meals, todaysMeals = [], onSelectMeal, onDeleteMeal, selectedMeal }: MealLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealTypeFilter, setSelectedMealTypeFilter] = useState<MealType | 'all'>('all');

  // Filter and search saved meals (excluding today's meals to avoid duplication)
  const filteredMeals = meals
    .filter(meal => {
      // Exclude meals that are in todaysMeals to avoid duplication
      const isInTodaysMeals = todaysMeals.some(todayMeal => todayMeal.mealId === meal.mealId);
      
      const matchesSearch = meal.mealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          meal.mealDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedMealTypeFilter === 'all' || meal.mealType === selectedMealTypeFilter;
      // First check if it's not in today's meals, then apply search and type filters
      return !isInTodaysMeals && matchesSearch && matchesType;
    });

  // Filter today's meals based on search and type filter
  const filteredTodaysMeals = todaysMeals.filter(meal => {
    const matchesSearch = meal.mealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        meal.mealDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedMealTypeFilter === 'all' || meal.mealType === selectedMealTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleDeleteMeal = async (mealId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      // Call API to delete the meal
      await deleteMeal(mealId);
      
      // Update local state via callback
      onDeleteMeal(mealId);
      
      toast.success('Meal deleted successfully');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal. Please try again.');
    }
  };

  // Render a meal card
  const renderMealCard = (meal: Meal, isToday = false) => {
    const MealTypeIcon = getMealTypeIcon(meal.mealType);
    const isSelected = selectedMeal?.source === 'saved' && 
                     selectedMeal.name === meal.mealName && 
                     selectedMeal.description === meal.mealDescription;
    return (
      <div
        key={meal.mealId}
        className={`relative p-2 border rounded-lg cursor-pointer transition-colors group ${
          isSelected 
            ? 'bg-green-100 border-green-400 shadow-md' 
            : isToday
              ? 'bg-green-50 hover:bg-green-100 border-green-200'
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
        }`}
        onClick={() => onSelectMeal(meal)}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center z-10">
            <Check className="w-2 h-2 text-white" />
          </div>
        )}
        
        {/* Delete button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleDeleteMeal(meal.mealId, e)}
          className="absolute top-1 right-6 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </Button>

        <div className="flex items-start justify-between gap-2 pr-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-xs text-gray-800 truncate">{meal.mealName}</h4>
              <Badge className={`text-xs ${getMealTypeColor(meal.mealType)}`}>
                <MealTypeIcon className="w-2 h-2 mr-1" />
                {meal.mealType}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{meal.mealDescription}</p>
            <div className="text-xs text-gray-600 mt-1">
              P: {meal.proteins}g | C: {meal.carbs}g | F: {meal.fats}g
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-medium text-xs text-green-600">{meal.calories} cal</div>
            <p className="text-xs text-gray-500">
              {new Date(meal.mealDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg flex-1 flex flex-col min-h-0">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-green-600" />
          Your Meal Library ({meals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden min-h-0">
        {/* Search and Filters */}
        <div className="flex-shrink-0 space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals..."
              className="pl-7 text-sm h-8 border-green-200 focus:border-green-500 focus:ring-green-500/20"
            />
          </div>
          
          <div className="flex flex-wrap gap-1">
            {mealTypeFilters.map((filter) => {
              const IconComponent = filter.icon;
              const isActive = selectedMealTypeFilter === filter.value;
              return (
                <Button
                  key={filter.value}
                  onClick={() => setSelectedMealTypeFilter(filter.value)}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-6 px-2 ${
                    isActive 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : `${filter.color} border-current hover:bg-opacity-80`
                  }`}
                >
                  <IconComponent className="w-2 h-2 mr-1" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Meals List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {meals.length === 0 && todaysMeals.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Start Building Your Meal Library</h4>
              <p className="text-xs text-gray-600 mb-3">
                Once you add meals, they'll appear here for quick reuse.
              </p>
            </div>
          ) : (filteredTodaysMeals.length > 0 || filteredMeals.length > 0) ? (
            <div className="space-y-4">
              {/* Today's Meals Section */}
              {filteredTodaysMeals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <Clock className="w-3 h-3 text-green-600" />
                    <h3 className="text-xs font-medium text-green-700">Today's Meals ({filteredTodaysMeals.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {filteredTodaysMeals
                      .sort((a, b) => new Date(b.mealDate).getTime() - new Date(a.mealDate).getTime())
                      .map(meal => renderMealCard(meal, true))}
                  </div>
                </div>
              )}
              
              {/* Previous Meals Section */}
              {filteredMeals.length > 0 && (
                <div className="space-y-2">
                  {filteredTodaysMeals.length > 0 && (
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <BookOpen className="w-3 h-3 text-gray-600" />
                      <h3 className="text-xs font-medium text-gray-700">Previous Meals ({filteredMeals.length})</h3>
                    </div>
                  )}
                  <div className="space-y-2">
                    {filteredMeals
                      .sort((a, b) => new Date(b.mealDate).getTime() - new Date(a.mealDate).getTime())
                      .map(meal => renderMealCard(meal))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No meals match your current filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
