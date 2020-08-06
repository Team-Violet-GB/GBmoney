<template>
    <div>
        <el-row :gutter="30" style="height: 100%;">
            <el-col :span="12">

                <!--                выбор диапазона месяцов-->
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

                <!--                круговая диаграмма категорий-->
                <div class="chart-block">
                    <div class="total-amount-wrapper" v-if="totalAmount !== 0">
                        <div class="total-amount">{{ totalAmount }}&#8381</div>
                    </div>
                    <monthChart ref="chart" :chartData="dataChart" :options="chartOptions"/>
                </div>

                <!--                текстовое отображение данных диаграммы-->
                <div v-if="totalAmount !== 0" class="box-card text-chart-table-wrapper">
                    <el-row class="tran-group-header">
                        <el-col class="text-chart-data-name" :span="10">{{ typeOfChart }}</el-col>
                        <el-col class="cstm-percent" :span="7">Проценты</el-col>
                        <el-col class="tran-group-header-sum" :span="7">Сумма</el-col>
                    </el-row>
                    <div class="text-chart-data-wrapper">
                        <div class="text-chart-data">
                            <el-row class="text-chart-data-row" v-for="(item, index) in getTotalAmountOfCategories" :key="index">
                                <el-col :span="10">{{ item.name }}</el-col>
                                <el-col class="cstm-percent" :span="7">{{ ((100 / totalAmount) *
                                    +item.amount).toFixed(0) }}%
                                </el-col>
                                <el-col class="cstm-amount" :span="7">{{ Number(item.amount).toFixed(2).toLocaleString()
                                    }}&#8381;
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">

<!--                лента-->
                <div class="feed-container-wrapper">
                    <div class="feed-container">
                        <el-alert
                            v-if="getErrorStatus"
                            :title="getErrorInfo"
                            type="error"
                            effect="dark">
                        </el-alert>
                        <feed v-else
                              :editable="true"
                              :feed-template="false"
                              :transactions="getTransactions">
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
                //установка параметров запроса
                if (typeof (range) === "object") {
                    this.setDateFrom(range.from);
                    this.setDateTo(range.to);
                }
                let url = this.typeOfChart == 'Расходы' ? 'api/report/sum-expenses' : 'api/report/sum-incomes';

                // выполнение запроса
                this.fetchTotalAmountOfCategories(url);
                this.fetchTransactions();
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
        padding-bottom: 20px;
    }

    .feed-container {
        max-height: 100%;
        width: 100%;
        padding-right: 45px;
        margin-top: 20px;
        overflow-y: scroll;
    }

    .tran-group-header {
        color: #b3fb2acf;
        font-size: 20px;
        font-weight: 500;
        background-color: #5F6068;
        padding-left: 5px;
        padding-bottom: 5px;
        padding-top: 3px;
    }

    .tran-group-header-sum {
        text-align: right;
        font-size: 20px;
        font-weight: 500;
        padding-right: 20px;
    }

    .text-chart-data-name {
        padding-left: 10px;
    }

    .cstm-amount {
        text-align: right;
    }

    .cstm-percent {
        text-align: center;
    }

    .chart-block {
        width: 70%;
        margin: 0 auto;
        position: relative
    }

    .chart {
        width: auto;
        /*position: absolute;*/
        /*height: 450px;*/
    }

    .total-amount-wrapper {
        position: absolute;
        top: 50%;
        font-weight: bolder;
        font-size: x-large;
        color: #fbfbfbd1;

        width: 100%;
        text-align: center;
    }

    .total-amount {
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 150px;
    }

    .text-chart-table-wrapper {
        border: none;
        margin-top: 20px;
        position: fixed;
        width: 730px;
        bottom: 20px;
    }

    .text-chart-data-wrapper {
        width: 100%;
        overflow: hidden;
    }

    .text-chart-data {
        padding: 7px 0;
        height: 70px;
        border: none;
        background-color: rgba(61, 62, 72, 0.99);
        color: #b682f9;
        width: 100%;
        padding-right: 45px;
        overflow-y: scroll;
    }

    .text-chart-data-row {
        padding: 0px 0px 3px 15px;
    }
</style>
