<template>
  <div v-loading="loading" element-loading-background="rgba(44, 46, 56, 0.8)">

    <el-row v-if="type == 'income' || type == 'expense'">
      <el-col class="grid-content bg-purple-dark" :span="24">
          <LineChart :chartData="lineChart" :height="70"></LineChart>
      </el-col>
    </el-row>

    <div class="cstm-col">
      <CalendarMonth @changeDate="newDate => changeDate(newDate)" />
        <br>
    </div>
     <Feed v-if="type == 'income' || type == 'wallet'" />

    <el-row v-if="type == 'expense'">
      <el-col class="grid-content bg-purple cstm-col-left" :span="12">
          <div>
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
        <Feed :feed-template="false" />
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
      loadingPie: true, 
      loadingLine: true,
    }
  },

  computed: {
    loading() {
      if (!this.loadingPie && !this.loadingLine) return false
      return true
    },

    intervalMonth() {
        let date = new Date()
        let dateFrom = new Date(date.getFullYear(), date.getMonth(), 1)
        let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
        dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate()
        return  {dateFrom, dateTo}
    },
  
    intervalHalfYear() {
        let date = new Date()
        let dateFrom = new Date(date.getFullYear(), date.getMonth() - 5 , 1)
        let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        dateFrom = dateFrom.getFullYear() + '-' + (dateFrom.getMonth() + 1) + '-' + dateFrom.getDate()
        dateTo = dateTo.getFullYear() + '-' + (dateTo.getMonth() + 1) + '-' + dateTo.getDate() 
        return  {dateFrom, dateTo} 
    },
  },

mounted() {
      if (this.type == 'income') this.loadingPie = false
      if (this.type == 'wallet') this.loadingPie = this.loadingLine = false
      this.fetchTransactions({ [`${this.type}_id`]: this.id }) // получение данных для ленты
      this.axios.get(`/api/${this.type}s/${this.id}`)  // получение данных о текущаем поинте
      .then(response => {
          this.point = response.data.data
      })
      .then(() => {
        if (this.type == 'expense') {
          this.fetchPieChart({ // получение данных для круглого графика за этот месяц
            dateFrom: this.intervalMonth.dateFrom,
            dateTo: this.intervalMonth.dateTo,
          })
        }

        if (this.type == 'expense' || this.type == 'income') {
          this.fetchLineChart({ // получение данных для линейного графика за пол года
            dateFrom: this.intervalHalfYear.dateFrom,
            dateTo: this.intervalHalfYear.dateTo,
          })
        }
      })
  },

  methods: {
    ...mapActions([
      'fetchTransactions'
    ]),

    changeDate(newDate) {
      if (this.type == 'expense') {
        this.fetchPieChart({ dateFrom: newDate.from, dateTo: newDate.to })
      }
      if (this.type == 'expense' || this.type == 'income') {
        this.fetchLineChart({ dateFrom: newDate.from, dateTo: newDate.to })
      }
      this.fetchTransactions({ [`${this.type}_id`]: this.id, date_from: newDate.from, date_to: newDate.to })
    },
    
    fetchLineChart(data) {
        this.axios.get(`/api/report/sum-points-by-months?${this.type}_id=${this.id}&date_from=${data.dateFrom}&date_to=${data.dateTo}`)
            .then(response => {
              let lineData =  this.prepareLineData(response.data)
              this.setLineChart(lineData)
              this.loadingLine = false
            })
    },

    fetchPieChart(data) {
        this.axios.get(`/api/report/sum-tags?expense_id=${this.id}&date_from=${data.dateFrom}&date_to=${data.dateTo}`)
            .then(response => {
                this.pieTable = response.data.data
                let pieData = this.preparePieData(response.data.data)
                this.setPieChart(pieData)
                this.loadingPie = false
            })
    },

    prepareLineData(months) {
      let names = []
      let amounts = []
      let color = {}
      for (let month in months) {
        names.push(month)
        if (months[month][0]) amounts.push(months[month][0].amount)
        else amounts.push(0)
      }
      if (this.type == 'expense') {
        color.r = '255'
        color.g = color.b =  '0'
      } else {
        color.b = '255'
        color.r = color.g =  '0'
      }
      return { names, amounts, color }
    },

    preparePieData(tags) {
        let names = []
        let amounts = []
        let colors = []
        this.pieSumm = 0
        for (let tag in tags) {
            let color = this.colorGenerator()
            if (tags[tag].tag_id == 0) color = '#C9C9C9'
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
                label: this.point.name,
                backgroundColor: `rgba(${lineData.color.r}, ${lineData.color.g}, ${lineData.color.b}, 0.2)`,
                borderColor: `rgba(${lineData.color.r}, ${lineData.color.g}, ${lineData.color.b})`,
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

.cstm-col {
  display: flex;
  flex-direction: column;
  align-items: center;
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