<template>
    <div>
        <el-alert
            v-if="error"
            :title="errorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <!--        заголовок группы транзакций-->
        <el-card v-if="!error" v-for="(transactionGroups, index) in getTransactions" :key="index"
                 v-loading="loading" element-loading-text="Загрузка..." element-loading-spinner="el-icon"
                 element-loading-background="rgba(0, 0, 0, 0.8)" class="box-card">
            <el-row :gutter="10" slot="header" class="clearfix tran-group-header">
                <el-col :span="14">
                    <div>{{ getLocalDateString(transactionGroups[0]['date']) }}</div>
                </el-col>
                <el-col :span="10">
                    <div class="tran-group-header-sum">{{ groupSumCalc(transactionGroups) }} &#8381</div>
                </el-col>
            </el-row>

            <!--            группа транзакций-->
            <Transaction-groups
                :transactionGroups="transactionGroups"
            />
        </el-card>

        <!--        Пагинация-->
        <div class="pagination block">
            <el-pagination
                background
                :page-size="20"
                :pager-count="11"
                :total="1000"
                hide-on-single-page
                layout="prev, pager, next">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import 'element-theme-dark';
    import {mapActions, mapGetters} from 'vuex';
    import TransactionGroups from "../components/feed/TransactionGroups";

    export default {
        data() {
            return {
                loading: false,
                error: false,
                errorInfo: 'Нет данных',

                // transactions: {},
            };
        },

        computed: {
            ...mapGetters([
                'getTransactions',
            ]),
        },
        methods: {
            ...mapActions([
                'requestTransactions'
            ]),


            async getData() {
                const headers = {
                    'Content-Type': 'application/json'
                }
                await axios.get('storage/testWallets.json', {headers: headers})
                    .then(response => {
                        this.wallets = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = true;
                        this.errorInfo = 'Ошибка во время запроса данных';
                        //todo: обработка других кодов с сервера
                    });

                await axios.get('storage/testIncomes.json', {headers: headers})
                    .then(response => {
                        this.incomes = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = true;
                        this.errorInfo = 'Ошибка во время запроса данных';
                        //todo: обработка других кодов с сервера
                    });

                await axios.get('storage/testExpensesCategory.json', {headers: headers})
                    .then(response => {
                        this.expensesCategory = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = true;
                        this.errorInfo = 'Ошибка во время запроса данных';
                        //todo: обработка других кодов с сервера
                    });

                await axios.get('storage/testExpenses.json', {headers: headers})
                    .then(response => {
                        this.expenses = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = true;
                        this.errorInfo = 'Ошибка во время запроса данных';
                        //todo: обработка других кодов с сервера
                    });
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
                    sum += group[i].money;
                }
                return sum;
            }
        },
        mounted() {
            // await this.getData();
            // await this.getTransactions();
            this.requestTransactions();
        },
        components: {
            TransactionGroups,
        }
    }
</script>

<style scoped>
    body {
        margin: 0;
    }

    .pagination {
        margin-top: 20px;
        margin-bottom: 50px;
        display: flex;
        justify-content: center;
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
</style>
