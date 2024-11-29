<template>
  <div class="container mx-auto p-6">
    <!-- Back link -->
    <div class="flex items-center mb-6">
      <router-link to="/" class="text-gray-700 underline pl-4">
        ← Retour à la liste
      </router-link>
    </div>

    <!-- Article details -->
    <div v-if="article" class="bg-white rounded-lg p-6 flex flex-col lg:flex-row gap-6">
      <!-- Image Slider -->
      <div class="lg:w-1/2">
        <div class="relative">
          <img
            :src="'data:image/jpeg;base64,' + article.images[currentImageIndex].base64"
            alt="Article image"
            class="w-full h-96 object-cover rounded-lg shadow"
          />
          <!-- Navigation buttons -->
          <button 
            @click="prevImage"
            class="absolute top-1/2 left-4 bg-white text-gray-600 rounded-full shadow-md p-2 focus:outline-none"
          >
            ◀
          </button>
          <button 
            @click="nextImage"
            class="absolute top-1/2 right-4 bg-white text-gray-600 rounded-full shadow-md p-2 focus:outline-none"
          >
            ▶
          </button>
        </div>
        <!-- Thumbnails -->
        <div class="flex mt-4 gap-2 overflow-x-auto">
          <img
            v-for="(image, index) in article.images"
            :key="image.id"
            :src="'data:image/jpeg;base64,' + image.base64"
            alt="Thumbnail"
            @click="currentImageIndex = index"
            :class="{
              'border-2 border-blue-500': currentImageIndex === index,
              'opacity-50': currentImageIndex !== index
            }"
            class="w-20 h-20 object-cover rounded-lg cursor-pointer shadow-md"
          />
        </div>
      </div>

      <!-- Article Info -->
      <div class="flex flex-col lg:w-1/2">
        <h1 class="text-4xl font-bold mb-4 text-gray-800">{{ article.name }}</h1>
        <p class="text-gray-600 mb-6 leading-relaxed">{{ article.description }}</p>
        <div class="text-2xl font-semibold text-blue-700 mb-4">
          {{ article.price }} €
        </div>
        <p class="text-gray-800 mb-4">
          Quantité en stock : 
          <span class="font-bold text-green-600">{{ article.stock }}</span>
        </p>
        <button 
          @click="addToCart" 
          class="bg-gray-600 text-white px-8 py-3 rounded-lg shadow hover:bg-gray-500 transition-all duration-300 focus:ring focus:ring-blue-300 focus:outline-none"
        >
          Ajouter au panier
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else>
      <p class="text-center text-gray-500">Chargement des détails de l'article...</p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'ArticleDetails',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      article: null,
      currentImageIndex: 0,
    };
  },
  methods: {
    async fetchArticleDetails() {
      try {
        const response = await axios.get(`http://localhost:3000/articles/${this.id}`);
        this.article = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'article :", error);
      }
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.article.images.length;
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.article.images.length) % this.article.images.length;
    },
    addToCart() {
      const cartStore = useCartStore();
      const item = {
        id: this.article.id,
        name: this.article.name,
        price: this.article.price,
      };
      cartStore.addToCart(item);
    },
  },
  mounted() {
    this.fetchArticleDetails();
  },
};
</script>
