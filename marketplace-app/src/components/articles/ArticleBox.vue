<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="bg-gray-100 w-full py-4">
      <!-- Section des filtres -->
      <CategoryFilter
        :categories="categories"
        :initialFilters="filters"
        @filter="updateFilters"
      />
    </div>

    <div class="container mx-auto mt-4">
      <!-- Section des produits -->
      <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <p class="text-gray-600 mb-4 line-clamp-3">{{ product.description }}</p>
              <div class="text-lg font-semibold text-gray-700 mb-4">{{ product.price }} €</div>
            </router-link>
            <button
              @click="addToCart(product)"
              class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300 w-full flex items-center justify-center"
            >
              <ShoppingCartOutlined class="mr-2" />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-600 text-lg font-semibold mt-8">
        Aucun article est disponible pour le moment.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CategoryFilter from '@/components/articles/CategoryFilter.vue';
import { useCartStore } from '../../stores/cartStore';
import { ShoppingCartOutlined } from '@ant-design/icons-vue';

export default {
  name: 'ArticleBox',
  components: {
    CategoryFilter,
    ShoppingCartOutlined,
  },
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
        const response = await axios.get('http://localhost:3000/tags');
        this.categories = response.data.map((tag) => tag.name);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    },

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
    this.fetchTags();
  },
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* For WebKit */
  -webkit-box-orient: vertical;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1em * 3); /* Approximation for 3 lines */
  line-height: 1.5; /* Adjust this to match your font's line height */
}
</style>
