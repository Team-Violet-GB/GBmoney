import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import points from './modules/points'
import auth from './modules/auth'
import icons from './modules/icons'
import transactions from './modules/transactions'
import charts from './modules/charts'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        transactions,
        user,
        points,
        auth,
        icons,
        charts
    }
})
