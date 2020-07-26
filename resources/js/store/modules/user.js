export default {
    mutations: {
        setUserEmail(state, email) {
            state.email = email
            let user = JSON.parse(localStorage.getItem('user')) || {};
            user.email = email
            localStorage.setItem('user', JSON.stringify(user))
        },
        clearUserData(state) {
            localStorage.removeItem('user')
            state.email = ''
        },
        setUserData(state, user) {
            localStorage.setItem('user', JSON.stringify(user))
            state.email = user.email
        },
    },
    state: {
        email: JSON.parse(localStorage.getItem('user')) ? (JSON.parse(localStorage.getItem('user'))).email : '',
    },
    getters: {
        email(state) {
            return state.email
        },
    },
}
