<template>
  <header class="bg-white shadow-lg sticky top-0 w-full z-50">
    <nav class="container mx-auto flex justify-between items-center p-2">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <a href="/" class="flex items-center">
          <img src="../assets/logo.png" class="w-16 h-16" alt="Logo" />
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
            <a v-if="!isAdmin" href="#account" class="block px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
              Mon espace
            </a>
          </li>
          <li v-if="isAdmin">
            <a href="/createArticle" class="block px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
              Créer un article
            </a>
          </li>
          <li>
            <a href="#contact" class="block px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium">
              Nous contacter
            </a>
          </li>
          <!-- Panier visible uniquement sur mobile -->
          <li v-if="!isAdmin" class="lg:hidden">
            <button
              @click="$router.push('/cart')"
              class="flex items-center px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3h2l.36 2M6 15h12l1.24-7.5H7.76L6 15z"
                />
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="17" cy="21" r="1.5" />
              </svg>
              Panier
              <span
                v-if="cartStore.cartCount > 0"
                class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-1"
              >
                {{ cartStore.cartCount }}
              </span>
            </button>
          </li>
          <!-- Connexion visible uniquement sur mobile -->
          <li v-if="!isLoggedIn" class="lg:hidden">
            <button
              @click="$router.push('/login')"
              class="block px-6 py-4 text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
            >
              Connexion
            </button>
          </li>
        </ul>
      </div>

      <!-- Profil, Panier et Connexion visibles uniquement sur desktop -->
      <div class="hidden lg:flex items-center space-x-6">
        <!-- Connexion sur desktop -->
        <button
          v-if="!isLoggedIn"
          @click="$router.push('/login')"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 shadow"
        >
          Connexion
        </button>

        <!-- Panier sur desktop -->
        <div class="relative" v-if="!isAdmin">
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
    const mobileMenuOpen = ref(false);
    const dropdownOpen = ref(false);

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const logout = async () => {
      await authStore.logout();
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
    isAdmin() {
      return this.authStore.isAdmin;
    },
    userName() {
      return this.authStore.user ? this.authStore.user.username : 'Utilisateur';
    },
  },
};
</script>
