export default {
    actions: {
        authRequest({ commit }, data) {
            data.this.axios.post('/api/login' , {
                email: data.email,
                password: data.password
            })
            .then(response => {
                const token = response.data.token
                localStorage.setItem('user-token', token)
                // data.this.axios.defaults.headers.common = {
                //     'X-Requested-With': token,
                //     'X-CSRF-TOKEN': token,
                // };
                window.axios.defaults.headers.common = {
                    'X-Requested-With': 'XMLHttpRequest',
                };
                commit('authSuccess', token)
                data.this.$message({
                    message: 'Добро пожаловать!',
                    type: 'success'
                })
                data.this.$router.push('/')

            })
            .catch((error) => {
                data.this.$message.error(error.response.data.errors) 
            })
        }
    },
    mutations: {
        authSuccess(state, token) {
            state.status = 'success'
            state.token = token
        }
    },
    state: {
        token: localStorage.getItem('user-token') || '',
        status: '',
      
    },
    getters: {
        isAuthenticated: state => !!state.token,
        authStatus: state => state.status,
    }
}
