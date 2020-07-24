import axios from "axios";

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
                    commit('setTransactions', Object.assign({}, this.getters.getTransactions, response.data.data));
                    commit('setDisablePagination', response.data.meta.current_page === response.data.meta.last_page);
                    let next = this.getters.getPage;
                    next++;
                    commit('setPage', next);
                })
                .catch(error => {
                    commit('setErrorStatus', true);
                    commit('setErrorInfo', error);
                    //todo: обработка кодов с сервера
                })
                .finally(() => {
                });
        }
    },
    mutations: {
        setTransactions(state, data) {
            state.transactions = data;
        },
        setTransaction(state, data) {
            state.transactions[data.transactionGroupName].splice(data.transactionIndex, 1,  data.edata)
        },
        setEditorShowStatus(state, data) {
            state.editorShowStatus = data
        },
        setEditorData(state, data) {
            state.editorData = data
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
        setDisablePagination(state, data) {
            state.disablePagination = data
        }
    },
    state: {
        transactions: {},
        editorData: '',
        editorShowStatus: false,
        errorStatus: false,
        errorInfo: 'Нет данных!',
        editable: true,
        dateFrom: '',
        dateTo: '',
        page: '',
        disablePagination: false
    },
    getters: {
        getTransactions(state) {
            return state.transactions
        },
        getEditorData(state) {
            return state.editorData
        },
        getEditorShowStatus(state) {
            return state.editorShowStatus
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
        getDisablePagination(state) {
            return state.disablePagination
        }
    }
}
