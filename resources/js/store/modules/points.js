import axios from 'axios'

export default {
    actions: {
        addIncomes({commit, dispatch}, data) {
            axios.post('/api/incomes' , data)
                .then(response => {
                    dispatch('fetchIncomes')
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        addWallets({commit, dispatch}, data) {
            axios.post('/api/wallets' , data)
                .then(response => {
                    dispatch('fetchWallets')
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        addExpenses({commit, dispatch}, data) {
            axios.post('/api/expenses' , data)
                .then(response => {
                    dispatch('fetchExpenses')
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        fetchIncomes({ commit }) {
            axios.get('/api/get/incomes')
            .then(response => {
                const incomes = response.data.data
                commit('updateIncomes', incomes)
                commit('updateIncomesLoad', false)
            })
        },
        fetchWallets({ commit }) {
            axios.get('/api/get/wallets')
            .then(response => {
                const wallets = response.data.data
                commit('updateWallets', wallets)
                commit('updateWalletsSumm', false)
            })
        },
        fetchExpenses({ commit }) {
            axios.get('/api/get/expenses')
            .then(response => {
                const expenses = response.data.data
                commit('updateExpenses', expenses)
                commit('updateExpensesLoad', false)
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
            for (let point in points) if (points[point].include) summ += Number(points[point].amount)
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

        updateIncomesLoad(state, newState) {
            state.incomesLoad = newState
        },
        updateWalletsSumm(state, newState) {
            state.walletsLoad = newState
        },
        updateExpensesLoad(state, newState) {
            state.expensesLoad = newState
        },

    },
    state: {
        incomesList: null,
        walletsList: null,
        expensesList: null,
        tagsList: null,
        incomesSumm: null,
        walletsSumm: null,
        expensesSumm: null,
        expensesLimit: null,
        incomesLoad: true,
        walletsLoad: true,
        expensesLoad: true,
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
            return state.expensesSumm
        },
        expensesLimit(state) {
            return state.expensesLimit
        },
        incomesLoading(state) {
            return state.incomesLoad
        },
        walletsLoading(state) {
            return state.walletsLoad
        },
        expensesLoading(state) {
            return state.expensesLoad
        },
    }
}
