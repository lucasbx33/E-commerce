<script>
import AppFooter from './components/Footer.vue';
import AppHeader from './components/Header.vue';
import { useAuthStore } from './stores/auth.js';
import { useRoute } from 'vue-router';
import { watch } from 'vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      showHeader: false,
    };
  },
  setup() {
    const route = useRoute(); // Appelé dans setup()
    return {
      route,
    };
  },
  async mounted() {
    const authStore = useAuthStore();
    await authStore.validateToken();

    // Vérifiez la route au montage
    this.checkRoute();

    // Ajoutez un watcher pour détecter les changements de route
    watch(
      () => this.route.path,
      () => {
        this.checkRoute();
      }
    );
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    checkRoute() {
      // Ajoutez ou retirez l'écouteur de scroll en fonction de la route
      if (this.route.path === '/') {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll(); // Mettre à jour immédiatement
      } else {
        window.removeEventListener('scroll', this.handleScroll);
        this.showHeader = true; // Toujours afficher le header sur d'autres pages
      }
    },
    handleScroll() {
      const scrollPosition = window.scrollY; 
      this.showHeader = scrollPosition > window.innerHeight;
    },
  },
};
</script>

<template>
  <div id="app" class="flex flex-col min-h-screen ">
    <!-- Affiche le header uniquement si showHeader est vrai -->
    <AppHeader v-if="showHeader" />
    <main class="flex-grow">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* Assure que le footer ne chevauche pas le contenu et reste en bas */
main {
  flex-grow: 1;
}
</style>
