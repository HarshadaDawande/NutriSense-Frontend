import { useState, useEffect } from 'react';
import axios from 'axios';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { LoginScreen } from './pages/LoginScreen';
import { SignupScreen } from './pages/SignupScreen';
import { Dashboard } from './pages/Dashboard';
import { MacroTargets as MacroTargetsComponent } from './pages/MacroTargets';
import { MealLogging } from './pages/MealLogging';
import type { Screen, MacroTargets, Meal, Params } from './types';
import { v4 as uuidv4 } from 'uuid';
//import { calculateMacroTotals } from './utils';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const userData = localStorage.getItem('userData');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(() => {
    return userData ? JSON.parse(userData).isFirstTimeUser : true;
  });
  const [hasSetTargets, setHasSetTargets] = useState(() => {
    return userData ? JSON.parse(userData).hasSetTargets : false;
  });

  // Save hasSetTargets to userData object in localStorage whenever it changes
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      parsedData.hasSetTargets = hasSetTargets;
      localStorage.setItem('userData', JSON.stringify(parsedData));
    }
  }, [hasSetTargets]);
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      parsedData.isFirstTimeUser = isFirstTimeUser;
      localStorage.setItem('userData', JSON.stringify(parsedData));
    }
  }, [isFirstTimeUser]);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65
  });
  const [meals, setMeals] = useState<Meal[]>([]);
  const [navigationParams, setNavigationParams] = useState<Params | null>(null);

  const addMeal = (meal: Omit<Meal, 'id'> & { timestamp?: Date }) => {
    const newMeal: Meal = {
      ...meal,
      mealId: uuidv4(),
      mealDate: meal.timestamp ? new Date(meal.timestamp).toISOString() : new Date().toISOString()
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const deleteMeal = (mealId: string) => {
    setMeals(prev => prev.filter(meal => meal.mealId !== mealId));
  };

  const saveTargets = async (targets: MacroTargets) => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) throw new Error('User data not found');
      const parsedData = JSON.parse(userData);

      await axios.post('http://localhost:8080/v1/meal/targets', {
        userName: parsedData.userName,
        emailAddress: parsedData.emailAddress,
        createdAt: new Date().toISOString(),
        calories: targets.calories,
        protein: targets.protein,
        carbs: targets.carbs,
        fats: targets.fats
      });
    } catch (error) {
      console.error('Failed to save targets:', error);
      throw error;
    }
  };

  const handleTargetsSave = async (targets: MacroTargets) => {
    try {
      await saveTargets(targets);
      setMacroTargets(targets);
      setHasSetTargets(true);

      if (isFirstTimeUser) {
        // For first-time users, go to meal logging after setting targets
        localStorage.setItem('userData', JSON.stringify({
          emailAddress: userEmail,
          userName: userName,
          isFirstTimeUser: false,
          hasSetTargets: true,
          createdAt: new Date().toISOString()
        }));
        setCurrentScreen('meals');
      } else {
        // For returning users, go back to dashboard
        setCurrentScreen('dashboard');
      }
    } catch (error) {
      console.error('Error saving targets:', error);
      alert('Failed to save your targets. Please try again.');
      // For returning users, go back to dashboard
      setCurrentScreen('dashboard');
    }
  };

  const handleNavigate = (screen: Screen, params?: Params) => {
    setCurrentScreen(screen);
    if (params) {
      setNavigationParams(params);
    } else {
      setNavigationParams(null);
    }
  };

  const handleFirstMealComplete = () => {
    setIsFirstTimeUser(false);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserEmail('');
    setIsFirstTimeUser(true);
    setHasSetTargets(false);
    setMeals([]);
    setCurrentScreen('welcome');
  };

  //const currentMacros = calculateMacroTotals(meals);

  const renderScreen = () => {
    // console.log('currentScreen in App.tsx:', currentScreen);
    // console.log('isFirstTimeUser in App.tsx:', isFirstTimeUser);
    // console.log('hasSetTargets in App.tsx:', hasSetTargets);
    switch (currentScreen) {
      case 'welcome':
        localStorage.removeItem('userData');
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen('login')}
            onSignUp={() => setCurrentScreen('signup')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLogin={(_, __) => {
              // Check if user data is stored in localStorage
              const userDataStr = localStorage.getItem('userData');
              if (userDataStr) {
                try {
                  const userData = JSON.parse(userDataStr);
                  setUserEmail(userData.emailAddress);
                  setUserName(userData.userName);
                  setUserId(userData.userId);
                  setIsFirstTimeUser(userData.isFirstTimeUser === 'true');
                  setHasSetTargets(userData.hasSetTargets === 'true');
                  (isFirstTimeUser) ?
                      setCurrentScreen('targets') : setCurrentScreen('dashboard');
                } catch (error) {
                  console.error('Error parsing user data from localStorage:', error);
                }
              }
            }}
            onBack={() => setCurrentScreen('welcome')}
            onSignUp={() => setCurrentScreen('signup')}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onBackToLogin={() => setCurrentScreen('login')}
            onBackToWelcome={() => setCurrentScreen('welcome')}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            targets={macroTargets}
            meals={meals}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            userEmail={userEmail}
            userName={userName}
            userId={userId}
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
            initialDate={navigationParams?.initialDate}
            userId={userId}
          />
        );
      default:
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen('login')}
            onSignUp={() => setCurrentScreen('signup')}
          />
        );
    }
  };

  return <div className="size-full">{renderScreen()}</div>;
}
