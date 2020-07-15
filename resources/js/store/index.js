import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import points from './modules/points'
import transaction from './modules/transaction'

Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        user,
        points,
        transaction
    }
})