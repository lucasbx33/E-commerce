<template>
  <div class="min-h-screen flex flex-col">
    <!-- Conteneur principal -->
    <div class="container mx-auto flex flex-col lg:flex-row mt-8">
      <!-- Section des filtres -->
      <aside class="bg-white p-4 rounded-lg w-full lg:w-1/4 mb-8 lg:mb-0 mr-4">
        <CategoryFilter
          :categories="categories"
          :initialFilters="filters"
          @filter="updateFilters"
        />
      </aside>

      <!-- Section des produits -->
      <main class="flex-1">
        <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="product in products"
            :key="product.id"
            class="relative bg-white rounded-lg transition-transform duration-300 cursor-pointer hover:shadow-2xl hover:scale-105"
          >
            <router-link :to="{ name: 'ArticleDetails', params: { id: product.id } }">
              <img
                :src="'data:image/jpeg;base64,' + product.image"
                :alt="product.name"
                class="w-full h-60 object-contain rounded-t-lg"
              />
            </router-link>
            <div class="p-6">
              <router-link :to="{ name: 'ArticleDetails', params: { id: product.id } }">
                <h3 class="text-xl font-bold mb-4">{{ product.name }}</h3>
                <p class="text-gray-600 mb-4 line-clamp-3">{{ product.description }}</p>
                <div class="text-lg font-semibold text-gray-700 mb-4">{{ product.price }} €</div>
              </router-link>
              <button
                @click="addToCart(product)"
                class="absolute bottom-4 right-4 bg-[#ffd700] text-black p-3 rounded-full hover:bg-[#ffc107] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
              >
                <ShoppingCartOutlined />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-600 text-lg font-semibold mt-8">
          Aucun article n'est disponible pour le moment.
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CategoryFilter from '@/components/articles/CategoryFilter.vue';
import { useCartStore } from '../../stores/cartStore';
import { ShoppingCartOutlined } from '@ant-design/icons-vue';

export default {
  name: 'ArticlePage',
  components: {
    CategoryFilter,
    ShoppingCartOutlined,
  },
  data() {
    return {
      categories: [], // Remplir avec les catégories disponibles
      products: [], // Liste des produits
      filters: {
        category: '',
        priceMin: null,
        priceMax: null,
        name: '',
      },
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.post('http://localhost:3000/articles/get_articles', this.filters);
        this.products = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
      }
    },
    updateFilters(newFilters) {
      this.filters = newFilters;
      this.fetchProducts();
    },
    addToCart(product) {
      const cartStore = useCartStore();
      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
      };
      cartStore.addToCart(item);
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* For WebKit */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1em * 3); /* Approximation for 3 lines */
  line-height: 1.5; /* Adjust this to match your font's line height */
}

.grid > div {
  border: none; /* Remove border */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition */
}

.grid > div:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1); /* Shadow effect */
  transform: scale(1.05); /* Slight zoom effect */
}

@media (max-width: 640px) {
  .h-60 {
    height: 200px; /* Adjust for mobile */
  }
}
</style>
