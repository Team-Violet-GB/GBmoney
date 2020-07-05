<template>
    <div>
        <el-table
            :data="tableData"
            :default-sort="{prop: 'date', order: 'descending'}"
            :header-cell-style="tableHeaderColor"
            style="width: 100%">

            <el-table-column type="expand">
                <template slot-scope="props">
                    <h2>{{ props.row.source }} -> {{ props.row.receiver }}</h2>
                    <h4>{{ props.row.comment }}</h4>
                </template>
            </el-table-column>

            <el-table-column
                prop="date"
                label="Дата"
                sortable
                :formatter="dateLocalizer">
            </el-table-column>

            <el-table-column
                prop="amount"
                label="Сумма"
                sortable
                :formatter="amountLocalizer">
            </el-table-column>

            <el-table-column
                prop="type"
                label="Операция"
                sortable>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import 'element-theme-dark';

    export default {
        name: "feed",
        data() {
            return {
                tableData:
                    [
                        {
                            date: '2015-07-29',
                            type: 'Расход',
                            source: 'Карта',
                            receiver: 'Авто',
                            amount: 2000,
                            comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci commodi deleniti earum ex laborum magni perferendis porro. Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
                        },
                        {
                            date: '2011-11-12',
                            type: 'Доход',
                            source: 'Зарплата',
                            receiver: 'Кошелек',
                            amount: 20000,
                            comment: 'Adipisci commodi deleniti earum ex laborum magni perferendis porro. Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'

                        },
                        {
                            date: '2010-03-18',
                            type: 'Перевод',
                            source: 'Кошелек',
                            receiver: 'Заначка',
                            amount: 13000,
                            comment: 'Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'

                        },
                        {
                            date: '2001-05-03',
                            type: 'Перевод',
                            source: 'Карта',
                            receiver: 'Кошелек',
                            amount: 7500,
                            comment: 'Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
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
            amountLocalizer(row, column) {
                return row[column.property] + ' ' + String.fromCharCode(8381);
            },
            tableHeaderColor({row, column, rowIndex, columnIndex}) {

                return 'background-color: #5f6068;color: #fff;font-weight: 700;'

            }
        }
    }
</script>

<style scoped>


</style>
