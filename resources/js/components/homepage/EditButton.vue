<template>
    <div class="">
        <i class="cstm-edit el-icon-edit"  @click="dialogEditVisible = true"></i>

        <el-drawer
            :visible.sync="dialogEditVisible"
            size="40%"
        >
            <div class="cstm-container">
                <el-form :model="ruleForm" status-icon ref="ruleForm">
                    <span class="cstm-header">Редактировать {{ this.data.name }}</span>
                    <el-form-item prop="name">
                        <el-input placeholder="Введите название" v-model="ruleForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-switch v-if="(this.category === 'Счета')" v-model="ruleForm.include" class="cstm-switch-margin"></el-switch>
                    <span v-if="(this.category === 'Счета')" class="cstm-switch-text">Учитывать в общем балансе</span>
                    <br><br>
                    <span v-if="(this.category === 'Расход')" class="cstm-amount">Планирую потратить</span>
                    <el-form-item v-if="(this.category === 'Расход')">
                        <el-input-number v-model="ruleForm.amount" :min="0" :step="500"></el-input-number>
                    </el-form-item>
                    <span v-if="(this.category === 'Счета')" class="cstm-amount">Баланс</span>
                    <el-form-item v-if="(this.category === 'Счета')">
                        <el-input-number v-model="ruleForm.amount" :min="0" :step="500"></el-input-number>
                    </el-form-item>
                    <div align="center" style="overflow: auto; max-height: 40vh">
                        <el-form-item prop="choose">
                            <el-radio-group v-model="ruleForm.choose">
                                <el-radio-button
                                    class="cstm-radio-gap"
                                    :label="elem.id"
                                    v-for="elem in allIcons"
                                    :key="elem.id"
                                >
                                    <i :class="elem.name" class="cstm-icon-size"></i>
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <br>
                    <el-form-item align="center">
                        <el-button @click="cancelForm()">Отмена</el-button>
                        <el-button type="primary" @click="submitForm()">Подтвердить</el-button>
                        <el-button type="danger" @click="pointDelete()">Удалить</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-drawer>
    </div>
</template>


<script>
    import { mapGetters, mapActions } from 'vuex'
    import axios from 'axios'

    export default {
        props: ['data', 'category'],
        data() {
            return {
                errors: [],
                dialogEditVisible: false,
                ruleForm: {
                    name: this.data.name,
                    choose: this.data.choose,
                    amount: this.data.amount || 0,
                    include: Boolean(this.data.include)
                },
            };
        },
        computed:
            mapGetters(['allIcons', 'intervalMonth',]),
        mounted() {
            if (!this.allIcons.length) this.fetchIcons()
        },
        methods: {
            ...mapActions(['fetchIcons', 'fetchIncomes', 'fetchWallets', 'fetchExpenses']),

            pointDelete() {
                if (this.category === 'Доход') {
                    axios.delete('/api/incomes/' + this.data.id)
                        .then( response => {
                            this.fetchIncomes({
                                dateFrom: this.intervalMonth.dateFrom,
                                dateTo: this.intervalMonth.dateTo,
                            })
                            this.dialogEditVisible = false
                            this.$message.success(this.ruleForm.name + ' успешно удален')
                            this.$emit('cancel')
                        })
                        .catch((error) => {
                            this.errors.push(error.response.data.errors.name[0])
                            this.MessageArrayErrors(this.errors)
                        })
                }
                if (this.category === 'Счета') {
                    axios.delete('/api/wallets/' + this.data.id)
                        .then( response => {
                            this.fetchWallets()
                            this.dialogEditVisible = false
                            this.$message.success(this.ruleForm.name + ' успешно удален')
                            this.$emit('cancel')
                        })
                        .catch((error) => {
                            this.errors.push(error.response.data.errors.name[0])
                            this.MessageArrayErrors(this.errors)
                        })
                }
                if (this.category === 'Расход') {
                    axios.delete('/api/expenses/' + this.data.id)
                        .then( response => {
                            this.fetchExpenses({
                                dateFrom: this.intervalMonth.dateFrom,
                                dateTo: this.intervalMonth.dateTo,
                            })
                            this.dialogEditVisible = false
                            this.$message.success(this.ruleForm.name + ' успешно удален')
                            this.$emit('cancel')
                        })
                        .catch((error) => {
                            this.errors.push(error.response.data.errors.name[0])
                            this.MessageArrayErrors(this.errors)
                        })
                }
            },

            submitForm() {
                if (this.ruleForm.name) {
                        if (this.category === 'Доход'){
                            axios.patch('/api/incomes/' + this.data.id , {
                                name: this.ruleForm.name,
                                icon_id: this.ruleForm.choose
                                }).then(response => {
                                    this.fetchIncomes({
                                        dateFrom: this.intervalMonth.dateFrom,
                                        dateTo: this.intervalMonth.dateTo,
                                    })
                                    this.successForm()
                                })
                                .catch((error) => {
                                    this.errors.push(error.response.data.errors.name[0])
                                    this.MessageArrayErrors(this.errors)
                                })
                        }
                        // Wallets
                        if (this.category === 'Счета'){
                            axios.patch('/api/wallets/' + this.data.id, {
                                name: this.ruleForm.name,
                                icon_id: this.ruleForm.choose,
                                amount: this.ruleForm.amount,
                                include: this.ruleForm.include
                            }).then( response => {
                                this.fetchWallets()
                                this.successForm()
                            }).catch( error => {
                                this.errors.push(error.response.data.errors.name[0])
                                this.MessageArrayErrors(this.errors)
                            })
                        }
                        // Expenses
                        if (this.category === 'Расход'){
                            axios.patch('/api/expenses/' + this.data.id, {
                                name: this.ruleForm.name,
                                icon_id: this.ruleForm.choose,
                                max_limit: this.ruleForm.amount
                            }).then( response => {
                                this.fetchExpenses({
                                    dateFrom: this.intervalMonth.dateFrom,
                                    dateTo: this.intervalMonth.dateTo,
                                })
                                this.successForm()
                            }).catch( error => {
                                this.errors.push(error.response.data.errors.name[0])
                                this.MessageArrayErrors(this.errors)
                            })
                        }
                    } else {
                        if (!this.ruleForm.name) this.errors.push('Введите название')
                        this.MessageArrayErrors(this.errors)
                        return false;
                    };
            },
            MessageArrayErrors(errors) {
                errors.forEach((error, i) => {
                    setTimeout(() => {
                        this.$message.error(error);
                    }, 100 * ++i)
                });
                this.errors = []
            },
            cancelForm () {
                this.dialogEditVisible = false
            },
            successForm () {
                this.dialogEditVisible = false
                this.$message.success(this.ruleForm.name + ' успешно изменен')
                this.$emit('cancel')
            }
        },
    };
