import { Sunrise, Sun, Sunset, Cookie, Filter } from 'lucide-react';
import type { MealType } from '../../types';

// Meal type filter options
export const mealTypeFilters = [
  { value: 'all' as const, label: 'All', icon: Filter, color: 'bg-gray-100 text-gray-700' },
  { value: 'breakfast' as const, label: 'Breakfast', icon: Sunrise, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'lunch' as const, label: 'Lunch', icon: Sun, color: 'bg-orange-100 text-orange-700' },
  { value: 'dinner' as const, label: 'Dinner', icon: Sunset, color: 'bg-purple-100 text-purple-700' },
  { value: 'snack' as const, label: 'Snacks', icon: Cookie, color: 'bg-pink-100 text-pink-700' }
];

// Get icon component for a meal type
export const getMealTypeIcon = (type: MealType) => {
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

// Get color classes for a meal type
export const getMealTypeColor = (type: MealType) => {
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
