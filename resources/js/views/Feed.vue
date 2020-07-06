<template>
    <div>
        <el-alert
            v-if="dataError"
            :title="errorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <el-card v-if="!dataError" v-for="(item, index) in transactionData" :key="index" class="box-card">
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
                loading: false,
                dataError: false,
                errorInfo: 'Ошибка при получении данных с сервера',
                transactionData: {}
            };
        },
        methods: {},
        mounted() {
            this.loading = true;
            axios.get('storage/testData.json', {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    // console.log(response);
                    if (response.headers['content-type'] === "application/json") {
                        this.transactionData = response.data;
                    } else {
                        this.errorInfo = 'данные поступили в неверном формате (ожидался json)'
                        this.dataError = true
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.dataError = true
                })
                .finally(() => (this.loading = false));
        }
    }
</script>

<style scoped>
    .el-card {
        margin-bottom: 30px;
    }
</style>
