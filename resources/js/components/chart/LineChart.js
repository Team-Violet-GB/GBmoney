// MonthlyIncome.js
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartData'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  },

  data() {
     return {
        options: {
          responsive: true, 
          maintainAspectRation: true,
          legend: {
              display: true,
              position: 'top',
              labels: {
                fontColor: '#ffffff',
              },
          },
          scales: {
              yAxes: [{
                  ticks: {
                      maxTicksLimit: 5,
                      fontColor: '#ffffff'
                  },
                  gridLines: {
                      color: "#4b4c55",
                      zeroLineColor: '#ffffff'
                      
                  }
              }],
              xAxes: [{
                  ticks: {
                      fontColor: '#ffffff'
                  },
                  gridLines: {
                      color: "#4b4c55",
                  }
              }]
          }
        }
     }
   }
}