import axios from "axios";

export default {
    namespaced: true,
    actions: {
        setUserData({commit}) {
            axios
                .get('/api/user/show')
                .then(response => {
                    if (typeof (response.data) == 'object') {
                        let userData = response.data;
                        commit('setUserData', userData);
                    } else
                        console.log('Неверные данные')
                })
                //Проверку на null в данном случае не делаю, т.к. если вернет null - поле останется пустым
                .catch(error => console.log(error))
                .finally(() => (console.log('finished')));
        }
    },
    mutations: {
        setUserData(state, user) {
            state.id = user.id;
            state.email = user.email;
        },
    },
    state: {
        id: '',
        email: '',
    },
    getters: {
        user(state) {
            return state
        }
    },
}
