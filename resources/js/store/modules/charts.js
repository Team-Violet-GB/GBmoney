import axios from 'axios'

export default {
    actions: {
        fetchCharts({ commit }, data) {
            axios.get(`/api/report/sum-tags?expense_id=${data.expense_id}&date_from=${data.dateFrom}&date_to=${data.dateTo}`)
                .then(response => {
                    const tags = response.data.data
                    var names = []
                    var amounts = []
                    var colors = []
                    for (let tag in tags) {
                        var r = Math.floor(Math.random() * (256))
                        var g = Math.floor(Math.random() * (256))
                        var b = Math.floor(Math.random() * (256))
                        var color = '#' + r.toString(16) + g.toString(16) + b.toString(16)

                        names.push(tags[tag].name)
                        amounts.push(tags[tag].amount)
                        colors.push(color)
                    }
                    var pieData = {
                        names,
                        amounts,
                        colors,
                    }
                    commit('updatePieData', pieData)
                })

            // заглушка для линейного графика
            var lineData = {
                names: ["март","апрель","май","июнь","март","апрель","май","июнь","май","июнь","июнь",],
                amounts: [0,15000,5000,15000,-10000,5000,15000,-10000,5000,30000,-10000,],
                namePoint: data.namePoint
            }
            commit('updateLineData', lineData)
        },
    },

    mutations: {
        updateLineData (state, lineData) {
            state.lineData = {
                labels: lineData.names,
                datasets: [
                  {
                    label: lineData.namePoint,
                    backgroundColor: "rgba(10, 147, 209, 0.2)",
                    borderColor: "rgba(10, 147, 209)",
                    data: lineData.amounts,
                  },
                  //   {   // вторая линия
                  //     label: "Непродажи",
                  //     backgroundColor: "#e6a23c",
                  //     data: [5000, 15000, 10000, 30000],
                  //   },
                ],
              }
        },
        updatePieData (state, pieData) {
            state.pieData = {
                labels: pieData.names,
                datasets: [
                  {
                    label: "Подкатегории",
                    backgroundColor: pieData.colors,
                    borderWidth: 0,
                    data: pieData.amounts
                  },
                ],
              }
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
    }
}
