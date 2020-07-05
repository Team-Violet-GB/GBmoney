<template>
    <div>
        <el-table
            :data="tableData"
            :default-sort="{prop: 'date', order: 'descending'}"
            :header-cell-style="tableHeaderColor"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="Дата"
                sortable
                width="180"
                :formatter="dateLocalizer">
            </el-table-column>
            <el-table-column
                prop="type"
                label="Тип"
                width="180">
            </el-table-column>
            <el-table-column
                prop="source"
                label="Источник">
            </el-table-column>
            <el-table-column
                prop="receiver"
                label="Приемник">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import 'element-theme-dark';
    export default {
        name: "history",
        data() {
            return {
                tableData:
                    [
                        {
                            date: '2015-07-29',
                            type: 'расход',
                            source: 'карта',
                            receiver: 'авто',
                            user: 'Вася'
                        },
                        {
                            date: '2011-11-12',
                            type: 'доход',
                            source: 'карта',
                            receiver: 'авто',
                            user: 'Петя'
                        },
                        {
                            date: '2010-03-18',
                            type: 'перевод',
                            source: 'карта',
                            receiver: 'авто',
                            user: 'Толя'
                        },
                        {
                            date: '2001-05-03',
                            type: 'перевод',
                            source: 'карта',
                            receiver: 'авто',
                            user: 'Люся'
                        }
                    ]
            }
        }
        ,
        methods: {
            dateLocalizer(row, column) {
                let localDate = new Date(row[column.property]);
                let options = {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    timezone: 'UTC',
                    hour: 'numeric',
                    minute: 'numeric',
                };
                return localDate.toLocaleString("ru", options);
            },
            tableHeaderColor({row, column, rowIndex, columnIndex}) {

                return 'background-color: #5f6068;color: #fff;font-weight: 700;'

            }
        }
    }
</script>

<style scoped>



</style>
