import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

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
        console.error('Token validation failed', error);
        this.logout();
      }
    },

    async register(email, password) {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', { email, password }, { withCredentials: true });
        return response.data; 
      } catch (error) {
        return error.response.data; 
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

    async logout() {
      const router = useRouter();

      try {
        await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });

        this.user = null;

        router.push('/login');
      } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
      }
    },
  },

  getters: {
    isAuthenticated: (state) => {
      //console.log('isAuthenticated:', !!state.user);
      return !!state.user;
    }
  }
});
