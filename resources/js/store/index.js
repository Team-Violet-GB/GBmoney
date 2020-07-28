import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import points from './modules/points'
import auth from './modules/auth'
import feed from './modules/feed'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        feed,
        user,
        points,
        auth
    }
})
