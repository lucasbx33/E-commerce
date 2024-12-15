<template>
  <div class="min-h-screen flex flex-col">
    <div class="container mx-auto flex flex-col lg:flex-row">
      <aside class="bg-white p-4 rounded-lg w-full lg:w-1/4 lg:mb-0 mr-4">
        <CategoryFilter :initialFilters="filters" @filter="updateFilters" />
      </aside>
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

export default {
  name: 'ArticlePage',
  components: {
    CategoryFilter,
  },
  data() {
    return {
      products: [],
      filters: {
        selectedCategories: [],
        priceMin: null,
        priceMax: null,
        name: '',
      },
    };
  },
  methods: {
    async fetchProducts() {
      const filtersToSend = {
        ...this.filters,
        category: this.filters.selectedCategories,
      };
      try {
        const response = await axios.post('http://localhost:3000/articles/get_articles', filtersToSend);
        this.products = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
      }
    },
    updateFilters(newFilters) {
      this.filters = { ...newFilters };
      this.fetchProducts();
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>
