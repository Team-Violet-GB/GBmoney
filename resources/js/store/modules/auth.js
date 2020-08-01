import axios from "axios";

export default {
    actions: {
        login({ commit }, data) {
            data.this.axios.post('/api/login' , {
                email: data.email,
                password: data.password
            })
                .then(response => {
                    const token = response.data.token
                    const user = response.data.user
                    localStorage.setItem('user-token', token)
                    data.this.$message({
                        message: 'Добро пожаловать!',
                        type: 'success'
                    })
                    commit('setUserData', user)
                    commit('login', token)
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                    data.this.$router.push('/')
                })
                .catch((error) => {
                    data.this.$message.error(error.response.data.errors)
                })
        },
        logout(state, data) {
            data.this.axios.get('/api/logout')
                .then(() => {
                    localStorage.removeItem('user-token')
                    state.commit('logout')
                    state.commit('clearUserData')
                    data.this.$router.push('/login')
                    
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    mutations:{
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
