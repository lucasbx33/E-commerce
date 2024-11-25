<template>
  <header class="bg-white shadow-lg sticky top-0 w-full z-50">
    <nav class="container mx-auto flex justify-between items-center p-6">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <a href="/" class="flex items-center">
          <img src="../assets/logo.png" class="w-12 h-12" alt="Logo" />
          <p class="text-gray-900 font-bold text-2xl hover:text-gray-700">ECLORE</p>
        </a>
      </div>

      <!-- Menu Burger -->
      <button class="lg:hidden flex items-center text-gray-700" @click="toggleMobileMenu">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Navigation Links -->
      <div 
  class="absolute lg:static w-full bg-white lg:w-auto top-full left-0 lg:flex lg:space-x-8"
  :class="mobileMenuOpen ? 'block' : 'hidden lg:flex'"
  style="transition: max-height 0.3s ease-in-out;"
>
  <ul class="flex flex-col lg:flex-row">
    <li>
      <a href="/#products" class="block px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
        Nos produits
      </a>
    </li>
    <li>
      <a href="#account" class="block px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
        Mon espace
      </a>
    </li>
    <li>
      <a href="#contact" class="block px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
        Nous contacter
      </a>
    </li>
  </ul>
</div>


      <!-- Right Side -->
      <div class="hidden lg:flex items-center space-x-6">
        <!-- Panier -->
        <div class="relative">
          <button @click="$router.push('/cart')" class="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-gray-700 hover:text-blue-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3h2l.36 2M6 15h12l1.24-7.5H7.76L6 15z"
              />
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="17" cy="21" r="1.5" />
            </svg>
            <span
              v-if="cartStore.cartCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1"
            >
              {{ cartStore.cartCount }}
            </span>
          </button>
        </div>

        <!-- Profil -->
        <div v-if="isLoggedIn" class="relative">
          <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="Profil"
              class="w-10 h-10 rounded-full border-2 border-blue-600"
            />
            <span class="text-gray-700">{{ userName }}</span>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
            <router-link to="/profil" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Mon Profil
            </router-link>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <!-- Login Button -->
        <button
          v-if="!isLoggedIn"
          @click="$router.push('/login')"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 shadow"
        >
          Connexion
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'HeaderVue',
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const mobileMenuOpen = ref(false); // Ajout de la gestion de l'état du menu burger
    const dropdownOpen = ref(false);

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const logout = async () => {
      await authStore.logout();
      this.$router.push('/login');
    };

    return {
      authStore,
      cartStore,
      mobileMenuOpen,
      dropdownOpen,
      toggleMobileMenu,
      toggleDropdown,
      logout,
    };
  },
  computed: {
    isLoggedIn() {
      return this.authStore.isAuthenticated;
    },
    userName() {
      return this.authStore.user ? this.authStore.user.username : 'Utilisateur';
    },
  },
};
</script>
