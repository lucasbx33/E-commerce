<template>
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold mb-6">Créer un Article</h1>
      <form @submit.prevent="submitArticle">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 font-bold mb-2">Nom de l'article</label>
          <input
            type="text"
            id="name"
            v-model="article.name"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>
  
        <div class="mb-4">
          <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            id="description"
            v-model="article.description"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
          ></textarea>
        </div>
  
        <div class="mb-4">
          <label for="price" class="block text-gray-700 font-bold mb-2">Prix (€)</label>
          <input
            type="number"
            id="price"
            v-model="article.price"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>
  
        <div class="mb-4">
          <label for="stock" class="block text-gray-700 font-bold mb-2">Stock</label>
          <input
            type="number"
            id="stock"
            v-model="article.stock"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>
  
        <div class="mb-4">
          <label for="tags" class="block text-gray-700 font-bold mb-2">ID du Tag</label>
          <input
            type="text"
            id="tags"
            v-model="article.tags"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">Image Principale</label>
          <input
            type="file"
            @change="handleMainImage"
            accept="image/*"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">Images Supplémentaires</label>
          <input
            type="file"
            multiple
            @change="handleOtherImages"
            accept="image/*"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
  
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition duration-300"
        >
          Créer l'Article
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CreateArticle',
    data() {
      return {
        article: {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          tags: '',
        },
        mainImage: null, // Image principale
        otherImages: [], // Images supplémentaires
      };
    },
    methods: {
      handleMainImage(event) {
        this.mainImage = event.target.files[0];
      },
      handleOtherImages(event) {
        this.otherImages = Array.from(event.target.files);
      },
      async submitArticle() {
        try {
          const formData = new FormData();
  
          const tagsArray = this.article.tags
          .split(',') // Sépare les tags par des virgules
          .map(tag => tag.trim()) // Supprime les espaces
          .filter(tag => tag !== '') // Ignore les tags vides
          .map(tag => parseInt(tag, 10)); // Convertit en nombres

          formData.append('tags', JSON.stringify(tagsArray));

          // Ajouter les champs texte
          formData.append('name', this.article.name);
          formData.append('description', this.article.description);
          formData.append('price', this.article.price);
          formData.append('stock', this.article.stock);
  
          // Ajouter l'image principale
          if (this.mainImage) {
            formData.append('mainImage', this.mainImage);
          }
  
          this.otherImages.forEach((image) => {
            formData.append('otherImages', image);
          });
  
          await axios.post('http://localhost:3000/articles/create', formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          this.resetForm();
        } catch (error) {
          console.error('Erreur lors de la création de l\'article:', error);
          alert('Erreur lors de la création de l\'article');
        }
      },
      resetForm() {
        this.article = {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          tagsName: '',
        };
        this.mainImage = null;
        this.otherImages = [];
      },
    },
  };
  </script>