// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/browse' },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('@/views/BrowsePage.vue')
    },
    {
      path: '/item/:id',
      name: 'item-detail',
      component: () => import('@/views/ItemDetailPage.vue')
    },
    {
      path: '/list-item',
      name: 'list-item',
      component: () => import('@/views/ListItemPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/request-rental/:id',
      name: 'request-rental',
      component: () => import('@/views/RequestRentalPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/:id',
      name: 'user-profile',
      component: () => import('@/views/ProfilePage.vue')
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/MessagesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/messages/:id',
      name: 'message-detail',
      component: () => import('@/views/MessagesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/rentals',
      name: 'rentals',
      component: () => import('@/views/RentalsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue')
    }
  ]
})

/* Firebase Auth Guard */
let isAuthReady = false

router.beforeEach((to, from, next) => {
  if (!isAuthReady) {
    onAuthStateChanged(auth, (user) => {
      isAuthReady = true
      proceedNavigation(to, from, next, user)
    })
  } else {
    proceedNavigation(to, from, next, auth.currentUser)
  }
})

function proceedNavigation(to, from, next, user) {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth && !user) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (requiresAdmin && !user?.isAdmin) {
    next('/browse')
  } else if (to.path === '/login' && user) {
    next('/browse')
  } else {
    next()
  }
}

export default router
