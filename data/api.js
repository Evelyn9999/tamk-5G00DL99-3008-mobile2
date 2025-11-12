import axios from 'axios';
import { SPOON_API_KEY, SPOON_BASE_URL } from '../config/constants';
import localData from './localData.json';

// Fetch recipe details including ingredients
const getRecipeDetails = async (recipeId) => {
  try {
    const response = await axios.get(`${SPOON_BASE_URL}/recipes/${recipeId}/information`, {
      params: {
        apiKey: SPOON_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe ${recipeId} details:`, error.message);
    return null;
  }
};

// Get unique image for each meal
// Uses specific Unsplash photo IDs for reliable, high-quality food images
const getUniqueImage = (mealName, mealId, index) => {
  // Array of curated Unsplash photo IDs for food bowls
  // Each photo ID corresponds to a specific high-quality food image
  const foodImageIds = [
    '1576045057995-568f588f82fb', // Poke bowl
    '1512621776951-a57141f2eefd', // Buddha bowl
    '1546069901-ba9599a7e63c',    // Teriyaki/Asian bowl
    '1579584425555-c3ce17fd4351', // Sushi bowl
    '1626700051175-6818013e1d4f', // Burrito bowl
    '1570197788417-0e82375c9371', // Acai bowl
    '1555939594-58d7cb561ad1',    // Thai/Asian curry
    '1540189549336-e6e99c3679fe', // Salad bowl
    '1565299624946-b28f40a0ae38', // Grain bowl
    '1567620905732-2d1ec7ab7445', // Healthy bowl
    '1579952363873-27f3bade9f55', // Protein bowl
    '1556910096-6f5ce2a77e1a',    // Mediterranean
    '1563379091339-032b63ace614', // Vegan bowl
    '1574071318508-1cdbab80d002', // Quinoa bowl
    '1565299507177-b0ac202638a8', // Rice bowl
    '1571091718767-18b5b1457add', // Breakfast bowl
    '1563379091339-032b63ace614', // Veggie bowl
    '1576045057995-568f588f82fb', // Poke variation
    '1540189549336-e6e99c3679fe', // Salad variation
    '1626700051175-6818013e1d4f', // Burrito variation
    '1555939594-58d7cb561ad1',    // Asian variation
    '1512621776951-a57141f2eefd', // Buddha variation
    '1546069901-ba9599a7e63c',    // Teriyaki variation
    '1579584425555-c3ce17fd4351', // Sushi variation
    '1565299624946-b28f40a0ae38', // Grain variation
  ];

  // Use meal ID to select image (ensures consistency)
  const imageIndex = (mealId - 1) % foodImageIds.length;
  const photoId = foodImageIds[imageIndex];

  // Return direct Unsplash image URL with proper sizing
  return `https://images.unsplash.com/photo-${photoId}?w=400&h=400&fit=crop&auto=format`;
};

// Fetch healthy bowl-style meals with ingredients
export const getBowls = async () => {
  try {
    // Fetch more recipes - increased to 25
    const searchResponse = await axios.get(`${SPOON_BASE_URL}/recipes/complexSearch`, {
      params: {
        query: 'bowl',
        number: 25,       // fetch 25 results
        apiKey: SPOON_API_KEY,
      },
    });

    const recipes = searchResponse.data.results;

    // Fetch details for each recipe to get ingredients
    // Use Promise.all to fetch all recipes in parallel (faster)
    const recipeDetailsPromises = recipes.map((recipe) => getRecipeDetails(recipe.id));
    const recipeDetails = await Promise.all(recipeDetailsPromises);

    // Format data with ingredients and unique images
    const formattedResults = recipes.map((item, index) => {
      const details = recipeDetails[index];
      // Extract ingredient names from the extendedIngredients array
      const ingredients = details?.extendedIngredients
        ? details.extendedIngredients.map((ing) => ing.name || ing.originalName).filter(Boolean)
        : [];

      // Use unique image for each meal
      const uniqueImage = getUniqueImage(item.title, item.id, index);

      return {
        id: item.id,
        name: item.title,
        image: uniqueImage, // Use unique image instead of API image
        ingredients: ingredients,
        description: details?.summary
          ? details.summary.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
          : null,
      };
    });

    // Remove duplicates based on id
    return formattedResults.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );
  } catch (error) {
    // Handle API quota exceeded (402) or other errors
    if (error.response?.status === 402) {
      console.log('API quota exceeded. Using local data with 25 meals...');
    } else {
      console.error('Error fetching data from Spoonacular:', error.message);
      console.log('Falling back to local data...');
    }
    // Fallback to local data if API fails, with unique images
    return localData.bowls.map((bowl, index) => ({
      id: bowl.id,
      name: bowl.name,
      image: bowl.image || getUniqueImage(bowl.name, bowl.id, index),
      ingredients: bowl.ingredients || [],
      description: bowl.description || null,
    }));
  }
};
