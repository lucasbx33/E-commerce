import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data.orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error.message);
    throw error;
  }
};

export const createOrder = async (orderLines) => {
  try {
    const response = await apiClient.post(
      '/orders',
      { orderLines },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('Erreur lors de la commande :', err.message);
    throw err;
  }
};

export const fetchOrderPdf = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du PDF de commande :', error.message);
    throw error;
  }
};

export default {
  fetchOrders,
  fetchOrderPdf,
};
