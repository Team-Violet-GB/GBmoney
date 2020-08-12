
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

        fetchWallets({ commit }) {
            axios.get('/api/get/wallets')
            .then(response => {
                const wallets = response.data.data
                commit('updateWallets', wallets)
                commit('updateWalletsLoad', false)
            })
        },

        fetchIncomes({ commit, dispatch }, interval) {
            axios.get('/api/get/incomes')
            .then(response => {
                const incomes = response.data.data
                commit('updateIncomes', incomes)
                if (interval) dispatch('fetchIncomesByInterval', interval)
                else commit('updateIncomesLoad', false)
            })
        },

        fetchExpenses({ commit, dispatch }, interval) {
            axios.get('/api/get/expenses')
            .then(response => {
                const expenses = response.data.data
                commit('updateExpenses', expenses)
                if (interval) dispatch('fetchExpensesByInterval', interval)
                else commit('updateExpensesLoad', false)
            })
        },
        fetchTags({ commit }) {
            axios.get('/api/tags')
            .then(response => {
                const tags = response.data.data
                commit('updateTags', tags)
            })
        },

        fetchIncomesByInterval({ commit }, interval) {
            axios.get(`api/report/sum-incomes?date_from=${interval.dateFrom}&date_to=${interval.dateTo}`)
                .then(response => {
                    commit('updateIncomesByInterval', response.data.data)
                    commit('updateIncomesLoad', false)
                })
        },

        fetchExpensesByInterval({ commit }, interval) {
            axios.get(`api/report/sum-expenses?date_from=${interval.dateFrom}&date_to=${interval.dateTo}`)
                .then(response => {
                    commit('updateExpensesByInterval', response.data.data)
                    commit('updateExpensesLoad', false)
                })
        },

    },
    mutations: {
        updateIncomes(state, points) {
            state.incomesList = points
        },
        updateWallets(state, points) {
            state.walletsList = points
            let summ = 0
            for (let point in points) if (points[point].include) summ += Number(points[point].amount)
            state.walletsSumm = summ
        },
        updateExpenses(state, points) {
            state.expensesList = points
        },
        updateTags(state, points) {
            state.tagsList = points
        },

        updateIncomesLoad(state, newState) {
            state.incomesLoad = newState
        },
        updateWalletsLoad(state, newState) {
            state.walletsLoad = newState
        },
        updateExpensesLoad(state, newState) {
            state.expensesLoad = newState
        },

        updateIncomesByInterval(state, pointsByInterval) {
            let points = state.incomesList
            let summ = 0
            for (let point in points)  {
                if (pointsByInterval[point]) {
                    points[point].amount = pointsByInterval[point].amount
                    summ += Number(points[point].amount)
                } else {
                    points[point].amount = 0
                }
            }
            state.incomesListByInterval = points
            state.incomesSumm = summ
        },

        updateExpensesByInterval(state, pointsByInterval) {
            let points = state.expensesList
            let summ = 0
            let limit = 0
            for (let point in points)  {
                if (pointsByInterval[point]) {
                    points[point].amount = pointsByInterval[point].amount
                    summ += Number(points[point].amount)
                } else {
                    points[point].amount = 0
                }
                limit += Number(points[point].max_limit)
            }

            state.expensesListByInterval = points
            state.expensesSumm = summ
            state.expensesLimit = limit - summ
        },
    },
    state: {
        incomesList: null,
        walletsList: null,
        expensesList: null,
        incomesListByInterval: null,
        expensesListByInterval: null,
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
        incomesByInterval(state) {
            return state.incomesListByInterval
        },
        expensesByInterval(state) {
            return state.expensesListByInterval
        },

        intervalMonth() {
            let date = new Date()
            let dateFrom = new Date(date.getFullYear(), date.getMonth(), 1)
            dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
            let dateTo = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            return  {dateFrom, dateTo}
        },
    }
}
