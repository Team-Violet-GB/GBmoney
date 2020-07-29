import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import points from './modules/points'
import auth from './modules/auth'
import icons from './modules/icons'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        points,
        auth,
        icons
    }
})
