export default {
    actions: {
        // createTransact({ commit }, data) {
        //     data.this.axios.post('/api/transactions' , {

        //     })
        //     .then(response => {

        //     })
        //     // .catch((error) => {
        //     //     data.this.$message.error(error.response.data.errors) 
        //     // })
        // },
    },
    mutations: {
        createTransaction(state, newTransaction) {
            state.transactionData = newTransaction
        },
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