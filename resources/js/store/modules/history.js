import axios from 'axios'

export default {
    namespaced: true,
    state: {
        expenses: null,
        incomes: null,
        categories: {
            incomes: [],
            expenses: [],
        },
        labels: [],
        dateFrom: '',
        dateTo: '',
        expensesSums: [],
        incomesSums: [],
        totalIncomes: "",
        totalExpenses: "",
        minIncomes: '',
        avgIncomes: '',
        maxIncomes: '',
        minExpenses: '',
        avgExpenses: '',
        maxExpenses: '',
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
        setTotalIncomes(state, data) {
            state.totalIncomes = data
        },
        setTotalExpenses(state, data) {
            state.totalExpenses = data
        },
        setMinIncomes(state, data) {
            state.minIncomes = data
        },
        setAvgIncomes(state, data) {
            state.avgIncomes = data
        },
        setMaxIncomes(state, data) {
            state.maxIncomes = data
        },
        setMinExpenses(state, data) {
            state.minExpenses = data
        },
        setAvgExpenses(state, data) {
            state.avgExpenses = data
        },
        setMaxExpenses(state, data) {
            state.maxExpenses = data
        },
    },
    actions: {
        fetchIncomes({commit}) {
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
        fetchExpenses({commit}) {
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
        getTotalExpenses(state) {
            return state.totalExpenses
        },
        getTotalIncomes(state) {
            return state.totalIncomes
        },
        getMinIncomes(state) {
            return state.minIncomes
        },
        getAvgIncomes(state) {
            return state.avgIncomes
        },
        getMaxIncomes(state) {
            return state.maxIncomes
        },
        getMinExpenses(state) {
            return state.minExpenses
        },
        getAvgExpenses(state) {
            return state.avgExpenses
        },
        getMaxExpenses(state) {
            return state.maxExpenses
        },
    }
}
