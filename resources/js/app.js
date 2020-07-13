window.Vue = require('vue')
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from "./store"

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

import App from './components/App'

new Vue({
    router,
    render: h => h(App),
    store
}).$mount('#app')


