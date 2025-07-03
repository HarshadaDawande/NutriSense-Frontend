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
    const response = await axios.get(`http://localhost:8080/v1/meal/${userId}/meals`);
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
      const response = await axios.post(`http://localhost:8080/v1/meal/add`, mealData);
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
    // Use the default axios instance so it can be easily mocked in tests
    const response = await axios.delete(`${API_BASE_URL}/meal/${mealId}`);
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

/**
 * Calculate macros for a meal description using the LLM-powered endpoint.
 * This sends the meal description to the `/v1/llm/openrouter` endpoint and
 * returns the calculated macronutrients.
 */
export const calculateMacros = async (mealDescription: string) => {
  try {
    const payload = {
      model: 'deepseek/deepseek-chat:free',
      messages: [
        {
          role: 'system',
          content:
            'You are a nutrition expert. You are able to determine the nutritional breakdown of recipes provided to you with ease. You are going to be provided with a recipe that will be denoted by + characters, where the first + character will denote the start of the recipe, and the final + character will denote the end of the recipe. This recipe will contain ingredients with mismatched units (i.e. cups, grams, mililitres), and occasionally references terms like \'portions\'. Your job, as a nutrition expert, is to first convert all the measurements to the same unit (for example grams), and then to make your BEST approximation at the nutritional breakdown of each ingredient. Obtain the macros for the provided recipe, in terms of Protein, Carbs, Fats, and Calories. Where available, use the official nutritional information based on the brand provided.'
        },
        {
          role: 'system',
          content:
            'Your result should be formatted such that all the macros are summed together. That is, each macro has been added and only the total for each is provided. Additionally, they should be provided in json format. DO NOT PRINT YOUR REASONING. ONLY RETURN THE FINAL JSON RESULT. DO NOT PREFIX WITH \'json\'!'
        },
        {
          role: 'user',
          content: mealDescription
        }
      ]
    };
    console.log('Sending payload to API:', payload);
    const response = await axios.post('http://localhost:8080/v1/llm/openrouter', payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ------------------------------
// Macro-targets related API calls
// ------------------------------

import type { MacroTargets } from '../types';

/**
 * Get the saved macro targets for a user.
 * The backend is expected to expose GET /v1/targets/:userId which returns
 * an object matching the `MacroTargets` interface.
 */
export const getMacroTargets = async (userName: string): Promise<MacroTargets> => {
  try {
    const response = await apiClient.get(`/meal/${userName}/targets`);
    return response.data as MacroTargets;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching targets: ${error.response.status}`);
    }
    throw error;
  }
};
