<template>
  <div class=" p-12 rounded-lg mb-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Filtre par catégorie -->
      <div>
        <label for="category" class="block text-gray-700 font-medium mb-2">Catégorie</label>
        <select
          id="category"
          v-model="filters.category"
          @change="onFilterChange"
          class="border border-gray-300 rounded-lg px-4 py-2 w-full"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="category" class="block text-gray-700 font-medium mb-2">Prix :</label>
        <a-slider
          v-model:value="filters.priceRange"
          range
          :min="10"
          :max="100"
          :marks="{
            10: '10€',
            100: '100€'
          }"
          @afterChange="onFilterChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryFilter',
  props: {
    tags: [],
    categories: {
      type: Array,
      required: true,
    },
    initialFilters: {
      type: Object,
      default: () => ({
        category: '',
        priceMin: null,
        priceMax: null,
        name: '',
      }),
    },
  },
  data() {
    return {
      filters: { ...this.initialFilters, priceRange: [10, 100] },
    };
  },
  methods: {
    onFilterChange() {
      this.$emit('filter', {
        ...this.filters,
        priceMin: this.filters.priceRange[0],
        priceMax: this.filters.priceRange[1],
      });
    },
  },
};
</script>

<style scoped>
/* Ajout de styles spécifiques si nécessaire */
</style>
