import axios from 'axios'

export default {
    namespaced: true,
    state: {
        expenses: null,
        incomes: null,
        categories: {
          incomes: null,
          expenses: null
        },
        labels: [],
        dateFrom: '',
        dateTo: '',
        expensesSums: [],
        incomesSums: [],
    },
    mutations: {
        setExpenses(state, data) {
            state.expenses = data
        },
        setIncomes(state, data) {
            state.incomes = data
        },
        setIncomesCategories(state, data) {
            state.categories.incomes = data
        },
        setExpensesCategories(state, data) {
            state.categories.expenses = data
        },
        setLabels(state, data) {
            state.labels = data
        },
        setDateFrom(state, data) {
            state.dateFrom = data
        },
        setDateTo(state, data) {
            state.dateTo = data
        },
        setExpensesSums(state, data) {
            state.expensesSums = data
        },
        setIncomesSums(state, data) {
            state.incomesSums = data
        },
    },
    actions: {
        fetchIncomes({ commit }) {
            const headers = {
                'Content-Type': 'application/json'
            }
            let params = {
                date_from: this.getters.getDateFrom,
                date_to: this.getters.getDateTo,
                type: 1
            }

            axios.get('api/report/sum-points-by-months', {params: params, headers: headers})
                .then(response => {
                    commit('setIncomes', response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        fetchExpenses({ commit }) {
            const headers = {
                'Content-Type': 'application/json'
            }
            let params = {
                date_from: this.getters.getDateFrom,
                date_to: this.getters.getDateTo,
                type: 3
            }

            axios.get('api/report/sum-points-by-months', {params: params, headers: headers})
                .then(response => {
                    commit('setExpenses', response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    getters: {
        getIncomes(state) {
            return state.incomes
        },
        getExpenses(state) {
            return state.expenses
        },
        getCategories(state) {
            return state.categories
        },
        getLabels(state) {
            return state.labels
        },
        getDateFrom(state) {
            return state.dateFrom
        },
        getDateTo(state) {
            return state.dateTo
        },
        getExpensesSums(state) {
            return state.expensesSums
        },
        getIncomesSums(state) {
            return state.incomesSums
        },
    }
}
