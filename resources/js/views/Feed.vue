<template>
    <div>
        <el-alert
            v-if="error"
            :title="errorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <!--        заголовок группы транзакций-->
        <el-card v-if="!error" v-for="(transactionsGroup, index) in transactions" :key="index" class="box-card">
            <div slot="header" class="clearfix group-header">{{ dateLocal(index) }}</div>

            <!--            список транзакций в группе-->
            <el-card v-for="(transaction, indexx) in transactionsGroup" :key="indexx" class="box-card">
                <el-row type="flex" align="middle">
                    <el-col :span="18">
                        <el-row :gutter="10" class="tr-data-row">
                            <el-col :span="8">{{ fromCalc(transaction) }}</el-col>
                            <el-col :span="8">{{ transaction.amount }} {{ rub }}</el-col>
                            <el-col :span="8">{{ toCalc(transaction) }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" style="color: #8f95a7">
                                {{ transaction.comment }}
                            </el-col>
                        </el-row>
                    </el-col>

                    <!--                    кнопачки операций над транзакцией-->
                    <el-col :span="6">
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-button-group>
                                <el-button v-if="showInput && transaction.id === editor.data.id"
                                           type="success" @click="onSubmitData('editorForm')" size="small"
                                           icon="el-icon-check"></el-button>
                                <el-button v-else @click="showEditForm(index, indexx)"
                                           type="primary" size="small" icon="el-icon-edit"></el-button>
                                <el-button @click="deleteTransaction(transaction.id)"
                                           type="danger" size="small" icon="el-icon-delete"></el-button>
                            </el-button-group>
                        </el-row>
                    </el-col>
                </el-row>

                <!--                редактор транзакции-->
                <el-collapse-transition>
                    <div v-if="transaction.id === editor.data.id" v-show="showInput" class="edit-view">
                        <el-form :model="editor.data" ref="editorForm" :rules="rules" label-position="top"
                                 label-width=" 90px" size="small">
                            <el-row :gutter="20" type="flex" justify="space-between">
                                <el-col :span="5">
                                    <el-form-item prop="date" label="когда">
                                        <el-date-picker type="date" format="dd.MM.yyyy"
                                                        v-model="editor.data.date"
                                                        style="margin-top: 0; font-size: 1em; width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
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
                                <el-col :span="5">
                                    <el-form-item label="куда">
                                        <el-select prop="to" filterable v-if="transaction.type_id === 1"
                                                   v-model="editor.data.wallet_id_to">
                                            <el-option v-for="wallet in wallets" :key="wallet.id"
                                                       :label="wallet.name" :value="wallet.id">
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
                                <el-col :span="5">
                                    <el-form-item prop="amount" label="сколько">
                                        <el-input clearable v-model.number="editor.data.amount"
                                                  style="font-size: 1em;"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item prop="comment" label="коментарий" label-position="top">
                                        <el-input v-model="editor.data.comment"></el-input>
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
    export default {
        data() {
            return {
                editor: {
                    index: null,
                    indexx: null,
                    data: {}
                },
                rules: {
                    amount: [
                        {required: true, message: 'Ну, хоть немношко!', trigger: 'blur'},
                        {type: 'number', message: 'Только цыфры!'},
                    ],
                },
                showInput: false,
                error: false,
                errorInfo: 'Ошибка при получении данных с сервера',
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
            onSubmitData(formName) {
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


                // axios
                //     .put(`/api/update/${this.currentItem}`, this.transactionData[this.currentItem.index])
                //     .then(response => {
                //         this.getTransaction();
                //         this.canceledData.data = null;
                //         // console.log(response)
                //     })
                //     .catch(error => console.log(error));

                //временно, пока не работает настоящий запрос:
                // this.getTransaction();
                this.editor.restore = false;

            },
            getTransactions() {
                const headers = {
                    'Content-Type': 'application/json'
                }
                axios.get('storage/testTransactions.json', {headers: headers})
                    .then(response => {
                        this.transactions = response.data;
                    })
                    .catch(error => {
                        console.log(error)
                        this.error = true
                        //todo: обработка других кодов с сервера
                    });
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
                        console.log(error)
                        this.error = true
                        //todo: обработка других кодов с сервера
                    });
            },
            deleteTransaction(id) {
                this.$message({
                    showClose: true,
                    message: "axios.delete('/api/delete/${currentItem.Id}'",
                    duration: 6000,
                    type: 'error'
                });

                // axios
                //     .delete(`/api/del/${id}`)
                //     .then(response => {
                //         console.log(response);
                //         this.getTransaction();
                //     })
                //     .catch(error => console.log(error));
            },
            dateLocal(date) {
                let days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
                let month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
                let dateObj = new Date(date);
                return days[dateObj.getDay()] + ', ' + dateObj.getDate() + ' ' + month[dateObj.getMonth()];
            }
        },
        mounted() {
            this.getData();
            this.getTransactions();

        }
    }
</script>

<style scoped>
    .el-card {
        margin-top: 15px;
    }

    .group-header {
        color: #008cff;
        font-size: x-large;
        font-weight: 700;
        padding-left: 20px;
    }

    .tr-data-row {
        font-size: x-large;
        margin-bottom: 15px;
    }

    .edit-view {
        margin-top: 30px;
        padding: 20px 20px 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .2), 0 0 6px rgba(0, 0, 0, .08);
    }
</style>
