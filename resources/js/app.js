window.Vue = require('vue')
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Vuelidate)

import App from './components/App'

new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
