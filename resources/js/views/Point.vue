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
          <CalendarMonth /> 
          <div class="cstm-pie-chart">
            <PieChart
              :chartData="pieChartData"
              :height="350"
            ></PieChart>
          </div>
          <el-card class="box-card">
              <el-row  slot="header" class="clearfix tran-group-header">
                  <el-col :span="10">{{ 'name' }}</el-col>
                  <el-col class="cstm-percent" :span="7">{{ 'percent' }}</el-col>
                  <el-col class="cstm-amount" :span="7">{{ 'amount' }}</el-col>
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
            <Feed
                :editable="false"
                page="1"
            ></Feed>
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

export default {
  components: {
    LineChart,
    PieChart,
    Feed,
    CalendarMonth,
  },
  data() {
    return {
      lineChartData: {
        labels: ["март", "апрель", "май", "июнь", "март", "апрель", "май", "июнь", "май", "июнь", "июнь"],
        datasets: [
           {
            label: 'Еда',
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
            backgroundColor: ['#F26202', '#0a93d1', '#e6a23c', '#67c23a', '#0a93d1', '#f56c6c', '#909399'],
            data: [10000, 1500, 1000],
          },
        ],
      },
    };
  },
};
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