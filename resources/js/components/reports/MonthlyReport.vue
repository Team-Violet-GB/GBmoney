<template>
    <div>
        <el-row :gutter="30" style="height: 85vh">
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

                for (let key in this.getTotalAmountOfCategories) {
                    labels.push(this.getTotalAmountOfCategories[key].name);
                    data.push(this.getTotalAmountOfCategories[key].amount);
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
                if (typeof(range) === "object") {
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
</style>
