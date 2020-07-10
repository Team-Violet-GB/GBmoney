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
    path: '/auth',
    name: 'Auth',
    meta: { layout: 'empty' },
    component: () => import('./views/Auth.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
