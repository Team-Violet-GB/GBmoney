export default {
    actions: {
        fetchIncomes({ commit }) {
            const incomes = [
                { id: 1, name: "Зарплата", icon: "el-icon-money", money: 20000 },
                { id: 2, name: "Депозит", icon: "el-icon-s-data", money: 1000 },
                { id: 3, name: "Кэшбэк", icon: "el-icon-coin", money: 500 },
                { id: 4, name: "Подарки", icon: "el-icon-present", money: 5000 }
            ]
            commit('updateIncomes', incomes)
        },
        fetchWallets({ commit }) {
            const wallets = [
                { id: 1, name: "Наличные", icon: "el-icon-wallet", money: 20000 },
                { id: 2, name: "Карта Такая", icon: "el-icon-bank-card", money: 15000 },
                { id: 3, name: "Карта Сякая", icon: "el-icon-bank-card", money: 100000 }
            ]
            commit('updateWallets', wallets)
        },
        fetchExpenses({ commit }) {
            const expenses = [
                { id: 1, name: "Бензин", icon: "el-icon-tableware", money: 20000, plan: 5000 },
                { id: 2, name: "Еда", icon: "el-icon-truck", money: 15000, plan: 5000 },
                { id: 3, name: "Связь", icon: "el-icon-present", money: 5000, plan: 5000 },
                { id: 4, name: "Развлечения", icon: "el-icon-tableware", money: 5000, plan: 5000 },
                { id: 5, name: "Вещи", icon: "el-icon-truck", money: 4000, plan: 5000 },
                { id: 6, name: "Автомобиль", icon: "el-icon-present", money: 1000, plan: 5000 },
                { id: 7, name: "Дорога", icon: "el-icon-tableware", money: 500, plan: 5000 },
                { id: 8, name: "Ребенок", icon: "el-icon-truck", money: 300, plan: 5000 },
                { id: 9, name: "Другое", icon: "el-icon-present", money: 3300, plan: 5000 },
                { id: 10, name: "Здоровье", icon: "el-icon-tableware", money: 15000, plan: 5000 },
                { id: 11, name: "Ипотека", icon: "el-icon-truck", money: 4500, plan: 5000 },
                { id: 12, name: "Квартира", icon: "el-icon-present", money: 6000, plan: 5000 },
                { id: 13, name: "Учеба", icon: "el-icon-tableware", money: 15000, plan: 5000 },
            ]
            commit('updateExpenses', expenses)
        },
        fetchTags({ commit }) {
            const tags = [
                { id: 1, name: "Подкатегория1" },
                { id: 2, name: "Подкатегория2" },
                { id: 3, name: "Подкатегория3" },
                { id: 4, name: "Подкатегория4" }
            ]
            commit('updateTags', tags)
        },
    },
    mutations: {
        updateIncomes(state, point) {
            state.incomesList = point
        },
        updateWallets(state, point) {
            state.walletsList = point
        },
        updateExpenses(state, point) {
            state.expensesList = point
        },
        updateTags(state, point) {
            state.tagsList = point
        }
    },
    state: {
        incomesList: [],
        walletsList: [],
        expensesList: [],
        tagsList: []
    },
    getters: {
        incomes(state) {
            return state.incomesList
        },
        wallets(state) {
            return state.walletsList
        },
        expenses(state) {
            return state.expensesList
        },
        tags(state) {
            return state.tagsList
        },
    }
}
