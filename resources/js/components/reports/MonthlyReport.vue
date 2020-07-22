<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="block">
                    <span class="month-label">Отчет за месяц </span>
                    <el-date-picker
                        v-model="month"
                        type="month"
                        placeholder="Месяц?"
                        format="  MMMM yyyy года"
                        >
                    </el-date-picker>
                </div>
                <monthChart/>
            </el-col>
            <el-col :span="12">
                <feed
                    :editable="false"
                    page="1"
                    dateFrom="2020-07-06"
                    dateTo="2020-07-18"></feed>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import monthChart from "./MonthChart"
    import feed from "../feed/Feed";

    export default {
        name: "monthlyReport",
        data() {
            return {
                month: new Date()
            }
        },
        computed: {
            date() {
                let fromDate = this.month.toISOString()
                // let year = this.month.toISOString().slice(5, 7)


                return fromDate
            }
        },
        components: {
            monthChart,
            feed
        }
    }
</script>

<style scoped>
    .el-date-editor {
        margin-top: 0;
    }

    .month-label {
        color: orange;
        padding-right: 20px;
        margin-left: 30px;
    }

    .block {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 30px;
        padding-right: 5px;
    }

</style>
