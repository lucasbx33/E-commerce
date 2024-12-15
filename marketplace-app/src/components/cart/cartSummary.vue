<template>
    <div class="bg-gray-100 p-6 rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-4">Résumé</h2>
      <div class="flex justify-between mb-2">
        <span>Total articles</span>
        <span>{{ totalItems }}</span>
      </div>
      <div class="flex justify-between mb-6">
        <p>Total : {{ total }} €</p>
      </div>
      <div>
        <button
          v-if="isLoggedIn"
          @click="onPay"
          class="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 transition"
        >
          Payer maintenant
        </button>
        <button
          v-else
          @click="$router.push('/login')"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition"
        >
          Connexion requise pour payer
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CartSummary',
    props: {
      totalItems: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      isLoggedIn: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['pay'],
    methods: {
      onPay() {
        this.$emit('pay');
      },
    },
  };
  </script>
  