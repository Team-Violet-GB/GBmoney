<template>
    <div>
        <div class="tran-wrapper" @click="edit(transaction)">
                <el-row :gutter="10" class="tran-row-data">
                    <el-col :span="8">
                        <div>{{ from }}</div>
                    </el-col>
                    <el-col :span="8">
                        <div>{{ transaction.money }} &#8381</div>
                    </el-col>
                    <el-col :span="8">
                        <div>{{ to }}</div>
                    </el-col>
                </el-row>
                <el-row class="editor-comment">
                    <el-col :span="24" class="tran-comment">
                        <div>{{ transaction.comment }}</div>
                    </el-col>
                </el-row>
            </div>
        <transactionEditor
            :transactionEditorId="transaction.id"
        />
    </div>
</template>

<script>
    import constants from '../../constants';
    import transactionEditor from './TransactionEditor';
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "transaction",
        components: {
            transactionEditor
        },
        data() {
            return {
                constants: constants,
            }
        },
        props: {
            transaction: {
                type: Object
            },
            transactionsInGroup: {
                type: Number
            }
        },
        computed: {
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags',
                'getEditorShowStatus',
                'getTransaction',
                'getLoadingStatus',
                'getErrorStatus',
                'getErrorInfo'
            ]),
            from() {
                if (this.transaction['type_id'] === this.constants.FROM_INCOME) {
                    return this.incomes.find(item => item.id === this.transaction.income_id).name;
                } else {
                    return this.wallets.find(item => item.id === this.transaction.wallet_id_from).name;
                }
            },
            to() {
                if (this.transaction['type_id'] === this.constants.FROM_WALLET) {
                    return this.expenses.find(item => item.id === this.transaction.tag_id).name;
                } else {
                    return this.wallets.find(item => item.id === this.transaction.wallet_id_to).name;
                }
            },
        },
        methods: {
            ...mapActions([
                'requestTransactions'
            ]),
            ...mapMutations([
                'setEditorShowStatus',
                'setTransaction',
                'setLoadingStatus',
                'setErrorStatus',
                'setErrorInfo'
            ]),
            edit(transaction) {
                this.setTransaction(transaction);
                this.setEditorShowStatus(true)
            },

        }
    }
</script>

<style scoped>
    .el-card {
        margin-top: 15px;
    }

    .tran-wrapper {
        cursor: pointer;
    }

    .tran-row-data div {
        color: #acdaff;
        font-size: large;
        font-weight: 600;
    }

    .tran-comment div {
        color: #0abda4d1;
        font-weight: bold;
        margin-top: 10px;
    }

    .tran-opps {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .editor {
        margin-top: 15px;
        padding-top: 5px;
        padding-bottom: 10px;
        padding-right: 17px;
        padding-left: 17px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .2), 0 0 6px rgba(0, 0, 0, .07);
    }
</style>
