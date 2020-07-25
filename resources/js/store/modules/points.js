import axios from 'axios'

export default {
    actions: {
        fetchIncomes({ commit }) {
            axios.get('/api/get/incomes')
            .then(response => {
                const incomes = response.data.data
                commit('updateIncomes', incomes)
            })
        },
        fetchWallets({ commit }) {
            axios.get('/api/get/wallets')
            .then(response => {
                const wallets = response.data.data
                commit('updateWallets', wallets)
            })
        },
        fetchExpenses({ commit }) {
            axios.get('/api/get/expenses')
            .then(response => {
                const expenses = response.data.data
                commit('updateExpenses', expenses)
            })
        },
        fetchTags({ commit }) {
            axios.get('/api/tags')
            .then(response => {
                const tags = response.data.data
                commit('updateTags', tags)
            })
        },
    },
    mutations: {
        updateIncomes(state, points) {
            state.incomesList = points
            let summ = 0
            for (let point in points)  summ += Number(points[point].amount)
            state.incomesSumm = summ
            console.log()
        },
        updateWallets(state, points) {
            state.walletsList = points
            let summ = 0
            for (let point in points)  summ += Number(points[point].amount)
            state.walletsSumm = summ
        },
        updateExpenses(state, points) {
            state.expensesList = points
            let summ = 0
            for (let point in points)  summ += Number(points[point].amount)
            state.expensesSumm = summ

            let limit = 0
            for (let point in points)  limit += Number(points[point].max_limit)
            state.expensesLimit = limit
        },

        updateTags(state, points) {
            state.tagsList = points
        },
    },
    state: {
        incomesList: [],
        walletsList: [],
        expensesList: [],
        tagsList: [],
        incomesSumm: null,
        walletsSumm: null,
        expensesSumm: null,
        expensesLimit: null,
    },
    getters: {
        incomes(state) {
            return state.incomesList
        },
        wallets(state) {
            return state.walletsList
        },
        expenses(state) {
            return state.expensesList
        },
        tags(state) {
            return state.tagsList
        },
        incomesSumm(state) {
            return state.incomesSumm
        },
        walletsSumm(state) {
            return state.walletsSumm
        },
        expensesSumm(state) {
            return state.walletsSumm
        },
        expensesLimit(state) {
            return state.expensesLimit
        },
    }
}
