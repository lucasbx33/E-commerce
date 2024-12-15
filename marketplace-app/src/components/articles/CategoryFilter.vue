<template>
  <div class="flex flex-col lg:flex-row h-[400px]">
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
                :checked="checkboxStates[category.id]"
                @change="toggleCategory(category.id)"
                class="mr-2"
              />
              <label :for="'category-' + category.id" class="text-gray-700 flex-1">
                {{ category.name }}
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-col">
          <label for="priceRange" class="text-gray-700 font-medium mb-2">Prix :</label>
          <a-slider
            v-model:value="filters.priceRange"
            range
            :min="-1"
            :max="200"
            :marks="{ 0: '0€', 200: '200€' }"
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
</template>

<script>
import { getTags } from '@/services/tags';

export default {
  name: 'CategoryFilter',
  props: {
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
  data() {
    return {
      localCategories: [],
      filters: { ...this.initialFilters, priceRange: [10, 10000] },
      checkboxStates: {},
    };
  },
  methods: {
    async fetchUserTags() {
      try {
        this.localCategories = await getTags();
        this.checkboxStates = this.localCategories.reduce((states, category) => {
          states[category.id] = this.filters.selectedCategories.includes(category.id);
          return states;
        }, {});
      } catch (error) {
        console.error('Erreur lors de la récupération des tags :', error);
      }
    },
    toggleCategory(categoryId) {
      const index = this.filters.selectedCategories.indexOf(categoryId);
      if (index === -1) {
        this.filters.selectedCategories.push(categoryId);
      } else {
        this.filters.selectedCategories.splice(index, 1);
      }
      this.onFilterChange();
    },
    onFilterChange() {
      this.$emit('filter', {
        ...this.filters,
        priceMin: this.filters.priceRange[0],
        priceMax: this.filters.priceRange[1],
      });
    },
  },
  mounted() {
    this.fetchUserTags();
  },
};
</script>
