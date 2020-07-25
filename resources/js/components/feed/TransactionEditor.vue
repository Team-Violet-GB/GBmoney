<template>
    <div>
        <el-collapse-transition>
            <div v-if="getEditorShowStatus & transactionEditorId === getEditorData.edata.id" class="editor">
                <el-form :model="editorData.edata" ref="editorForm" :rules="rules" label-position="right"
                         label-width=" 100px" size="small">
                    <el-row :gutter="10" type="flex" justify="space-between">
                        <el-col :span="5">
                            <el-form-item label="Дата">
                                <el-date-picker type="date"
                                                firstDayOfWeek="1"
                                                format="dd.MM.yyyy"
                                                value-format="yyyy-MM-dd"
                                                v-model="editorData.edata.date"
                                                style="margin-top: 0; font-size: 1em; width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item prop="amount" label="₽" class="label">
                                <el-input clearable :precision="2" type="number"
                                          v-model.number="editorData.edata.amount"
                                          class="select_option"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <div class="editor-pointers">
                                <el-form-item :label="typeData.typeDescription">
                                    <el-select class="selector"
                                               v-if="editorData.edata.type === constants.FROM_INCOME"
                                               v-model="editorData.edata.income_id">
                                        <el-option v-for="income in incomes" :key="income.id" :label="income.name"
                                                   :value="income.id" class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select class="selector" v-else
                                               v-model="editorData.edata.wallet_id_from">
                                        <el-option v-for="wallet in wallets" :key="wallet.id" :label="wallet.name"
                                                   :value="wallet.id" class="select_option"> {{ wallet.name }}
                                        </el-option>
                                    </el-select>&nbsp;<i class="el-icon-caret-right"></i>
                                    <el-select class="selector"
                                               v-if="editorData.edata.type === constants.FROM_INCOME"
                                               v-model="editorData.edata.wallet_id_to">
                                        <el-option v-for="wallet in wallets" :key="wallet.id"
                                                   :label="wallet.name" :value="wallet.id" class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select @select="prepareCurrentTags" class="selector"
                                               v-if="editorData.edata.type === constants.FROM_WALLET"
                                               v-model="editorData.edata.expense_id">
                                        <el-option v-for="expense in expenses" :key="expense.id"
                                                   :label="expense.name" :value="expense.id" class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select class="selector"
                                               v-if="editorData.edata.type === constants.FROM_WALLET"
                                               v-model="editorData.edata.tag">
                                        <el-option v-for="tag in currentTags" :key="tag.id"
                                                   :label="tag.name" :value="tag.id" class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select class="selector"
                                               v-if="editorData.edata.type === constants.TRANSFER"
                                               v-model="editorData.edata.wallet_id_to">
                                        <el-option v-for="wallet in wallets" :key="wallet.id"
                                                   :label="wallet.name" :value="wallet.id" class="select_option">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="18">
                            <el-form-item prop="comment" label="Коментарий">
                                <el-input v-model="editorData.edata.comment" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button-group style="width: 100px; padding-top: 2px">
                                <el-button @click="updateTransaction('editorForm')" type="success" size="mini"
                                           icon="el-icon-check"></el-button>
                                <el-button @click="deleteTransaction(editorData)" type="danger"
                                           size="mini"
                                           icon="el-icon-delete"></el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import constants from '../../constants';
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import axios from "axios";

    export default {
        name: "transactionEditor",
        data() {
            return {
                constants: constants,
                rules: {
                    amount: [
                        {required: true, message: 'Ну, хоть немношко!', trigger: 'blur'},
                    ],
                    comment: [
                        {max: 40, message: 'Хватит писать!', trigger: 'change'}
                    ]
                }
            }
        },
        props: {
            transactionEditorId: '',
            editorData: {
                type: Object
            }
        },
        computed: {
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags',
                'getEditorShowStatus',
                'getEditorData',
                'getTransactions',
                'getPage'
            ]),
            currentTags() {
                return this.tags.filter(tag => tag.expense_id === this.editorData.edata.expense_id)
            },
            typeData() {
                let data = {}
                switch (this.editorData.edata.type) {
                    case 1: {
                        data.type = 1
                        data.typeDescription = 'Доход'
                        data.fromId = this.editorData.edata.income_id
                        data.fromDescription = this.wallets[data.fromId].name
                        data.toId = this.editorData.edata.wallet_id_to
                        data.toDescription = this.wallets[data.toId].name
                    }
                        break;

                    case 2: {
                        data.type = 2
                        data.typeDescription = 'Перевод'
                        data.fromId = this.editorData.edata.wallet_id_from
                        data.fromDescription = this.wallets[data.fromId].name
                        data.toId = this.editorData.edata.wallet_id_to
                        data.toDescription = this.wallets[data.toId].name
                    }
                        break;

                    case 3: {
                        data.type = 3
                        data.typeDescription = 'Расход'
                        data.fromId = this.editorData.edata.wallet_id_from
                        data.fromDescription = this.wallets[data.fromId].name
                        data.toId = this.editorData.edata.expense_id
                        data.toDescription = this.expenses[data.toId].name
                        // data.tagId = this.editorData.edata.tag_id
                        // data.tagDescription = this.tags[data.tagId].name
                        // data.expenseIdOfTag = this.tags[data.tagId].expense_id
                        // data.expenseNameOfTag = this.tags[data.tagId].name
                    }
                        break;
                }
                return data;
            }
        },
        methods: {
            ...mapActions([
                'fetchTransactions'
            ]),
            ...mapMutations([
                'setPage',
                'setTransactions',
                'setTransactionUpdate',
                'setTransactionDelete',
                'setEditorShowStatus',
                'setErrorStatus',
                'setEditorData'
            ]),
            prepareCurrentTags() {
                return this.currentTags();
            },
            updateTransaction(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.setTransactionUpdate(this.editorData)
                        // let page = this.getPage
                        axios.put(`/api/transactions/${this.editorData.edata.id}`,
                            {
                                from_id: this.typeData.fromId,
                                to_id: this.typeData.toId,
                                type: this.typeData.type,
                                amount: this.editorData.edata.amount,
                                date: this.editorData.edata.date,
                                comment: this.editorData.edata.comment,
                                tag_id: this.editorData.edata.tag_id
                            })
                            .then(response => {
                                if (response.status === 200) {
                                    // this.setTransactionUpdate(this.editorData)
                                    // this.setPage(page - 1)

                                    console.log('страница из ответа на запрос обновления',this.getPage)
                                    this.fetchTransactions()
                                }
                            })
                            .catch(error => {
                                this.$message({
                                    showClose: true,
                                    message: `Попытка обновления транзакции от ${new Date(this.editorData.data.date).toLocaleDateString()} не удалась \n ${error}`,
                                    duration: 3000,
                                    type: 'error'
                                });
                            });
                        // this.setEditorShowStatus(false);
                    } else {
                        return false;
                    }
                });

            },
            deleteTransaction() {
                this.$confirm('Подтверждение удаления транзакции', 'Внимание!', {
                    confirmButtonText: 'Удалить',
                    confirmButtonClass: 'danger',
                    showCancelButton: false,
                    iconClass: 'el-icon-delete',
                    type: 'warning',
                }).then(() => {
                    axios.delete(`/api/transactions/${this.editorData.edata.id}`)
                        .then(response => {
                            if (response.status === 200) {
                                this.setTransactionDelete(this.editorData)
                                this.$message({
                                    showClose: true,
                                    message: `Транзакция от ${new Date(this.editorData.data.date).toLocaleDateString()} была успешно удалена`,
                                    duration: 3000,
                                    type: 'success'
                                });
                            }
                        })
                        .catch(error => {
                            this.$message({
                                showClose: true,
                                message: `Попытка удаления транзакции от ${new Date(this.editorData.data.date).toLocaleDateString()} не удалась \n ${error}`,
                                duration: 3000,
                                type: 'error'
                            });
                        });
                })
            }
        }
    }
</script>

<style scoped>
    .editor {
        color: rgb(255, 208, 75) !important;
        background-color: #3d3e48;
        border-radius: 2px;
        margin-top: 5px;
        margin-bottom: 7px;
        margin-left: 4px;
        margin-right: 4px;
        padding: 15px 17px 1px;
        box-shadow: 0 2px 4px rgba(255, 255, 255, 0.3), 0 0 7px rgba(255, 255, 255, 0.07);
    }

    .editor-pointers {
        display: flex;
        justify-content: flex-start;
    }

    .selector {
        width: 150px;
    }

    .select_option {
        color: rgba(224, 221, 234, 0.71);
        font-weight: 400;
        border-radius: 0;
        font-size: 0.95em;
    }

    .hover {
        color: rgb(255, 208, 75);
        background-color: rgb(49, 50, 58);
    }

</style>
