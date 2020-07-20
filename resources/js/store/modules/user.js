import axios from "axios";

export default {
    actions: {
        login({ commit }, data) {
            axios.post('/api/login' , {
                email: data.email,
                password: data.password
            })
                .then(response => {
                    const user = response.data
                    localStorage.setItem('user-token', user.token)
                    let token = localStorage.getItem('user-token')
                    localStorage.setItem('user-email', user.email)
                    data.this.$message({
                        message: 'Добро пожаловать!',
                        type: 'success'
                    })
                    commit('login', user)
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
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
                    localStorage.removeItem('user-email')
                    commit('logout')
                })
                .catch((error) => {
                    data.this.$message.error(error.response.data.errors)
                })
        },
        /*setUserData({commit}) {
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
        }*/
    },
    mutations: {
        setUserEmail(state, email) {
            state.email = email;
        },
        login(state, user) {
            state.token = user.token;
            state.email = user.email;
        },
        logout(state) {
            state.token = '';
            state.email = '';
        }
    },
    state: {
        email: localStorage.getItem('user-email') || '',
        token: localStorage.getItem('user-token') || '',
    },
    getters: {
        user(state) {
            return state
        },
        isAuth: (state) => !!state.token,
    },
}
