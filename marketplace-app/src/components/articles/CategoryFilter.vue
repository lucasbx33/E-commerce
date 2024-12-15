<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-col lg:flex-row w-full">
      <aside class="bg-white p-6 rounded-lg w-full lg:w-full flex-shrink-0">
        <h2 class="text-xl font-bold mb-6">Filtres :</h2>
        <div class="space-y-6">
          <div class="flex flex-col">
            <label class="text-gray-700 font-medium mb-2">Catégories :</label>
            <div class="space-y-2">
              <div
                v-for="category in localCategories"
                :key="category.id"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :id="'category-' + category.id"
                  :value="category.id"
                  v-model="filters.selectedCategories"
                  @change="onFilterChange"
                  class="mr-2"
                />
                
                <label :for="'category-' + category.id" class="text-gray-700 flex-1">
                  {{ category.name }}
                </label>
                <button
                  v-if="isAdmin"
                  @click="deleteTagById(category.id)"
                  class="text-red-600 hover:text-red-800 transition ml-4"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <div v-if="isAdmin" class="flex flex-col mt-4">
            <label class="text-gray-700 font-medium mb-2">Ajouter une catégorie :</label>
            <div class="flex space-x-4">
              <input
                type="text"
                v-model="newTagName"
                placeholder="Nom du tag"
                class="border border-gray-300 rounded-lg px-4 py-2 flex-1"
              />
              <button
                @click="createNewTag"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="priceRange" class="text-gray-700 font-medium mb-2">Prix :</label>
            <a-slider
              v-model:value="filters.priceRange"
              range
              :min="10"
              :max="10000"
              :marks="{
                10: '10€',
                10000: '10000€'
              }"
              @afterChange="onFilterChange"
              class="w-full"
            />
          </div>

          <div class="flex flex-col">
            <label for="name" class="text-gray-700 font-medium mb-2">Nom de l'article :</label>
            <input
              id="name"
              type="text"
              v-model="filters.name"
              @blur="onFilterChange"
              placeholder="Rechercher un article"
              class="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { getTags, deleteTag, createTag } from '@/services/tags';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'CategoryFilter',
  props: {
    categories: {
      type: Array,
      required: true,
    },
    initialFilters: {
      type: Object,
      default: () => ({
        selectedCategories: [],
        priceMin: null,
        priceMax: null,
        name: '',
      }),
    },
  },

  setup() {
    const authStore = useAuthStore();
    
    return {
      authStore,
    };
  },

  data() {
    return {
      localCategories: [],
      filters: { ...this.initialFilters, priceRange: [10, 10000] },
      newTagName: '',
    };
  },
  methods: {
    async fetchUserTags() {
      try {
        this.localCategories = await getTags();
      } catch (error) {
        console.error('Erreur lors de la récupération des tags :', error);
      }
    },
    onFilterChange() {
      this.$emit('filter', {
        ...this.filters,
        priceMin: this.filters.priceRange[0],
        priceMax: this.filters.priceRange[1],
      });
    },
    async deleteTagById(tagId) {
      try {
        await deleteTag(tagId);
        this.localCategories = this.localCategories.filter((tag) => tag.id !== tagId);
        this.filters.selectedCategories = this.filters.selectedCategories.filter(
          (id) => id !== tagId
        );
      } catch (error) {
        console.error('Erreur lors de la suppression du tag :', error);
      }
    },
    async createNewTag() {
      if (!this.newTagName.trim()) return;
      try {
        const newTag = await createTag(this.newTagName.trim());
        this.localCategories.push(newTag);
        this.newTagName = '';
      } catch (error) {
        console.error('Erreur lors de la création du tag :', error);
      }
    },
  },
  computed: {
    isAdmin() {
      return this.authStore.isAdmin;
    },
  },
  mounted() {
    this.fetchUserTags();
  },
};
</script>
