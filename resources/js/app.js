require('./bootstrap');
window.Vue = require('vue');

import App from './components/App'
import router from './router'
import VueRouter from 'vue-router'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import store from './store'

Vue.use(VueRouter)
Vue.use(ElementUI, { locale })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
