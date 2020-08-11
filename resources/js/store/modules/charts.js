import axios from 'axios'

export default {
    actions: {
        fetchTotalAmountOfCategories({commit}) {
            const url = this.getters.getTypeId == 3 ? 'api/report/sum-expenses' : 'api/report/sum-incomes';
            const params = {
                date_from: this.getters.getDateFrom,
                date_to: this.getters.getDateTo
            }
            commit('setErrorStatus', false);
            commit('setLoaded', false);

            axios.get(url, {params})
                .then(response => {
                    commit('setTotalAmountOfCategories', response.data.data);
                    if ((Object.keys(response.data.data).length) === 0) {
                        commit('setErrorStatus', true);
                        commit('setErrorInfo', `За запрошеный период транзакции не производились ...`);
                    } else {
                        commit('setErrorStatus', false)
                        commit('setLoaded', true);
                    }
                })
                .catch(error => {
                    commit('setErrorStatus', true);
                    commit('setErrorInfo', `Ошибка во время запроса транзакций: (${error})`);
                    console.log(error);
                })
        }
    },

    mutations: {
        setTotalAmountOfCategories(state, data) {
            let red, green, blue;
            let staticColorIndex = 0;
            const rgbStaticData = [
                [244, 66, 35],
                [250, 169, 39],
                [81, 190, 40],
                [39, 136, 164],
                [233, 130, 36],
                [240, 44, 226],
                [33, 251, 204],
                [200, 50, 243],
                [209, 73, 41],
                [42, 225, 154],
                [49, 171, 236],
                [37, 202, 230],
                [204, 243, 36],
                [243, 45, 154],
                [42, 225, 154],
                [235, 42, 81],
                [120, 171, 45],
                [105, 246, 30],
                [228, 247, 42],
            ];

            for (let key in data) {
                data[key].show = true

                // добавление данных о цвете для отображения категории на диаграмме
                if (staticColorIndex < rgbStaticData.length - 1) {
                    [red, green, blue] = rgbStaticData[staticColorIndex];
                    staticColorIndex++;
                } else {
                    let rgbDynamicData = [
                        Math.floor(Math.random() * (255 - 5 + 1)) + 5,
                        Math.floor(Math.random() * (100 - 50 + 1)) + 50,
                        Math.floor(Math.random() * (255 - 200 + 1)) + 200
                    ]
                    let rnd, temp;
                    for (let i = rgbDynamicData.length - 1; i > 0; i--) {
                        rnd = Math.floor(Math.random() * (i + 1));
                        temp = rgbDynamicData[rnd];
                        rgbDynamicData[rnd] = rgbDynamicData[i];
                        rgbDynamicData[i] = temp;
                    }
                    [red, green, blue] = rgbDynamicData;
                }
                data[key].color = `rgba(${red},${green},${blue},0.9)`;
            }
            state.totalAmountOfCategories = data;
        }
    },

    state: {
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
        }
    }
}
