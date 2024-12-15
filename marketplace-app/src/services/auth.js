import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const register = async (email, password, firstName, lastName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      firstName,
      lastName, 
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};