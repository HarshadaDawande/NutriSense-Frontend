import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Target, Save, Scale, Star, Leaf, Apple, Wheat, Droplets, Check } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { MacroTargets as MacroTargetsType } from '../types';

interface MacroTargetsProps {
  targets: MacroTargetsType;
  onSave: (targets: MacroTargetsType) => void;
  onBack: () => void;
  isFirstTime?: boolean;
}

export function MacroTargets({ targets, onSave, onBack, isFirstTime = false }: MacroTargetsProps) {
  const [formData, setFormData] = useState(targets);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Define preset data
  const presetData = {
    'weight-loss': {
      calories: 1500,
      protein: 120,
      carbs: 150,
      fats: 50
    },
    'maintenance': {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fats: 65
    },
    'muscle-gain': {
      calories: 2500,
      protein: 180,
      carbs: 280,
      fats: 85
    }
  };

  // Check if current values match any preset
  const getMatchingPreset = (data: MacroTargetsType) => {
    for (const [presetName, presetValues] of Object.entries(presetData)) {
      if (
        data.calories === presetValues.calories &&
        data.protein === presetValues.protein &&
        data.carbs === presetValues.carbs &&
        data.fats === presetValues.fats
      ) {
        return presetName;
      }
    }
    return null;
  };

  // Set initial preset selection based on target values
  useEffect(() => {
    const matchingPreset = getMatchingPreset(targets);
    if (matchingPreset) {
      setSelectedPreset(matchingPreset);
    }
  }, [targets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof MacroTargetsType, value: string) => {
    const numValue = parseInt(value) || 0;
    const newFormData = { ...formData, [field]: numValue };
    setFormData(newFormData);

    // Check if the new values match any preset
    const matchingPreset = getMatchingPreset(newFormData);
    setSelectedPreset(matchingPreset);
  };

  const handlePresetSelect = (presetName: string, presetValues: MacroTargetsType) => {
    setFormData(presetValues);
    setSelectedPreset(presetName);
  };

  const macroInfo = [
    {
      field: 'calories' as const,
      label: 'Daily Calories',
      description: 'Total calories you want to consume per day',
      unit: 'cal',
      color: '#22c55e',
      icon: Apple
    },
    {
      field: 'protein' as const,
      label: 'Protein',
      description: 'Aim for 1.8-2.2g per kg of body weight for muscle building',
      unit: 'g',
      color: '#ff6b6b',
      icon: Target
    },
    {
      field: 'carbs' as const,
      label: 'Carbohydrates',
      description: 'Primary energy source, 45-65% of total calories',
      unit: 'g',
      color: '#4ecdc4',
      icon: Wheat
    },
    {
      field: 'fats' as const,
      label: 'Fats',
      description: 'Essential for hormone production, 20-35% of calories',
      unit: 'g',
      color: '#45b7d1',
      icon: Droplets
    }
  ];

  const headerTitle = isFirstTime ? "Welcome! Let's Set Your Goals" : "Macro Targets";
  const headerDescription = isFirstTime
    ? "First, let's establish your daily nutrition targets to help you stay balanced"
    : "Set your daily nutrition goals";

  const buttonText = isFirstTime ? "Save & Start Tracking" : "Save Targets";
  const ButtonIcon = isFirstTime ? Star : Save;

  // Get summary title based on selected preset
  const getSummaryTitle = () => {
    if (selectedPreset === 'weight-loss') {
      return 'Summary - Your Weight Loss Targets';
    } else if (selectedPreset === 'muscle-gain') {
      return 'Summary - Your Muscle Gain Targets';
    } else if (selectedPreset === 'maintenance') {
      return 'Summary - Your Maintenance Targets';
    }
    return 'Summary - Your Custom Targets';
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100" />

      {/* Background Images */}
      <div className="absolute top-10 right-10 w-40 h-40 opacity-8 hidden lg:block">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop&crop=focalpoint"
          alt="Balanced nutrition"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-8 hidden lg:block">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=150&h=150&fit=crop&crop=focalpoint"
          alt="Fresh ingredients"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="relative z-10 p-2 sm:p-4">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {!isFirstTime && (
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto border-green-200 hover:bg-green-100 text-green-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-700">
                  {headerTitle}
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 ml-10">{headerDescription}</p>
            </div>
          </div>

          {/* First Time User Welcome */}
          {isFirstTime && (
            <Card className="bg-green-50 border border-green-200 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      Step 1: Set Your Macro Balance
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      These targets will help you maintain a balanced diet. Don't worry - you can always adjust them later
                      as you learn more about your body's needs. We've set some reasonable defaults to get you started!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Quick Presets - Moved Higher */}
            <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Apple className="w-5 h-5 text-green-600" />
                  Quick Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePresetSelect('weight-loss', presetData['weight-loss'])}
                    className={`relative p-4 h-auto flex-col items-start text-left transition-all ${
                      selectedPreset === 'weight-loss'
                        ? 'bg-red-50 border-red-400 shadow-md'
                        : 'border-red-300 hover:bg-red-50 hover:border-red-400'
                    }`}
                  >
                    {selectedPreset === 'weight-loss' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="font-medium text-sm text-red-600">Weight Loss</div>
                    <div className="text-xs text-gray-600">1500 cal deficit</div>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePresetSelect('maintenance', presetData['maintenance'])}
                    className={`relative p-4 h-auto flex-col items-start text-left transition-all ${
                      selectedPreset === 'maintenance'
                        ? 'bg-green-50 border-green-400 shadow-md'
                        : 'border-green-300 hover:bg-green-50 hover:border-green-400'
                    }`}
                  >
                    {selectedPreset === 'maintenance' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="font-medium text-sm text-green-600">Maintenance</div>
                    <div className="text-xs text-gray-600">2000 cal balanced</div>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePresetSelect('muscle-gain', presetData['muscle-gain'])}
                    className={`relative p-4 h-auto flex-col items-start text-left transition-all ${
                      selectedPreset === 'muscle-gain'
                        ? 'bg-blue-50 border-blue-400 shadow-md'
                        : 'border-blue-300 hover:bg-blue-50 hover:border-blue-400'
                    }`}
                  >
                    {selectedPreset === 'muscle-gain' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="font-medium text-sm text-blue-600">Muscle Gain</div>
                    <div className="text-xs text-gray-600">2500 cal surplus</div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Target Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-green-700">
                    Daily Targets
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {macroInfo.map((macro) => {
                  const IconComponent = macro.icon;
                  return (
                    <div key={macro.field} className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: `${macro.color}20` }}
                        >
                          <IconComponent className="w-4 h-4" style={{ color: macro.color }} />
                        </div>
                        <Label htmlFor={macro.field} className="font-medium text-sm sm:text-base text-gray-800">
                          {macro.label}
                        </Label>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 ml-10">{macro.description}</p>
                      <div className="flex items-center gap-2 ml-10">
                        <Input
                          id={macro.field}
                          type="number"
                          value={formData[macro.field]}
                          onChange={(e) => handleInputChange(macro.field, e.target.value)}
                          className="w-24 sm:w-32 border-green-200 focus:border-green-500 focus:ring-green-500/20"
                          min="0"
                        />
                        <span className="text-sm text-gray-600 font-medium">{macro.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Summary - with dynamic title */}
            <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  {getSummaryTitle()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {macroInfo.map((macro) => {
                    const IconComponent = macro.icon;
                    return (
                      <div key={macro.field} className="text-center p-3 bg-gray-50 rounded-lg border border-green-100 shadow-sm">
                        <div
                          className="w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center"
                          style={{ backgroundColor: `${macro.color}20` }}
                        >
                          <IconComponent className="w-3 h-3" style={{ color: macro.color }} />
                        </div>
                        <div className="font-medium text-sm sm:text-base" style={{ color: macro.color }}>
                          {formData[macro.field]}
                        </div>
                        <div className="text-xs text-gray-600">{macro.unit}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              size="lg"
            >
              <ButtonIcon className="w-4 h-4 mr-2" />
              {buttonText}
            </Button>

            {/* Next Step Preview for First Time Users */}
            {isFirstTime && (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Apple className="w-4 h-4 text-green-600" />
                  <p className="text-xs sm:text-sm text-green-700 font-medium">
                    <strong>Next:</strong> We'll help you log your first meal and see how AI calculates your macros!
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
