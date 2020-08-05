<template>
    <div class="container">
        <line-chart
            v-if="loaded"
            :chartdata="chartdata"
            :options="options"
        />
    </div>
</template>

<script>
import LineChart from "./HistoryChart";
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
    name: "History",
    components: { LineChart },
    data: () => ({
        loaded: false,
        chartdata: null
    }),
    mounted() {
    }
}
</script>

<style scoped>

</style>
