<template>
    <div>
        <transaction v-for="(transaction, index) in transactionGroup"
                     :key="transaction.id" :id="transaction.id"
                     :transaction="{transactionGroupName: transactionGroupName,
                     transactionGroupLength: transactionGroup.length,
                     transactionIndex: index, data: transaction, edata: {}}"/>
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
            transactionGroupName: {
                type: String
            },
        },
        components: {
            transaction
        }
    }
</script>
