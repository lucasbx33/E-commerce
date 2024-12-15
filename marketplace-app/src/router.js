import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import RegisterComponent from './components/auth/RegisterComponent.vue';
import Login from './components/auth/LoginComponent.vue';
import Profile from './views/Profil.vue';
import { useAuthStore } from './stores/auth';
import CreateArticle from './views/CreateArticle.vue';
import ArticleDetails from './views/ArticleDetails.vue';
import Cart from './views/Cart.vue';
import Orders from './views/Orders.vue';
import TestThree from './views/testThree.vue';

const routes = [
  { path: '/', 
    component: Home,
    name: 'home'
  },
  { path: '/login', component: Login },
  {
    path: '/profil',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    component: RegisterComponent,
  },
  {
    path: '/createArticle',
    component: CreateArticle,
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
  },
  {
    path: '/cart',
    component: Cart,
  },
  {
    path: '/article/:id',
    name: 'ArticleDetails',
    component: ArticleDetails,
    props: true,
  },
  { 
    path: '/orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/3D',
    component: TestThree
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      try {
        await authStore.validateToken();
        if (!authStore.isAuthenticated) {
          throw new Error('User not authenticated');
        }
      } catch (error) {
        return next('/login');
      }
    }

    if (to.meta.roles) {
      const userHasRole = to.meta.roles.some((role) => authStore.hasRole(role));
      if (!userHasRole) {
        return next('/');
      }
    }

    next();
  } else {
    next();
  }
});

export default router;
