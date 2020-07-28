<template>
    <div>
        <!--        разметка и поведение для ленты-->
        <div ref="div" v-if="getEditable" class="tran-wrapper" @click="openEditor">
            <el-card :class="{active: editorData.isEdit && editorData.transactionGroupLength > 1}">
                <el-row :gutter="10" class="tran-row-data">
                    <el-col :span="3">
                        <div>{{ from.name }}</div>
                    </el-col>
                    <el-col :span="3"><span style="color: #8e8e8e">{{ from.typeName }}</span></el-col>
                    <el-col :span="6"><span>{{ to.to }}</span><span class="tran-tag-name">{{ to.tagName }}</span>
                    </el-col>
                    <el-col :span="8"><div class="tran-comment">{{ transaction.data.comment }} &nbsp;</div></el-col>
                    <el-col :span="4">
                        <div
                        :class="getTypeData(this.transaction.data).color"
                        style="display: flex; justify-content: flex-end">
                            {{ getTypeData(this.transaction.data).symbol}}{{ transaction.data.amount }} &#8381;
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>

        <!--        разметка для отчетов-->
        <div v-else>
            <el-row :gutter="10" class="tran-row-data">
                <el-col :span="6">
                    <div>{{ from.name }}</div>
                </el-col>
                <el-col :span="5"><span style="color: #8e8e8e">{{ from.typeName }}</span></el-col>
                <el-col :span="8">
                    <span>{{ to.to }}</span><span class="tran-tag-name">{{ to.tagName }}</span>
                </el-col>
                <el-col :span="5">
                    <span style="display: flex;justify-content: flex-end">{{ transaction.data.amount }} &#8381;</span>
                </el-col>
            </el-row>
        </div>

        <!--    подключаемый по условию компонент редактора транзакций    -->
        <transactionEditor
            v-if="getEditable && editorData.isEdit"
            :editorData="editorData"
        />
    </div>
</template>

<script>
    import type from './TypeMixin';
    import transactionEditor from './TransactionEditor';
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "transaction",
        mixins: [type],
        components: {
            transactionEditor
        },
        data() {
            return {
                editorData: {}
            }
        },
        props: {
            transaction: {
                default() {
                    return Object;
                }
            }
        },
        computed: {
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags',
                'getErrorStatus',
                'getErrorInfo',
                'getEditable',
                'getTransactions'
            ]),
            from() {
                let from = {};
                from.typeName = this.getTypeData(this.transaction.data).typeName
                const income = this.incomes[this.transaction.data.income_id];
                const wallet = this.wallets[this.transaction.data.wallet_id_from];

                switch (this.getTypeData(this.transaction.data).typeName) {
                    case 'Доход':
                        from.name = income.name;
                        break;

                    case 'Расход':
                        from.name = wallet.name;
                        break;

                    case 'Перевод':
                        from.name = wallet.name;
                        break
                }
                return from;
            },
            to() {
                let data = {};
                if (this.getTypeData(this.transaction.data).typeName === 'Расход') {
                    const expense = this.expenses[this.transaction.data.expense_id];
                    const to = expense !== undefined ? expense.name : 'не определен';
                    const tag = this.tags[this.transaction.data.tag_id];
                    let tagName = tag !== undefined ? `(${tag.name})` : '';
                    data = {to, tagName}
                } else {
                    const wallet = this.wallets[this.transaction.data.wallet_id_to];
                    let to = wallet !== undefined ? wallet.name : 'не определен';
                    data = {to, tagName: ''}
                }
                return data
            },
        },
        methods: {
            openEditor() {
                this.transaction.isEdit = !this.editorData.isEdit
                this.transaction.edata = Object.assign({}, this.transaction.data)
                this.editorData = this.transaction
            },
            ...mapActions([
                'fetchTransactions'
            ]),
            ...mapMutations([
                'setErrorStatus',
                'setErrorInfo'
            ]),
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
        background-color: rgba(88, 89, 106, 0.54);
    }

    .active {
        background-color: rgba(88, 89, 106, 0.30);
    }

    .tran-wrapper {
        cursor: pointer;
        outline: none;
        z-index: 99999;
    }

    .tran-row-data {
        color: #ffffff;
        font-size: large;
        font-weight: 400;
    }

    .tran-comment {
        color: #886ebb;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 5px;
    }

    .tran-tag-name {
        color: #8e8e8e;
        font-size: 0.97em;
        margin-left: 20px;
        text-transform: lowercase;
    }

    .cstm-yellow {
    color: #e6a23c;
    }
    .cstm-green {
    color: #67c23a;
    }
    .cstm-red {
    color: #f56c6c;
    }
</style>
