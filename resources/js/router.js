import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { layout: 'main' },
    component: () => import('./views/Home.vue')
  },
  {
    path: '/user',
    name: 'User',
    meta: { layout: 'main' },
    component: () => import('./views/User.vue')
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
    meta: { layout: 'main' },
    component: () => import('./views/FeedPage.vue')
  },
  {
    path: '/monthly-report',
    name: 'monthlyReport',
    meta: { layout: 'main' },
    component: () => import('./components/reports/MonthlyReport.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
