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
                date_to: this.getters.getDateTo,
                // expense_id: this.getters.getExpenseId(),
                // income_id: this.getters.getIncomeId(),
                // type: this.getters.getTypeId()
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

        //сеттеры параметров запроса
        setPage(state, data) {
            state.page = Number(data)
        },
        setDateFrom(state, data) {
            state.dateFrom = data
        },
        setDateTo(state, data) {
            state.dateTo = data
        },
        setTypeId(state, data) {
            state.typeId = data
        },
        setExpenseId(state, data) {
            state.expenseId = data
        },
        setIncomeId(state, data) {
            state.incomeId = data
        },


        setErrorStatus(state, data) {
            state.errorStatus = data
        },
        setErrorInfo(state, data) {
            state.errorInfo = data
        },

        setTotal(state, data) {
            state.total = Number(data)
        },
        updateTransactionsByPoint(state, transactions) {
            state.transactionsByPoint = transactions
        },
    },
    state: {
        transactions: null,
        transactionsByPoint: null,
        errorStatus: false,
        errorInfo: 'Не предопределенное сообщение об ошибке ...',

        //параметры запроса транзакций
        page: 1,
        dateFrom: '',
        dateTo: '',
        expenseId: '',
        incomeId: '',
        typeId: '',

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

        getDateFrom(state) {
            return state.dateFrom
        },
        getDateTo(state) {
            return state.dateTo
        },
        getPage(state) {
            return state.page
        },
        getTypeId(state) {
            return state.typeId
        },
        getExpenseId(state) {
            return state.expenseId
        },
        getIncomeId(state) {
            return state.incomeId
        },
        getTotal(state) {
            return Number(state.total)
        }
    }
}
