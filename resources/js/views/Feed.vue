<template>
    <div>
        <el-alert
            v-if="dataError"
            :title="errorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <el-card v-if="!dataError" v-for="(item, index) in transactionData" :key="index" class="box-card">
            <div @click="showInput = !showInput" slot="header" class="clearfix">
                <h2>{{ transactionData[index].date }}</h2>
            </div>

            <el-card v-for="(transaction, indexx) in item.transactions" :key="indexx" class="box-card">
                <div  v-show="showInput">
                    <el-input type="text" v-model="transactionData[index].transactions[indexx].name"></el-input>
                    <el-input type="text" v-show="showInput" v-model="transactionData[index].transactions[indexx].amount"></el-input>
                    <el-input type="date" v-show="showInput" v-model="transactionData[index].date"></el-input>
                    <el-input type="textarea" v-model="transactionData[index].transactions[indexx].comment"></el-input>
                </div>
            </el-card>

        </el-card>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                showText: true,
                showInput: false,

                dataError: false,
                errorInfo: 'Ошибка при получении данных с сервера',
                transactionData: {}
            };
        },
        methods: {},
        mounted() {
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
        }
    }
</script>

<style scoped>
    .el-card {
        margin-bottom: 30px;
        cursor: default !important;
    }

    .el-input {
        font-size: 18pt;
        cursor: pointer !important;
    }
</style>
