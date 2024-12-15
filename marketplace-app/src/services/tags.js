import axios from 'axios';

const BASE_URL = 'http://localhost:3000/tags';

export const getTags = async () => {
  try {
    const response = await axios.get(BASE_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des tags :', error);
    throw error;
  }
};

export const deleteTag = async (tagId) => {
  try {
    await axios.delete(`${BASE_URL}/${tagId}`, { withCredentials: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du tag :', error);
    throw error;
  }
};

export const createTag = async (tagName) => {
  try {
    const response = await axios.post(BASE_URL, { name: tagName }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du tag :', error);
    throw error;
  }
};
