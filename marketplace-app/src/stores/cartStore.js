import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart')) || [],
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
      this.saveCart();
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.saveCart();
    },
    removeItemById(id) {
      const index = this.cart.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.cart.splice(index, 1);
        this.saveCart();
      }
    },
    clearCart() {
      this.cart = [];
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    groupCart() {
      const grouped = this.cart.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          acc.push({ ...item, quantity: 1 });
        }
        return acc;
      }, []);
      return grouped;
    },
  },
});
