<template>
    <div>
        <el-alert
            v-show="getErrorStatus"
            :title="getErrorInfo"
            type="error"
            effect="dark">
        </el-alert>

            <!--        заголовок группы транзакций-->
            <el-card v-show="!getErrorStatus" v-for="(transactionGroup, index) in getTransactions" :key="index" class="box-card">
                <el-row :gutter="10" slot="header" class="clearfix tran-group-header">
                    <el-col :span="14">
                        <div>{{ getLocalDateString(index) }}</div>
                    </el-col>
                    <el-col :span="10">
                        <div class="tran-group-header-sum">{{ groupSumCalc(transactionGroup) }} &#8381</div>
                    </el-col>
                </el-row>

                <!--            группа транзакций-->
                <transaction-group :transactionGroup="transactionGroup" class="tran-group"/>
            </el-card>
        <scroll-loader :loader-method="fetchTransactions" :loader-disable="getDisablePagination"/>
<!--        <scroll-loader :loader-method="getTranList" :loader-disable="getDisablePagination"/>-->
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import transactionGroup from "./TransactionGroup";

    export default {
        props: {
            page: {
                type: String,
                default() {
                    return '1';
                }
            }, dateFrom: {
                type: String,
                default() {
                    return '';
                }
            },
            dateTo: {
                type: String,
                default() {
                    return '';
                }
            },
            editable: {
                type: Boolean,
                default() {
                    return true;
                }
            }
        },
        computed: {
            ...mapGetters([
                'getTransactions',
                'getErrorStatus',
                'getErrorInfo',
                'getPage',
                'getDisablePagination'
            ]),
        },
        methods: {
            ...mapActions([
                'fetchWallets',
                'fetchIncomes',
                'fetchExpenses',
                'fetchTags',
                'fetchTransactions'
            ]),
            ...mapMutations([
                'setEditable',
                'setDateFrom',
                'setDateTo',
                'setPage'
            ]),
            // getTranList() {
            //     this.fetchTransactions()
            // },
            getLocalDateString(date) {
                let days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
                let months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
                let dateObj = new Date(date);
                return days[dateObj.getDay()] + ', ' + dateObj.getDate() + ' ' + months[dateObj.getMonth()];
            },
            groupSumCalc(group) {
                let sum = 0;
                for (let i = 0; i < group.length; i++) {
                    sum += Number(group[i].amount);
                }
                sum = Math.round(sum) * 100;
                sum = sum / 100
                return sum.toFixed(0);
            }
        },
        async mounted() {
            await this.fetchIncomes();
            await this.fetchWallets();
            await this.fetchExpenses();
            await this.fetchTags();
            this.setEditable(this.editable);
            this.setPage(this.page);
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
        },
        components: {
            transactionGroup,
        }
    }
</script>

<style scoped>
    body {
        margin: 0;
    }

    .el-card {
        border: 0 solid rgba(255, 255, 255, 0);
        margin-bottom: 30px;
        background-color: #3D3E48;
        color: #b682f9 ;
    }

    .tran-group-header {
        color: #b3fb2acf;
        font-size: x-large;
        font-weight: 500;
        padding-left: 5px;
    }

    .tran-group-header-sum {
        text-align: right;
        color: #b3fb2acf;
        font-size: large;
        font-weight: 500;
        padding-right: 5px;
        padding-top: 4px;
    }
</style>
