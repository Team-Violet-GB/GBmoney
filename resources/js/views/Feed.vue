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
                <h2>{{ item[0].date }}</h2>
            </div>
            <el-card v-for="(transaction, indexx) in item" :key="indexx" class="box-card">
                <el-row type="flex" align="middle">
                    <el-col :span="18">
                        <el-row :gutter="20">
                            <el-col :span="4"><h2>{{ transaction.source }}</h2></el-col>
                            <el-col :span="4"><h2>{{ transaction.amount }}</h2></el-col>
                            <el-col :span="4"><h2>{{ transaction.receiver }}</h2></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="grid-content bg-purple">{{ transaction.comment }}</div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="6">
                        <el-row type="flex" class="row-bg" justify="end">
                            <el-button-group>
                                <el-button v-if="showInput && transaction.id == currentItem.id" type="success"
                                           @click="onSubmitData" size="small" icon="el-icon-check"></el-button>
                                <el-button @click="showEditForm(transaction.id, index, indexx)" size="small" type="primary"
                                           icon="el-icon-edit"></el-button>
                                <el-button @click="deleteTransaction(transaction.id)" size="small" type="danger"
                                           icon="el-icon-delete"></el-button>
                            </el-button-group>
                        </el-row>
                    </el-col>
                </el-row>
                <el-collapse-transition>
                    <div v-if="transaction.id == currentItem.id" v-show="showInput" class="edit-view">
                        <el-form ref="form" :model="editFormData" label-width="120px"
                                 size="mini">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="Момент">
                                        <el-col :span="11">
                                            <el-date-picker
                                                v-model="editFormData.date"
                                                type="datetime"
                                                placeholder="Когда?"
                                                default-time="12:00:00">
                                            </el-date-picker>
                                        </el-col>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="Из">
                                        <el-select v-model="editFormData.source" placeholder="источник">
                                            <el-option label="Наличные" value="Наличные"></el-option>
                                            <el-option label="Карта" value="Карта"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6">
                                    <el-form-item label="В">
                                        <el-select v-model="editFormData.receiver" placeholder="приемник">
                                            <el-option label="Авто" value="Авто"></el-option>
                                            <el-option label="Разное" value="Разное"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="6">
                                    <el-form-item label="Сумма">
                                        <el-input v-model="editFormData.amount"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">


                                    <el-form-item label="Коментарий">
                                        <el-input v-model="editFormData.comment"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <!--                            <el-form-item>-->
                            <!--                                <el-button type="success" @click="onSubmitData" icon="el-icon-check"></el-button>-->
                            <!--                            </el-form-item>-->
                        </el-form>
                        <!--                        <el-input type="text" v-model="transactionData[index][indexx].name"></el-input>-->
                        <!--                        <el-input type="text" v-model="transactionData[index][indexx].amount"></el-input>-->
                        <!--                        <el-input type="date" v-model="transactionData[index][indexx].date"></el-input>-->
                        <!--                        <el-input type="text" v-model="transactionData[index][indexx].comment"></el-input>-->
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
                editFormData: {
                    date: '',
                    time: '',
                    source: '',
                    receiver: '',
                    amount: '',
                    comment: ''
                },

                showText: true,
                showInput: false,
                currentItem: {
                    id: null,
                    index: null,
                    indexx: null
                },

                dataError: false,
                errorInfo: 'Ошибка при получении данных с сервера',
                transactionData: {}
            };
        },
        methods: {
            onSubmitData() {
                this.showInput = false;
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
            },
            showEditForm(id, index, indexx) {
                console.log(id, '\n', index, '\n', indexx);
                this.currentItem.id = id;
                this.currentItem.index = index;
                this.currentItem.indexx = indexx;
                this.showInput = true;

                // axios
                //     .put(`/api/update/${this.currentItem}`, {
                //         title: this.tr.title,
                //         desc: this.tr.desc
                //     })
                //     .then(response => {
                //         this.tr.title = ''
                //         this.tr.desc = ''
                //         this.edit = false
                //         this.getPosts()
                //         console.log(response)
                //     })
                //     .catch(error => console.log(error));
            },
            deleteTransaction(id) {
                axios
                    .delete(`/api/del/${id}`)
                    .then(response => console.log(response))
                    .catch(error => console.log(error));
                this.getTransaction()
            }
        },
        mounted() {
            this.getTransaction()
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

    .edit-view {
        padding-top: 20px;
    }

</style>
