<template>
    <div>
        <el-alert
            v-if="getErrorStatus"
            :title="getErrorInfo"
            type="error"
            effect="dark">
        </el-alert>
        <feed v-else/>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import Feed from "../components/feed/Feed";

    export default {
        name: "FeedPage",
        components: {
            Feed,
        },
        computed: {
            ...mapGetters([
                'getTransactions',
                'getErrorStatus',
                'getErrorInfo'
            ]),
        },
        methods: {
            ...mapMutations([
                'setPage',
                'setDateFrom',
                'setDateTo',
                'setExpenseId',
                'setIncomeId',
                'setTypeId',
            ]),
            ...mapActions([
                'fetchTransactions'
            ])
        },
        mounted() {
            this.setPage(1)
            this.setDateFrom('')
            this.setDateTo('')
            // this.setIncomeId('')
            // this.setExpenseId('')
            // this.setTypeId('')
            this.fetchTransactions()
        }
    }
</script>

<style scoped></style>
