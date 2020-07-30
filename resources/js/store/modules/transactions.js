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
                data_from: this.getters.getDateFrom,
                data_to: this.getters.getDateTo
            }
            axios.get('/api/transactions', {params: params, headers: headers})
                .then(response => {
                    commit('setTotal', response.data.meta.total);
                    commit('setTransactions', response.data.data);
                })
                .catch(error => {
                    commit('setErrorStatus', true);
                    commit('setErrorInfo', `Транзакции отсутствуют: (${error})`);
                })
                .finally(() => {
                    if (Object.keys(this.getters.getTransactions).length === 0) {
                        commit('setErrorStatus', true);
                    }
                });
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
            state.page = data
        },
        setTotal(state, data) {
            state.total = data
        },
        updateTransactionsByPoint(state, transactions) {
            state.transactionsByPoint = transactions
        },
    },
    state: {
        transactions: {},
        errorStatus: false,
        errorInfo: 'Список транзакций пуст',
        editable: true,
        dateFrom: '',
        dateTo: '',
        page: '',
        total: '',
        transactionsByPoint: null
    },
    getters: {
        getTransactions(state) {
            return state.transactions
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
