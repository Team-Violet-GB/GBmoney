<template>
    <div>
        <el-row :gutter="2" style="height: 100%;">
            <el-col :span="12">

                <!--                выбор диапазона месяцов-->
                <div class="params">
                    <month-picker @changeDate="onMonthChange" style="float: left;"/>

                    <!--                    выбор типа категории для отображения-->
                    <div class="btn-group">
                        <el-button-group>
                            <el-button @click="onTypeBtnClick('Доходы')" type="success" size="mini"
                                       :class="typeOfChart == 'Доходы' ? 'isActive' : 'inActive'">Доходы
                            </el-button>
                            <el-button @click="onTypeBtnClick('Расходы')" type="danger" size="mini"
                                       :class="typeOfChart == 'Расходы' ? 'isActive' : 'inActive'" class="inActive">
                                Расходы
                            </el-button>
                        </el-button-group>

                    </div>
                </div>

                <!--                круговая диаграмма категорий-->
                <div class="chart-block">
                    <div class="total-amount-wrapper">
                        <div v-show="totalAmount !== 0 && getLoaded" class="total-amount"
                             :style="{color: typeOfChart === 'Доходы' ? '#67C23A' : '#F56C6C'}">{{
                            totalAmount.toLocaleString('ru',
                            { maximumFractionDigits: 0 }) }}&#8381
                        </div>
                    </div>
                    <monthChart v-show="getLoaded" ref="chart" :chartData="dataChart" :options="chartOptions"/>

                    <!--                текстовое отображение данных диаграммы-->
                    <div v-if="getLoaded" class="box-card text-chart-table-wrapper">
                        <el-row class="tran-group-header">
                            <el-col class="text-chart-data-name" :span="10">{{ typeOfChart }}</el-col>
                            <el-col class="cstm-percent" :span="7">100%</el-col>
                            <el-col class="tran-group-header-sum" :span="7">{{ totalAmount.toLocaleString('ru',
                                { maximumFractionDigits: 0 }) }}&#8381
                            </el-col>
                        </el-row>
                        <div class="text-chart-data-wrapper">
                            <div class="text-chart-data">
                                <el-row v-for="(item, index) in getTotalAmountOfCategories" :key="index"
                                        class="text-chart-data-row"
                                        :style="{color: item.show ? item.color : 'rgba(110, 110, 114, 0.99)'}">
                                    <div @click="item.show = !item.show"
                                         class="text-chart-data-row-wrapper" style="cursor: pointer">
                                        <el-col :span="10">{{ item.name }}</el-col>
                                        <el-col class="cstm-percent" :span="7">{{ item.show ? ((100 / totalAmount) *
                                            +item.amount).toFixed(1) + '%' : 'не отображается'}}
                                        </el-col>
                                        <el-col class="cstm-amount" :span="7">{{
                                            Number(item.amount).toLocaleString('ru',
                                            {minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            }}&#8381;
                                        </el-col>
                                    </div>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
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

                        <!--                лента-->
                        <feed v-show="getLoaded" :feed-template="false"/>
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
                'getLoaded',
                'getPage',
                'getTotal'
            ]),
            transformResponseToChartData() {
                let labels = [];
                let data = [];
                let colors = [];
                this.totalAmount = 0;

                for (let key in this.getTotalAmountOfCategories) {
                    if (this.getTotalAmountOfCategories[key].show) {
                        labels.push(this.getTotalAmountOfCategories[key].name);
                        data.push(this.getTotalAmountOfCategories[key].amount);
                        colors.push(this.getTotalAmountOfCategories[key].color);
                        this.totalAmount += Number(this.getTotalAmountOfCategories[key].amount);
                    }
                }

                return {labels, data, colors}
            },
            dataChart() {
                return {
                    labels: this.transformResponseToChartData.labels,
                    datasets: [
                        {
                            backgroundColor: this.transformResponseToChartData.colors,
                            borderColor: 'rgba(44,46,56,1)',
                            borderWidth: 2,
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
                        display: false
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
                'setPage',
                'setDateFrom',
                'setDateTo',
                'setExpenseId',
                'setIncomeId',
                'setTypeId',
            ]),
            onTypeBtnClick(typeOfChart) {
                this.typeOfChart = typeOfChart
                this.onMonthChange()
            },
            onMonthChange(range) {

                //установка параметров запросов получения данных диаграммы списка транзакций
                if (typeof (range) === "object") {
                    this.setDateFrom(range.from);
                    this.setDateTo(range.to);
                }
                this.setIncomeId('');
                this.setExpenseId('');
                this.setTypeId(this.typeOfChart == 'Расходы' ? 3 : 1);

                // выполнение запросов
                this.fetchTotalAmountOfCategories();
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
            this.totalAmount = 0;
            this.setPage(1);
            this.setDateFrom(this.currentISODateFrom);
            this.setDateTo(this.getLastISODateOfMonth(this.currentISODateFrom));
            this.onMonthChange();
        },
        components: {
            monthPicker,
            monthChart,
            feed
        }
    }
</script>

<style scoped>
    .params {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        margin-bottom: 20px;
    }

    .btn-group {
        min-width: max-content;
        padding: 0 35px;

    }

    .inActive {
        box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.7);
    }

    .isActive {
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.9);
    }

    .feed-container-wrapper {
        width: 100%;
        height: 83vh;
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
        color: rgba(255, 255, 255, 0.57);
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
    }

    .total-amount-wrapper {
        position: absolute;
        top: 36%;
        font-weight: bolder;
        font-size: x-large;
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
        width: 100%;
    }

    .text-chart-data-wrapper {
        width: 100%;
        overflow: hidden;
    }

    .text-chart-data {
        padding: 7px 0;
        height: 77px;
        border: none;
        background-color: #3D3E48;
        width: 100%;
        padding-right: 45px;
        overflow-y: scroll;
    }

    .text-chart-data-row {
        padding: 0 0 3px 15px;
        font-weight: 500;
    }

    .text-chart-data-row-wrapper {
        cursor: pointer;
    }

    .text-chart-data-row:hover {
        color: #FFF8F6F6;
    }
</style>
