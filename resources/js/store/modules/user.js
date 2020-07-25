import axios from "axios";

export default {
    actions: {
        login({ commit }, data) {
            axios.post('/api/login' , {
                email: data.email,
                password: data.password
            })
                .then(response => {
                    const resp = response.data
                    localStorage.setItem('user-token', resp.token)
                    let token = localStorage.getItem('user-token')
                    localStorage.setItem('user-email', resp.user.email)
                    data.this.$message({
                        message: 'Добро пожаловать!',
                        type: 'success'
                    })
                    commit('login', resp)
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                    data.this.$router.push('/')
                })
                .catch((error) => {
                    data.this.$message.error(error.response.data.errors)
                })
        },
        logout({ commit }, data) {
            axios.get('/api/logout')
                .then(() => {
                    commit('clearUserData')
                })
                .catch((error) => {
                    data.this.$message.error(error.response.data.errors)
                })
        },
    },
    mutations: {
        setUserEmail(state, email) {
            state.email = email;
        },
        login(state, data) {
            state.token = data.token;
            state.email = data.user.email;
        },
        clearUserData(state) {
            localStorage.removeItem('user-token');
            localStorage.removeItem('user-email');
            state.token = null;
            state.email = null;
        },
        isNotAuthenticated(state) {
            if (this.isAuth)
                this.$router.push('/')
            else
                state.isNotAuth = false;
        },
    },
    state: {
        email: localStorage.getItem('user-email') || '',
        token: localStorage.getItem('user-token') || '',
        isNotAuth: true,
    },
    getters: {
        user(state) {
            return state
        },
        isAuth() {return !!localStorage.getItem('user-token')},
        isNotAuth(state) {return state.isNotAuth}
    },
}
