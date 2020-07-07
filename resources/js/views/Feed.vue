<template>
    <div>
        <el-alert
            v-if="dataError"
            :title="errorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <el-card v-if="!dataError" v-for="(item, index) in transactionData" :key="index" class="box-card">
            <div slot="header" class="clearfix orange">
                <h2>{{ item.date }}</h2>
            </div>

            <el-card v-for="(transaction, indexx) in item.transactions" :key="indexx"
                     class="box-card">
                <el-row>
                    <el-col :span="12">
                        <el-row :gutter="20">
                            <el-col :span="6">{{ transaction.name }}</el-col>
                            <el-col :span="6">{{ transaction.amount }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <div class="grid-content bg-purple">{{ transaction.comment }}</div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-button-group>
                                <el-button @click="showEdit($event, transaction.id, indexx)" type="primary" icon="el-icon-edit"></el-button>
                                <el-button type="danger" icon="el-icon-delete"></el-button>
                            </el-button-group>
                        </el-row>
                    </el-col>
                </el-row>
                <el-collapse-transition>
                    <div v-if="transaction.id == currentItem" v-show="showInput">
                        <el-input type="text" v-model="transactionData[index].transactions[indexx].name"></el-input>
                        <el-input type="text" v-model="transactionData[index].transactions[indexx].amount"></el-input>
                        <el-input type="date" v-model="transactionData[index].date"></el-input>
                        <el-input type="text"
                                  v-model="transactionData[index].transactions[indexx].comment"></el-input>
                    </div>
                </el-collapse-transition>
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
                currentItem: null,

                dataError: false,
                errorInfo: 'Ошибка при получении данных с сервера',
                transactionData: {}
            };
        },
        methods: {
            showEdit(event, transactionId, indexx) {
                this.currentItem = transactionId;
                this.showInput = true;
            }
        },
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
                        this.errorInfo = "данные поступили в неверном формате (нам бы json'на)"
                        this.dataError = true
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.dataError = true
                    //todo: обработка других кодов с сервера
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

    .orange {
        color: darkorange;
    }

</style>
