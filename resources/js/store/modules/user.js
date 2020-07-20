import axios from "axios";

export default {
    actions: {
        login({ commit }, data) {
            axios.post('/api/login' , {
                email: data.email,
                password: data.password
            })
                .then(response => {
                    const token = response.data.token
                    localStorage.setItem('user-token', token)
                    data.this.$message({
                        message: 'Добро пожаловать!',
                        type: 'success'
                    })
                    commit('login', token)
                    data.this.$router.push('/')
                })
                .catch((error) => {
                    data.this.$message.error(error.response.data.errors)
                })
        },
        logout({ commit }, data) {
            axios.get('/api/logout')
                .then(response => {
                    localStorage.removeItem('user-token')
                    commit('logout')
                })
                .catch((error) => {
                    data.this.$message.error(error.response.data.errors)
                })
        },
        setUserData({commit}) {
            const token = localStorage.getItem('user-token')
            if (token) {
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
            }

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
        login(state, token) {
            state.token = token
        },

        logout(state) {
            state.token = ''
        }
    },
    state: {
        id: '',
        email: '',
        token: localStorage.getItem('user-token') || '',
    },
    getters: {
        user(state) {
            return state
        },
        isAuth: (state) => !!state.token,
    },
}
