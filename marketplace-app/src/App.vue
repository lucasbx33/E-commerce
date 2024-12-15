<script>
import AppFooter from './components/Footer.vue';
import AppHeader from './components/Header.vue';
import { useAuthStore } from './stores/auth.js';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      showHeader: true, // Toujours afficher le header
    };
  },
  setup() {
    const route = useRoute();
    return {
      route,
    };
  },
  async mounted() {
    const authStore = useAuthStore();
    await authStore.validateToken();

    this.checkRoute();
  },
  methods: {
    checkRoute() {
      this.showHeader = true;
    },
  },
};
</script>

<template>
  <div id="app" class="flex flex-col min-h-screen">
    <AppHeader v-if="showHeader" />
    <main class="flex-grow">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
