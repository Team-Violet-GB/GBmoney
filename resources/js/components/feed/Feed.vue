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
            <transaction-group :transactionGroup="transactionGroup"/>
        </el-card>

        <!--        Пагинация-->
        <div v-show="!getErrorStatus" class="pagination block">
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
    import transactionGroup from "./TransactionGroup";

    export default {
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
        async mounted() {
            await this.fetchIncomes()
            await this.fetchWallets()
            await this.fetchExpenses()
            await this.fetchTags()
            await this.requestTransactions();
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
