import axios from 'axios';
import { BASE_URL } from '../config/constants';

export const getBowls = async () => {
  const res = await axios.get(`${BASE_URL}/bowls`);
  return res.data;
};

export const syncFavorite = async (userId, bowlId) => {
  return axios.post(`${BASE_URL}/favorites`, { userId, bowlId });
};
