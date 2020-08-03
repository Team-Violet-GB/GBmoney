<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <LineChart :chartData="lineChartData" :height="70"></LineChart>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple cstm-col-left">
          <CalendarMonth @changeDate="newDate => changeDate(newDate)" />
          <div class="cstm-pie-chart">
            <PieChart :chartData="pieChartData" :height="350"></PieChart>
          </div>
          <el-card v-for="point in pointsByType" :key="point.id" class="box-card">
            <el-row v-if="point.id == id" slot="header" class="clearfix tran-group-header">
              <el-col :span="10">{{ point.name }}</el-col>
              <el-col class="cstm-percent" :span="7">100%</el-col>
              <el-col class="cstm-amount" :span="7">{{ 'сумма' }}</el-col>
            </el-row>
            <el-row v-if="point.id == id" class="tran-row-data">
              <el-col :span="10">{{ 'name' }}</el-col>
              <el-col class="cstm-percent" :span="7">{{ 'percent' }}</el-col>
              <el-col class="cstm-amount" :span="7">{{ 'amount' }}</el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light cstm-feed">
          <!-- <Feed :transactions="getTransactionsByPoint" /> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import LineChart from "../components/chart/LineChart"
import PieChart from "../components/chart/PieChart"
import Feed from "../components/feed/Feed"
import CalendarMonth from "../components/CalendarMonth"

export default {
  components: {
    LineChart,
    PieChart,
    Feed,
    CalendarMonth,
  },

  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.params.type,
      dateFrom: "",
      dateTo: "",
      lineChartData: null,
      pieChartData: null
    }
  },

  computed: {
    ...mapGetters([
      'points',
      'getTransactionsByPoint',
      'incomes',
      'wallets',
      'expenses',
      'getLineData',
      'getPieData',
      'thisMonth',
      'lastHalfYear',
      'colors'
    ]),
    pointsByType() {
      return this.points[this.type]
    },
  },

  mounted() {
    // получение данных для линейного графика
    this.fetchLineChart({
        [`${this.type}_id`]: this.id,
        dateFrom: this.lastHalfYear.dateFrom,
        dateTo: this.lastHalfYear.dateTo,
      })
    this.setLineChartData()

    // получение данных для круглого графика
    this.fetchPieChart({
        [`${this.type}_id`]: this.id,
        dateFrom: this.thisMonth.dateFrom,
        dateTo: this.thisMonth.dateTo,
      })
    this.setPieChartData()

    // получение данных для ленты
    if (!this.getTransactionsByPoint) this.fetchTransactionsByPoint()
    switch (this.type) {
      case 'income':
        if (!this.incomes) this.fetchIncomes()
        break
      case 'wallet':
        if (!this.wallets) this.fetchWallets()
        break
      case 'expense':
        if (!this.expenses) this.fetchExpenses()
        break
      }
  },

  methods: {
    ...mapActions([
      'fetchTransactionsByPoint',
      'fetchIncomes',
      'fetchWallets',
      'fetchExpenses',
      'fetchLineChart',
      'fetchPieChart',
    ]),

    changeDate(newDate) {
      this.dateFrom = newDate[0];
      this.dateTo = newDate[1];
    },

    setLineChartData() {
      this.lineChartData = {
        labels: this.getLineData.names,
        datasets: [
          {
            label: "this.poinst[this.type][this.id].name",
            backgroundColor: "rgba(10, 147, 209, 0.2)",
            borderColor: "rgba(10, 147, 209)",
            data: this.getLineData.amounts,
          },
          //   {   // вторая линия
          //     label: "Непродажи",
          //     backgroundColor: "#e6a23c",
          //     data: [5000, 15000, 10000, 30000],
          //   },
        ],
      }
    },

    setPieChartData() {
      this.pieChartData = {
        labels: this.getPieData.names,
        datasets: [
          {
            label: "Продажи",
            backgroundColor: this.colors,
            borderWidth: 0,
            data: this.getPieData.amounts
          },
        ],
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.cstm-col-left {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cstm-pie-chart,
.cstm-feed {
  margin-top: 20px;
}

.cstm-amount {
  text-align: right;
  padding-right: 10px;
}
.cstm-percent {
  text-align: center;
}

body {
  margin: 0;
}
.el-card {
  border: none;
  background-color: #3d3e48;
  color: #b682f9;
  width: 90%;
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
</style>