<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <LineChart :chart-data="chartHistData" :height="130" :options="chartOptions"></LineChart>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content">
                    <CalendarMonth v-bind:default-value="this.currentISODateFrom"
                                   @changeDate="newDate => onMonthChange(newDate)"/>
                </div>
                <p class="total incomes">Доход за период: {{ this.getTotalIncomes }} руб.</p>
                <p class="total expenses">Расход за период: {{ this.getTotalExpenses }} руб.</p>
            </el-col>
            <el-col :span="16">
                <div class="grid-content">
                    <el-card v-for="cat in this.$store.getters.getCategories" :key="id" class="box-card"></el-card>
                </div>
            </el-col>
        </el-row>

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
    data() {
        return {
            dateFrom: "",
            dateTo: "",
            currentISODateFrom: (new Date(new Date().getFullYear(), 0, 2)).toISOString().substr(0, 10),
            currentISODateTo: (new Date()).toISOString().substr(0, 10),
            chartData: null,
            labels: [],
            sumExpenses: [],
            sumIncomes: [],
        }
    },
    computed: {
        ...mapGetters({
            getCategories: 'history/getCategories',
            getLabels: 'history/getLabels',
            getIncomes: 'history/getIncomes',
            getExpenses: 'history/getExpenses',
            getDateFrom: 'history/getDateFrom',
            getDateTo: 'history/getDateTo',
            getTotalIncomes: 'history/getTotalIncomes',
            getTotalExpenses: 'history/getTotalExpenses',
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
                        data: store.getters["history/getIncomesSums"],
                        borderColor: ['green']
                    },
                    {
                        label: 'Расходы',
                        data: store.getters["history/getExpensesSums"],
                        borderColor: ['red']
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
            setTotalIncomes: "history/setTotalIncomes",
            setTotalExpenses: "history/setTotalExpenses",
        }),
        onMonthChange(range) {
            if (typeof (range) === "object") {
                store.commit('setDateFrom', range.from)
                store.commit('setDateTo', range.to)
            }
            store.dispatch('history/fetchExpenses')
            store.dispatch('history/fetchIncomes')
        },
    },
    watch: {
        getIncomes: getIncomes => {
            let labels = []
            let cats = new Map
            let sum = []
            let total = 0
            Object.keys(getIncomes).forEach(
                key => {
                    labels.push(key.substr(0, 7))
                    sum.push(0)
                    if (getIncomes[key].length) {
                        for (let point of getIncomes[key]) {
                            if (!cats.has(point.income_id))
                                cats.set(point.income_id, point.name)
                            sum[sum.length - 1] = (+sum[sum.length - 1] + +point.amount).toFixed(2)
                            total = (+total + +point.amount).toFixed(2)
                        }
                    }
                }
            )
            store.commit('history/setIncomesCategories', cats)
            store.commit('history/setIncomesSums', sum)
            store.commit('history/setLabels', labels)
            store.commit('history/setTotalIncomes', total)
        },
        getExpenses: getExpenses => {
            let cats = new Map
            let sum = []
            let total = 0
            Object.keys(getExpenses).forEach(
                key => {
                    sum.push(0)
                    if (getExpenses[key].length) {
                        for (let point of getExpenses[key]) {
                            if (!cats.has(point.expense_id))
                                cats.set(point.expense_id, point.name)
                            sum[sum.length - 1] = (+sum[sum.length - 1] + +point.amount).toFixed(2)
                            total = (+total + +point.amount).toFixed(2)
                        }
                    }
                }
            )
            store.commit('history/setExpensesCategories', cats)
            store.commit('history/setExpensesSums', sum)
            store.commit('history/setTotalExpenses', total)
        },
    },
    mounted() {
        store.commit('setDateFrom', this.currentISODateFrom)
        store.commit('setDateTo', this.currentISODateTo)
        this.onMonthChange()
    },

}
</script>

<style scoped lang="scss">
.el-row {
    margin-bottom: 20px;

    & :last-child {
        margin-bottom: 0;
    }

}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
}

.row-bg {
    padding: 10px 0;
}

.total {
    font-size: 20px;
    font-weight: 500;
}
.expenses {
    color: #e3342f;
}

.incomes {
    color: #b3fb2acf;
}

</style>
