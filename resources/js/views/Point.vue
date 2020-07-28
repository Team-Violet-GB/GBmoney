<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <LineChart
            :chartData="lineChartData"
            :height="70"
            :options="{responsive: true, maintainAspectRation: true}"
          ></LineChart>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <PieChart
            :chartData="pieChartData"
            :options="{responsive: true, maintainAspectRation: true}"
          ></PieChart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <Feed />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from "../components/chart/LineChart";
import PieChart from "../components/chart/PieChart";
import Feed from "../components/feed/Feed";

export default {
  data() {
    return {
      lineChartData: {
        labels: ["март", "апрель", "май", "июнь"],
        datasets: [
          {
            label: "Продажи",
            backgroundColor: "#0a93d1",
            data: [15000, 5000, 15000, 10000],
          },
        //   {   // вторая линия
        //     label: "Непродажи",
        //     backgroundColor: "#e6a23c",
        //     data: [5000, 15000, 10000, 30000],
        //   },
        ],
      },

      pieChartData: {
        labels: ['март', 'апрель', 'май', 'июнь'],
        datasets: [
          {
            label: 'Продажи',
            backgroundColor: ['#F26202', '#0a93d1', '#e6a23c', '#67c23a', '#0a93d1', '#f56c6c', '#909399'],
            data: [15000, 15000, 10000, 30000],
          },
        ],
      },
    };
  },
  components: {
    LineChart,
    PieChart,
    Feed
  },
};
</script>


<style lang="scss" scoped>

</style>