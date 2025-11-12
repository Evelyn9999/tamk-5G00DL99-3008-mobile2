import axios from 'axios';
import { SPOON_API_KEY, SPOON_BASE_URL } from '../config/constants';

// Fetch healthy bowl-style meals
export const getBowls = async () => {
  try {
    const response = await axios.get(`${SPOON_BASE_URL}/recipes/complexSearch`, {
      params: {
        query: 'bowl',
        number: 10,       // fetch 10 results
        apiKey: SPOON_API_KEY,
      },
    });

    // Format data for app and remove duplicates
    const formattedResults = response.data.results.map((item) => ({
      id: item.id,
      name: item.title,
      image: item.image,
      ingredients: [],
    }));

    // Remove duplicates based on id
    return formattedResults.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );
  } catch (error) {
    console.error('Error fetching data from Spoonacular:', error.message);
    return [];
  }
};
