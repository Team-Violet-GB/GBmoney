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
    component: () => import('./views/Feed.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
