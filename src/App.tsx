import { useState } from 'react';
import { LoginScreen } from './pages/LoginScreen';
import { LoginForm } from './pages/LoginForm';
import { SignupScreen } from './pages/SignupScreen';
import { Dashboard } from './pages/Dashboard';
import { MacroTargets as MacroTargetsComponent } from './pages/MacroTargets';
import { MealLogging } from './pages/MealLogging';
import type { Screen, MacroTargets, Meal } from './types';
import { calculateMacroTotals } from './utils';

// Types are now imported from './types'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [hasSetTargets, setHasSetTargets] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65
  });
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = (meal: Omit<Meal, 'id' | 'timestamp'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const deleteMeal = (mealId: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  const handleShowLoginForm = () => {
    setCurrentScreen('loginForm');
  };

  const handleLogin = (email: string, _password: string) => {
    setUserEmail(email);
    
    // Check if this is a returning user (simple check based on email)
    const isReturningUser = email === 'demo@example.com' || hasSetTargets;
    
    if (isReturningUser) {
      setIsFirstTimeUser(false);
      setHasSetTargets(true);
      setCurrentScreen('dashboard');
    } else {
      setIsFirstTimeUser(true);
      setHasSetTargets(false);
      setCurrentScreen('targets');
    }
  };

  const handleSignUp = () => {
    setIsFirstTimeUser(true);
    setHasSetTargets(false);
    setCurrentScreen('targets');
  };

  const handleTargetsSave = (targets: MacroTargets) => {
    setMacroTargets(targets);
    setHasSetTargets(true);
    
    if (isFirstTimeUser) {
      // For first-time users, go to meal logging after setting targets
      setCurrentScreen('meals');
    } else {
      // For returning users, go back to dashboard
      setCurrentScreen('dashboard');
    }
  };

  const handleFirstMealComplete = () => {
    setIsFirstTimeUser(false);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserEmail('');
    setIsFirstTimeUser(true);
    setHasSetTargets(false);
    setMeals([]);
    setCurrentScreen('login');
  };

  const currentMacros = calculateMacroTotals(meals);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleShowLoginForm}
            onSignUp={() => setCurrentScreen('signup')}
          />
        );
      case 'loginForm':
        return (
          <LoginForm
            onLogin={handleLogin}
            onBack={() => setCurrentScreen('login')}
            onSignUp={() => setCurrentScreen('signup')}
          />
        );
      case 'signup':
        return (
          <SignupScreen 
            onSignUp={handleSignUp}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            targets={macroTargets}
            current={currentMacros}
            meals={meals}
            onNavigate={setCurrentScreen}
            onLogout={handleLogout}
            userEmail={userEmail}
          />
        );
      case 'targets':
        return (
          <MacroTargetsComponent
            targets={macroTargets}
            onSave={handleTargetsSave}
            onBack={() => setCurrentScreen('dashboard')}
            isFirstTime={isFirstTimeUser && !hasSetTargets}
          />
        );
      case 'meals':
        return (
          <MealLogging
            meals={meals}
            onAddMeal={addMeal}
            onDeleteMeal={deleteMeal}
            onBack={() => setCurrentScreen('dashboard')}
            isFirstTime={isFirstTimeUser}
            onFirstMealComplete={handleFirstMealComplete}
          />
        );
      default:
        return (
          <LoginScreen 
            onLogin={handleShowLoginForm}
            onSignUp={() => setCurrentScreen('signup')}
          />
        );
    }
  };

  return <div className="size-full">{renderScreen()}</div>;
}