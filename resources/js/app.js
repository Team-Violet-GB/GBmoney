
window.Vue = require('vue');
// window.VueRouter  = require('vue-router');
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import App from './components/App'
import Home from './components/Home'
import User from './components/User'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/user',
            name: 'user',
            component: User,
        },
    ],
});

const app = new Vue({
    el: '#app',
    components: { App },
    router,
});
