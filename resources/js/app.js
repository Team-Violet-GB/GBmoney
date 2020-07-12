window.Vue = require('vue')
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(Vuex)

import App from './components/App'

const store = new Vuex.Store({
    state: {
        id: '',
        email: '',
    },
    mutations: {
        setUserData(state, userData) {
            state.id = userData.id;
            state.email = userData.email;
        },
    },
    actions: {
        setUserData({commit}) {
            axios
                .get('/api/getUser')
                .then(response => {
                    if (typeof (response.data) == 'object') {
                        let userData = response.data;
                        commit('setUserData', userData);
                    } else
                        console.log('Неверные данные')
                })
                //Проверку на null в данном случае не делаю, т.к. если вернет null - поле останется пустым
                .catch(error => console.log(error))
                .finally(() => (console.log('finished')));
        }
    }
})

new Vue({
    router,
    render: h => h(App),
    store,
}).$mount('#app')


