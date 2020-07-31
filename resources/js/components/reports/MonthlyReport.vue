<template>
    <div>
        <el-row :gutter="30" style="height: 100vh">
            <el-col :span="12">
                <div class="block">
                    <span class="month-label">Отчет за месяц </span>
                    <el-date-picker
                        v-model="month"
                        type="month"
                        format="  MMMM yyyy года"
                        value-format="yyyy-MM-dd"
                        @change="onMonthChange">
                    </el-date-picker>
                    <el-radio-group v-model="categoryOfChart" size="small" style="margin-left: 38px">
                        <el-radio-button label="Доходы">Доходы</el-radio-button>

                        <el-radio-button label="Расходы">Расходы</el-radio-button>
                    </el-radio-group>
                </div>
                <monthChart :chart-data="chartData" :options="chartOptions"/>
            </el-col>
            <el-col :span="12">
                <div class="feed-container">
                    <feed
                        :editable="false"
                        page="1"
                        :dateFrom="dates.from"
                        :dateTo="dates.to"
                    ></feed>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import monthChart from "./MonthChart"
    import feed from "../feed/Feed";
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import type from '../feed/TypeMixin';

    export default {
        name: "monthlyReport",
        mixins: [type],
        data() {
            return {
                month: new Date().toISOString().slice(0, 8) + '01',
                categoryOfChart: 'Расходы',
                chartData: null
            }
        },
        computed: {
            ...mapGetters([
                'getTransactions',
                'getErrorStatus',
                'getErrorInfo',
                'getPage',
            ]),
            dates() {
                Date.prototype.lastDayOfMonth = function () {
                    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
                };

                let date = new Date(this.month)
                let lastDay = date.lastDayOfMonth();
                const fromDate = this.month;
                const toDate = this.month.slice(0, 8) + lastDay.toString();

                return {from: fromDate, to: toDate}
            },
            chartOptions() {
                responsive: true
                maintainAspectRatio: false
            },
            createChartData() {
                let labels = [];
                let data = [];
                let trans = this.getTransactions;
                for (let groupKey in trans) {
                    let transGroup = trans[groupKey]
                    for (let tranKey in transGroup) {
                        let tran = transGroup[tranKey]
                        if (tran.type == 3) {
                            let name = this.getTypeData(tran).toName
                            if (!labels.includes(name)) {
                                labels.push(name);
                                data.push(this.getTotalOfExpense(tran.expense_id));
                            }
                        }
                    }
                }
                return {labels, data}
            },
        },
        methods: {
            ...mapActions([
                'fetchWallets',
                'fetchIncomes',
                'fetchExpenses',
                'fetchTags',
                'fetchTransactions'
            ]),
            ...mapMutations([
                'setTransactions',
                'setEditable',
                'setDateFrom',
                'setDateTo',
                'setPage'
            ]),
            onMonthChange() {
                this.setDateFrom(this.dates.from)
                this.setDateTo(this.dates.to)
                this.fetchTransactions()
                this.chartData = {
                    labels: this.createChartData.labels,
                    datasets: [
                        {
                            label: 'Расходы',
                            backgroundColor: ['rgba(190, 99, 255, 0.66)', 'rgba(59,220,89,0.66)', 'rgba(239,106,5,0.66)'],
                            borderColor: 'rgba(190,99,255,0)',
                            data: this.createChartData.data
                        }
                    ]
                }
            },
        },
        mounted() {
            this.setDateFrom(this.dates.from)
            this.setDateTo(this.dates.to)
            this.fetchTransactions()
            this.chartData = {
                labels: this.createChartData.labels,
                datasets: [
                    {
                        label: 'Расходы',
                        backgroundColor: ['rgba(190, 99, 255, 0.66)', 'rgba(59,220,89,0.66)', 'rgba(239,106,5,0.66)'],
                        borderColor: 'rgba(190,99,255,0)',
                        data: this.createChartData.data
                    }
                ]
            }
        },
        components: {
            monthChart,
            feed
        }
    }
</script>

<style scoped>
    .el-date-editor {
        margin-top: 0;
    }

    .month-label {
        color: orange;
        padding-right: 20px;
        margin-left: 30px;
    }

    .block {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 30px;
        padding-right: 5px;
    }

    .feed-container {
        height: 756px;
        overflow-y: scroll;
    }
</style>
