<template>
    <div>
        <el-alert
            v-show="getErrorStatus"
            :title="getErrorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <!--        заголовок группы транзакций-->
        <el-card v-if="!getErrorStatus" v-for="(transactionGroup, index) in getTransactions" :key="index"
                 class="box-card">
            <el-row :gutter="10" slot="header" class="clearfix tran-group-header">
                <el-col :span="14">
                    <div>{{ getLocalDateString(index) }}</div>
                </el-col>
                <el-col :span="10">
                    <div v-if="groupSumCalc(transactionGroup) != 0" class="tran-group-header-sum">{{ groupSumCalc(transactionGroup) }} &#8381</div>
                </el-col>
            </el-row>

            <!--            группа транзакций-->
            <transaction-group :transactionGroup="transactionGroup" :transactionGroupName="index" class="tran-group"/>
        </el-card>
        <div class="pagination">
            <el-pagination
                background
                :hide-on-single-page="true"
                layout="prev, pager, next, jumper, slot"
                @current-change="paginate"
                :total="getTotal">
            </el-pagination>
        </div>

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
                'getDisablePagination',
                'getEditable',
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
                'setEditable',
                'setDateFrom',
                'setDateTo',
                'setPage',
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
                return sum.toFixed(0);
            },
            paginate(page) {
                console.log('из пагинации: ', page)
                this.setPage(page);
                this.fetchTransactions()
            }
        },
        mounted() {
            this.fetchIncomes();
            this.fetchWallets();
            this.fetchExpenses();
            this.fetchTags();
            this.setEditable(this.editable);
            this.setPage(this.page);
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.fetchTransactions()
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
        margin-bottom: 40px;
        background-color: #3D3E48;
        color: #b682f9;
    }

    .tran-group-header {
        color: #b3fb2acf;
        font-size: large;
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
    .el-pagination {
        display: flex;
        justify-content: center;
    }
</style>
