import axios from 'axios'

export default {
    actions: {
        fetchLineChart({ commit }, data) {
            // axios.get('/api/get/...')
            //     .then(response => {
            //         const newTagsForChart = response.data.data;
            //         commit('updateTagsForChart', newTagsForChart)
            //     })
            console.log(data)
            var newData = {
                names: ["март","апрель","май","июнь","март","апрель","май","июнь","май","июнь","июнь",],
                amounts: [0,15000,5000,15000,-10000,5000,15000,-10000,5000,30000,-10000,],
              }
            commit('updateLineData', newData)
        },

        fetchPieChart({ commit }, data) {
            // axios.get('/api/get/...')
            //     .then(response => {
            //         const newTagsForChart = response.data.data;
            //         commit('updateTagsForChart', newTagsForChart)
            //     })
            console.log(data)
            var newData = {
                names: ["продукты", "кафе/рестораны", "на работе", "продукты", "кафе/рестораны", "на работе"],
                amounts: [10000, 1500, 1000, 10000, 1500, 1000],
              }
            commit('updatePieData', newData)
        },
    },

    mutations: {
        updateLineData (state, lineData) {
            state.lineData = lineData
        },
        updatePieData (state, pieData) {
            state.pieData = pieData
        }
    },

    state: {
        lineData: null,
        pieData: null,
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
            return  {dateFrom, dateTo}
        },
      
        lastHalfYear() {
            let date = new Date()
            let dateFrom = new Date(date.getFullYear(), date.getMonth() - 5 , 1)
            let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
            dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate() 
            return  {dateFrom, dateTo} 
        },

        colors() {
            return [
                "#0a93d1",
                "#e6a23c",
                "#67c23a",
                "#0a93d1",
                "#f56c6c",
                "#909399",
              ]
        }
    }
}
