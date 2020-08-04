<template>
  <div v-loading="loading" element-loading-background="rgba(44, 46, 56, 0.8)">
    <el-row>
      <el-col class="grid-content bg-purple-dark" :span="24">
          <LineChart :chartData="lineChartData" :height="70"></LineChart>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="grid-content bg-purple cstm-col-left" :span="12">
          <CalendarMonth @changeDate="newDate => changeDate(newDate)" />
          <div v-if="type == 'expense'">
            <div class="cstm-pie-chart">
            <PieChart :chartData="pieChartData" :height="350"></PieChart>
          </div>
          <el-card class="box-card">
            <el-row slot="header" class="clearfix tran-group-header">
              <el-col :span="10">{{ point.name }}</el-col>
              <el-col class="cstm-percent" :span="7">100%</el-col>
              <el-col class="cstm-amount" :span="7">{{ 'сумма' }}</el-col>
            </el-row>
            <el-row class="tran-row-data">
              <el-col :span="10">{{ 'name' }}</el-col>
              <el-col class="cstm-percent" :span="7">{{ 'percent' }}</el-col>
              <el-col class="cstm-amount" :span="7">{{ 'amount' }}</el-col>
            </el-row>
          </el-card>
          </div>
      </el-col>
      <el-col  class="grid-content bg-purple-light cstm-feed" :span="12">
          <!-- <Feed :transactions="getTransactionsByPoint"  /> -->
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
      lineChartData: null,
      pieChartData: null,
      point: {name: null, type:null},
      loading: true,
    }
  },

  computed: {
    ...mapGetters([
      'getTransactionsByPoint',
      'getLineData',
      'getPieData',
      'lastHalfYear',
      'colors'
    ]),
  },

 mounted() {
      this.axios.get(`/api/${this.type}s/${this.id}`)  // получение данных о текущаем поинте
      .then(response => {
          this.point = response.data.data
      })
      .then(() => {
        this.fetchCharts({ // получение данных для графиков
          [`${this.type}_id`]: this.id,
          dateFrom: this.lastHalfYear.dateFrom,
          dateTo: this.lastHalfYear.dateTo,
        })
      })
      .then(() => {
        this.setLineChartData()
        this.setPieChartData()
        this.loading = false

      })

    if (!this.getTransactionsByPoint) this.fetchTransactionsByPoint() // получение данных для ленты
  },

  methods: {
    ...mapActions([
      'fetchTransactionsByPoint',
      'fetchCharts',
    ]),

    changeDate(newDate) {
      this.fetchCharts({
        [`${this.type}_id`]: this.id,
        dateFrom: newDate.from,
        dateTo: newDate.to,
      })
    },

    setLineChartData() {
      this.lineChartData = {
        labels: this.getLineData.names,
        datasets: [
          {
            label: this.point.name,
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