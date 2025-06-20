import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Utensils, Zap, CheckCircle, Sunrise, Sun, Sunset, Cookie, Clock } from 'lucide-react';
import type { MealType } from '../../types';

interface MealFormProps {
  name: string;
  description: string;
  type: MealType | '';
  source: 'manual' | 'saved' | 'example';
  isAnalyzing?: boolean;
  hasMacros?: boolean;
  onMealChange: (field: string, value: string) => void;
  onAnalyzeMeal: () => void;
}

export function MealForm({
  name,
  description,
  type,
  source,
  isAnalyzing,
  hasMacros,
  onMealChange,
  onAnalyzeMeal
}: MealFormProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg flex-1 flex flex-col min-h-0">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <Utensils className="w-3 h-3 text-white" />
          </div>
          <span className="text-green-700">
            {name ? `Selected: ${name}` : "Meal Details"}
          </span>
          {source !== 'manual' && (
            <Badge variant="outline" className="text-xs">
              {source === 'saved' ? 'From Library' : 'Example'}
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
              value={name}
              onChange={(e) => onMealChange('name', e.target.value)}
              placeholder="e.g., Chicken Salad"
              className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="meal-type" className="text-sm text-gray-700">Meal Type</Label>
            <Select value={type} onValueChange={(value) => onMealChange('type', value)}>
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
            value={description}
            onChange={(e) => onMealChange('description', e.target.value)}
            placeholder="Describe your meal with quantities in grams for accurate macro calculations..."
            rows={4}
            className="border-green-200 focus:border-green-500 focus:ring-green-500/20 flex-1 resize-none min-h-[100px]"
            required
          />
          <p className="text-xs text-gray-500 bg-green-50 p-2 rounded border border-green-200">
            <strong>💡 Tip:</strong> Include specific quantities in grams for the most accurate AI macro calculations.
          </p>
        </div>

        {/* Calculate Macros Button - Only for manual entries */}
        {source === 'manual' && !hasMacros && (
          <Button 
            type="button" 
            onClick={onAnalyzeMeal} 
            disabled={!description || isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-2">
            {isAnalyzing ? (
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
        )}

        {/* Auto Analysis Status */}
        {description && source === 'manual' && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-yellow-700">AI is analyzing your meal...</span>
              </>
            ) : hasMacros ? (
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
  );
}
