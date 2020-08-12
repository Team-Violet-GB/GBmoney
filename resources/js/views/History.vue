<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <LineChart :chart-data="chartHistData" :height="130" :options="chartOptions"></LineChart>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="center">
            <div class="grid-content">
                <el-col :span="8">
                    <CalendarMonth :default-value="currentISODateFrom"
                                   @changeDate="newDate => onMonthChange(newDate)"/>
                </el-col>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <p class="total incomes">Доход за период: {{ Number(this.getTotalIncomes).toLocaleString('ru') }}
                    &#8381;</p>
                <p class="total expenses">Расход за период: {{ Number(this.getTotalExpenses).toLocaleString('ru') }}
                    &#8381;</p>
                <p class="total profit">Прибыль:
                    {{ Number(this.getTotalIncomes - this.getTotalExpenses).toLocaleString('ru') }} &#8381;</p>
            </el-col>
            <el-col :span="6">
                <p class="total incomes">Мин. доход: {{ Number(this.getMinIncomes).toLocaleString('ru') }} &#8381;</p>
                <p class="total expenses">Мин. расход: {{ Number(this.getMinExpenses).toLocaleString('ru') }}
                    &#8381;</p>
            </el-col>
            <el-col :span="6">
                <p class="total incomes">Средний доход: {{ Number(this.getAvgIncomes).toLocaleString('ru') }}
                    &#8381;</p>
                <p class="total expenses">Средний расход: {{ Number(this.getAvgExpenses).toLocaleString('ru') }}
                    &#8381;</p>
            </el-col>
            <el-col :span="6">
                <p class="total incomes">Макс. доход: {{ Number(this.getMaxIncomes).toLocaleString('ru') }} &#8381;</p>
                <p class="total expenses">Макс. расход: {{ Number(this.getMaxExpenses).toLocaleString('ru') }}
                    &#8381;</p>
            </el-col>
        </el-row>
        <el-row>
            <div class="grid-content">
                <el-col :span="12">
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="8">
                            <p class="incomes label">Фильтр Доходов</p>
                        </el-col>
                    </el-row>
                    <el-checkbox-group v-model="checkListIncomes">
                        <el-checkbox v-for="cat in this.$store.getters['history/getCategories'].incomes"
                                     :label="cat" :key="cat"
                                     @change="handleChangeIncomes(cat)">
                        </el-checkbox>
                    </el-checkbox-group>
                </el-col>
                <el-col :span="12">
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="8">
                            <p class="expenses label">Фильтр Расходов</p>
                        </el-col>
                    </el-row>
                    <el-checkbox-group v-model="checkListExpenses">
                        <el-checkbox v-for="cat in this.$store.getters['history/getCategories'].expenses"
                                     :label="cat" :key="cat"
                                     @change="handleChangeExpenses(cat)">
                        </el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </div>
        </el-row>

    </div>
</template>

