<template>
    <div>
        <el-alert
            v-if="getErrorStatus"
            :title="getErrorInfo"
            type="error"
            effect="dark">
        </el-alert>
        <!--        <div class="header">Лента транзакций</div>-->
        <feed v-else />
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
                'getErrorStatus',
                'getErrorInfo'
            ]),
        },
        methods: {
            ...mapMutations([
                'setDateFrom',
                'setDateTo',
                'setPage'
            ]),
            ...mapActions([
                'fetchTransactions'
            ])
        },
        mounted() {
            this.setPage(1);
            this.setDateFrom('');
            this.setDateTo('');
            this.fetchTransactions()
        }
    }
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: center;
        color: #8468ff;
        font-weight: bolder;
        font-size: xx-large;
        margin-bottom: 40px;
    }

</style>
