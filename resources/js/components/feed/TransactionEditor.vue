<template>
    <div>
        <el-collapse-transition>
            <div v-if="editorData.isEdit" class="editor">
                <el-form :model="editorData.edata" ref="editorForm" :rules="rules" label-position="right"
                         label-width=" 5px" size="small">
                    <el-row>

                        <!--                        первая сторока редактора-->
                        <el-row>
                            <div class="editor-pointers">
                                <el-form-item>
                                    <el-select
                                        style="margin-top: 0; font-size: 1em; width: 200px"
                                        v-if="getTypeData(editorData.edata).typeName === 'Доход'"
                                        v-model="editorData.edata.income_id">
                                        <el-option v-for="income in incomes" :key="income.id"
                                                   :label="income.name"
                                                   :value="income.id" class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select v-else
                                               style="margin-top: 0; font-size: 1em; width: 200px"
                                               v-model="editorData.edata.wallet_id_from">
                                        <el-option v-for="wallet in wallets" :key="wallet.id"
                                                   :label="wallet.name"
                                                   :value="wallet.id" class="select_option">
                                        </el-option>
                                    </el-select>&nbsp;&nbsp;<i class="el-icon-d-arrow-right"></i>
                                </el-form-item>
                                <el-form-item prop="amount">
                                    <el-input type="number" class="right-sum"
                                              v-model.number="editorData.edata.amount"
                                              style="margin-top: 0; font-size: 1em; width: 200px"

                                    ><strong slot="suffix">₽&nbsp;&nbsp;&nbsp;</strong></el-input>
                                    &nbsp;<i class="el-icon-d-arrow-right"></i>
                                </el-form-item>
                                <el-form-item>
                                    <el-select class="selector"
                                               v-if="getTypeData(editorData.edata).typeName === 'Доход'"
                                               v-model="editorData.edata.wallet_id_to">
                                        <el-option v-for="wallet in wallets" :key="wallet.id"
                                                   :label="wallet.name" :value="wallet.id"
                                                   class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select @change="setCurrentTagOfSelectedExpense" class="selector"
                                               v-if="getTypeData(editorData.edata).typeName === 'Расход'"
                                               v-model="editorData.edata.expense_id">
                                        <el-option v-for="expense in expenses" :key="expense.id"
                                                   :label="expense.name" :value="expense.id"
                                                   class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select class="selector"
                                               v-if="getTypeData(editorData.edata).typeName === 'Расход'"
                                               v-model="editorData.edata.tag_id">
                                        <el-option v-for="tag in getTagsOfExpense" :key="tag.id"
                                                   :label="tag.name" :value="tag.id" class="select_option">
                                        </el-option>
                                    </el-select>
                                    <el-select class="selector"
                                               v-if="getTypeData(editorData.edata).typeName === 'Перевод'"
                                               v-model="editorData.edata.wallet_id_to">
                                        <el-option v-for="wallet in wallets" :key="wallet.id"
                                                   :label="wallet.name" :value="wallet.id"
                                                   class="select_option">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-row>

                        <!--                        вторая строка редактора-->
                        <el-row>
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
                                <el-form-item :class="{comment_long: editorData.edata.type == 3 }"
                                              class="comment_short">
                                    <el-input v-model="editorData.edata.comment" clearable placeholder="Коментарий"
                                              maxlength="44" show-word-limit></el-input>
                                </el-form-item>
                            </div>
                        </el-row>

                        <!--                        кнопки-->
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <div class="button-group">
                                    <el-button @click="updateTransaction('editorForm')" type="success" size="mini"
                                               icon="el-icon-check"></el-button>
                                    <el-popover
                                        placement="top"
                                        width="170">
                                        <p style="margin-top: 0; font-size: large; font-weight: bold">Подтверждение!</p>
                                        <p style="margin-bottom: 5px">Транзакция от <strong>{{ new
                                            Date(this.editorData.data.date).toLocaleDateString()
                                            }}</strong></p>
                                        <p style="text-align: right; margin-top: 0">{{ this.editorData.data.amount }} ₽</p>
                                        <div style="text-align: right; margin: 0">
                                            <el-button style="margin-top: 10px" type="danger" size="mini"
                                                       @click="deleteTransaction(editorData)">
                                                Удалить
                                            </el-button>
                                        </div>
                                        <el-button slot="reference" type="danger"
                                                   size="mini"
                                                   icon="el-icon-delete"></el-button>
                                    </el-popover>
                                </div>
                            </el-col>
                        </el-row>
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
            var checkAmount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Введите цифры...'));
                }
                if (value > 999999999999.99) {
                    callback(new Error('Не более 14 цифр!'));
                } else {
                    callback();
                }
            };
            return {
                rules: {
                    amount: [
                        {validator: checkAmount, trigger: 'blur'}
                    ]
                },

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
            getTagsOfExpense() {
                let tagsOfExpense = [];
                for (let tag in this.tags) {
                    if (this.tags[tag].expense_id === this.editorData.edata.expense_id) {
                        tagsOfExpense.push(this.tags[tag])
                    }
                }
                return tagsOfExpense
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
            setCurrentTagOfSelectedExpense() {
                this.editorData.edata.tag_id = null;
            },
            updateTransaction(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.put(`/api/transactions/${this.editorData.edata.id}`,
                            {
                                from_id: this.getTypeData(this.editorData.edata).fromId,
                                to_id: this.getTypeData(this.editorData.edata).toId,
                                type: this.getTypeData(this.editorData.edata).type,
                                amount: this.editorData.edata.amount,
                                date: this.editorData.edata.date,
                                comment: this.editorData.edata.comment,
                                tag_id: this.editorData.edata.tag_id
                            })
                            .then(response => {
                                if (response.status === 200) {
                                    this.editorData.isEdit = false
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
        margin-left: 4px;
        margin-right: 4px;
        padding: 15px 17px 1px;
    }

    .editor-pointers {
        display: flex;
        justify-content: flex-start;
        margin-bottom: -14px;
        width: 870px;
    }

    .comment_short {
        margin-left: 21px;
        width: 430px;
    }

    .comment_long {
        margin-left: 21px;
        width: 633px;
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
        margin-top: 15px;
        margin-left: 5px;
        margin-bottom: 15px;
    }
</style>
