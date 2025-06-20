import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Utensils, Zap, Plus, CheckCircle, ChefHat, Apple, Beef, Coffee, Search, Filter, Sunrise, Sun, Sunset, Cookie, BookOpen, Check, Trash2, Clock, Sparkles } from 'lucide-react';
import type { Meal, MealType } from '../types';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealTypeFilter, setSelectedMealTypeFilter] = useState<MealType | 'all'>('all');

  // Removed auto-analyze debounce in favor of a button

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

  const mealTypeFilters = [
    { value: 'all' as const, label: 'All', icon: Filter, color: 'bg-gray-100 text-gray-700' },
    { value: 'breakfast' as const, label: 'Breakfast', icon: Sunrise, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'lunch' as const, label: 'Lunch', icon: Sun, color: 'bg-orange-100 text-orange-700' },
    { value: 'dinner' as const, label: 'Dinner', icon: Sunset, color: 'bg-purple-100 text-purple-700' },
    { value: 'snack' as const, label: 'Snacks', icon: Cookie, color: 'bg-pink-100 text-pink-700' }
  ];

  const getMealTypeIcon = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return Sunrise;
      case 'lunch':
        return Sun;
      case 'dinner':
        return Sunset;
      case 'snack':
        return Cookie;
    }
  };

  const getMealTypeColor = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'lunch':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'dinner':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'snack':
        return 'bg-pink-100 text-pink-700 border-pink-200';
    }
  };

  // Filter and search saved meals
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedMealTypeFilter === 'all' || meal.type === selectedMealTypeFilter;
    return matchesSearch && matchesType;
  });

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

  const headerTitle = isFirstTime ? "Log Your First Meal!" : "Add Meal";
  const headerDescription = isFirstTime 
    ? "Let's see how our AI calculates macros from your meal description" 
    : "Add a meal and get AI-powered macro analysis";

  const isTrackingEnabled = selectedMeal.name && selectedMeal.description && selectedMeal.type && selectedMeal.macros && !selectedMeal.isAnalyzing;

  // First-time user simplified layout
  if (isFirstTime) {
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Utensils className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-green-700">Tell Us About Your Meal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meal-name" className="text-sm text-gray-700">What did you eat?</Label>
                        <Input
                          id="meal-name"
                          value={selectedMeal.name}
                          onChange={(e) => handleManualMealChange('name', e.target.value)}
                          placeholder="e.g., Chicken Caesar Salad"
                          className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="meal-type" className="text-sm text-gray-700">When did you eat it?</Label>
                        <Select value={selectedMeal.type} onValueChange={(value) => handleManualMealChange('type', value)}>
                          <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500/20">
                            <SelectValue placeholder="Select meal time..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">
                              <div className="flex items-center gap-2">
                                <Sunrise className="w-3 h-3 text-yellow-600" />
                                Breakfast
                              </div>
                            </SelectItem>
                            <SelectItem value="lunch">
                              <div className="flex items-center gap-2">
                                <Sun className="w-3 h-3 text-orange-600" />
                                Lunch
                              </div>
                            </SelectItem>
                            <SelectItem value="dinner">
                              <div className="flex items-center gap-2">
                                <Sunset className="w-3 h-3 text-purple-600" />
                                Dinner
                              </div>
                            </SelectItem>
                            <SelectItem value="snack">
                              <div className="flex items-center gap-2">
                                <Cookie className="w-3 h-3 text-pink-600" />
                                Snack
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meal-description" className="text-sm text-gray-700">Describe it in detail</Label>
                      <Textarea
                        id="meal-description"
                        value={selectedMeal.description}
                        onChange={(e) => handleManualMealChange('description', e.target.value)}
                        placeholder="Include specific quantities in grams for the most accurate macro calculations. For example: '150g grilled chicken breast, 100g steamed broccoli, 80g brown rice with 1 tbsp olive oil'"
                        rows={5}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500/20 resize-none"
                        required
                      />
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-green-700">
                          <strong>Pro tip:</strong> The more specific you are with quantities and cooking methods, the more accurate our AI macro calculations will be!
                        </div>
                      </div>
                      
                      {/* Calculate Macros Button */}
                      <Button 
                        type="button" 
                        onClick={analyzeMeal} 
                        disabled={!selectedMeal.description || selectedMeal.isAnalyzing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-2">
                        {selectedMeal.isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Calculate Macros
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Analysis Status */}
                    {selectedMeal.macros && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200 mt-4">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Analysis complete!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Analysis Results */}
                {selectedMeal.macros && (
                  <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-yellow-600">AI Analysis Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-green-100 rounded-lg border border-green-200">
                          <div className="text-xl font-bold text-green-600">{selectedMeal.macros.calories}</div>
                          <div className="text-xs text-gray-600">Calories</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="text-xl font-bold text-red-600">{selectedMeal.macros.protein}g</div>
                          <div className="text-xs text-gray-600">Protein</div>
                        </div>
                        <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                          <div className="text-xl font-bold text-teal-600">{selectedMeal.macros.carbs}g</div>
                          <div className="text-xs text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xl font-bold text-blue-600">{selectedMeal.macros.fats}g</div>
                          <div className="text-xs text-gray-600">Fats</div>
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={!isTrackingEnabled}
                        className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed py-3"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Track Meal & Complete Setup
                      </Button>

                      {isTrackingEnabled && (
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700 font-medium">
                            <strong>🎉 Perfect!</strong> Click above to save this meal and complete your setup. 
                            You'll then see your dashboard with this meal tracked!
                          </p>
                        </div>
                      )}

                      {!isTrackingEnabled && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600">
                            {!selectedMeal.name ? 'Please enter a meal name' : 
                             !selectedMeal.description ? 'Please add a meal description' : 
                             !selectedMeal.type ? 'Please select when you ate this meal' : 
                             selectedMeal.isAnalyzing ? 'Waiting for AI analysis to complete...' : 
                             !selectedMeal.macros ? 'Macros are being calculated...' : 'Ready to track!'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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

  // Regular user layout (existing two-column layout) - fixed for mobile scrolling
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
                <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4 min-h-0">
                  <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg flex-1 flex flex-col min-h-0">
                    <CardHeader className="flex-shrink-0 pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Utensils className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-green-700">
                          {selectedMeal.name ? `Selected: ${selectedMeal.name}` : "Meal Details"}
                        </span>
                        {selectedMeal.source !== 'manual' && (
                          <Badge variant="outline" className="text-xs">
                            {selectedMeal.source === 'saved' ? 'From Library' : 'Example'}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-3 overflow-y-auto min-h-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="meal-name" className="text-sm text-gray-700">Meal Name</Label>
                          <Input
                            id="meal-name"
                            value={selectedMeal.name}
                            onChange={(e) => handleManualMealChange('name', e.target.value)}
                            placeholder="e.g., Chicken Salad"
                            className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="meal-type" className="text-sm text-gray-700">Meal Type</Label>
                          <Select value={selectedMeal.type} onValueChange={(value) => handleManualMealChange('type', value)}>
                            <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500/20">
                              <SelectValue placeholder="Choose your Meal Type..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="breakfast">
                                <div className="flex items-center gap-2">
                                  <Sunrise className="w-3 h-3 text-yellow-600" />
                                  Breakfast
                                </div>
                              </SelectItem>
                              <SelectItem value="lunch">
                                <div className="flex items-center gap-2">
                                  <Sun className="w-3 h-3 text-orange-600" />
                                  Lunch
                                </div>
                              </SelectItem>
                              <SelectItem value="dinner">
                                <div className="flex items-center gap-2">
                                  <Sunset className="w-3 h-3 text-purple-600" />
                                  Dinner
                                </div>
                              </SelectItem>
                              <SelectItem value="snack">
                                <div className="flex items-center gap-2">
                                  <Cookie className="w-3 h-3 text-pink-600" />
                                  Snack
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-1 flex-1 flex flex-col min-h-0">
                        <Label htmlFor="meal-description" className="text-sm text-gray-700">Description</Label>
                        <Textarea
                          id="meal-description"
                          value={selectedMeal.description}
                          onChange={(e) => handleManualMealChange('description', e.target.value)}
                          placeholder="Describe your meal with quantities in grams for accurate macro calculations..."
                          rows={4}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500/20 flex-1 resize-none min-h-[100px]"
                          required
                        />
                        <p className="text-xs text-gray-500 bg-green-50 p-2 rounded border border-green-200">
                          <strong>💡 Tip:</strong> Include specific quantities in grams for the most accurate AI macro calculations.
                        </p>
                      </div>

                      {/* Auto Analysis Status */}
                      {selectedMeal.description && selectedMeal.source === 'manual' && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          {selectedMeal.isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm text-yellow-700">AI is analyzing your meal...</span>
                            </>
                          ) : selectedMeal.macros ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-700">Analysis complete!</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm text-yellow-700">AI will analyze in a moment...</span>
                            </>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Analysis Results - Always show if available */}
                  {selectedMeal.macros && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg flex-shrink-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-yellow-600">
                            {selectedMeal.source === 'manual' ? 'AI Analysis Results' : 'Macro Breakdown'}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center p-2 bg-green-100 rounded-lg border border-green-200">
                            <div className="text-lg font-bold text-green-600">{selectedMeal.macros.calories}</div>
                            <div className="text-xs text-gray-600">Calories</div>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-lg font-bold text-red-600">{selectedMeal.macros.protein}g</div>
                            <div className="text-xs text-gray-600">Protein</div>
                          </div>
                          <div className="text-center p-2 bg-teal-50 rounded-lg border border-teal-200">
                            <div className="text-lg font-bold text-teal-600">{selectedMeal.macros.carbs}g</div>
                            <div className="text-xs text-gray-600">Carbs</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-lg font-bold text-blue-600">{selectedMeal.macros.fats}g</div>
                            <div className="text-xs text-gray-600">Fats</div>
                          </div>
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={!isTrackingEnabled}
                          className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Track Meal and Macros
                        </Button>

                        {!isTrackingEnabled && (
                          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600">
                              {!selectedMeal.name ? 'Enter a meal name' : 
                               !selectedMeal.description ? 'Add a meal description' : 
                               !selectedMeal.type ? 'Select a meal type' : 
                               selectedMeal.isAnalyzing ? 'Waiting for AI analysis...' : 
                               !selectedMeal.macros ? 'Macros are being calculated...' : 'Ready to track!'}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </form>
              </div>

              {/* Right Column - Split between Meal Library and Examples */}
              <div className="flex flex-col space-y-4 h-full min-h-0">
                
                {/* Your Meal Library - Top Half */}
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
                      {meals.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BookOpen className="w-6 h-6 text-green-600" />
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">Start Building Your Meal Library</h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Once you add meals, they'll appear here for quick reuse.
                          </p>
                        </div>
                      ) : filteredMeals.length > 0 ? (
                        <div className="space-y-2">
                          {filteredMeals
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((meal) => {
                              const MealTypeIcon = getMealTypeIcon(meal.type);
                              const isSelected = selectedMeal.source === 'saved' && 
                                               selectedMeal.name === meal.name && 
                                               selectedMeal.description === meal.description;
                              return (
                                <div
                                  key={meal.id}
                                  className={`relative p-2 border rounded-lg cursor-pointer transition-colors group ${
                                    isSelected 
                                      ? 'bg-green-100 border-green-400 shadow-md' 
                                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                  }`}
                                  onClick={() => handleSelectSavedMeal(meal)}
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteMeal(meal.id);
                                    }}
                                    className="absolute top-1 right-6 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>

                                  <div className="flex items-start justify-between gap-2 pr-8">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-xs text-gray-800 truncate">{meal.name}</h4>
                                        <Badge className={`text-xs ${getMealTypeColor(meal.type)}`}>
                                          <MealTypeIcon className="w-2 h-2 mr-1" />
                                          {meal.type}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-600 line-clamp-2">{meal.description}</p>
                                      <div className="text-xs text-gray-600 mt-1">
                                        P: {meal.macros.protein}g | C: {meal.macros.carbs}g | F: {meal.macros.fats}g
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <div className="font-medium text-xs text-green-600">{meal.macros.calories} cal</div>
                                      <p className="text-xs text-gray-500">
                                        {new Date(meal.timestamp).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
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

                {/* Try These Examples - Bottom Half */}
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
                        const isSelected = selectedMeal.source === 'example' && 
                                         selectedMeal.name === meal.name;
                        
                        return (
                          <div
                            key={index}
                            className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-green-100 border-2 border-green-400 shadow-md' 
                                : 'bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-200'
                            }`}
                            onClick={() => handleSelectExampleMeal(meal)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}