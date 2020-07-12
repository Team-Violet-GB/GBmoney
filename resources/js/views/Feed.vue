<template>
    <div>
        <el-alert
            v-if="error"
            :title="errorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <!--        заголовок группы транзакций-->
        <el-card v-if="!error" v-for="(transactionsGroup, index) in transactions" :key="index"
                 v-loading="loading" element-loading-text="Загрузка..." element-loading-spinner="el-icon"
                 element-loading-background="rgba(0, 0, 0, 0.8)" class="box-card">
            <el-row :gutter="10" slot="header" class="clearfix tran-group-header">
                <el-col :span="6">
                    <div>{{ getLocalDateString(transactionsGroup[0]['date']) }}</div>
                </el-col>
                <el-col :span="6" :offset="12">
                    <div class="tran-group-header-sum">{{ groupSumCalc(transactionsGroup) }}</div>
                </el-col>
            </el-row>

            <!--            список транзакций в группе-->
            <el-card v-for="(transaction, indexx) in transactionsGroup" :key="indexx" class="box-card">
                <el-row type="flex" align="middle">
                    <el-col :span="18">
                        <el-row :gutter="10" class="tran-row-data">
                            <el-col :span="8">
                                <!--                                <div>{{ fromCalc(transaction) }}</div>-->
                            </el-col>
                            <el-col :span="8">
                                <div>{{ transaction.amount }} {{ rub }}</div>
                            </el-col>
                            <el-col :span="8">
                                <!--                                <div>{{ toCalc(transaction) }}</div>-->
                            </el-col>
                        </el-row>
                        <el-row class="editor-comment">
                            <el-col :span="24" class="tran-comment">
                                <div>{{ transaction.comment }}</div>
                            </el-col>
                        </el-row>
                    </el-col>

                    <!--                    кнопачки операций над транзакцией-->
                    <el-col :span="6">
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-button-group>
                                <el-button v-if="showInput && transaction.id === editor.data.id"
                                           type="success" @click="updateTransaction('editorForm')" size="small"
                                           icon="el-icon-check"></el-button>
                                <el-button v-else @click="showEditForm(index, indexx)"
                                           type="primary" size="small" icon="el-icon-edit"></el-button>
                                <el-button v-if="showInput && transaction.id === editor.data.id"
                                           @click="deleteTransaction(transaction.id)"
                                           type="danger" size="small" icon="el-icon-delete"></el-button>
                            </el-button-group>
                        </el-row>
                    </el-col>
                </el-row>

                <!--                редактор транзакции-->
                <el-collapse-transition>
                    <div v-if="transaction.id === editor.data.id" v-show="showInput" class="editor">
                        <el-form :model="editor.data" ref="editorForm" :rules="rules" label-position="top"
                                 label-width=" 90px" size="small">
                            <el-row :gutter="20" type="flex" justify="space-between">
                                <el-col :span="6">
                                    <el-form-item prop="date" label="когда">
                                        <el-date-picker type="date" format="dd.MM.yyyy"
                                                        v-model="editor.data.date"
                                                        style="margin-top: 0; font-size: 1em; width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="откуда">
                                        <el-select prop="from" filterable v-if="transaction.type_id === 1"
                                                   v-model="editor.data.income_id">
                                            <el-option v-for="income in incomes" :key="income.id" :label="income.name"
                                                       :value="income.id">
                                            </el-option>
                                        </el-select>
                                        <el-select prop="from" filterable v-else v-model="editor.data.wallet_id_from">
                                            <el-option v-for="wallet in wallets" :key="wallet.id" :label="wallet.name"
                                                       :value="wallet.id">
                                                {{ wallet.name }}
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="куда">
                                        <el-select prop="to" filterable v-if="transaction.type_id === 1"
                                                   v-model="editor.data.wallet_id_to">
                                            <el-option v-for="wallet in wallets" :key="wallet.id"
                                                       :label="wallet.name" :value="wallet.id"
                                                       style="width: 100%">
                                            </el-option>
                                        </el-select>
                                        <el-select prop="to" filterable v-if="transaction.type_id === 2"
                                                   v-model="editor.data.tag_id">
                                            <el-option v-for="expense in expenses" :key="expense.id"
                                                       :label="expense.name" :value="expense.id">
                                                <span style="float: left">{{ expense.name }}</span>
                                                <span style="float: right; color: #536e8e; font-size: 10px">
                                            {{ expensesCategory[expense.expense_id].name }}</span>
                                            </el-option>
                                        </el-select>
                                        <el-select prop="to" filterable v-if="transaction.type_id === 3"
                                                   v-model="editor.data.wallet_id_to">
                                            <el-option v-for="wallet in wallets" :key="wallet.id"
                                                       :label="wallet.name"
                                                       :value="wallet.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item prop="amount" label="сколько">
                                        <el-input clearable v-model.number="editor.data.amount"
                                                  style="font-size: 1em;"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item prop="comment" label="зечем" label-position="top">
                                        <el-input v-model="editor.data.comment" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-collapse-transition>
            </el-card>
        </el-card>
    </div>
</template>

