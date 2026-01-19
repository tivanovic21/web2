import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SubjectView from '@/views/SubjectView.vue'

// routing + svaka ruta je bookmarkable
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("@/views/FavoritesView.vue"), // lazy-load
    },
    {
      path: "/subject/:subjectKey",
      name: "subject",
      component: SubjectView,
      props: true
    },
    {
      // catch all - 404 not found
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue') // lazy-load
    }
  ],
})

export default router
