import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/LandingPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/auth/:view?',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: { requiresAuth: false },
      props: route => ({ defaultView: route.params.view || 'login' })
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/AuthView.vue'),
      meta: { requiresAuth: false },
      props: { defaultView: 'register' }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/AuthView.vue'),
      meta: { requiresAuth: false },
      props: { defaultView: 'reset' }
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('@/views/BrowsePage.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/BrowsePage.vue'),
      meta: { requiresAuth: true }
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
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue')
    }
  ]
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const currentUser = auth.currentUser

  // Check if route requires authentication
  if (requiresAuth && !currentUser) {
    // Redirect to auth page
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath } // Save the location to redirect after login
    })
  } 
  // Check if route requires admin access
  else if (requiresAdmin && !currentUser?.isAdmin) {
    // Redirect to home if not admin
    next('/browse')
  } 
  // Redirect to browse if logged in user tries to access login/auth pages
  else if ((to.path === '/login' || to.path.startsWith('/auth')) && currentUser) {
    next('/browse')
  } 
  else {
    next()
  }
})

export default router