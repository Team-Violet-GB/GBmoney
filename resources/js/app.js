window.Vue = require('vue')
import VueRouter from 'vue-router'
import router from './router'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from "./store"
import ScrollLoader from 'vue-scroll-loader'
import VueCharts from 'vue-chartjs'

Vue.use(VueRouter)
Vue.use(ElementUI, { locale })
Vue.use(VueAxios, axios)
Vue.use(ScrollLoader)
Vue.use(VueCharts)

import App from './components/App'

const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
