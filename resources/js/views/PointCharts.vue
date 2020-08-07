<template>
  <div v-loading="loadingCharts" element-loading-background="rgba(44, 46, 56, 0.8)">
    <el-row>
      <el-col class="grid-content bg-purple-dark" :span="24">
          <LineChart :chartData="lineChart" :height="70"></LineChart>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="grid-content bg-purple cstm-col-left" :span="12">
          <CalendarMonth @changeDate="newDate => changeDate(newDate)" />
          <div v-if="type == 'expense'">
            <div class="cstm-pie-chart">
            <PieChart :chartData="pieChart" :height="350"></PieChart>
          </div>
          <el-card class="box-card">
            <el-row slot="header" class="clearfix tran-group-header">
              <el-col :span="10">{{ point.name }}</el-col>
              <el-col class="cstm-percent" :span="7">100%</el-col>
              <el-col class="cstm-amount" :span="7">{{ Number(pieSumm).toLocaleString() }} &#8381;</el-col>
            </el-row>
            <el-row v-for="tag in pieTable" :key="tag.tag_id" class="tran-row-data" :style="`color: ${tag.color} ;`">
              <el-col :span="10">{{ tag.name }}</el-col>
              <el-col class="cstm-percent" :span="7">{{ (tag.amount/pieSumm * 100).toFixed(1) }}%</el-col>
              <el-col class="cstm-amount" :span="7">{{ Number(tag.amount).toLocaleString() }} &#8381;</el-col>
            </el-row>
          </el-card>
          </div>
      </el-col>
      <el-col  class="grid-content bg-purple-light cstm-feed" :span="12">
          <!-- <Feed :transactions="getTransactionsByPoint" v-loading="loadingFeed" /> -->
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
      point: {name: null, type:null},
      pieTable: null,
      pieSumm: 0,
      pieChart: null,
      lineChart: null,
      loadingCharts: true, 
      loadingFeed: true, 
    }
  },

  computed: {
    ...mapGetters([
      'getTransactionsByPoint',
      'getLineData',

    ]),

    thisMonth() {
        let date = new Date()
        let dateFrom = new Date(date.getFullYear(), date.getMonth(), 1)
        let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
        dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate()
        return  {dateFrom, dateTo}
    },
  
    lastHalfYear() {
        let date = new Date()
        let dateFrom = new Date(date.getFullYear(), date.getMonth() - 5 , 1)
        let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
        dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate() 
        return  {dateFrom, dateTo} 
    },
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

    if (!this.getTransactionsByPoint) this.fetchTransactionsByPoint() // получение данных для ленты
  },

  methods: {
    ...mapActions([
      'fetchTransactionsByPoint',
    ]),

    changeDate(newDate) {
      this.fetchCharts({
        [`${this.type}_id`]: this.id,
        dateFrom: newDate.from,
        dateTo: newDate.to,
        namePoint: this.point.name
      })
    },
    
    fetchCharts(data) {
        this.axios.get(`/api/report/sum-tags?expense_id=${data.expense_id}&date_from=${data.dateFrom}&date_to=${data.dateTo}`)
            .then(response => {
                this.pieTable = response.data.data
                let pieData = this.preparePieData(response.data.data)
                this.setPieChart(pieData)
                this.loadingCharts = false
            })

        // заглушка для линейного графика
        var lineData = {
            names: ["март","апрель","май","июнь","март","апрель","май","июнь","май","июнь","июнь",],
            amounts: [0,15000,5000,15000,-10000,5000,15000,-10000,5000,30000,-10000,],
            namePoint: this.point.name
        }
        this.setLineChart(lineData)
    },

    preparePieData(tags) {
        let names = []
        let amounts = []
        let colors = []
        this.pieSumm = 0
        for (let tag in tags) {
            let color = this.colorGenerator()
            names.push(tags[tag].name)
            amounts.push(tags[tag].amount)
            colors.push(color)
            this.pieTable[tag].color = color
            this.pieSumm += Number(tags[tag].amount)
        }
        return { names, amounts, colors }
    },

    setLineChart(lineData) {
        this.lineChart = {
            labels: lineData.names,
            datasets: [
              {
                label: lineData.namePoint,
                backgroundColor: "rgba(10, 147, 209, 0.2)",
                borderColor: "rgba(10, 147, 209)",
                data: lineData.amounts,
              },
            ],
          }
    },

    setPieChart(pieData) {
        this.pieChart = {
            labels: pieData.names,
            datasets: [
              {
                label: "Подкатегории",
                backgroundColor: pieData.colors,
                borderWidth: 0,
                data: pieData.amounts
              },
            ],
        }
    },

    colorGenerator() {
      let rbg = [0, 255, (Math.floor(Math.random() * (256)))] // параметры для самого яркого цвета, чтобы не получались тёмные
      let value1 = rbg.splice(Math.floor(Math.random()*rbg.length), 1)[0] // перемешиваем, выбирая случайный элемент масива, удаляем его из массива
      let value2 = rbg.splice(Math.floor(Math.random()*rbg.length), 1)[0]
      let value3 = rbg[0]
      return '#' + this.rgbToHex(value1) + this.rgbToHex(value2) + this.rgbToHex(value3)
    },
    
    rgbToHex(c) { // конвертирует rgb цвет в hex 16-ти битный для css
        let hex = c.toString(16)
        return hex.length == 1 ? "0" + hex : hex
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
  width: 120%;
  margin-left: -10%;
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