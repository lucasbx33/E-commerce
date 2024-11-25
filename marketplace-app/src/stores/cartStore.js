// stores/cartStore.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart')) || [], // Charger depuis localStorage
  }),
  getters: {
    cartCount: (state) => state.cart.length,
    total: (state) =>
      state.cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0).toFixed(2),
  },
  actions: {
    loadCart() {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cart = storedCart;
      },
    addToCart(item) {
      this.cart.push(item);
      this.saveCart(); // Sauvegarder après ajout
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.saveCart(); // Sauvegarder après suppression
    },
    clearCart() {
      this.cart = [];
      this.saveCart(); // Sauvegarder après vidage
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
  },
});
