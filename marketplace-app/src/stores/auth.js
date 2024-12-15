import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null, 
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', { email, password }, { withCredentials: true });
        this.user = response.data.user;
        this.token = response.data.token;
        return response.data; 
      } catch (error) {
        return error.response.data;
      }
    },

    async validateToken() {
      try {
        const response = await axios.get('http://localhost:3000/auth/validate', { withCredentials: true });
        this.user = response.data.user; 
        this.token = response.data.token;
      } catch (error) {
        console.error('Token validation failed:', error);
        this.logout();
      }
    },

    async logout() {
      try {
        await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
        this.user = null;
      } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
      }
    },

    async refreshToken() {
      try {
        const response = await axios.post('http://localhost:3000/auth/refresh-token', {}, { withCredentials: true });
        this.token = response.data.token;
      } catch (error) {
        console.error('Token refresh failed', error);
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    roles: (state) => state.user?.roles || [],

    hasRole: (state) => (role) => state.user?.roles.includes(role),
    isAdmin: (state) => state.user?.roles?.includes('ROLE_ADMIN') || false,
  },
});
