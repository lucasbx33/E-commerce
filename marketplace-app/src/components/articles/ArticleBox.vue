<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto">
      <!-- Section des filtres -->
      <CategoryFilter
        :categories="categories"
        :initialFilters="filters"
        @filter="updateFilters"
      />

      <!-- Section des produits -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <router-link :to="{ name: 'ArticleDetails', params: { id: product.id } }">
            <img
              :src="'data:image/jpeg;base64,' + product.image"
              :alt="product.name"
              class="w-full h-48 object-cover rounded-t-lg cursor-pointer"
            />
          </router-link>
          <div class="p-6">
            <router-link :to="{ name: 'ArticleDetails', params: { id: product.id } }">
              <h3 class="text-xl font-bold mb-4 cursor-pointer">{{ product.name }}</h3>
              <p class="text-gray-600 mb-4">{{ product.description }}</p>
              <div class="text-lg font-semibold text-gray-600 mb-4">{{ product.price }} €</div>
            </router-link>
            <button
              @click="addToCart(product)"
              class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300 w-full"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CategoryFilter from '@/components/articles/CategoryFilter.vue';
import { useCartStore } from '../../stores/cartStore';

export default {
  name: 'ArticleBox',
  components: { CategoryFilter },
  data() {
    return {
      categories: [],
      products: [],
      filters: {
        category: '',
        priceMin: null,
        priceMax: null,
        name: '',
      },
    };
  },
  methods: {
    async fetchTags() {
      try {
        const response = await axios.get('http://localhost:3000/auth/tags',);
        this.categories = response.data.map(tag => tag.name);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
      }
    },

    async fetchProducts() {
      try {
        const response = await axios.post('http://localhost:3000/auth/get_articles', this.filters,);
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
    this.fetchTags();
  },
};
</script>
