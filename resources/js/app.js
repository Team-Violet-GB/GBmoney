require('./bootstrap');
window.Vue = require('vue');
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import 'element-ui/lib/theme-chalk/index.css'
import DarkTheme from 'element-theme-dark';

Vue.use(VueRouter);
Vue.use(ElementUI, { locale })
Vue.use(DarkTheme)

import App from './components/App'

new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
