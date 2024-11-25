<template>
    <div class="container mx-auto p-6">
      <h1 class="text-4xl font-bold mb-8 text-gray-800">Votre Panier</h1>
  
      <!-- Si le panier est vide -->
      <div v-if="cartStore.cart.length === 0" class="text-center text-gray-600">
        <p>Votre panier est vide.</p>
        <router-link
          to="/"
          class="mt-4 inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
        >
          Retour à la boutique
        </router-link>
      </div>
  
      <!-- Si le panier contient des articles -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="col-span-2">
                <div
                    v-for="(item, index) in cartStore.cart"
                    :key="index"
                    class="flex items-center justify-between bg-white p-4 shadow rounded-lg mb-4"
                    >
                    <div class="flex">
                        <h2 class="mr-8 text-xl"><strong>{{ item.name }}</strong></h2>
                        <p class="text-xl"><strong>{{ item.price }} €</strong></p>
                    </div>
                    <button @click="cartStore.removeFromCart(index)" class="text-red-600 hover:text-gray-700">Supprimer</button>
                </div>
            </div>
            <div class="bg-gray-100 p-6 rounded-lg shadow">
                <h2 class="text-2xl font-semibold mb-4">Résumé</h2>
                <div class="flex justify-between mb-2">
                    <span>Total articles</span>
                    <span>{{ cartStore.cart.length }}</span>
                </div>
                <div class="flex justify-between mb-6">
                    <p>Total : {{ cartStore.total }} €</p>
                </div>
                <button
                @click="pay"
                class="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 transition"
                >
                Payer maintenant
                </button>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import { useCartStore } from '../stores/cartStore';
  
  export default {
    name: 'CartVue',
    setup() {
      const cartStore = useCartStore();
      cartStore.loadCart();
      return {
        cartStore,
      };
    },
    methods: {
      pay() {
        alert('Paiement fictif effectué ! Merci pour votre achat.');
        this.cartStore.clearCart();
      },
    },
  };
  </script>