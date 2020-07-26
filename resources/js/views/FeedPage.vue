<template>
    <div>
<!--        <div class="header">Лента транзакций</div>-->
        <el-alert
            v-show="getErrorStatus"
            :title="getErrorInfo"
            type="error"
            effect="dark">
        </el-alert>
        <feed/>

    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import feed from "../components/feed/Feed";
    export default {
        name: "FeedPage",
        components: {
            feed
        },
        computed: {
            ...mapGetters([
                'getErrorStatus',
                'getErrorInfo'
            ]),
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
