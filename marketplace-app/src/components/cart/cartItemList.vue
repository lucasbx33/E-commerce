<template>
    <div>
      <div
        v-for="(item, index) in groupedCart"
        :key="index"
        class="flex items-center justify-between bg-white p-4 shadow rounded-lg mb-4"
      >
        <div class="flex">
          <h2 class="mr-8 text-xl"><strong>{{ item.name }}</strong></h2>
          <p class="text-xl"><strong>{{ item.price }} €</strong></p>
          <p class="text-lg text-gray-500 ml-4">x{{ item.quantity }}</p>
        </div>
        <button
          @click="$emit('remove-item', item.id)"
          class="text-red-600 hover:text-gray-700"
        >
          Supprimer
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CartItemList',
    props: {
      groupedCart: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  