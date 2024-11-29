<template>
    <div class="container mx-auto p-6">
      <h1 class="text-4xl font-bold mb-8 text-gray-800 text-center">🛍️ Mes Commandes</h1>
  
      <div v-if="orders.length === 0" class="text-center text-gray-600 mt-12">
        <p class="text-lg">Vous n'avez pas encore passé de commande.</p>
        <router-link
          to="/"
          class="mt-6 inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-500 transition shadow-md"
        >
          🛒 Retour à la boutique
        </router-link>
      </div>
  
      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(order, index) in orders"
          :key="index"
          class="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition relative"
        >
          <h2 class="text-xl font-bold mb-2 text-gray-800">Commande #{{ order.id }}</h2>
          <p class="text-sm text-gray-500 mb-2">Passée le : {{ new Date(order.createdAt).toLocaleDateString() }}</p>
          <p class="text-sm text-gray-500 mb-4">Statut : <span class="font-semibold capitalize">{{ order.status }}</span></p>
          
          <h3 class="text-lg font-semibold mb-3 text-gray-800">Résumé :</h3>
          <div class="text-sm text-gray-600 mb-4">
            <p>Total : <span class="font-semibold">{{ order.totalPrice }} €</span></p>
            <p>Articles : {{ order.orderLines.length }}</p>
          </div>
  
          <div class="text-sm text-gray-800">
            <h4 class="font-medium mb-2">Articles commandés :</h4>
            <ul>
              <li
                v-for="line in order.orderLines"
                :key="line.id"
                class="flex justify-between items-center border-b border-gray-200 pb-2 mb-2"
              >
                <span class="truncate w-1/2">{{ line.article.name }}</span>
                <span class="text-gray-500">x{{ line.quantity }}</span>
                <span class="font-semibold">{{ line.lineTotal }} €</span>
              </li>
            </ul>
          </div>
  
          <button
            @click="downloadOrderPdf(order.id)"
            class="absolute top-4 right-4 text-gray-700 hover:text-blue-600 transition"
            >
            <PrinterOutlined class="text-xl" />
        </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { PrinterOutlined } from '@ant-design/icons-vue';
  
  export default {
    name: 'OrdersVue',
    components: {
      PrinterOutlined,
    },
    data() {
      return {
        orders: [],
      };
    },
    async mounted() {
      try {
        const response = await axios.get('http://localhost:3000/orders', {
          withCredentials: true,
        });
        this.orders = response.data.orders;
      } catch (err) {
        console.error('Erreur lors de la récupération des commandes :', err.message);
        alert('Une erreur est survenue lors de la récupération des commandes.');
      }
    },
    methods: {
      printOrder(order) {
        console.log('Printing order:', order);
        alert(`Impression du bon de commande pour la commande #${order.id}`);
      },
      async downloadOrderPdf(orderId) {
    try {
      const response = await axios.get(`http://localhost:3000/orders/${orderId}/pdf`, {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `commande-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erreur lors du téléchargement du PDF :', err.message);
      alert('Une erreur est survenue lors du téléchargement du bon de commande.');
    }
  },
    },
  };
  </script>
  