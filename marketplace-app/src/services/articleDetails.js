import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchArticleDetails = async (id) => {
  try {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'article :", error.message);
    throw error;
  }
};

export const updateArticle = async (id, updatedFields) => {
  try {
    await apiClient.put(`/articles/${id}`, updatedFields);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article :", error.message);
    throw error;
  }
};

export default {
  fetchArticleDetails,
  updateArticle,
};
