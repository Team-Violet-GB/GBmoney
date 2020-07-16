import axios from "axios";

export default {
    actions: {
        requestTransactions({commit}) {
            const headers = {
                'Content-Type': 'application/json'
            }
            commit('setLoadingStatus', true);
            axios.get('storage/testTransactions.json', {headers: headers})
                .then(response => {
                    commit('setTransactions', response.data);
                    commit('setLoadingStatus', false);
                })
                .catch(error => {
                    console.log(error)
                    this.error = true;
                    this.errorInfo = 'Ошибка во время запроса данных о транзакциях';
                    //todo: обработка кодов с сервера
                })
                .finally(() => {
                    commit('setLoadingStatus', false);
                    console.log('finished fetch transaction')
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

    },
    state: {
        transactions: {},
        transaction: {},
        loadingStatus: false,
        editorShowStatus: false
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
        }
    }
}
