<template>
    <div>
        <transaction v-for="(transaction, index) in transactionGroup" :key="index" :transaction="{transactionGroupName: transactionGroupName, transactionGrouplength: transactionGroup.length, transactionIndex: index, data: transaction}"/>
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
