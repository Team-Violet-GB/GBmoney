import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: { layout: 'main', auth: true },
      component: () => import('./views/Home.vue')
    },
    {
      path: '/user',
      name: 'User',
      meta: { layout: 'main', auth: true },
      component: () => import('./views/User.vue')
    },
    {
      path: '/:type/:id',
      name: 'Point',
      meta: { layout: 'main', auth: true },
      component: () => import('./views/PointCharts.vue')
    },
    {
      path: '/login',
      name: 'Login',
      meta: { layout: 'empty' },
      component: () => import('./views/Login.vue')
    },
    {
      path: '/registration',
      name: 'Registration',
      meta: { layout: 'empty' },
      component: () => import('./views/Registration.vue')
    },
    {
      path: '/feed',
      name: 'Feed',
      meta: { layout: 'main', auth: true },
      component: () => import('./views/FeedPage.vue')
    },
    {
      path: '/monthly-report',
      name: 'monthlyReport',
      meta: { layout: 'main', auth: true },
      component: () => import('./views/MonthlyReport.vue')
    },
    {
      path: '/history',
      name: 'History',
      meta: { layout: 'main', auth: true },
      component: () => import('./components/history/History.vue')
    },

  ]
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('user-token')
  const requireAuth = to.matched.some(route => route.meta.auth)

  if (requireAuth && !isAuth) next('/login')
  else if (!requireAuth && isAuth) next('/')
  else next()
})

export default router
