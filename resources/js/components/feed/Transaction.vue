<template>
    <div>
        <!--        разметка и поведение для ленты-->
        <div v-if="getEditable" class="tran-wrapper" @click="edit(transaction)">
            <el-card>
                <el-row :gutter="10" class="tran-row-data">
                    <el-col :span="3"><div>{{ from.name }}</div></el-col>
                    <el-col :span="3"><span style="color: #8e8e8e">{{ from.type }}</span></el-col>
                    <el-col :span="6"><div>{{ to }}</div></el-col>
                    <el-col :span="8"><span class="tran-comment">{{ transaction.comment }} &nbsp;</span></el-col>
                    <el-col :span="4"><div style="display: flex; justify-content: flex-end">{{ transaction.amount }} &#8381</div></el-col>
                </el-row>
            </el-card>
        </div>

        <!--        разметка и поведение для отчетов-->
        <div v-else>
            <el-row :gutter="10" class="tran-row-data">
                <el-col :span="6"><div>{{ from.name }}</div></el-col>
                <el-col :span="3"><span style="color: #8e8e8e">{{ from.type }}</span></el-col>
                <!--                <el-col :span="2"><i class="el-icon-right"></i></el-col>-->
                <el-col :span="10"><div>{{ to }}</div></el-col>
                <el-col :span="5"><div style="display: flex;justify-content: flex-end">{{ transaction.amount }} &#8381</div></el-col>
            </el-row>
        </div>

        <!--    подключаемый по условию компонент редактора транзакций    -->
        <transactionEditor
            v-if="getEditable"
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
                default() {
                    return Object;
                }
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
                'getErrorStatus',
                'getErrorInfo',
                'getEditable'
            ]),
            from() {
                let from = {};
                const income = this.incomes[this.transaction.income_id];
                const wallet = this.wallets[this.transaction.wallet_id_from];

                switch (this.transaction['type']) {
                    case this.constants.FROM_INCOME:
                        from.name = income.name;
                        from.type = 'Доход'
                        return income !== undefined ? from : '';

                    case this.constants.FROM_WALLET:
                        from.name = wallet.name;
                        from.type = 'Расход'
                        return wallet !== undefined ? from : '';

                    case this.constants.TRANSFER:
                        from.name = wallet.name;
                        from.type = 'Перевод'
                        return wallet !== undefined ? from : '';
                }
            },
            to() {
                if (this.transaction['type'] === this.constants.FROM_WALLET) {
                    const expense = this.expenses[this.transaction.expense_id];
                    const expenseName = expense !== undefined ? expense.name : '';
                    const tag = this.tags[this.transaction.tag_id];
                    const tagName = tag !== undefined ? tag.name : '';
                    return `${expenseName} (${tagName})`
                } else {
                    const wallet = this.wallets[this.transaction.wallet_id_to];
                    return wallet !== undefined ? wallet.name : '';
                }
            },
        },
        methods: {
            ...mapActions([
                'fetchTransactions'
            ]),
            ...mapMutations([
                'setEditorShowStatus',
                'setEditorData',
                'setErrorStatus',
                'setErrorInfo'
            ]),
            edit(transaction) {
                this.setEditorData(transaction);
                this.setEditorShowStatus(true)
            }
        }
    }
</script>

<style scoped>
    .el-card {
        border: 0 solid rgba(255, 255, 255, 0);
        background-color: #3D3E48;
        color: #b682f9;
    }

    .el-card:hover {
        background-color: rgba(88, 89, 106, 0.54) !important;;
    }

    .tran-wrapper {
        cursor: pointer;
        outline: none;
        z-index: 99999;
    }

    .tran-row-data div {
        color: #ffffff;
        font-size: large;
        font-weight: 400;
    }

    .tran-comment {
        color: rgba(12, 187, 163, 0.82);
        font-weight: 400;
    }
</style>
