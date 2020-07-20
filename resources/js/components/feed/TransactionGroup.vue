<template>
    <div>
        <transaction v-for="(transaction, index) in transactionGroup" :key="index" :transaction="transaction"/>
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
