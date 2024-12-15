<template>
  <div class="space-y-4">
    <!-- Champ Titre -->
    <div class="mb-4">
      <label v-if="isEditing" class="block text-gray-700 font-medium">
        Titre :
      </label>
      <div v-if="!isEditing">
        <h1 class="text-4xl font-bold text-gray-800">{{ localFields.name }}</h1>
      </div>
      <div v-else>
        <input
          type="text"
          @input="updateField('name', $event.target.value)"
          v-model="localFields.name"
          class="text-4xl font-bold text-gray-800 border border-gray-300 rounded w-full p-2"
          placeholder="Titre de l'article"
        />
      </div>
    </div>

    <!-- Champ Prix -->
    <div class="mb-4">
      <label v-if="isEditing" class="block text-gray-700 font-medium">
        Prix (€) :
      </label>
      <div v-if="!isEditing">
        <p class="text-4xl font-semibold">{{ localFields.price }} €</p>
      </div>
      <div v-else>
        <input
          type="number"
          @input="updateField('price', $event.target.value)"
          v-model="localFields.price"
          class="text-2xl font-semibold border border-gray-300 rounded w-full p-2"
          placeholder="Prix"
        />
      </div>
    </div>

    <!-- Champ Stock -->
    <div class="mb-4">
      <label v-if="isEditing" class="block text-gray-700 font-medium">
        Quantité en stock :
      </label>
      <div v-if="!isEditing">
        <p class="text-gray-500">
          Quantité en stock : <span class="font-bold text-gray-600">{{ localFields.stock }}</span>
        </p>
      </div>
      <div v-else>
        <input
          type="number"
          @input="updateField('stock', $event.target.value)"
          v-model="localFields.stock"
          class="text-gray-800 border border-gray-300 rounded p-2 w-full"
          placeholder="Quantité en stock"
        />
      </div>
    </div>

    <!-- Champ Description -->
    <div class="mb-4">
      <label v-if="isEditing" class="block text-gray-700 font-medium">
        Description :
      </label>
      <div v-if="!isEditing">
        <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ localFields.description }}</p>
      </div>
      <div v-else>
        <textarea
          @input="updateField('description', $event.target.value)"
          v-model="localFields.description"
          class="text-gray-600 leading-relaxed border border-gray-300 rounded w-full p-2"
          placeholder="Description"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditableFields",
  props: {
    fields: {
      type: Object,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localFields: {},
    };
  },
  watch: {
    fields: {
      immediate: true,
      handler(newFields) {
        if (!this.localFields || Object.keys(this.localFields).length === 0) {
          this.localFields = { ...newFields };
        }
      },
    },
  },
  methods: {
    updateField(key, value) {
      this.localFields[key] = value;
      this.$emit("update:fields", { ...this.localFields });
    },
  },
};
</script>

