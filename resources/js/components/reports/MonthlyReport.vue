<template>
    <div>
        <el-row :gutter="30" style="height: 85vh">
            <el-col :span="12">
                <div class="options">
                    <month-picker @changeDate="onMonthChange"/>
                    <div class="block">
                        <el-radio-group v-model="categoryOfChart" size="small" style="margin-left:80px; width: 200px">
                            <el-radio-button label="Доходы">Доходы</el-radio-button>
                            <el-radio-button label="Расходы">Расходы</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <monthChart ref="chart" :chartData="dataChart" :options="chartOptions"/>
            </el-col>
            <el-col :span="12">
                <div class="feed-container">
                    <el-alert
                        v-if="getErrorStatus"
                        :title="getErrorInfo"
                        type="error"
                        effect="dark">
                    </el-alert>
                    <feed v-else
                        :editable="false"
                        page="1"
                        :dateFrom="dates.from"
                        :dateTo="dates.to">

                    </feed>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import monthPicker from '../CalendarMonth'
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
                // month: '2020-06-01',
                categoryOfChart: 'Расходы'
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

                let date = new Date(this.month);
                let lastDay = date.lastDayOfMonth();
                const fromDate = this.month;
                const toDate = this.month.slice(0, 8) + lastDay.toString();

                return {from: fromDate, to: toDate}
            },
            chartOptions() {
                responsive: true
                maintainAspectRatio: false
            },
            dataChart() {
                return {
                    labels: this.createChartData().labels,
                    datasets: [
                        {
                            label: 'Расходы',
                            backgroundColor: [
                                'rgba(255,0,0,0.65)',
                                'rgba(127,108,246,0.65)',
                                'rgba(241,217,5,0.65)',
                                'rgba(7,227,52,0.65)',
                                'rgba(13,149,245,0.65)',
                                'rgba(255,99,3,0.65)'
                            ],
                            borderColor: 'rgba(190,99,255,0)',
                            data: this.createChartData().data
                        }
                    ]
                }

            }
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
                'setPage',
                'setErrorStatus'
            ]),
            onMonthChange(range) {
                console.log(range)
                this.setDateFrom(this.dates.from)
                this.setDateTo(this.dates.to)
                this.fetchTransactions()
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
        mounted() {
            this.setDateFrom(this.dates.from)
            this.setDateTo(this.dates.to)
            this.fetchTransactions()
            this.createChartData()
        },
        components: {
            monthPicker,
            monthChart,
            feed
        }
    }
</script>

<style lang="scss" scoped>
    body {
        margin: 0;
    }

    .options {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        margin-bottom: 30px;
        padding-right: 5px;
    }

    .feed-container {
        margin-top: 20px;
        height: 85vh;
        overflow-y: auto;
    }
</style>
