import axios from 'axios';
//import { Meal, MacroEntry, MealType } from '../types';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:8080/v1';

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User related API calls
export const getUserByEmail = async (email: string) => {
  try {
    const response = await apiClient.get(`/user/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Interface for meal creation payload
export interface MealPayload {
    userId: string;
    mealType: string;
    mealDescription: string;
    proteins: string;
    carbs: string;
    fats: string;
    calories: string;
    mealDate: string;
    mealId: string;
}

// Meal related API calls
export const getMealsByUserId = async (userId: string): Promise<MealPayload[]> => {
  try {
    const response = await axios.get(`http://localhost:8080/v1/${userId}/meals`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        console.error("User not found. Please check your email or sign up.");
      } else {
        console.error(`Error: ${error.response.data?.message || 'Something went wrong'}`);
      }
    } else {
      console.error("An unexpected error occurred");
    }
    console.error('Error during login:', error);
    throw error; // Re-throw the error so it can be caught in handleSubmit
  }
};

export const createMeal = async (mealData: MealPayload) => {
    try {
      console.log('Sending meal data to API:', mealData); // Log the data being sent
      const response = await axios.post(`http://localhost:8080/v1/add`, mealData);
      console.log('API response:', response.data); // Log the response
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API error response:', error.response.data); // Log the error response
        if (error.response.status === 404) {
          console.error('Endpoint not found (404)');
        } else {
          console.error(`Error: ${error.response.status} - ${error.response.data?.message || 'Something went wrong'}`);
        }
      } else {
        console.error('Unexpected error during meal creation:', error);
      }
      throw error; // Re-throw the error so it can be caught in handleSubmit
    }
  };

export const updateMeal = async (mealId: string, mealData: Partial<MealPayload>) => {
  try {
    const response = await apiClient.put(`/meals/${mealId}`, mealData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMeal = async (mealId: string) => {
  try {
    const response = await apiClient.delete(`/meals/${mealId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Analyze meal description using AI (if backend supports this)
export const analyzeMealDescription = async (description: string) => {
  try {
    const response = await apiClient.post('/meals/analyze', { description });
    return response.data;
  } catch (error) {
    throw error;
  }
};
