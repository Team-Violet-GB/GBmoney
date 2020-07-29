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
                </div>
                <monthChart :chartdata="chartData" :options="chartOptions"/>
            </el-col>
            <el-col :span="12">
                <feed
                    :editable="false"
                    page="1"
                    :dateFrom="dates.from"
                    :dateTo="dates.to"
                ></feed>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import monthChart from "./MonthChart"
    import feed from "../feed/Feed";
    import {mapActions, mapGetters, mapMutations} from 'vuex';

    export default {
        name: "monthlyReport",
        data() {
            return {
                month: new Date().toISOString().slice(0, 8) + '01'
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
            chartData() {
                return {
                    labels: ['Ребенок', 'Комуналка','Авто','Разное','Здоровье','Потерял'],
                    datasets: [
                        {
                            label: 'Комуналка',
                            backgroundColor: 'rgb(190, 99, 255, 0.25)',
                            borderColor: 'rgb(190, 99, 255)',
                            data: [1500, 1800, 2000, 1300, 1600, 1200]
                        },{
                            label: 'Ребенок',
                            backgroundColor: 'rgb(190, 99, 255, 0.25)',
                            borderColor: 'rgb(190, 99, 255)',
                            data: [1300, 1400, 1000, 1300, 1600, 1200]
                        },

                    ]
                }
            },
            chartOptions() {
                responsive: true
                maintainAspectRatio: false
            },
            chartLabels() {
                return Object.keys(this.getTransactions);
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
                'setPage'
            ]),
            onMonthChange() {
                this.setPage(1)
                this.setDateFrom(this.dates.from)
                this.setDateTo(this.dates.to)
                this.setTransactions({})
                this.getTransactions()
            }
        },
        mounted() {

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

</style>
