<template>
    <div>
        <el-collapse-transition>
            <div v-if="getEditorShowStatus && transactionEditorId === getEditorData.edata.id" class="editor">
                <el-form :model="editorData.edata" ref="editorForm" :rules="rules" label-position="right"
                         label-width=" 100px" size="small">
                    <el-row :gutter="10" type="flex" justify="space-between">
                        <el-col :span="5">
                            <el-form-item label="Дата">
                                <el-date-picker type="date"
                                                format="dd.MM.yyyy"
                                                firstDayOfWeek="1"
                                                v-model="editorData.edata.date"
                                                style="margin-top: 0; font-size: 1em; width: 100%;"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item prop="amount" label="₽" class="label">
                                <el-input clearable v-model.number="editorData.edata.amount"
                                          class="select_option"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <div class="editor-pointers">
                                <el-form-item :label="type">
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
                                <el-button @click="updateTransaction('editorForm')" type="success" size="small"
                                           icon="el-icon-check"></el-button>
                                <el-button @click="deleteTransaction(getEditorData)" type="danger"
                                           size="small"
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
    import {mapGetters, mapMutations} from 'vuex';
    import axios from "axios";

    export default {
        name: "transactionEditor",
        data() {
            return {
                constants: constants,
                rules: {
                    amount: [
                        {required: true, message: 'Ну, хоть немношко!', trigger: 'blur'},
                        {type: 'number', message: 'Только цыфры!', trigger: 'blur'},
                    ],
                    comment: [
                        {max: 50, message: 'Хватит писать!', trigger: 'change'}
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
                'getTransactions'
            ]),
            currentTags() {
                return this.tags.filter(tag => tag.expense_id === this.editorData.edata.expense_id)
            },
            type() {
                let type = ''
                switch (this.editorData.edata.type) {
                    case 1: {
                        type = 'Доход'
                    }
                        break;

                    case 2: {
                        type = 'Перевод'
                    }
                        break;

                    case 3: {
                        type = 'Расход'
                    }
                        break;
                    default:
                        type = 'Сперли'
                }
                return type;
            }
        },
        methods: {
            ...mapMutations([
                'setTransactions',
                'setTransaction',
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

                        // let transactions = this.getTransactions
                        // transactions[this.editorData.transactionGroupName][this.editorData.transactionIndex] = this.editorData.edata
                        this.setTransaction(this.editorData)

                        // axios
                        //     .put(`/api/transactions/${editorData.edata.id}`)
                        //     .then(response => {
                        //         if (response.status === 200) {
                        //             // let transactionsCopy = Object.assign({}, this.getTransactions)
                        //             this.getTransactions[editorData.transactionGroupName][editorData.transactionIndex] = Object.assign({}, editorData.data)
                        //         }
                        //     })
                        //     .catch(error => {
                        //         this.setErrorStatus(true);
                        //         this.setErrorInfo('Ошибка во время запроса на обновление данных');
                        //         //todo: обработка кодов с сервера
                        //     });
                        this.setEditorShowStatus(false);
                    } else {
                        return false;
                    }
                });

            },
            deleteTransaction(editorData) {
                this.$confirm('Подтверждение удаления транзакции', 'Внимание!', {
                    confirmButtonText: 'Удалить',
                    confirmButtonClass: 'primary',
                    showCancelButton: false,
                    iconClass: 'el-icon-delete',
                    type: 'warning',
                }).then(() => {
                    axios.delete(`/api/transactions/${editorData.data.id}`)
                        .then(response => {
                            if (response.status === 200) {
                                if (editorData.transactionGrouplength > 1) {
                                    this.getTransactions[editorData.transactionGroupName].splice(editorData.transactionIndex, 1)
                                } else {
                                    let transactionsCopy = Object.assign({}, this.getTransactions)
                                    delete transactionsCopy[editorData.transactionGroupName]
                                    this.setTransactions(transactionsCopy)
                                }
                                this.$message({
                                    showClose: true,
                                    message: `Транзакция от ${new Date(editorData.data.date).toLocaleDateString()} была успешно удалена`,
                                    duration: 3000,
                                    type: 'success'
                                });
                            }
                        })
                        .catch(error => {
                            this.$message({
                                showClose: true,
                                message: `Попытка удаления транзакции от ${new Date(editorData.data.date).toLocaleDateString()} не удалась`,
                                duration: 3000,
                                type: 'error'
                            });
                            //todo: обработка кодов с сервера
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

</style>
