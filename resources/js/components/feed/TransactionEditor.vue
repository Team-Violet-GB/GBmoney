<template>
    <div>
        <el-collapse-transition>
            <div v-if="getEditorShowStatus && transactionEditorId === getTransaction.id" class="editor">
                <el-form :model="getTransaction" ref="editorForm" :rules="rules" label-position="right"
                         label-width=" 70px" size="small">
                    <el-row :gutter="20" type="flex" justify="space-between">
                        <el-col :span="6">
                            <el-form-item prop="date" label="когда">

                                <el-date-picker type="date" format="dd.MM.yyyy"
                                                v-model="getTransaction.date"
                                                style="margin-top: 0; font-size: 1em; width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="откуда">
                                <el-select prop="from" filterable
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
                                <el-select prop="to" filterable
                                           v-if="getTransaction.type_id === constants.FROM_INCOME"
                                           v-model="getTransaction.wallet_id_to">
                                    <el-option v-for="wallet in wallets" :key="wallet.id"
                                               :label="wallet.name" :value="wallet.id"
                                               style="width: 100%">
                                    </el-option>
                                </el-select>
                                <el-select prop="to" filterable
                                           v-if="getTransaction.type_id === constants.FROM_WALLET"
                                           v-model="getTransaction.tag_id">
                                    <el-option v-for="tag in tags" :key="tag.id"
                                               :label="tag.name" :value="tag.id">
                                        <span style="float: left">{{ tag.name }}</span>
                                        <span style="float: right; color: #666666; font-size: 1em">
                                            {{ String((expenses.find(item => item.id === tag.expense_id)).name) }}</span>
                                    </el-option>
                                </el-select>
                                <el-select prop="to" filterable
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
                        <el-col :span="24">
                            <el-form-item prop="comment" label="зечем" label-position="top">
                                <el-input v-model="getTransaction.comment" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import constants from './constants';
    import rules from './feedValidationRules';
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "transactionEditor",
        data() {
            return {
                constants: constants,
                rules: rules,
                showInput: false,
            }
        },
        props: {
            transactionEditorId: {
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
                'getTransaction'
            ]),
        },
        methods: {
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
        },
        mounted() {
            // this.current = Object.assign({}, this.transaction);
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, .2), 0 0 6px rgba(0, 0, 0, .07);
    }
    /*.editor-comment {*/
    /*    margin-top: 10px;*/
    /*}*/
</style>
