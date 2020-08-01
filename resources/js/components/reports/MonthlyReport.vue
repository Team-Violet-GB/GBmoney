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
                          :editable="false">
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
                currentISODateFrom: new Date().toISOString().slice(0, 8) + '01',
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
            dataChart() {
                const generatedChartData = this.generateChartData()
                return {
                    labels: generatedChartData.labels,
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
                            data: generatedChartData.data
                        }
                    ]
                }
            },
            chartOptions() {
                return {
                    responsive: true,
                    maintainAspectRation: true,
                    legend: {
                        padding: 40,
                        position: 'top',
                        labels: {
                            fontColor: 'rgb(255,255,255)'
                        }

                    }
                }
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
                'setPage',
                'setErrorStatus'
            ]),
            onMonthChange(range) {
                this.setDateFrom(range[0])
                this.setDateTo(this.getLastISODateOfMonth(range[1]))
                this.fetchTransactions()
            },
            generateChartData() {
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
            getLastISODateOfMonth(anyISODateOfMonth) {
                Date.prototype.lastDayOfMonth = function () {
                    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
                };
                const lastDayOfDateTo = new Date(anyISODateOfMonth).lastDayOfMonth();
                const lastDateOfMonth = anyISODateOfMonth.slice(0, 8) + lastDayOfDateTo.toString();

                return lastDateOfMonth;
            }
        },
        mounted() {
            this.setDateFrom(this.currentISODateFrom);
            this.setDateTo(this.getLastISODateOfMonth(this.currentISODateFrom));
            this.fetchTransactions();
            this.generateChartData();
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
