<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Créer un compte</h2>

      <div v-if="errorMessage" class="text-red-500 text-center mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            v-model="firstName"
            type="text"
            id="firstName"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Votre prénom"
            required
          />
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            v-model="lastName"
            type="text"
            id="lastName"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Votre nom"
            required
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="text"
            id="email"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmez le mot de passe</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            S'inscrire
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">Vous avez déjà un compte ?
          <router-link to="/login" class="text-blue-600 hover:underline">
            Connectez-vous
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/services/auth';

export default {
  name: 'RegisterComponent',
  data() {
    return {
      firstName: '',
      lastName: '', 
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      this.errorMessage = '';

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas.';
        return;
      }

      try {
        const response = await register(this.email, this.password, this.firstName, this.lastName);

        if (response.message === 'User already exists') {
          this.errorMessage = 'Ce nom d\'utilisateur est déjà pris.';
        } else {
          this.$router.push('/login');
        }
      } catch (error) {
        this.errorMessage = error.message || 'Une erreur est survenue, veuillez réessayer.';
      }
    },
  },
};
</script>
