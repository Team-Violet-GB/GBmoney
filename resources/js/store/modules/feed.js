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
                    console.log(response.data.meta)
                    console.log('страница из ответа current_page : ', response.data.meta.current_page)
                    console.log('страница из ответа last_page : ', response.data.meta.last_page)
                    console.log('страница из store.page: ', this.getters.getPage)

                    commit('setTotal', response.data.meta.total);
                    commit('setTransactions', response.data.data);
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
            state.transactions = data
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
        },
        setTotal(state, data) {
            state.total = data
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
        total: '',
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
        },
        getTotal(state) {
            return Number(state.total)
        }
    }
}
