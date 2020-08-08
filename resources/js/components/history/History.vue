<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <LineChart :chart-data="chartHistData" :height="130" :options="chartOptions"></LineChart>
                </div>
            </el-col>
        </el-row>
        <CalendarMonth @changeDate="newDate => onMonthChange(newDate)"/>
        <el-card v-for="cat in this.$store.getters.getCategories" :key="id" class="box-card">
        </el-card>
    </div>
</template>

<script>
import LineChart from "./HistoryChart"
import {mapActions, mapGetters, mapMutations} from 'vuex'
import CalendarMonth from "../CalendarMonth"
import store from "../../store/index.js"

export default {
    name: "History",
    components: {LineChart, CalendarMonth, store},
    data: () => ({
        dateFrom: "",
        dateTo: "",
        currentISODateFrom: (new Date(new Date().getFullYear(), 0, 2)).toISOString().substr(0, 10),
        currentISODateTo: (new Date()).toISOString().substr(0, 10),
        chartData: null,
        labels: [],
        sumExpenses: [],
        sumIncomes: []
    }),
    computed: {
        ...mapGetters({
            getCategories: 'history/getCategories',
            getLabels: 'history/getLabels',
            getIncomes: 'history/getIncomes',
            getExpenses: 'history/getExpenses',
            getDateFrom: 'history/getDateFrom',
            getDateTo: 'history/getDateTo',
        }),
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: true,
            }
        },
        chartHistData() {
            return {
                labels: store.getters["history/getLabels"],
                datasets: [
                    {
                        label: 'Доходы',
                        data: store.getters["history/getIncomesSums"]
                    },
                    {
                        label: 'Расходы',
                        data: store.getters["history/getExpensesSums"]
                    },
                ]
            }
        },
    },
    methods: {
        ...mapActions([
            "history/fetchIncomes",
            "history/fetchExpenses",
        ]),

        ...mapMutations({
            setLabels: "history/setLabels",
            setDateFrom: "history/setDateFrom",
            setDateTo: "history/setDateTo",
            setExpensesSums: "history/setExpensesSums",
            setIncomesSums: "history/setIncomesSums",
        }),
        onMonthChange(range) {
            if (typeof (range) === "object") {
                this.$store.commit('history/setDateFrom', range.from);
                this.$store.commit('history/setDateTo', range.to);
            }
            this.$store.dispatch('history/fetchExpenses')
            this.$store.dispatch('history/fetchIncomes')
        },
        update() {
            this.$store.commit('setDateFrom', this.currentISODateFrom)
            this.$store.commit('setDateTo', this.currentISODateTo)
            this.$store.dispatch('history/fetchExpenses')
            this.$store.dispatch('history/fetchIncomes')
        }
    },
    watch: {
        getIncomes: getIncomes => {
            let labels = []
            let cats = new Map
            let sum = []

            Object.keys(getIncomes).forEach(
                key => {
                    labels.push(key.substr(0, 7))
                    sum.push(0)
                    if (getIncomes[key].length) {
                        for (let point of getIncomes[key]) {
                            if (!cats.has(point.income_id))
                                cats.set(point.income_id, point.name)
                            sum[sum.length - 1] += +point.amount
                        }
                    }
                }
            )
            console.log(sum)
            console.log(cats)
            store.commit('history/setIncomesCategories', cats)
            store.commit('history/setIncomesSums', sum)
            store.commit('history/setLabels', labels)
        },
        getExpenses: getExpenses => {
            let cats = new Map
            let sum = []
            Object.keys(getExpenses).forEach(
                key => {
                    sum.push(0)
                    if (getExpenses[key].length) {
                        for (let point of getExpenses[key]) {
                            if (!cats.has(point.expense_id))
                                cats.set(point.expense_id, point.name)
                            sum[sum.length - 1] += +point.amount
                        }
                    }
                }
            )
            console.log(sum)
            console.log(cats)
            store.commit('history/setExpensesCategories', cats)
            store.commit('history/setExpensesSums', sum)
        },
    },
    mounted() {
        this.update()
    },

}
</script>

<style scoped>

</style>
