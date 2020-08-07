<script>
    import { Doughnut, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins

    export default {
        name: "monthChart",
        extends: Doughnut,
        mixins: [mixins.reactiveProp],
        props: {
            chartData: {
                type: Object,
                default: null
            },
            options: {
                type: Object,
                default: null
            }
        },
        mounted() {
            this.renderChart(this.chartData, this.options)
        }
    }
</script>