<script>
import LineChart from "../components/history/HistoryChart"
import {mapActions, mapGetters, mapMutations} from 'vuex'
import CalendarMonth from "../components/CalendarMonth"
import store from "../store"

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
            checkListsRenew: true,
            checkListIncomes: [],
            checkListExpenses: [],
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
            getMinIncomes: "history/getMinIncomes",
            getAvgIncomes: "history/getAvgIncomes",
            getMaxIncomes: "history/getMaxIncomes",
            getMinExpenses: "history/getMinExpenses",
            getAvgExpenses: "history/getAvgExpenses",
            getMaxExpenses: "history/getMaxExpenses",
        }),
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    labels: {
                        fontColor: 'white',
                        fontSize: 16
                    },

                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontColor: 'white'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontColor: 'white'
                        }
                    }],
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ': ' + Number(tooltipItem.value).toLocaleString('ru') + ' ₽';
                        },
                    },
                    displayColors: false
                }
            }
        },
        chartHistData() {
            return {
                labels: store.getters["history/getLabels"],
                datasets: [
                    {
                        label: 'Доходы',
                        data: store.getters["history/getIncomesSums"],
                        borderColor: ['green'],
                        color: ['white']
                    },
                    {
                        label: 'Расходы',
                        data: store.getters["history/getExpensesSums"],
                        borderColor: ['red'],
                        color: ['white']
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
            setMinIncomes: "history/setMinIncomes",
            setAvgIncomes: "history/setAvgIncomes",
            setMaxIncomes: "history/setMaxIncomes",
            setMinExpenses: "history/setMinExpenses",
            setAvgExpenses: "history/setAvgExpenses",
            setMaxExpenses: "history/setMaxExpenses",
        }),
        onMonthChange(range) {
            if (typeof (range) === "object") {
                store.commit('setDateFrom', range.from)
                store.commit('setDateTo', range.to)
            }
            this.checkListsRenew = true
            store.dispatch('history/fetchExpenses')
            store.dispatch('history/fetchIncomes')
        },
        handleChangeIncomes(value) {
            this.checkListsRenew = false
            this.updateIncomes(store.getters['history/getIncomes'])
        },
        handleChangeExpenses(value) {
            this.checkListsRenew = false
            this.updateExpenses(store.getters['history/getExpenses'])
        },
        updateIncomes(getIncomes) {
            let labels = []
            let cats = []
            let sum = []
            let total = 0
            let min = 0
            let max = 0
            let avg
            Object.keys(getIncomes).forEach(
                key => {
                    labels.push(key.substr(0, 7))
                    sum.push(0)
                    if (getIncomes[key].length) {
                        for (let point of getIncomes[key]) {
                            if (!cats.includes(point.name)) {
                                cats.push(point.name)
                            }
                            if (this.checkListsRenew)
                                this.checkListIncomes = cats
                            if (this.checkListIncomes.includes(point.name)) {
                                sum[sum.length - 1] = (+sum[sum.length - 1] + +point.amount).toFixed(2)
                                total = (+total + +point.amount).toFixed(2)
                            }
                        }
                    }
                    let num = Number(sum[sum.length - 1])
                    max = max < num ? num.toFixed(2) : max
                    min = min >= num ? num.toFixed(2) : min
                }
            )
            avg = (total / labels.length).toFixed(2)

            store.commit('history/setIncomesCategories', cats)
            store.commit('history/setIncomesSums', sum)
            store.commit('history/setLabels', labels)
            store.commit('history/setTotalIncomes', total)
            store.commit('history/setMinIncomes', min)
            store.commit('history/setAvgIncomes', avg)
            store.commit('history/setMaxIncomes', max)
        },
        updateExpenses(getExpenses) {
            let labels = []
            let cats = []
            let sum = []
            let total = 0
            let min = 0
            let max = 0
            let avg
            Object.keys(getExpenses).forEach(
                key => {
                    labels.push(key.substr(0, 7))
                    sum.push(0)
                    if (getExpenses[key].length) {
                        for (let point of getExpenses[key]) {
                            if (!cats.includes(point.name)) {
                                cats.push(point.name)
                            }
                            if (this.checkListsRenew)
                                this.checkListExpenses = cats
                            if (this.checkListExpenses.includes(point.name)) {
                                sum[sum.length - 1] = (+sum[sum.length - 1] + +point.amount).toFixed(2)
                                total = (+total + +point.amount).toFixed(2)
                            }
                        }
                    }
                    let num = Number(sum[sum.length - 1])
                    max = max < num ? num.toFixed(2) : max
                    min = min >= num ? num.toFixed(2) : min
                }
            )
            avg = (total / labels.length).toFixed(2)

            store.commit('history/setExpensesCategories', cats)
            store.commit('history/setExpensesSums', sum)
            store.commit('history/setTotalExpenses', total)
            store.commit('history/setMinExpenses', min)
            store.commit('history/setAvgExpenses', avg)
            store.commit('history/setMaxExpenses', max)
        }
    },
    watch: {
        getIncomes: function (getIncomes) {
            this.updateIncomes(getIncomes)
        },

        getExpenses: function (getExpenses) {
            this.updateExpenses(getExpenses)
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
    font-size: 18px;
    font-weight: 300;
}

.expenses {
    color: #e3342f;
}

.incomes {
    color: #b3fb2acf;
}

.profit {
    color: #0dadec;
}

.label {
    font-size: 16px;
    font-weight: 600;
}


</style>
