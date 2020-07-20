/*
export default {
    actions: {
        login({ commit }, data) {
            data.this.axios.post('/api/login' , {
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
            data.this.axios.get('/api/logout')
            .then(response => {
                localStorage.removeItem('user-token')
                commit('logout')
            })
            .catch((error) => {
                data.this.$message.error(error.response.data.errors)
            })
        }
    },
    mutations: {
        login(state, token) {
            state.token = token
        },

        logout(state) {
            state.token = ''
        }
    },
    state: {
        token: localStorage.getItem('user-token') || '',
    },
    getters: {
        isAuth: (state) => !!state.token,
    }
}
*/
