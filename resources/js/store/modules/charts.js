import axios from 'axios'

export default {
    actions: {
        fetchCharts({ commit }, data) {
            axios.get(`/api/report/sum-tags?expense_id=${data.expense_id}&date_from=${data.dateFrom}&date_to=${data.dateTo}`)
                .then(response => {
                    const tags = response.data.data
                    var names = []
                    var amounts = []
                    for (let tag in tags) {
                        names.push(tags[tag].name)
                        amounts.push(tags[tag].amount)
                    }
                    console.log (names)
                    console.log (amounts)
                    var pieData = {
                        names,
                        amounts,
                    }
                    commit('updatePieData', pieData)
                })

            // заглушка для линейного графика
            var newData = {
                names: ["март","апрель","май","июнь","март","апрель","май","июнь","май","июнь","июнь",],
                amounts: [0,15000,5000,15000,-10000,5000,15000,-10000,5000,30000,-10000,],
            }
            commit('updateLineData', newData)
        },
    },

    mutations: {
        updateLineData (state, lineData) {
            state.lineData = lineData
        },
        updatePieData (state, pieData) {
            state.pieData = pieData
        },

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
            return ["#0a93d1","#e6a23c","#67c23a","#0a93d1","#f56c6c","#909399",]
        }
    }
}
