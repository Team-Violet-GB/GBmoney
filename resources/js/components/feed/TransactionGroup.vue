<template>
    <div>
        <el-card v-for="(transaction, index) in transactionGroup" :key="index" class="box-card">
            <transaction :transaction="transaction" :transactionsInGroup="transactionGroup.length"/>
        </el-card>
    </div>
</template>

<script>
    import transaction from './Transaction';

    export default {
        name: "transactionGroup",
        props: {
            transactionGroup: {
                type: Array
            },
        },
        components: {
            transaction
        }
    }
</script>

<style scoped>
    .el-card {
        margin-top: 15px;
    }
</style>
