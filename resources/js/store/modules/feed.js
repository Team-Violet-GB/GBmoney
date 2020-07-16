import axios from "axios";

export default {
    actions: {
        requestTransactions({commit}) {
            const headers = {
                'Content-Type': 'application/json'
            }
            commit('setLoadingStatus', true);
            axios.get('storage/testTrnsactions.json', {headers: headers})
                .then(response => {
                    commit('setTransactions', response.data);
                })
                .catch(error => {
                    commit('setErrorStatus', true);
                    commit('setErrorInfo', 'Ошибка во время запроса данных о транзакциях');
                    //todo: обработка кодов с сервера
                })
                .finally(() => {
                    commit('setLoadingStatus', false);
                });
        }
    },
    mutations: {
        setTransactions(state, data) {
            state.transactions = data;
        },
        setLoadingStatus(state, data) {
            state.loadingStatus = data
        },
        setEditorShowStatus(state, data) {
            state.editorShowStatus = data
        },
        setTransaction(state, data) {
            state.transaction = data
        },
        setErrorStatus(state, data) {
            state.errorStatus = data
        },
        setErrorInfo(state, data) {
            state.errorInfo = data
        }

    },
    state: {
        transactions: {},
        transaction: {},
        loadingStatus: false,
        editorShowStatus: false,
        errorStatus: true,
        errorInfo: 'Непредсказуемая ситуация, данные не поступили!'
    },
    getters: {
        getTransactions(state) {
            return state.transactions
        },
        getTransaction(state) {
            return state.transaction
        },
        getLoadingStatus(state) {
            return state.loadingStatus;
        },
        getEditorShowStatus(state) {
            return state.editorShowStatus
        },
        getErrorStatus(state) {
            return state.errorStatus
        },
        getErrorInfo(state) {
            return state.errorInfo
        }
    }
}
