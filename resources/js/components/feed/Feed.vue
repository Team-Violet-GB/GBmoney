<template>
    <div>
        <el-alert
            v-show="getErrorStatus"
            :title="getErrorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <!--        заголовок группы транзакций-->
        <el-card v-show="!getErrorStatus" v-for="(transactionGroup, index) in getTransactions" :key="index"
                 v-loading="getLoadingStatus" element-loading-text="Загрузка..." element-loading-spinner="el-icon"
                 element-loading-background="rgba(0, 0, 0, 0.8)" class="box-card">
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
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import transactionGroup from "./TransactionGroup";

    export default {
        props: {
            dateFrom: {
                type: String,
                default: null
            },
            dateTo: {
                type: String,
                default: null
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            ...mapGetters([
                'getTransactions',
                'getLoadingStatus',
                'getErrorStatus',
                'getErrorInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'fetchWallets',
                'fetchIncomes',
                'fetchExpenses',
                'fetchTags',
                'requestTransactions'
            ]),
            ...mapMutations([
                'setEditable',
                'setDateFrom',
                'setDateTo'
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
                    sum += group[i].money;
                }
                return sum;
            }
        },
        mounted() {
            this.fetchIncomes();
            this.fetchWallets();
            this.fetchExpenses();
            this.fetchTags();
            this.setEditable(this.editable);
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.requestTransactions();
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
        margin-bottom: 30px;
        background-color: #3D3E48;
        color: #b682f9;
    }

    .tran-group-header {
        color: #b3fb2acf;
        font-size: x-large;
        font-weight: 500;
        padding-left: 20px;
    }

    .tran-group-header-sum {
        text-align: right;
        color: #b3fb2acf;
        font-size: large;
        font-weight: 500;
        padding-right: 20px;
    }
</style>
