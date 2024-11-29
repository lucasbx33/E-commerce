import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import RegisterComponent from './views/Register.vue';
import Login from './views/Login.vue';
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
    meta: { requiresAuth: true }
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
        next();
      } catch (error) {
        next('/login');
      }
    } else {
      next();
    }
  } else {
    next();
  }
});




export default router;
