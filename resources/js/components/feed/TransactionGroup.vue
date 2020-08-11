<template>
    <div>
        <transaction v-for="(transaction, index) in transactionGroup"
                     :key="transaction.id" :transaction="{transactionGroupName: transactionGroupName,
                     transactionGroupLength: transactionGroup.length,
                     transactionIndex: index, data: transaction, edata: {}, isEdit: false}" :feedTemplate="feedTemplate"
                     @change-transaction="changeTransaction"
                     />
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
            feedTemplate: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            transactionGroupName: {
                type: String
            },
        },
        components: {
            transaction
        },
        methods: {
            changeTransaction() {
              console.log('1')
              this.$parent.$emit('change-transactionn')
            },
        },
    }
</script>
