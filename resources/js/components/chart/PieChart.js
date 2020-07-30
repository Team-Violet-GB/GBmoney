import { Pie, mixins } from 'vue-chartjs'

export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: ['chartData'],
  mounted() {
    this.renderChart(this.chartData, this.options)
  },

  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRation: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
          enabled: false
        },
      }
    }
  }
}