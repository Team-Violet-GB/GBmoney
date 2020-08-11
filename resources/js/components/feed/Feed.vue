<template>
    <div>
        <div class="container">
            <el-alert
                v-if="getErrorStatus"
                :title="getErrorInfo"
                type="error"
                effect="dark">
            </el-alert>
            <div v-else class="feed">
                <!--        заголовок группы транзакций-->
                <el-card v-for="(transactionGroup, index) in getTransactions" :key="index"
                         class="box-card">
                    <el-row :gutter="10" slot="header" class="clearfix tran-group-header text-no-wrap">
                        <el-col :span="14">
                            <div>{{ getLocalDateString(index) }}</div>
                        </el-col>
                        <el-col :span="10">
                            <div class="tran-group-header-sum" :class="groupSumCalc(transactionGroup).color">
                                {{ groupSumCalc(transactionGroup).symbol }}{{
                                Number(groupSumCalc(transactionGroup).sum).toLocaleString() }} &#8381;
                            </div>
                        </el-col>
                    </el-row>

                    <!--            группа транзакций-->
                    <transaction-group :transactionGroup="transactionGroup" :transactionGroupName="index"
                                       class="tran-group"
                                       :feed-template="feedTemplate"
                                       />
                </el-card>
            </div>

            <!--        пагинация-->
            <div v-if="!getErrorStatus" class="pagination">
                <el-pagination
                    :hide-on-single-page="true"
                    layout="prev, pager, next"
                    @current-change="paginate"
                    :total="getTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import transactionGroup from "./TransactionGroup";

    export default {
        props: {
            feedTemplate: {
                type: Boolean,
                default() {
                    return true;
                }
            }
        },
        computed: {
            ...mapGetters([
                'getTransactions',
                'wallets',
                'incomes',
                'expenses',
                'tags',
                'getErrorStatus',
                'getErrorInfo',
                'getPage',
                'getTotal'
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
                'setPage',
                'setDateFrom',
                'setDateTo',
                'setExpenseId',
                'setIncomeId',
                'setTypeId',
                'setTotal'
            ]),
            getLocalDateString(date) {
                let days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
                let months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
                let dateObj = new Date(date);
                return days[dateObj.getDay()] + ', ' + dateObj.getDate() + ' ' + months[dateObj.getMonth()];
            },
            groupSumCalc(group) {
                let sum = 0;
                for (let i = 0; i < group.length; i++) {
                    switch (group[i].type) {
                        case 1:
                            sum += Number(group[i].amount);
                            break;
                        case 3:
                            sum -= Number(group[i].amount);
                            break;
                    }
                }
                sum = Math.round(sum) * 100;
                sum = sum / 100
                let color = (sum > 0) ? 'cstm-green' : (sum < 0) ? 'cstm-red' : 'cstm-yellow'
                let symbol = (sum > 0) ? '+' : ''
                return {sum: sum.toFixed(0), color, symbol};
            },
            paginate(page) {
                this.setPage(page);
                this.fetchTransactions()
            },
        },
        mounted() {
            if (!this.incomes) this.fetchIncomes();
            if (!this.wallets) this.fetchWallets();
            if (!this.expenses) this.fetchExpenses();
            if (!this.tags) this.fetchTags();
        },
        components: {
            transactionGroup,
        }
    }
</script>

<style scoped>
    .container {
        display: block;
        height: 100%;
    }

    .feed {
        width: 100%;
    }

    .pagination {
        margin: 10px 0;
    }

    .el-pagination {
        display: flex;
        justify-content: flex-end;
    }

    .el-card {
        border: 0 solid rgba(255, 255, 255, 0);
        margin-bottom: 30px;
        background-color: #3D3E48;
        color: #b682f9;
    }

    .text-no-wrap {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 5px;
    }

    .tran-group-header {
        color: #b3fb2acf;
        font-size: 20px;
        font-weight: 500;
        padding-left: 5px;
    }

    .tran-group-header-sum {
        text-align: right;
        font-size: 20px;
        font-weight: 500;
        padding-right: 5px;
        padding-top: 4px;
    }

    .cstm-yellow {
        color: #e6a23c;
    }

    .cstm-green {
        color: #67c23a;
    }

    .cstm-red {
        color: #f56c6c;
    }
</style>
