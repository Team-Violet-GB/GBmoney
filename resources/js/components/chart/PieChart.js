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
        default:null,
        responsive: true,
        maintainAspectRation: true,
        legend: {
            display: false,
            position: 'bottom'
        },
      }
    }
  }
}