</script>

<style lang="scss" scoped>
    .cstm-point {
        display: block;
        position: relative;
        cursor: pointer;
    }
    .cstm-point:hover .cstm-edit {
        display: block;
        cursor: pointer;
    }
    .cstm-edit {
        color: #9a9898;
        position: absolute;
        top: 17%;
        right: 23%;
        font-size: 15px;
        display: none;
        transition: 0.3s;
    }
    .cstm-edit:hover {
        color: #67c23a;
    }
    .cstm-point {
        margin-bottom: 10px;
        flex-basis: 15%;
        position: relative;
        margin-right: 0.72%;
        margin-left: 0.72%;
    }
    .cstm-container {
        padding: 10px 10px;
    }

    .cstm-header {
        display: block;
        font-size: 25px;
        color: #ffffff;
        margin-bottom: 10px;
        text-align: center;
    }

    .cstm-point {
        margin-bottom: 10px;
        flex-basis: 15%;
        position: relative;
        margin-right: 0.72%;
        margin-left: 0.72%;
    }

    .cstm-head-point {
        color: #ffffff;
        text-align: center;
        padding-bottom: 4px;
        font-weight: 300;
    }

    .cstm-icon-point {
        font-size: 50px;
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
        cursor: grab;
    }

    .cstm-icon-point-add {
        background-color: #3d3e48;
        color: #ffffff;
    }

    .cstm-radio-gap {
        margin: 2px;
        border-radius: 50%;
    }

    .cstm-radio-gap:first-child {
        border-left: none;
    }

    .cstm-switch-margin {
        margin-left: 15px;
    }

    .cstm-switch-text {
        margin-left: 15px;
        color: #ffffff;
    }

    .cstm-amount {
        display: block;
        margin-bottom: 10px;
        color: #ffffff;
    }

    .cstm-icon-size {
        font-size: 30px;
    }

    .cstm-radio-gap {
        .el-radio-button__inner {
            border-radius: 50%;
            border: none;
            height: 72px;
        }
    }
    .el-radio-button:first-child {
        border-radius: 50%;
        .el-radio-button__inner {
            border-radius: 50%;
        }
    }
    .el-radio-button:last-child {
        border-radius: 50%;
        .el-radio-button__inner {
            border-radius: 50%;
        }
    }
    .el-radio-button__inner [class*=el-icon-] {
        line-height: 1.6;
    }
    .el-select-dropdown__item:hover {
        background-color: #3d3e48;
    }
    
    .el-button {
        border-radius: 0%;
    }

</style>
