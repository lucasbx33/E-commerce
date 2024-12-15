<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold mb-8 text-gray-800">Votre Panier</h1>

    <div v-if="cartStore.cart.length === 0" class="text-center text-gray-600">
      <p>Votre panier est vide.</p>
      <router-link
        to="/"
        class="mt-4 inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
      >
        Retour à la boutique
      </router-link>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="col-span-2">
          <CartItemList
            :groupedCart="groupedCart"
            @remove-item="removeGroupedItem"
          />
        </div>
        <CartSummary
          :totalItems="cartStore.cart.length"
          :total="cartStore.total"
          :isLoggedIn="isLoggedIn"
          @pay="pay"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/auth';
import { createOrder } from '@/services/orders';
import CartItemList from '../components/cart/cartItemList.vue';
import CartSummary from '../components/cart/cartSummary.vue';

export default {
  name: 'CartVue',
  components: {
    CartItemList,
    CartSummary,
  },
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    cartStore.loadCart();

    const groupedCart = cartStore.groupCart();

    return {
      cartStore,
      authStore,
      groupedCart,
    };
  },
  computed: {
    isLoggedIn() {
      return this.authStore.isAuthenticated;
    },
  },
  methods: {
    async pay() {
      try {
        const orderLines = this.groupedCart.map((item) => ({
          articleId: item.id,
          quantity: item.quantity,
        }));

        const data = await createOrder(orderLines);

        this.$router.push('/orders');
        this.cartStore.clearCart();
        console.log(data);
      } catch (err) {
        alert('Une erreur est survenue lors de la commande.');
      }
    },
    removeGroupedItem(id) {
      this.cartStore.removeItemById(id);
    },
  },
};
</script>
