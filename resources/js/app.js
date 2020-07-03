
window.Vue = require('vue');
window.VueRouter  = require('vue-router');

Vue.use(VueRouter);

Vue.component('App', require('./components/App.vue'));
Vue.component('Home', require('./components/Home.vue'));
Vue.component('User', require('./components/User.vue'));

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
