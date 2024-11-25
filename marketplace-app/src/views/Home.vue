<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Hero Section -->
    <div class="relative h-screen">
    <!-- Background Image -->
    <img 
      src="@/assets/home/boutique.png" 
      alt="Hero Background" 
      class="absolute inset-0 w-full h-full object-cover"
    />
    
    <!-- Hero Content with Blurred Background -->
    <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
      <div 
        class="relative p-8 rounded-lg" 
        style="backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.2);"
      >
        <h1 class="text-5xl font-bold mb-6 text-gray-700 font-titre_home">Bienvenue chez ECLORE</h1>
        <p class="text-lg mb-6 text-gray-700 font-titre_home">
          Découvrez nos produits exceptionnels à des prix incroyables
        </p>
      </div>
    </div>

    <!-- Scroll Indicator with "Voir les produits" -->
    <div class="absolute bottom-10 w-full flex justify-center">
      <a 
        @click.prevent="scrollToProducts"
        class="flex flex-col items-center text-white text-lg font-bold animate-bounce"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-8 w-8 mb-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </a>
    </div>
  </div>

    <!-- Products Section -->
    <div id="products" class="container mx-auto py-12">
      <h2 class="text-3xl font-bold text-center">Nos Produits</h2>
      <ArticleBox :products="products" />
    </div>

    <!-- Newsletter Section -->
    <div class="bg-gray-200 py-20">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">Restez informé</h2>
        <p class="text-lg mb-6">Inscrivez-vous à notre newsletter pour ne manquer aucune de nos offres spéciales !</p>
        <div class="flex justify-center">
          <input type="email" placeholder="Votre email" class="px-4 py-2 rounded-l-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <button class="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-500 transition duration-300">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleBox from '@/components/articles/ArticleBox.vue';

export default {
  name: 'HomeVue',
  components: {
    ArticleBox,
  },
  methods: {
    scrollToProducts() {
      const productsSection = document.querySelector('#products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },
};
</script>

<style scoped>
/* Ajout de styles pour ajuster la présentation si nécessaire */
</style>
