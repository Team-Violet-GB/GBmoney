<template>
    <div>
        <el-card v-for="(transaction, index) in transactionGroups" :key="index" class="box-card">
            <el-row id="transaction.id" type="flex" justify="center">
                <el-col :span="18">
                    <el-row :gutter="10" class="tran-row-data">
                        <el-col :span="8">
<!--                            <div>{{ from }}</div>-->
                        </el-col>
                        <el-col :span="8">
                            <div>{{ transaction.money }} &#8381</div>
                        </el-col>
                        <el-col :span="8">
                            <!--                        <div>{{ to }}</div>-->
                        </el-col>
                    </el-row>
                    <el-row class="editor-comment">
                        <el-col :span="24" class="tran-comment">
                            <div>{{ transaction.comment }}</div>
                        </el-col>
                    </el-row>
                </el-col>

                <!--                    кнопачки операций над транзакцией-->
                <el-col :span="6" class="tran-opps">
                    <el-button-group>
                        <el-button v-if="showInput" @click="updateTransaction('editorForm')" type="success" size="mini"
                                   icon="el-icon-check"></el-button>
                        <el-button v-if="!showInput" @click="edit()"
                                   type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button v-if="showInput" @click="cancel()"
                                   type="warning" size="mini" icon="el-icon-close"></el-button>
                        <el-button @click="deleteTransaction(transaction.id)" type="danger" size="mini"
                                   icon="el-icon-delete"></el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </el-card>

        <!--                редактор транзакции-->
<!--        <el-collapse-transition>-->
<!--            <div v-show="showInput" class="editor">-->
<!--                <el-form :model="transaction" ref="editorForm" :rules="rules" label-position="right"-->
<!--                         label-width=" 70px" size="small">-->
<!--                    <el-row :gutter="20" type="flex" justify="space-between">-->
<!--                        <el-col :span="6">-->
<!--                            <el-form-item prop="date" label="когда">-->

<!--                                <el-date-picker type="date" format="dd.MM.yyyy"-->
<!--                                                v-model="transaction.date"-->
<!--                                                style="margin-top: 0; font-size: 1em; width: 100%;"></el-date-picker>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                        <el-col :span="6">-->
<!--                            <el-form-item label="откуда">-->
<!--                                <el-select prop="from" filterable-->
<!--                                           v-if="transaction.type_id === constants.FROM_INCOME"-->
<!--                                           v-model="transaction.income_id">-->
<!--                                    <el-option v-for="income in incomes" :key="income.id" :label="income.name"-->
<!--                                               :value="income.id">-->
<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                                <el-select prop="from" filterable v-else v-model="transaction.wallet_id_from">-->
<!--                                    <el-option v-for="wallet in wallets" :key="wallet.id" :label="wallet.name"-->
<!--                                               :value="wallet.id">-->
<!--                                        {{ wallet.name }}-->
<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                        <el-col :span="6">-->
<!--                            <el-form-item label="куда">-->
<!--                                <el-select prop="to" filterable-->
<!--                                           v-if="transaction.type_id === constants.FROM_INCOME"-->
<!--                                           v-model="transaction.wallet_id_to">-->
<!--                                    <el-option v-for="wallet in wallets" :key="wallet.id"-->
<!--                                               :label="wallet.name" :value="wallet.id"-->
<!--                                               style="width: 100%">-->
<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                                <el-select prop="to" filterable-->
<!--                                           v-if="transaction.type_id === constants.FROM_WALLET"-->
<!--                                           v-model="transaction.tag_id">-->
<!--                                    <el-option v-for="tag in tags" :key="tag.id"-->
<!--                                               :label="tag.name" :value="tag.id">-->
<!--                                        <span style="float: left">{{ tag.name }}</span>-->
<!--                                        <span style="float: right; color: #666666; font-size: 1em">-->
<!--                                            {{ expenses[tag.expense_id].name }}</span>-->
<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                                <el-select prop="to" filterable-->
<!--                                           v-if="transaction.type_id === constants.TRANSFER"-->
<!--                                           v-model="transaction.wallet_id_to">-->
<!--                                    <el-option v-for="wallet in wallets" :key="wallet.id"-->
<!--                                               :label="wallet.name"-->
<!--                                               :value="wallet.id">-->
<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                        <el-col :span="6">-->
<!--                            <el-form-item prop="money" label="сколько">-->
<!--                                <el-input clearable v-model.number="transaction.money"-->
<!--                                          style="font-size: 1em;"></el-input>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                    </el-row>-->
<!--                    <el-row>-->
<!--                        <el-col :span="24">-->
<!--                            <el-form-item prop="comment" label="зечем" label-position="top">-->
<!--                                <el-input v-model="transaction.comment" clearable></el-input>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                    </el-row>-->
<!--                </el-form>-->
<!--            </div>-->
<!--        </el-collapse-transition>-->
    </div>
