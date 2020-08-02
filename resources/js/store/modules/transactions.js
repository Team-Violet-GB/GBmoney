import axios from "axios";
import { update } from "lodash";

export default {
    actions: {
        fetchTransactions({commit}) {
            const headers = {
                'Content-Type': 'application/json'
            }
            const params = {
                page: this.getters.getPage,
                date_from: this.getters.getDateFrom,
                date_to: this.getters.getDateTo
            }
            commit('setErrorStatus', false);
            axios.get('/api/transactions', {params: params, headers: headers})
                .then(response => {
                    commit('setTotal', response.data.meta.total);
                    commit('setTransactions', response.data.data);
                    if ((Object.keys(response.data.data).length) === 0) {
                        commit('setErrorStatus', true);
                        commit('setErrorInfo', `За запрошеный период транзакции не производились ...`);
                    } else {
                        commit('setErrorStatus', false);
                    }
                })
                .catch(error => {
                    commit('setErrorStatus', true);
                    commit('setErrorInfo', `Ошибка во время запроса транзакций: (${error})`);
                })
        },
        fetchTransactionsByPoint({ commit }, data) {
            // axios.get('/api/get/transactions', {      \\ ждём реализацию на бэке
            //     params: {
            //         id: data.id,
            //         type: data.type,
            //         dateFrom: data.dateFrom,
            //         dateFrom: data.dateTo
            //       }
            // })
            // .then(response => {
            //     const transactions = response.data.data
            //     commit('updateTransactionsByPoint', transactions)
            // })
                const transactions = this.getters.getTransactions // заглушка
                commit('updateTransactionsByPoint', transactions)
        },
    },
    mutations: {
        setTransactions(state, data) {
            state.transactions = data
        },
        setErrorStatus(state, data) {
            state.errorStatus = data
        },
        setErrorInfo(state, data) {
            state.errorInfo = data
        },
        setEditable(state, data) {
            state.editable = data
        },
        setDateFrom(state, data) {
            state.dateFrom = data
        },
        setDateTo(state, data) {
            state.dateTo = data
        },
        setPage(state, data) {
            state.page = Number(data)
        },
        setTotal(state, data) {
            state.total = Number(data)
        },
        updateTransactionsByPoint(state, transactions) {
            state.transactionsByPoint = transactions
        },
    },
    state: {
        transactions: {},
        transactionsByPoint: null,
        errorStatus: false,
        errorInfo: 'Не предопределенное сообщение об ошибке ...',
        editable: true,
        dateFrom: '',
        dateTo: '',
        page: 1,
        total: 1,
    },
    getters: {
        getTransactions(state) {
            return state.transactions
        },
        getTransactionsByPoint(state) {
            return state.transactionsByPoint
        },
        getErrorStatus(state) {
            return state.errorStatus
        },
        getErrorInfo(state) {
            return state.errorInfo
        },
        getEditable(state) {
            return state.editable
        },
        getDateFrom(state) {
            return state.dateFrom
        },
        getDateTo(state) {
            return state.dateTo
        },
        getPage(state) {
            return state.page
        },
        getTotal(state) {
            return Number(state.total)
        }
    }
}
