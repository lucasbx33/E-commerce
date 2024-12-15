import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const fetchUserProfile = async () => {
  try {
    const response = await axios.post(`${API_URL}/me`, {}, { withCredentials: true });
    return response.data.user;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur :', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    await axios.put(
      `${API_URL}/update`,
      userData,
      { withCredentials: true }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations utilisateur :', error);
    throw error;
  }
};
