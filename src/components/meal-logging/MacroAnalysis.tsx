import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Zap, Plus, CheckCircle } from 'lucide-react';

interface MacroAnalysisProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  isTrackingEnabled: boolean;
  onSubmit: () => void;
  source: 'manual' | 'saved' | 'example';
  statusMessage?: string;
}

export function MacroAnalysis({
  macros,
  isTrackingEnabled,
  onSubmit,
  source,
  statusMessage
}: MacroAnalysisProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg flex-shrink-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-yellow-600">
            {source === 'manual' ? 'AI Analysis Results' : 'Macro Breakdown'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-green-100 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">{macros.calories}</div>
            <div className="text-xs text-gray-600">Calories</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="text-lg font-bold text-red-600">{macros.protein}g</div>
            <div className="text-xs text-gray-600">Protein</div>
          </div>
          <div className="text-center p-2 bg-teal-50 rounded-lg border border-teal-200">
            <div className="text-lg font-bold text-teal-600">{macros.carbs}g</div>
            <div className="text-xs text-gray-600">Carbs</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">{macros.fats}g</div>
            <div className="text-xs text-gray-600">Fats</div>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={!isTrackingEnabled}
          onClick={onSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Track Meal and Macros
        </Button>

        {!isTrackingEnabled && statusMessage && (
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600">{statusMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
