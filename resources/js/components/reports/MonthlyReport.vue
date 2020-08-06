<template>
    <div>
        <el-row :gutter="30" style="height: 100vh;">
            <el-col :span="12">
                <div class="options">
                    <month-picker @changeDate="newDate => onMonthChange(newDate)"/>
                    <div class="block">
                        <el-radio-group @change="onMonthChange" v-model="typeOfChart" size="small"
                                        style="margin-left:80px; width: 200px">
                            <el-radio-button label="Доходы">Доходы</el-radio-button>
                            <el-radio-button label="Расходы">Расходы</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; align-items: center">
                    <div v-if="totalAmount !== 0" class="totalAmount">{{ totalAmount }}&#8381</div>
                    <monthChart ref="chart" :chartData="dataChart" :options="chartOptions"/>
                </div>
                <el-card v-if="totalAmount !== 0" class="box-card">
                    <el-row slot="header" class="clearfix tran-group-header">
                        <el-col :span="10">{{ typeOfChart }}</el-col>
                        <el-col class="cstm-percent" :span="7">Проценты</el-col>
                        <el-col class="cstm-amount" :span="7">Сумма</el-col>
                    </el-row>
                    <el-row v-for="(item, index) in getTotalAmountOfCategories" :key="index" class="tran-row-data">
                        <el-col :span="10">{{ item.name }}</el-col>
                        <el-col class="cstm-percent" :span="7">{{ ((100 / totalAmount) * +item.amount).toFixed(0) }}%
                        </el-col>
                        <el-col class="cstm-amount" :span="7">{{ Number(item.amount).toFixed(2).toLocaleString() }}&#8381;
                        </el-col>
                    </el-row>
                </el-card>
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
                        <!--                        <feed v-else-->
                        <!--                              :editable="false"-->
                        <!--                              :transactions="transactions">-->
                        <!--                        </feed>-->
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
                totalAmount: 0
            }
        },
        computed: {
            ...mapGetters([
                'getDateFrom',
                'getDateTo',
                'getTransactions',
                'getTotalAmountOfCategories',
                'getErrorStatus',
                'getErrorInfo',
                'getPage',
                'getTotal'
            ]),
            transformResponseToChartData() {
                let labels = [];
                let data = [];
                this.totalAmount = 0;

                for (let key in this.getTotalAmountOfCategories) {
                    labels.push(this.getTotalAmountOfCategories[key].name);
                    data.push(this.getTotalAmountOfCategories[key].amount);
                    this.totalAmount += +this.getTotalAmountOfCategories[key].amount
                }

                return {labels, data}
            },
            dataChart() {
                return {
                    labels: this.transformResponseToChartData.labels,
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
                            data: this.transformResponseToChartData.data
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
                'fetchTransactions',
                'fetchTotalAmountOfCategories'
            ]),
            ...mapMutations([
                'setTransactions',
                'setTotalAmountOfCategories',
                'setDateFrom',
                'setDateTo',
                'setPage'
            ]),
            onMonthChange(range) {
                if (typeof (range) === "object") {
                    this.setDateFrom(range.from);
                    this.setDateTo(range.to);
                }

                switch (this.typeOfChart) {
                    case "Расходы":
                        this.fetchTotalAmountOfCategories('api/report/sum-expenses')
                        break;

                    case "Доходы":
                        this.fetchTotalAmountOfCategories('api/report/sum-incomes')
                        break;
                }
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
            this.onMonthChange()
        },
        components: {
            monthPicker,
            monthChart,
            // feed
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

    .el-card {
        border: none;
        background-color: #3d3e48;
        color: #b682f9;
        margin-top: 20px;
    }

    .tran-group-header {
        color: #b3fb2acf;
        font-size: 20px;
        font-weight: 500;
        padding-left: 5px;
    }

    .tran-group-header-sum {
        text-align: right;
        font-size: 20px;
        font-weight: 500;
        padding-right: 5px;
        padding-top: 4px;
    }

    .cstm-amount {
        text-align: right;
        padding-right: 10px;
    }

    .cstm-percent {
        text-align: center;
    }

    .totalAmount {
        position: absolute;
        top: 48%;
        left: 19%;
        font-weight: bolder;
        font-size: large;
        color: #fbfbfbd1;
        width: 184px;
        text-align: center;
    }
</style>
