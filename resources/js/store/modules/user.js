import axios from "axios";

export default {
    mutations: {
        setUserEmail(state, email) {
            state.email = email;
        },
        clearUserData(state) {
            localStorage.removeItem('user-token');
            localStorage.removeItem('user-email');
            state.token = '';
            state.email = '';
        },
        setUserData(state, data) {
            state.token = data.token;
            state.email = data.user.email;
        },
    },
    state: {
        email: localStorage.getItem('user-email') || '',
        token: localStorage.getItem('user-token') || '',
    },
    getters: {
        user(state) {
            return state
        },
    },
}