</template>

<script>
    import constants from './constants';
    import rules from './feedValidationRules';
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "TransactionGroups",
        data() {
            return {
                constants: constants,
                rules: rules,
                showInput: false,
                current: {}
            }
        },
        props: {
            transactionGroups: [],
            // wallets: [],
            // incomes: [],
            // expenses: [],
            // tags: [],
        },
        computed: {
            from() {
                if (this.transaction['type_id'] === this.constants.FROM_INCOME) {
                    let income = this.incomes.find(income => income.id === this.transaction.income_id)
                    // console.log(this.incomes)
                    // return this.incomes.find(income => income.id === this.transaction.income_id)
                } else {
                    // return this.wallets[this.transaction.wallet_id_from].name
                }
            },
            to() {
                if (this.transaction['type_id'] === this.constants.FROM_WALLET) {
                    return this.expenses[this.transaction.tag_id].name
                } else {
                    return this.wallets[this.transaction.wallet_id_to].name
                }
            },
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags',
            ]),
        },
        methods: {
            edit() {
                this.showInput = true;
            },
            cancel() {
                this.showInput = false;
            },
            updateTransaction(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // для теста, убрать потом
                        this.$message({
                            showClose: true,
                            dangerouslyUseHTMLString: true,
                            message: `<h2>axios.put('/api/update/${this.transaction.id}', this.transaction)</h2>`,
                            duration: 10000,
                            type: 'success'
                        });
                        this.showInput = false;
                    } else {
                        return false;
                    }
                });

                // this.loading = true;
                // axios
                //     .put(`/api/update/${this.transaction.id}`, this.transaction)
                //     .then(response => {
                //         if (response.status === 200) {
                //             todo: сделать по нормальному это: this.$parent.$options.getTransactions();
                //         }
                //     })
                //     .catch(error => {
                //         this.error = true;
                //         this.errorInfo = 'Ошибка во время запроса на обновление данных';
                //         console.log(error)
                //         //todo: обработка кодов с сервера
                //     });
                // this.loading = false;
                // this.showInput = false;
            },
            deleteTransaction(id) {
                // this.$confirm('Подтверждение удаления транзакции', 'Внимание!', {
                //     confirmButtonText: 'Удалить',
                //     confirmButtonClass: 'danger',
                //     showCancelButton: false,
                //     iconClass: 'el-icon-delete',
                //     type: 'warning',
                // }).then(() => {
                //     this.showInput = false;
                //     if (this.transactions[this.transaction.index].length > 1) {
                //         this.transactions[this.editor.index].splice(this.transaction.indexx, 1);
                //     } else {
                //         delete this.transactions[this.transaction.index];
                //     }
                //     !Object.keys(this.transactions).length ? this.error = true : '';
                //     this.$message({
                //         type: 'success',
                //         message: `<h2>axios.delete('/api/delete/${this.transaction.id}')</h2>`
                //     });
                // });

                // axios
                //     .delete(`/api/del/${this.transaction.id}`)
                //     .then(response => {
                //         if (response.status === 200) {
                //             if (this.transactions[this.transaction.index].length > 1) {
                //                 this.transactions[this.transaction.index].splice(this.transaction.indexx, 1);
                //             } else {
                //                 delete this.transactions[this.transaction.index];
                //             }
                //         }
                //         !Object.keys(this.transactions).length ? this.error = true : '';
                //     })
                //     .catch(error => console.log(error));
            },
            ...mapActions([
                'fetchWallets',
                'fetchIncomes',
                'fetchExpenses',
                'fetchTags',
            ]),
        },
        mounted() {
            // this.current = Object.assign({}, this.transaction);
            this.fetchIncomes()
            this.fetchWallets()
            this.fetchExpenses()
            this.fetchTags()
        }
    }
</script>

<style scoped>
    .tran-row-data div {
        color: #acdaff;
        font-size: large;
        font-weight: 600;
    }

    .tran-comment div {
        color: #0abda4d1;
        font-weight: bold;
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

    .editor-comment {
        margin-top: 10px;
    }
</style>
