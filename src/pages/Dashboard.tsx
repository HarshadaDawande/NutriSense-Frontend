import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Target, Plus, Clock, LogOut, Scale, User, Leaf, Apple, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { useMealLogging } from '../hooks/useMealLogging';
import type { MacroTargets, Meal, Screen, Params } from '../types';
import { Calendar as CalendarComponent } from '../components/ui/calendar';

interface DashboardProps {
  targets: MacroTargets;
  meals: Meal[];
  onNavigate: (screen: Screen, params?: Params) => void;
  onLogout?: () => void;
  userEmail?: string;
  userName?: string;
  userId?: string;
}

export function Dashboard({ targets, meals: initialMeals, onNavigate, onLogout, userEmail, userName, userId }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  // Ref for the calendar overlay to detect outside clicks if needed
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarToggleRef = useRef<HTMLButtonElement>(null);

  // Close calendar when clicking anywhere outside
  useEffect(() => {
    if (!showCalendar) return;

    const handleClick = (event: MouseEvent) => {
      // If click happened inside calendar, ignore
      if (
        (calendarRef.current && calendarRef.current.contains(event.target as Node)) ||
        (calendarToggleRef.current && calendarToggleRef.current.contains(event.target as Node))
      ) {
        return;
      }
      setShowCalendar(false);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showCalendar]);

  // Use our custom hook for meal logging
  const { 
    meals, 
    isLoading, 
    fetchMeals, 
    removeMeal 
  } = useMealLogging({ userId: userId || '' });

  // Fetch meals on component mount
  useEffect(() => {
    if (userId) {
      fetchMeals();
    }
  }, [userId, fetchMeals]);

  // Handle meal deletion
  const handleDeleteMeal = async (mealId: string) => {
    const success = await removeMeal(mealId);
    if (success) {
      toast.success('Meal deleted successfully');
    }
    fetchMeals();
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Use the meals from the API or fall back to the props
  const mealsToUse = userId ? meals : initialMeals;

  // Get meals for selected date
  const getMealsForDate = (date: Date) => {
    return mealsToUse.filter(meal => isSameDay(new Date(meal.mealDate), date));
  };

  // Calculate macros for selected date
  const getMacrosForDate = (date: Date) => {
    const dateMeals = getMealsForDate(date);
    return dateMeals.reduce(
      (total: { calories: string, protein: string, carbs: string, fats: string }, meal) => ({
        calories: (Number(total.calories) + Number(meal.calories)).toString(),
        protein: (Number(total.protein) + Number(meal.proteins)).toString(),
        carbs: (Number(total.carbs) + Number(meal.carbs)).toString(),
        fats: (Number(total.fats) + Number(meal.fats)).toString()
      }),
      { calories: '0', protein: '0', carbs: '0', fats: '0' }
    );
  };

  const selectedDateMacros = getMacrosForDate(selectedDate);
  const selectedDateMeals = getMealsForDate(selectedDate);
  const isToday = isSameDay(selectedDate, new Date());

  // Helper function to get progress bar color
  // const getProgressColor = (current: number, target: number) => {
  //   const percentage = (current / target) * 100;
  //   if (percentage >= 100 && percentage <= 110) {
  //     return 'bg-green-500'; // Achieved target (within 10% tolerance)
  //   } else if (percentage > 110) {
  //     return 'bg-red-500'; // Exceeded target significantly
  //   } else {
  //     return 'bg-gray-400'; // Not yet achieved
  //   }
  // };

  // Get progress color indicator for the progress component
  const getProgressIndicatorColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100 && percentage <= 110) {
      return '[&>*]:bg-green-500'; // Achieved target
    } else if (percentage > 110) {
      return '[&>*]:bg-red-500'; // Exceeded target
    } else {
      return '[&>*]:bg-gray-400'; // In progress
    }
  };

  // App color palette for macro distribution - more distinct colors
  const macroColors = {
    protein: '#22c55e', // green-500 (main app green)
    carbs: '#eab308',   // yellow-500 (distinct yellow) 
    fats: '#84cc16'     // lime-500 (lighter green)
  };

  const macroData = [
    { name: 'Protein', value: Number(selectedDateMacros.protein), target: Number(targets.protein), color: macroColors.protein },
    { name: 'Carbs', value: Number(selectedDateMacros.carbs), target: Number(targets.carbs), color: macroColors.carbs },
    { name: 'Fats', value: Number(selectedDateMacros.fats), target: Number(targets.fats), color: macroColors.fats }
  ];

  const calorieProgress = Math.min((Number(selectedDateMacros.calories) / Number(targets.calories)) * 100, 100);

  const recentMeals = selectedDateMeals.slice(-5).reverse();

  const formatDate = (date: Date) => {
    if (isToday) {
      return 'Today';
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const canNavigateNext = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return selectedDate < tomorrow;
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      onNavigate('login');
    }
  };

  // Get daily summary status
  const getDailySummaryStatus = () => {
    const totalProgress = Object.entries({
      calories: Number(selectedDateMacros.calories) / targets.calories,
      protein: Number(selectedDateMacros.protein) / targets.protein,
      carbs: Number(selectedDateMacros.carbs) / targets.carbs,
      fats: Number(selectedDateMacros.fats) / targets.fats
    });

    const achieved = totalProgress.filter(([_, progress]) => progress >= 1 && progress <= 1.1).length;
    const exceeded = totalProgress.filter(([_, progress]) => progress > 1.1).length;
    
    if (achieved === 4) return { status: 'perfect', color: 'text-green-600', message: 'Perfect day! All targets achieved!' };
    else if (achieved >= 3) return { status: 'great', color: 'text-green-600', message: 'Great progress on your goals!' };
    else if (achieved >= 2) return { status: 'good', color: 'text-yellow-600', message: 'Good progress, keep it up!' };
    else if (exceeded >= 2) return { status: 'over', color: 'text-red-600', message: 'Watch your intake levels' };
    else return { status: 'start', color: 'text-gray-600', message: 'Start tracking to see your progress' };
  };

  const dailySummary = getDailySummaryStatus();

  // Navigate to meal logging page
  const navigateToMealLogging = () => {
    onNavigate('meals', { initialDate: selectedDate });
  };

  // const handleDateChange = (date: Date | undefined) => {
  //   if (date) {
  //     setSelectedDate(date);
  //     setShowCalendar(false);
  //   }
  // };

  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100" />
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=300&fit=crop&crop=focalpoint"
          alt="Fresh vegetables"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&crop=focalpoint"
          alt="Healthy food"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      <div className="relative z-10 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-700">
                  NutriSense
                </h1>
              </div>
              {userEmail && (
                <div className="flex flex-col text-xs text-gray-500 mt-1 ml-10">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {userName ? userName : 'User'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{userEmail}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                onClick={() => onNavigate('targets')}
                variant="outline"
                size="sm"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 w-full sm:w-auto h-10 sm:h-9"
              >
                <Scale className="w-4 h-4 mr-2" />
                Set Targets
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto hover:bg-red-50 hover:border-red-200 hover:text-red-600 h-10 sm:h-9"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Date Navigation */}
          <Card className="relative z-30 bg-white/70 backdrop-blur-sm border border-green-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateDate('prev')}
                  variant="outline"
                  size="sm"
                  className="border-green-200 hover:bg-green-100 text-green-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="relative flex items-center gap-3">
                  <button
                    type="button"
                    ref={calendarToggleRef}
                    onClick={() => {
                      // Ensure the calendar opens on the month of the currently selected date
                      setCalendarMonth(selectedDate);
                      setShowCalendar(!showCalendar);
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-800">{formatDate(selectedDate)}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {showCalendar && (
                    <div
                      id="div1"
                      ref={calendarRef}
                      className="absolute top-full left-0 z-[999] mt-1 w-fit border border-green-200 rounded-md p-3 bg-white shadow-lg pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        {/* Previous month */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                          onClick={() => {
                            setCalendarMonth(prev => {
                              const newDate = new Date(prev);
                              newDate.setMonth(prev.getMonth() - 1);
                              return newDate;
                            });
                          }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {/* Today */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                          onClick={() => {
                            const today = new Date();
                            setSelectedDate(today);
                            setCalendarMonth(today);
                          }}
                        >
                          Today
                        </Button>

                        {/* Next month */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                          onClick={() => {
                            setCalendarMonth(prev => {
                              const newDate = new Date(prev);
                              newDate.setMonth(prev.getMonth() + 1);
                              return newDate;
                            });
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <CalendarComponent
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          console.log('Day selected:', date);
                          if (date) {
                            setSelectedDate(date);
                            setCalendarMonth(date);
                            //setShowCalendar(false);
                          }
                        }}
                        onDayClick={(day) => console.log('Day clicked:', day)}
                        disabled={(date) => date > new Date()}
                        className="mx-auto"
                        classNames={{
                          nav: "hidden", // hide default navigation controls
                          day_selected: "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white",
                          day_today: "bg-green-50 text-green-800 font-medium",
                          caption_label: "text-green-800 font-medium",
                          nav_button: "text-green-600 hover:bg-green-50 hover:text-green-800",
                          cell: "rounded-full",
                          day: "rounded-full hover:bg-green-50 hover:text-green-800 focus:bg-green-50 focus:text-green-800"
                        }}
                        components={{
                          // remove default navbar completely
                          //Navbar: () => null,
                        }}
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => navigateDate('next')}
                  variant="outline"
                  size="sm"
                  disabled={!canNavigateNext()}
                  className="border-green-200 hover:bg-green-100 text-green-700 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Daily Summary Status */}
              <div className="mt-4 text-center">
                <p className={`text-sm font-medium ${dailySummary.color}`}>
                  {dailySummary.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Calorie Overview with Progress Color */}
          <Card className="bg-white/70 backdrop-blur-sm border border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-green-700">
                  Daily Calories
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">
                    {selectedDateMacros.calories} / {targets.calories}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    Number(selectedDateMacros.calories) > Number(targets.calories) 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-gray-600'
                  }`}>
                    {Number(selectedDateMacros.calories) > Number(targets.calories)
                      ? `Over target by ${Number(selectedDateMacros.calories) - Number(targets.calories)} calories`
                      : `${Number(targets.calories) - Number(selectedDateMacros.calories)} calories remaining`
                    }
                  </span>
                </div>
                <Progress 
                  value={calorieProgress} 
                  className={`h-3 bg-gray-200 ${getProgressIndicatorColor(Number(selectedDateMacros.calories), Number(targets.calories))}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Macro Breakdown with Updated Colors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Apple className="w-5 h-5 text-green-600" />
                  Macro Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}g`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Progress vs Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={macroData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#22c55e/20" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#22c55e" name="Current" />
                      <Bar dataKey="target" fill="#e0e0e0" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Macro Details with Color-Coded Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {macroData.map((macro) => {
              const progressColor = getProgressIndicatorColor(Number(macro.value), Number(macro.target));
              return (
                <Card key={macro.name} className="bg-white/70 backdrop-blur-sm border border-green-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm sm:text-base text-gray-800">{macro.name}</span>
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm" 
                        style={{ backgroundColor: macro.color }}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{macro.value}g</span>
                        <span className="text-gray-600">{macro.target}g</span>
                      </div>
                      <Progress 
                        value={Math.min((Number(macro.value) / Number(macro.target)) * 100, 100)} 
                        className={`h-2 ${progressColor}`}
                      />
                      <div className="text-xs text-center">
                        <span className={
                          Number(macro.value) >= Number(macro.target) * 1.1 ? 'text-red-600' :
                          Number(macro.value) >= Number(macro.target) ? 'text-green-600' : 
                          'text-gray-600'
                        }>
                          {Number(macro.value) >= Number(macro.target) * 1.1 ? 'Over target' :
                           Number(macro.value) >= Number(macro.target) ? 'Target achieved' : 
                           `${Math.round(((Number(macro.target) - Number(macro.value)) / Number(macro.target)) * 100)}% to go`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Meals for Selected Date */}
          <Card className="bg-white/70 backdrop-blur-sm border border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg text-green-700">
                    {isToday ? 'Today\'s Meals' : `Meals for ${formatDate(selectedDate)}`} ({selectedDateMeals.length})
                  </span>
                </div>
                <Button
                  onClick={navigateToMealLogging}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto shadow-lg h-10 sm:h-9"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isToday ? 'Add Meal' : `Add Meal for ${formatDate(selectedDate)}`}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600">Loading meals...</p>
                </div>
              ) : recentMeals.length > 0 ? (
                <div className="space-y-3">
                  {recentMeals.map((meal) => (
                    <div key={meal.mealId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm sm:text-base text-gray-800">{meal.mealType}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(meal.mealDate).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{meal.mealDescription}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-left sm:text-right">
                          <div className="font-medium text-sm sm:text-base text-green-600">{meal.calories} cal</div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            P: {meal.proteins}g | C: {meal.carbs}g | F: {meal.fats}g
                          </div>
                        </div>
                        {userId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMeal(meal.mealId)}
                            className="text-gray-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Apple className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    {isToday ? 'No meals logged today' : `No meals logged for ${formatDate(selectedDate)}`}
                  </p>
                  {isToday && (
                    <p className="text-xs sm:text-sm mt-1 text-gray-500">Start by adding your first meal!</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}