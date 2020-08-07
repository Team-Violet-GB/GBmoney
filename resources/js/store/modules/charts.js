import axios from 'axios'

export default {
    actions: {
        fetchCharts({commit}, data) {
            // axios.get('/api/get/...')
            //     .then(response => {
            //         const newTagsForChart = response.data.data;
            //         commit('updateTagsForChart', newTagsForChart)
            //     })
            var newData = {
                names: ["март", "апрель", "май", "июнь", "март", "апрель", "май", "июнь", "май", "июнь", "июнь",],
                amounts: [0, 15000, 5000, 15000, -10000, 5000, 15000, -10000, 5000, 30000, -10000,],
            }

            var newData2 = {
                names: ["продукты", "кафе/рестораны", "на работе", "продукты", "кафе/рестораны", "на работе"],
                amounts: [10000, 1500, 1000, 10000, 1500, 1000],
            }
            console.log(data)

            commit('updateLineData', newData)
            commit('updatePieData', newData2)
        },
        fetchTotalAmountOfCategories({commit}) {
            const url = this.getters.getTypeId == 3 ? 'api/report/sum-expenses' : 'api/report/sum-incomes';
            const headers = {
                'Content-Type': 'application/json'
            }
            const params = {
                date_from: this.getters.getDateFrom,
                date_to: this.getters.getDateTo
            }
            commit('setErrorStatus', false);
            axios.get(url, {params: params, headers: headers})
                .then(response => {
                    commit('setTotalAmountOfCategories', response.data.data);
                    if ((Object.keys(response.data.data).length) === 0) {
                        commit('setErrorStatus', true);
                        commit('setErrorInfo', `За запрошеный период транзакции не производились ...`);
                    } else {
                        commit('setErrorStatus', false);
                    }
                })
                .catch(error => {
                    commit('setErrorStatus', true);
                    commit('setErrorInfo', `Ошибка во время запроса транзакций: (${error})`);
                })
        }
    },

    mutations: {
        updateLineData(state, lineData) {
            state.lineData = lineData
        },
        updatePieData(state, pieData) {
            state.pieData = pieData
        },
        setTotalAmountOfCategories(state, data) {
            for (let key in data) {
                data[key].show = true
            }
            state.totalAmountOfCategories = data
        }
    },

    state: {
        lineData: null,
        pieData: null,
        totalAmountOfCategories: null
    },

    getters: {
        getLineData(state) {
            return state.lineData
        },
        getPieData(state) {
            return state.pieData
        },

        thisMonth() {
            let date = new Date()
            let dateFrom = new Date(date.getFullYear(), date.getMonth(), 1)
            let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
            dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate()
            return {dateFrom, dateTo}
        },

        lastHalfYear() {
            let date = new Date()
            let dateFrom = new Date(date.getFullYear(), date.getMonth() - 5, 1)
            let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
            dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate()
            return {dateFrom, dateTo}
        },

        colors() {
            return ["#0a93d1", "#e6a23c", "#67c23a", "#0a93d1", "#f56c6c", "#909399",]
        },
        getTotalAmountOfCategories(state) {
            return state.totalAmountOfCategories
        },
    }
}
