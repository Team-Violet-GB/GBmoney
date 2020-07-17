<template>
    <div>
        <el-collapse-transition>
            <div v-if="getEditorShowStatus && transactionEditorId === getTransaction.id" class="editor">
                <el-form :model="getTransaction" ref="editorForm" :rules="rules" label-position="right"
                         label-width=" 70px" size="small">
                    <el-row :gutter="10" type="flex" justify="space-between">
                        <el-col :span="6">
                            <el-form-item label="когда">

                                <el-date-picker type="date" format="dd.MM.yyyy"
                                                v-model="getTransaction.date"
                                                style="margin-top: 0; font-size: 1em; width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="откуда">
                                <el-select filterable
                                           v-if="getTransaction.type_id === constants.FROM_INCOME"
                                           v-model="getTransaction.income_id">
                                    <el-option v-for="income in incomes" :key="income.id" :label="income.name"
                                               :value="income.id">
                                    </el-option>
                                </el-select>
                                <el-select prop="from" filterable v-else v-model="getTransaction.wallet_id_from">
                                    <el-option v-for="wallet in wallets" :key="wallet.id" :label="wallet.name"
                                               :value="wallet.id">
                                        {{ wallet.name }}
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="куда">
                                <el-select filterable
                                           v-if="getTransaction.type_id === constants.FROM_INCOME"
                                           v-model="getTransaction.wallet_id_to">
                                    <el-option v-for="wallet in wallets" :key="wallet.id"
                                               :label="wallet.name" :value="wallet.id"
                                               style="width: 100%">
                                    </el-option>
                                </el-select>
                                <el-select filterable
                                           v-if="getTransaction.type_id === constants.FROM_WALLET"
                                           v-model="getTransaction.tag_id">
                                    <el-option v-for="tag in tags" :key="tag.id"
                                               :label="tag.name" :value="tag.id">
                                        <span style="float: left">{{ tag.name }}</span>
                                        <span style="float: right; color: #666666; font-size: 1em">
                                            {{ String((expenses.find(item => item.id === tag.expense_id)).name) }}</span>
                                    </el-option>
                                </el-select>
                                <el-select filterable
                                           v-if="getTransaction.type_id === constants.TRANSFER"
                                           v-model="getTransaction.wallet_id_to">
                                    <el-option v-for="wallet in wallets" :key="wallet.id"
                                               :label="wallet.name"
                                               :value="wallet.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="money" label="сколько">
                                <el-input clearable v-model.number="getTransaction.money"
                                          style="font-size: 1em;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item prop="comment" label="зечем">
                                <el-input v-model="getTransaction.comment" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <div class="editor-btn">
                                <el-form-item label="нажать">
                                    <el-button-group>
                                        <el-button @click="updateTransaction('editorForm')" type="success" size="small"
                                                   icon="el-icon-check"></el-button>
                                        <el-button @click="deleteTransaction(getTransaction.id)" type="danger"
                                                   size="small"
                                                   icon="el-icon-delete"></el-button>
                                    </el-button-group>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import constants from '../../constants';
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "transactionEditor",
        data() {
            return {
                constants: constants,
                rules: {
                    money: [
                        {required: true, message: 'Ну, хоть немношко!', trigger: 'blur'},
                        {type: 'number', message: 'Только цыфры!', trigger: 'blur'},
                    ],
                    comment: [
                        {max: 100, message: 'Хватит!', trigger: 'change'}
                    ]
                },
                model: {}
            }
        },
        props: {
            transactionEditorId: ''
        },
        computed: {
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags',
                'getEditorShowStatus',
                'getTransaction'
            ]),
        },
        methods: {
            ...mapMutations([
                'setEditorShowStatus',
                'setErrorStatus'
            ]),
            updateTransaction(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // для теста, убрать потом
                        this.$message({
                            showClose: true,
                            dangerouslyUseHTMLString: true,
                            message: `<h3>axios.put('/api/update/', this.getTransaction())</h3>`,
                            duration: 10000,
                            type: 'success'
                        });
                        this.setEditorShowStatus(false);
                    } else {
                        return false;
                    }
                });

                // this.setLoadingStatus(true);
                // axios
                //     .put(`/api/update/`, this.getTransaction())
                //     .then(response => {
                //         if (response.status === 200) {
                //             this.requestTransactions();
                //         }
                //     })
                //     .catch(error => {
                //         this.setErrorStatus(true);
                //         this.setErrorInfo('Ошибка во время запроса на обновление данных');
                //         //todo: обработка кодов с сервера
                //     });
                // this.setLoadingStatus(false);
                // this.setEditorShowStatus(false);
            },
            deleteTransaction(id) {
                this.$confirm('Подтверждение удаления транзакции', 'Внимание!', {
                    confirmButtonText: 'Удалить',
                    confirmButtonClass: 'danger',
                    showCancelButton: false,
                    iconClass: 'el-icon-delete',
                    type: 'warning',
                }).then(() => {
                    this.setEditorShowStatus(false);

                    // axios
                    //     .delete(`/api/del/${id}`)
                    //     .then(response => {
                    //         if (response.status === 200) {
                    //             this.requestTransactions();
                    //         }
                    //     })
                    //     .catch(error => {
                    //         this.setErrorStatus(true);
                    //         this.setErrorInfo('Ошибка во время запроса на удаление данных');
                    //         //todo: обработка кодов с сервера
                    //     });

                    this.$message({
                        type: 'danger',
                        message: `<h1>Запрос на удаление транзакции</h1><h2>axios.delete('/api/delete/${id}')</h2>`
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .editor {
        margin-top: 15px;
        padding-top: 5px;
        padding-bottom: 10px;
        padding-right: 17px;
        padding-left: 17px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 6px rgba(0, 0, 0, .07);
    }

    .editor-btn {
        display: flex;
        justify-content: flex-end;
    }
</style>
