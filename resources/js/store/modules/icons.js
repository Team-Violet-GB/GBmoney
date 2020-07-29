import axios from 'axios'

export default {
    actions: {
        fetchIcons({ commit }) {
            axios.get('/api/get/icons')
                .then(response => {
                    const icons = response.data.data;
                    commit('updateIcons', icons)
                })
        }
    },
    mutations: {
        updateIcons (state, icons) {
            state.icons = icons
        }
    },
    state: {
        icons: []
    },
    getters: {
        allIcons(state) {
            return state.icons
        }
    }
}
