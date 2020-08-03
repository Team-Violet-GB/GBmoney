import axios from 'axios'

export default {
    actions: {
        fetchTagsForChart({ commit }, data) {
            // axios.get('/api/get/...')
            //     .then(response => {
            //         const newTagsForChart = response.data.data;
            //         commit('updateTagsForChart', newTagsForChart)
            //     })

            var newTagsForChart = {
                names: ["продукты", "кафе/рестораны", "на работе"],
                amounts: [10000, 1500, 1000],
              }
              
              commit('updateTagsForChart', newTagsForChart)
        }
    },

    mutations: {
        updateTagsForChart (state, newTagsForChart) {
            state.tagsForChart = newTagsForChart
        }
    },
    state: {
        tagsForChart: null
    },
    getters: {
        getTagsForChart(state) {
            return state.tagsForChart
        }
    }
}
