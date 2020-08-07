<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <LineChart :chartData="chartHistData" :height="70"></LineChart>
                </div>
            </el-col>
        </el-row>
        <CalendarMonth @changeDate="newDate => changeDate(newDate)" />
        <el-card v-for="cat in this.$store.getters.getCategories" :key="id" class="box-card">
        </el-card>
    </div>
</template>

<script>
import LineChart from "./HistoryChart"
import {mapActions, mapGetters, mapMutations} from 'vuex'
import CalendarMonth from "../CalendarMonth"

export default {
    name: "History",
    components: { LineChart, CalendarMonth },
    data: () => ({
        dateFrom: "",
        dateTo: "",
        loaded: false,
        chartData: null
    }),
    computed: {
        ...mapGetters({
            getSums: 'history/getSums',
            getCategories: 'history/getCategories',
            getLabels: 'history/getLabels',
            /*'getErrorStatus',
            'getErrorInfo',*/
        }),
        chartOptions() {
            responsive: true
            maintainAspectRatio: false
        },
        chartHistData() {
            return {
                /*labels: ["01.2020", "02.2020", "03.2020", "04.2020", "05.2020", "06.2020", "07.2020", "08.2020", "09.2020", "10.2020", "11.2020", "12.2020"],*/
                labels: this.$store.getters.getLabels,
                datasets: []
            }
        },
        chartLabels() {
            return null
        }
    },
    methods: {
        ...mapActions([
            "history/fetchCategories",
            "history/fetchIncomes",
            "history/fetchExpenses",
        ]),

        ...mapMutations([
            "history/setLabels"
        ]),

        changeDate(newDate) {
            this.dateFrom = newDate[0];
            this.dateTo = newDate[1];
        },
    },
    mounted() {
        this.$store.dispatch('history/fetchCategories')
        this.$store.dispatch('history/fetchExpenses')
        this.$store.dispatch('history/fetchIncomes', {
            dateFrom: '01-2020',
            dateTo: '08-2020',
        })
    },
}
</script>

<style scoped>

</style>
