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
                    commit('setUserData', resp)
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
    getters: {
        isAuth() {return !!localStorage.getItem('user-token')},
    },

}
