<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <LineChart
            :chartData="lineChartData"
            :height="70"
          ></LineChart>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple cstm-col-left">
          <CalendarMonth @changeDate="newDate => changeDate(newDate)" /> 
          <div class="cstm-pie-chart">
            <PieChart
              :chartData="pieChartData"
              :height="350"
            ></PieChart>
          </div>
          <el-card class="box-card">
              <el-row  slot="header" class="clearfix tran-group-header">
                  <el-col :span="10">{{ points[type][id].name }}</el-col>
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
      <el-col :span="12">
        <div class="grid-content bg-purple-light cstm-feed">
            <!-- <Feed
                :editable="false"
            ></Feed> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from "../components/chart/LineChart"
import PieChart from "../components/chart/PieChart"
import Feed from "../components/feed/Feed"
import CalendarMonth from "../components/CalendarMonth" 
import { mapGetters, mapActions } from "vuex"
 
export default {
  components: {
    LineChart,
    PieChart,
    Feed,
    CalendarMonth,
  },

  mounted() {
    if (!this.getTransactionsByPoint) this.fetchTransactionsByPoint()
    if (!this.incomes) this.fetchIncomes()
    if (!this.wallets) this.fetchWallets()
    if (!this.expenses) this.fetchExpenses()
    // switch (this.type) { 
    //   case 'income':
    //     if (!this.incomes) this.fetchIncomes()
    //     break
    //   case 'wallet':
    //     if (!this.wallets) this.fetchWallets()
    //     break
    //   case 'expense':
    //     if (!this.expenses) this.fetchExpenses()
    //     break
    // }
  },

  computed: {
    ...mapGetters([
        'getTransactionsByPoint',
        'incomes',
        'wallets',
        'expenses', 
        'points',
      ]),

      // point() {
      //   return this.points[this.$route.params.type][this.$route.params.id]         
      // }
},

  methods: {
    ...mapActions([
      'fetchTransactionsByPoint',
      'fetchIncomes',
      'fetchWallets',
      'fetchExpenses',
    ]),

    changeDate(newDate) {
      this.dateFrom = newDate[0]
      this.dateTo = newDate[1]
      console.log(this.dateFrom)
      console.log(this.dateTo)
    }

    // fetchPoint() {
    //   this.axios.get(`/api/${id}s/${this.type}`)
    //   .then(response => {
    //       console.log(response)
    //   })
    // }
  },

  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.params.type,
      dateFrom: '',
      dateTo: '',
      lineChartData: {
        labels: ["март", "апрель", "май", "июнь", "март", "апрель", "май", "июнь", "май", "июнь", "июнь"],
        datasets: [
           {
            label: 'this.points[this.type][this.id].name',
            backgroundColor: 'rgba(10, 147, 209, 0.2)',
            borderColor: 'rgba(10, 147, 209)',
            data: [0, 15000, 5000, 15000, -10000, 5000, 15000, -10000, 5000, 30000, -10000],
          },
        //   {   // вторая линия
        //     label: "Непродажи",
        //     backgroundColor: "#e6a23c",
        //     data: [5000, 15000, 10000, 30000],
        //   },
        ],
      },

      pieChartData: {
        labels: ['продукты', 'кафе/рестораны', 'на работе'],
        datasets: [
          {
            label: 'Продажи',
            backgroundColor: ['#0a93d1', '#e6a23c', '#67c23a', '#0a93d1', '#f56c6c', '#909399'],
            borderWidth: 0,
            data: [10000, 1500, 1000],
          },
        ],
      },
    }
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

  .cstm-blue {
    color: #0a93d1;
  }
  .cstm-yellow {
    color: #e6a23c;
  }
  .cstm-green {
    color: #67c23a;
  }
  .cstm-red {
    color: #f56c6c;
  }
  .cstm-grey {
    color: #909399;
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
      background-color: #3D3E48;
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