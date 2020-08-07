import axios from 'axios'

export default {
    state: {
        expenses: null,
        incomes: null,
        sums: {
          incomes: null,
          expenses: null
        },
        categories: null,
        labels: [],
    },
    mutations: {
        setExpenses(state, data) {
            state.expenses = data
        },
        setIncomes(state, data) {
            state.incomes = data
        },
        setCategories(state, data) {
            state.categories = data
        },
        setSums(state, data) {
            data.incomes ? state.sums.incomes = data.incomes : null
            data.expenses ? state.sums.expenses = data.expenses : null
        },
        setLabels(state, data) {
            state.labels = data
        }
    },
    actions: {
        fetchHistCategories({ commit }) {
          commit("setCategories", {
              "1": "Авто",
              "2": "Дом",
          })
        },
        fetchHistIncomes({commit}) {
            let data = {
                "01.2020": {
                    "1": 125000,
                    "2": 124000,
                },
                "02.2020": {
                    "1": 122000,
                    "2": 53300,
                },
                "03.2020": {
                    "1": 125000,
                    "2": 13400,
                },
                "04.2020": {
                    "1": 125000,
                    "2": 10400,
                },
                "05.2020": {
                    "1": 125000,
                    "2": 12400,
                },
                "06.2020": {
                    "1": 12500,
                    "2": 24400,
                },
                "07.2020": {
                    "1": 125000,
                    "2": 22400,
                },
                "08.2020": {
                    "1": 125000,
                    "2": 104000,
                },
                "09.2020": {
                    "1": 12000,
                    "2": 13400,
                },
                "10.2020": {
                    "1": 125000,
                    "2": 13400,
                },
                "11.2020": {
                    "1": 125000,
                    "2": 0,
                },
                "12.2020": {
                    "1": 125000,
                    "2": 1200,
                },
            }
            let labels = []
            for (let key in data) {
                labels.push(key)
            }
            commit("setLabels", labels)
            commit("setIncomes", data)
        },
        fetchHistExpenses({commit}) {
            commit("setExpenses", {
                "01.2020": {
                    "1": 125000,
                    "2": 12400,
                },
                "02.2020": {
                    "1": 122000,
                    "2": 12400,
                },
                "03.2020": {
                    "1": 125000,
                    "2": 16400,
                },
                "04.2020": {
                    "1": 125000,
                    "2": 12400,
                },
                "05.2020": {
                    "1": 125000,
                    "2": 1240,
                },
                "06.2020": {
                    "1": 12500,
                    "2": 12400,
                },
                "07.2020": {
                    "1": 125000,
                    "2": 12400,
                },
                "08.2020": {
                    "1": 125000,
                    "2": 124000,
                },
                "09.2020": {
                    "1": 12000,
                    "2": 12400,
                },
                "10.2020": {
                    "1": 125000,
                    "2": 12400,
                },
                "11.2020": {
                    "1": 125000,
                    "2": 12400,
                },
                "12.2020": {
                    "1": 125000,
                    "2": 12400,
                },
            })
        }
    },
    getters: {
        getSums(state) {
            return state.sums
        },
        getCategories(state) {
            return state.categories
        },
        getLabels(state) {
            return state.labels
        }
    }
}
