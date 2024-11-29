<template>
  <div class="w-full bg-gray-100 py-8 px-4 md:px-12 mb-8">
    <!-- Conteneur centré -->
    <div class="flex flex-col items-center space-y-8">
      <!-- Conteneur des filtres -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-y-12 gap-x-16 w-full max-w-4xl">
        <!-- Filtre par catégorie -->
        <div class="flex flex-col items-center space-y-4">
          <label for="category" class="text-gray-700 font-medium">Catégorie</label>
          <select
            id="category"
            v-model="filters.category"
            @change="onFilterChange"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Filtre par prix -->
        <div class="flex flex-col items-center space-y-4">
          <label for="priceRange" class="text-gray-700 font-medium">Prix</label>
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
            class="w-full max-w-xs"
          />
        </div>

        <!-- Filtre par nom -->
        <div class="flex flex-col items-center space-y-4">
          <label for="name" class="text-gray-700 font-medium">Nom de l'article</label>
          <input
            id="name"
            type="text"
            v-model="filters.name"
            @blur="onFilterChange"
            placeholder="Rechercher un article"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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