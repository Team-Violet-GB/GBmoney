<template>
    <div>
        <el-alert
            v-if="dataError"
            :title="errorInfo"
            type="error"
            effect="dark">
        </el-alert>

        <!--        заголовок группы транзакций-->
        <el-card v-if="!dataError" v-for="(item, index) in transactionData" :key="index" class="box-card">
            <div slot="header" class="clearfix group-header">{{ dateLocal(item[0].date) }}</div>

            <!--            список транзакций в группе-->
            <el-card v-for="(transaction, indexx) in item" :key="indexx" class="box-card">
                <el-row type="flex" align="middle">
                    <el-col :span="18">
                        <el-row :gutter="20" class="tr-data-row">
                            <el-col :span="8">{{ transaction.source }}</el-col>
                            <el-col :span="8">{{ transaction.amount }} {{ rub }}</el-col>
                            <el-col :span="8">{{ transaction.receiver }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" style="color: #8f95a7">
                                {{ transaction.comment }}
                            </el-col>
                        </el-row>
                    </el-col>

                    <!--                    кнопачки операций над транзакцией-->
                    <el-col :span="6">
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-button-group>
                                <el-button v-if="showInput && transaction.id == currentItem.id" type="success"
                                           @click="onSubmitData" size="small" icon="el-icon-check"></el-button>
                                <el-button @click="showEditForm(transaction.id, index, indexx)" size="small"
                                           type="primary"
                                           icon="el-icon-edit"></el-button>
                                <el-button @click="deleteTransaction(transaction.id)" size="small" type="danger"
                                           icon="el-icon-delete"></el-button>
                            </el-button-group>
                        </el-row>
                    </el-col>
                </el-row>

                <!--                выпадающий редактор транзакции-->
                <el-collapse-transition>
                    <div v-if="transaction.id == currentItem.id" v-show="showInput" class="edit-view">
                        <el-form ref="form" label-width=" 90px" size="small">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="Откуда">
                                        <el-select v-model="transactionData[index][indexx].source"
                                                   placeholder="источник">
                                            <el-option v-for="src in sources" :key="src.id" :label="src.title"
                                                       :value="src.title">{{ src.title }}
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item :label="rub">
                                        <el-input clearable v-model="transactionData[index][indexx].amount"
                                                  style="font-size: 1em;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="Куда">
                                        <el-select v-model="transactionData[index][indexx].receiver"
                                                   placeholder="приемник">
                                            <el-option v-for="rsv in receivers" :key="rsv.id" :label="rsv.title"
                                                       :value="rsv.title">{{ rsv.title }}
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="16">
                                    <el-form-item label="Коментарий">
                                        <el-input v-model="transactionData[index][indexx].comment"
                                                  style="font-size: 1em;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="Когда">
                                        <el-date-picker type="date" v-model="transactionData[index][indexx].date"
                                                        style="font-size: 1em; width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
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
                showInput: false,
                currentItem: {
                    id: null,
                    index: null,
                    indexx: null
                },

                dataError: false,
                errorInfo: 'Ошибка при получении данных с сервера',
                transactionData: {},
                sources: [],
                receivers: {}
            };
        },
        computed: {
            rub() {
                return String.fromCharCode(8381);
            }
        },
        methods: {
            dateLocal(date) {
                return new Date(date).toLocaleDateString();
            },
            onSubmitData() {
                this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: '<h4>axios.put(\'/api/update/${currentItem.Id}\', this.transactionData[this.currentItem.index]</h4>',
                    duration: 6000,
                    type: 'success'
                });
                console.log(this.transactionData[this.currentItem.index]);

                this.showInput = false;

                // axios
                //     .put(`/api/update/${this.currentItem}`, this.transactionData[this.currentItem.index])
                //     .then(response => {
                //         this.getTransaction();
                //         // console.log(response)
                //     })
                //     .catch(error => console.log(error));

            },
            getTransaction() {
                axios
                    .get('storage/testData.json', {
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
                    });

                axios
                    .get('storage/testSources.json', {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => {
                        // console.log(response);
                        if (response.headers['content-type'] === "application/json") {
                            this.sources = response.data;
                        } else {
                            this.errorInfo = "данные поступили в неверном формате (нам бы json'на)"
                            this.dataError = true
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.dataError = true
                        //todo: обработка других кодов с сервера
                    });

                axios
                    .get('storage/testReceivers.json', {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => {
                        // console.log(response);
                        if (response.headers['content-type'] === "application/json") {
                            this.receivers = response.data;
                        } else {
                            this.errorInfo = "данные поступили в неверном формате (нам бы json'на)"
                            this.dataError = true
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.dataError = true
                        //todo: обработка других кодов с сервера
                    });

            },
            showEditForm(id, index, indexx) {
                this.currentItem.id = id;
                this.currentItem.index = index;
                this.currentItem.indexx = indexx;
                this.showInput = true;
            },
            deleteTransaction(id) {
                this.$message({
                    showClose: true,
                    message: "axios.delete('/api/delete/${currentItem.Id}'",
                    duration: 6000,
                    type: 'error'
                });

                axios
                    .delete(`/api/del/${id}`)
                    .then(response => console.log(response))
                    .catch(error => console.log(error));
                this.getTransaction()
            }
        },
        filters: {},
        mounted() {
            this.getTransaction()
        }
    }
</script>

<style scoped>
    .el-card {
        margin-top: 15px;
    }

    .group-header {
        color: #0097FF;
        font-size: xx-large;
        font-weight: 500;
        padding-left: 20px;
    }

    .tr-data-row {
        font-size: x-large;
        margin-bottom: 10px;
    }

    .edit-view {
        margin-top: 30px;
        padding: 20px 20px 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }
</style>
