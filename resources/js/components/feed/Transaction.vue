<template>
    <div>

<!--        разметка и поведение для ленты-->
        <div v-if="getWithEditor" class="tran-wrapper" @click="edit(transaction)">
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

<!--        разметка и поведение для отчетов-->
        <div v-else>
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
        </div>

<!--    подключаемый по условию компонент редактора транзакций    -->
        <transactionEditor
            v-if="getWithEditor"
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
                'getLoadingStatus',
                'getErrorStatus',
                'getErrorInfo',
                'getWithEditor'
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
                    let expenseName = this.expenses.find(expense => expense.id === this.transaction.expense_id).name
                    let tagName = this.tags.find(item => item.id === this.transaction.tag_id).name;
                    return `${expenseName} (${tagName})`
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
                'setEditorData',
                'setLoadingStatus',
                'setErrorStatus',
                'setErrorInfo'
            ]),
            edit(transaction) {
                this.setEditorData(transaction);
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
</style>
