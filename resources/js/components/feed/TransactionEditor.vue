<template>
    <div>
        <el-collapse-transition>
            <div v-if="getEditorShowStatus & transactionEditorId === getEditorData.edata.id" class="editor">
                <el-form :model="editorData.edata" ref="editorForm" :rules="rules" label-position="right"
                         label-width=" 5px" size="small">
                    <el-row>
                        <el-col :span="22">
                            <el-row>
                                <el-col :span="10">
                                    <div class="editor-pointers">
                                        <el-form-item>
                                            <el-date-picker type="date"
                                                            firstDayOfWeek="1"
                                                            format="dd.MM.yyyy"
                                                            value-format="yyyy-MM-dd"
                                                            v-model="editorData.edata.date"
                                                            style="margin-top: 0;font-size: 1em; width: 200px">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item prop="amount">
                                            <el-input type="number" class="right-sum"
                                                      v-model.number="editorData.edata.amount"
                                                      style="margin-top: 0; font-size: 1em; width: 200px"
                                            ><strong slot="suffix">₽&nbsp;&nbsp;&nbsp;</strong></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="16">
                                    <div class="editor-pointers">
                                        <el-form-item>
                                            <el-select
                                                style="margin-top: 0; margin-right: 2px; font-size: 1em; width: 200px"
                                                v-if="typeData(editorData.edata.type).typeDescription === 'Доход'"
                                                v-model="editorData.edata.income_id">
                                                <el-option v-for="income in incomes" :key="income.id"
                                                           :label="income.name"
                                                           :value="income.id" class="select_option">
                                                </el-option>
                                            </el-select>
                                            <el-select v-else
                                                       style="margin-top: 0; margin-right: 2px; font-size: 1em; width: 200px"
                                                       v-model="editorData.edata.wallet_id_from">
                                                <el-option v-for="wallet in wallets" :key="wallet.id"
                                                           :label="wallet.name"
                                                           :value="wallet.id" class="select_option">
                                                </el-option>
                                            </el-select>
                                            <el-select class="selector"
                                                       v-if="typeData(editorData.edata.type).typeDescription === 'Доход'"
                                                       v-model="editorData.edata.wallet_id_to">
                                                <el-option v-for="wallet in wallets" :key="wallet.id"
                                                           :label="wallet.name" :value="wallet.id"
                                                           class="select_option">
                                                </el-option>
                                            </el-select>
                                            <el-select @select="prepareCurrentTags" class="selector"
                                                       v-if="typeData(editorData.edata.type).typeDescription === 'Расход'"
                                                       v-model="editorData.edata.expense_id">
                                                <el-option v-for="expense in expenses" :key="expense.id"
                                                           :label="expense.name" :value="expense.id"
                                                           class="select_option">
                                                </el-option>
                                            </el-select>
                                            <el-select class="selector"
                                                       v-if="typeData(editorData.edata.type).typeDescription === 'Расход'"
                                                       v-model="editorData.edata.tag_id">
                                                <el-option v-for="tag in currentTags" :key="tag.id"
                                                           :label="tag.name" :value="tag.id" class="select_option">
                                                </el-option>
                                            </el-select>
                                            <el-select class="selector"
                                                       v-if="typeData(editorData.edata.type).typeDescription === 'Перевод'"
                                                       v-model="editorData.edata.wallet_id_to">
                                                <el-option v-for="wallet in wallets" :key="wallet.id"
                                                           :label="wallet.name" :value="wallet.id"
                                                           class="select_option">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="16">
                                    <el-form-item prop="comment">
                                        <el-input v-model="editorData.edata.comment" clearable placeholder="Коментарий"
                                                  maxlength="100" show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col :span="6">
                                    <div class="button-group">
                                        <el-button @click="updateTransaction('editorForm')" type="success" size="small"
                                                   icon="el-icon-check"></el-button>
                                        <el-button @click="deleteTransaction(editorData)" type="danger"
                                                   size="small"
                                                   icon="el-icon-delete"></el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import type from './TypeMixin';
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import axios from "axios";

    export default {
        name: "transactionEditor",
        mixins: [type],
        data() {
            return {
                rules: {
                    amount: [
                        {required: true, message: 'Ну, хоть немношко!', trigger: 'blur'},
                    ],
                    // comment: [
                    //     {max: 40, message: 'Хватит писать!', trigger: 'change'}
                    // ]
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
            }
        },
        methods: {
            ...mapActions([
                'fetchTransactions'
            ]),
            ...mapMutations([
                'setPage',
                'setTransactions',
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
                        axios.put(`/api/transactions/${this.editorData.edata.id}`,
                            {
                                from_id: this.typeData(this.editorData.edata.type).fromId,
                                to_id: this.typeData(this.editorData.edata.type).toId,
                                type: this.typeData(this.editorData.edata.type).type,
                                amount: this.editorData.edata.amount,
                                date: this.editorData.edata.date,
                                comment: this.editorData.edata.comment,
                                tag_id: this.editorData.edata.tag_id
                            })
                            .then(response => {
                                if (response.status === 200) {
                                    this.fetchTransactions()
                                    this.setEditorShowStatus(false)
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
                    } else {
                        return false;
                    }
                });

            },
            deleteTransaction() {
                this.$confirm('Подтверждение удаления транзакции', 'Внимание!', {
                    confirmButtonText: 'Удалить',
                    confirmButtonClass: 'danger',
                    showCancelButton: true,
                    iconClass: 'el-icon-delete',
                    type: 'warning',
                }).then(() => {
                    axios.delete(`/api/transactions/${this.editorData.edata.id}`)
                        .then(response => {
                            if (response.status === 200) {
                                this.fetchTransactions()
                                this.$message({
                                    type: 'info',
                                    message: `Транзакции от ${new Date(this.editorData.data.date).toLocaleDateString()} была удалена`
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: `Отмена удаления транзакции от ${new Date(this.editorData.data.date).toLocaleDateString()}`
                    });
                });
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
        box-shadow: 0 2px 3px rgba(255, 255, 255, 0.4), 0 0 7px rgba(255, 255, 255, 0.07);
    }

    .editor-pointers {
        display: flex;
        justify-content: flex-start;
        margin-bottom: -14px;
    }

    .selector {
        margin-top: 0;
        font-size: 1em;
        width: 200px;
    }

    .select_option {
        color: rgba(224, 221, 234, 0.71);
        font-weight: 400;
        border-radius: 0;
        font-size: 1em;
    }

    .hover {
        color: rgb(255, 208, 75);
        background-color: rgb(49, 50, 58);
    }

    .button-group {
        width: 100px;
        display: flex;
        margin-left: 10px;
        margin-bottom: 15px;
    }
</style>
