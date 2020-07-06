<template>
    <div>
        <el-card v-for="(item, index) in testData" :key="index" class="box-card">
            <div slot="header" class="clearfix">
                <span>{{ item.date }}</span>
            </div>

            <el-card v-for="(transaction, indexx) in item.transactions" :key="indexx" class="box-card">
                <div class="text item">
                    <h2>{{ transaction.name }}</h2>
                    <h3>{{ transaction.amount }}</h3>
                    <h5>Коментарий</h5>
                    <p>{{ transaction.comment }}</p>
                </div>
            </el-card>

        </el-card>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                testData: [
                    {
                        date: '2015-07-29',
                        transactions: [
                            {
                                id: 53,
                                date: '2015-07-29',
                                name: 'Бензин',
                                type: 'Расход',
                                source: 'Карта',
                                receiver: 'Авто',
                                amount: 2000,
                                comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci commodi deleniti earum ex laborum magni perferendis porro. Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
                            }
                        ]
                    },

                    {
                        date: '2011-11-12',
                        transactions: [
                            {
                                id: 44,
                                date: '2011-11-12',
                                name: 'Получка',
                                type: 'Доход',
                                source: 'Зарплата',
                                receiver: 'Кошелек',
                                amount: 20000,
                                comment: 'Adipisci commodi deleniti earum ex laborum magni perferendis porro. Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
                            },
                            {
                                id: 32,
                                date: '2011-11-12',
                                name: 'Припрятал и забыл',
                                type: 'Перевод',
                                source: 'Кошелек',
                                receiver: 'Заначка',
                                amount: 13000,
                                comment: 'Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'

                            },
                        ]
                    },

                    {
                        date: '2001-05-03',
                        transactions: [
                            {
                                id: 20,
                                date: '2001-05-03',
                                name: 'Снял',
                                type: 'Перевод',
                                source: 'Карта',
                                receiver: 'Кошелек',
                                amount: 7500,
                                comment: 'Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            handleChange(val) {
                console.log(val);
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .el-card {
        margin-bottom: 30px;
    }
</style>