<script>
    import constants from '../constants';
    import rules from '../components/feed/feedValidationRules';

    export default {
        data() {
            return {
                editor: {
                    index: null,
                    indexx: null,
                    data: {}
                },
                rules: rules,
                loading: false,
                showInput: false,
                error: false,
                errorInfo: 'Нет данных',
                transactions: {},
                wallets: {},
                incomes: {},
                allIncomes: {},
                expensesCategory: {},
                expenses: {},
            };
        },
        computed: {
            rub() {
                return String.fromCharCode(8381);
            }
        },
        methods: {
            showEditForm(index, indexx) {
                this.showInput = true
                this.editor.index = index;
                this.editor.indexx = indexx;
                this.editor.data = Object.assign({}, this.transactions[index][indexx]);
            },
            fromCalc(tran) {
                switch (tran.type_id) {
                    case constants.FROM_INCOMES:
                        if (tran.income_id != null) {
                            return this.incomes[tran.income_id].name;
                        }
                        break;
                    case constants.TRANSFER:
                        if (tran.wallet_id_from != null) {
                            return this.wallets[tran.wallet_id_from].name;
                        }
                        break;
                    case constants.FROM_WALLET:
                        if (tran.wallet_id_from != null) {
                            return this.wallets[tran.wallet_id_from].name;
                        }
                        break;
                    default:
                        return 'нет данных';
                }
            },
            toCalc(tran) {
                switch (tran.type_id) {
                    case constants.FROM_INCOMES:
                        if (tran.wallet_id_to != null) {
                            return this.wallets[tran.wallet_id_to].name;
                        }
                        break;
                    case constants.TRANSFER:
                        if (tran.wallet_id_to != null) {
                            return this.wallets[tran.wallet_id_to].name;
                        }
                        break;
                    case constants.FROM_WALLET:
                        if (tran.tag_id != null) {
                            return this.expenses[tran.tag_id].name;
                        }
                        break;
                    default:
                        return 'нет данных';
                }
            },
            updateTransaction(formName) {
                // для теста, убрать потом
                this.transactions[this.editor.index][this.editor.indexx] = Object.assign({}, this.editor.data);
                this.$refs[formName][0].validate((valid) => {
                    if (valid) {
                        this.$message({
                            showClose: true,
                            dangerouslyUseHTMLString: true,
                            message: '<h4>axios.put(\'/api/update/${currentItem.Id}\', this.editor.data</h4>',
                            duration: 10000,
                            type: 'success'
                        });
                        this.showInput = false;
                    } else {
                        return false;
                    }
                });

                this.loading = true;
                axios
                    .put(`/api/update/${this.editor.data.id}`, this.editor.data)
                    .then(response => {
                        if (response.status === 200) {
                            this.transactions[this.editor.index][this.editor.indexx] = Object.assign({}, this.editor.data);
                        }
                    })
                    .catch(error => {
                        this.error = true;
                        this.errorInfo = 'Ошибка во время запроса на обновление данных';
                        console.log(error)
                        //todo: обработка кодов с сервера
                    });
                this.loading = false;
            },
            getTransactions() {
                const headers = {
                    'Content-Type': 'application/json'
                }
                this.loading = true;
                axios.get('storage/testTransactions.json', {headers: headers})
                    .then(response => {
                        this.transactions = response.data;
                        this.loading = false;
                    })
                    .catch(error => {
                        console.log(error)
                        this.error = true;
                        this.errorInfo = 'Ошибка во время запроса данных о транзакциях';
                        //todo: обработка кодов с сервера
                    });
                this.loading = false;
            },
            getData() {
                const headers = {
                    'Content-Type': 'application/json'
                }
                axios.get('storage/testWallets.json', {headers: headers})
                    .then(response => {
                        this.wallets = response.data;
                        axios.get('storage/testIncomes.json', {headers: headers})
                            .then(response => {
                                this.incomes = response.data;
                                axios.get('storage/testExpensesCategory.json', {headers: headers})
                                    .then(response => {
                                        this.expensesCategory = response.data;
                                        axios.get('storage/testExpenses.json', {headers: headers})
                                            .then(response => {
                                                this.expenses = response.data;
                                            })
                                    })
                            })
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = true;
                        this.errorInfo = 'Ошибка во время запроса данных';
                        //todo: обработка других кодов с сервера
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
                    this.showInput = false;
                    if (this.transactions[this.editor.index].length > 1) {
                        this.transactions[this.editor.index].splice(this.editor.indexx, 1);
                    } else {
                        delete this.transactions[this.editor.index];
                    }
                    !Object.keys(this.transactions).length ? this.error = true : '';
                    this.$message({
                        type: 'success',
                        message: 'Транзакция удалена'
                    });
                });

                // axios
                //     .delete(`/api/del/${this.editor.data.id}`)
                //     .then(response => {
                //         if (response.status === 200) {
                //             if (this.transactions[this.editor.index].length > 1) {
                //                 this.transactions[this.editor.index].splice(this.editor.indexx, 1);
                //             } else {
                //                 delete this.transactions[this.editor.index];
                //             }
                //         }
                //         !Object.keys(this.transactions).length ? this.error = true : '';
                //     })
                //     .catch(error => console.log(error));
            },
            getLocalDateString(date) {
                let days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
                let months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
                let dateObj = new Date(date);
                return days[dateObj.getDay()] + ', ' + dateObj.getDate() + ' ' + months[dateObj.getMonth()];
            },
            groupSumCalc(group) {
                let sum = 0;
                for (let i = 0; i < group.length; i++) {
                    sum += group[i].amount;
                }
                return sum += ' ' + this.rub;
            }
        },
        mounted() {
            this.getData();
            this.getTransactions();
        }
    }
</script>

<style scoped>
    body {
        margin: 0;
    }

    .el-card {
        margin-top: 15px;
    }

    .tran-group-header {
        color: #92a226;
        font-size: x-large;
        font-weight: 600;
        padding-left: 20px;
    }

    .tran-group-header-sum {
        text-align: right;
        color: #008ea6ed;
        font-size: large;
        font-weight: 700;
        padding-right: 20px;
    }

    .tran-row-data div {
        color: #acdaff;
        font-size: large;
        font-weight: 600;
    }

    .tran-comment div {
        color: #0abda4d1;
        font-weight: bold;
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
