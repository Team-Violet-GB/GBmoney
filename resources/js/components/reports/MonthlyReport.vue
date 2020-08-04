<template>
    <div>
        <el-row :gutter="30" style="height: 85vh">
            <el-col :span="12">
                <div class="options">
                    <month-picker @changeDate="newDate => onMonthChange(newDate)"/>
                    <div class="block">
                        <el-radio-group @change="generateChartData" v-model="typeOfChart" size="small"
                                        style="margin-left:80px; width: 200px">
                            <el-radio-button label="Доходы">Доходы</el-radio-button>
                            <el-radio-button label="Расходы">Расходы</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <monthChart ref="chart" :chartData="dataChart" :options="chartOptions"/>
            </el-col>
            <el-col :span="12">
                <div class="feed-container-wrapper">
                    <div class="feed-container">
                        <el-alert
                            v-if="getErrorStatus"
                            :title="getErrorInfo"
                            type="error"
                            effect="dark">
                        </el-alert>
                        <feed v-else
                              :editable="false"
                              :transactions="transactions">
                        </feed>
                    </div>
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
                typeOfChart: 'Доходы',
                transactions: {}
            }
        },
        computed: {
            ...mapGetters([
                'getDateFrom',
                'getDateTo',
                'getTransactions',
                'getErrorStatus',
                'getErrorInfo',
                'getPage',
                'getTotal'
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

                        position: 'top',
                        labels: {
                            padding: 5,
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
                'setPage'
            ]),
            onMonthChange(range) {
                this.setDateFrom(range.from);
                this.setDateTo(range.to);
                this.fetchTransactions();
            },
            generateChartData(typeOfChart = this.typeOfChart) {
                let labels = [];
                let data = [];
                let transNew = {}

                let trans = this.getTransactions;
                switch (typeOfChart) {
                    case "Расходы":
                        for (let groupKey in trans) {
                            let transGroup = trans[groupKey]
                            for (let tranKey in transGroup) {
                                let tran = transGroup[tranKey]
                                if (tran.type === 3) {
                                    let name = this.getTypeData(tran).toName
                                    if (!labels.includes(name)) {
                                        labels.push(name);
                                        data.push(this.getTotalOfExpense(tran.expense_id));
                                    }
                                    if (!transNew.hasOwnProperty(groupKey)) {
                                        transNew[groupKey] = [];
                                        transNew[groupKey].push(tran)
                                    } else {
                                        transNew[groupKey].push(tran)
                                    }
                                }
                            }
                        }
                        break;

                    case "Доходы":
                        for (let groupKey in trans) {
                            let transGroup = trans[groupKey]
                            for (let tranKey in transGroup) {
                                let tran = transGroup[tranKey]
                                if (tran.type === 1) {
                                    let name = this.getTypeData(tran).fromName
                                    if (!labels.includes(name)) {
                                        labels.push(name);
                                        data.push(this.getTotalOfIncomes(tran.income_id));
                                    }
                                    if (!transNew.hasOwnProperty(groupKey)) {
                                        transNew[groupKey] = [];
                                        transNew[groupKey].push(tran)
                                    } else {
                                        transNew[groupKey].push(tran)
                                    }
                                }
                            }
                        }
                        break;
                }
                this.transactions = transNew

                return {labels, data}
            },
            getLastISODateOfMonth(anyISODateOfMonth) {
                Date.prototype.lastDayOfMonth = function () {
                    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
                };
                const lastDayOfISODateTo = new Date(anyISODateOfMonth).lastDayOfMonth();

                return anyISODateOfMonth.slice(0, 8) + lastDayOfISODateTo.toString();
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
    .options {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        margin-bottom: 20px;
        padding-right: 5px;
    }

    .feed-container-wrapper {
        width: 100%;
        height: 85vh;
        overflow: hidden;
    }

    .feed-container {
        max-height: 100%;
        width: 100%;
        padding-right: 45px;
        margin-top: 20px;
        overflow-y: scroll;
    }
</style>
