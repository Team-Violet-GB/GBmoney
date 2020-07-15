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
                    console.log('finished')
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

    },
    state: {
        transactions: {},
        loadingStatus: false,

    },
    getters: {
        getTransactions(state) {
            return state.transactions
        },
        getGroupeCount(state, groupName) {
            return state.transactions.find(tran => {
                if (tran.key === groupName) {
                    return tran.length
                }
            })
        },
        getLoadingStatus(state) {
            return state.loadingStatus;
        }
    }
}
