import { createRouter, createWebHistory } from 'vue-router'

import FontsView from '@/views/FontsView.vue'
import ColorsView from '@/views/ColorsView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/fonts',
      name: 'Fonts',
      component: FontsView,
    },
    {
      path: '/colors',
      name: 'Colors',
      component: ColorsView,
    },
  ],
})

export default router
