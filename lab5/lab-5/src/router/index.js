import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SubjectView from '@/views/SubjectView.vue'

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
      component: () => import("@/views/FavoritesView.vue"),
    },
    {
      path: "/subject/:subjectKey",
      name: "subject",
      component: SubjectView,
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ],
})

export default router
