import axios from 'axios';
import { SPOON_API_KEY, SPOON_BASE_URL } from '../config/constants';
import localData from './localData.json';

// get recipe info from api
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

// get different image for each meal
const getUniqueImage = (mealName, mealId, index) => {
  // list of image ids from unsplash
  const foodImageIds = [
    '1576045057995-568f588f82fb',
    '1512621776951-a57141f2eefd',
    '1546069901-ba9599a7e63c',
    '1579584425555-c3ce17fd4351',
    '1626700051175-6818013e1d4f',
    '1570197788417-0e82375c9371',
    '1555939594-58d7cb561ad1',
    '1540189549336-e6e99c3679fe',
    '1565299624946-b28f40a0ae38',
    '1567620905732-2d1ec7ab7445',
    '1579952363873-27f3bade9f55',
    '1556910096-6f5ce2a77e1a',
    '1563379091339-032b63ace614',
    '1574071318508-1cdbab80d002',
    '1565299507177-b0ac202638a8',
    '1571091718767-18b5b1457add',
    '1563379091339-032b63ace614',
    '1576045057995-568f588f82fb',
    '1540189549336-e6e99c3679fe',
    '1626700051175-6818013e1d4f',
    '1555939594-58d7cb561ad1',
    '1512621776951-a57141f2eefd',
    '1546069901-ba9599a7e63c',
    '1579584425555-c3ce17fd4351',
    '1565299624946-b28f40a0ae38',
  ];

  // pick image based on meal id
  const imageIndex = (mealId - 1) % foodImageIds.length;
  const photoId = foodImageIds[imageIndex];

  return `https://images.unsplash.com/photo-${photoId}?w=400&h=400&fit=crop&auto=format`;
};

// get bowls from api
export const getBowls = async () => {
  try {
    // get 25 recipes
    const searchResponse = await axios.get(`${SPOON_BASE_URL}/recipes/complexSearch`, {
      params: {
        query: 'bowl',
        number: 25,
        apiKey: SPOON_API_KEY,
      },
    });

    const recipes = searchResponse.data.results;

    // get details for each recipe to get ingredients
    const recipeDetailsPromises = recipes.map((recipe) => getRecipeDetails(recipe.id));
    const recipeDetails = await Promise.all(recipeDetailsPromises);

    // format the data
    const formattedResults = recipes.map((item, index) => {
      const details = recipeDetails[index];
      // get ingredient names
      const ingredients = details?.extendedIngredients
        ? details.extendedIngredients.map((ing) => ing.name || ing.originalName).filter(Boolean)
        : [];

      const uniqueImage = getUniqueImage(item.title, item.id, index);

      return {
        id: item.id,
        name: item.title,
        image: uniqueImage,
        ingredients: ingredients,
        description: details?.summary
          ? details.summary.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
          : null,
      };
    });

    // remove duplicates
    return formattedResults.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );
  } catch (error) {
    // if api fails, use local data
    if (error.response?.status === 402) {
      console.log('API quota exceeded. Using local data with 25 meals...');
    } else {
      console.error('Error fetching data from Spoonacular:', error.message);
      console.log('Falling back to local data...');
    }
    return localData.bowls.map((bowl, index) => ({
      id: bowl.id,
      name: bowl.name,
      image: bowl.image || getUniqueImage(bowl.name, bowl.id, index),
      ingredients: bowl.ingredients || [],
      description: bowl.description || null,
    }));
  }
};
