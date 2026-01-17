import { createRouter, createWebHashHistory } from 'vue-router'
// pridaný lazy-loading namiesto eager loading/importu


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogPage.vue'),
      props: true,
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryPage.vue'),
    },
    {
      path: '/reader/:bookId?',
      name: 'reader',
      component: () => import('../views/ReaderPage.vue'),
      props: true,
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartPage.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/TemporaryPage.vue'),
    },
  ]
})

export default router
