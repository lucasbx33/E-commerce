<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>

      <!-- Affichage du message d'erreur si les identifiants sont incorrects -->
      <div v-if="errorMessage" class="text-red-500 text-center mb-4">
        {{ errorMessage }}
      </div>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="login" class="space-y-6">
        <!-- Champ d'utilisateur -->
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

        <!-- Champ mot de passe -->
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

        <!-- Bouton de connexion -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Connexion
          </button>
        </div>
      </form>

      <!-- Lien vers la page d'inscription -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">Pas encore de compte ?
          <router-link to="/register" class="text-blue-600 hover:underline">
            Créez un compte
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  name :  'LoginComponent',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', 
    };
  },
  methods: {
    async login() {
    const authStore = useAuthStore();
    this.errorMessage = '';

    const response = await authStore.login(this.email, this.password);

    if (response.message === 'Invalid credentials') {
      this.errorMessage = 'Vos identifiants sont incorrects.';
    } else {
      this.$router.push('/');
    }
  }

  }
};
</script>
