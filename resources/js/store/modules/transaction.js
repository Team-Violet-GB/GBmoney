export default {
    actions: {},
    mutations: {
        createTransaction(state, newTransaction) {
            state.transactionData = newTransaction
        }
    },
    state: {
        transactionData: { state_window: false }
    },
    getters: {
        transaction(state) {
            return state.transactionData
        }
    }
}