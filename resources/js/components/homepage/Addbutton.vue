<template>
    <div class="cstm-point">
        <div class="cstm-head-point" @click="dialogVisible = true">Добавить</div>
        <el-button
            type="el-icon-search"
            icon="el-icon-plus"
            circle
            class="cstm-icon-point cstm-icon-point-add"
            @click="dialogVisible = true"
        ></el-button>
        <el-dialog
            :visible.sync="dialogVisible"
            width="60%"
        >
            <el-form :rules="rules" :model="ruleForm" status-icon ref="ruleForm">
                <span class="cstm-header">Добавление карточки</span>
                <el-form-item prop="name">
                    <el-input placeholder="Введите название" v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="category">
                    <el-select v-model="ruleForm.category">
                        <el-option label="Доход" value="Доход" style="color: #ffffff"></el-option>
                        <el-option label="Счета" value="Счета" style="color: #ffffff"></el-option>
                        <el-option label="Расход" value="Расход" style="color: #ffffff"></el-option>
                    </el-select>
                    <el-switch v-if="(ruleForm.category === 'Счета')" v-model="ruleForm.balance" class="cstm-switch-margin"></el-switch>
                        <span v-if="(ruleForm.category === 'Счета')" class="cstm-switch-text">Учитывать в общем балансе</span>
                </el-form-item>
                <span v-if="(ruleForm.category === 'Расход')" class="cstm-amount">Планирую потратить</span>
                <el-form-item v-if="(ruleForm.category === 'Расход')">
                    <el-input-number v-model="ruleForm.amount" :min="ruleForm.amount" :step="500"></el-input-number>
                </el-form-item>
                <span v-if="(ruleForm.category === 'Счета')" class="cstm-amount">Баланс</span>
                <el-form-item v-if="(ruleForm.category === 'Счета')">
                    <el-input-number v-model="ruleForm.amount" :min="ruleForm.amount" :step="500"></el-input-number>
                </el-form-item>
                <br>
                <div align="center">
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
                    <el-button @click="dialogVisible = false">Отмена</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">Подтвердить</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>


<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        props: ['category'],
        data() {
            return {
                dialogVisible: false,
                ruleForm: {
                    category: this.category,
                    name: '',
                    choose: '',
                    balance: true,
                    amount: 0
                },
                rules: {
                    name: [
                        {required: true, message: 'Введите название', trigger: 'blur'},
                    ],
                    choose: [
                        {required: true, message: 'Выберите картинку', trigger: 'change'},
                    ]
                }
            };
        },
        computed:
          mapGetters(['allIcons']),
        mounted() {
            this.fetchIcons()
        },
        methods: {
            ...mapActions(['fetchIcons', 'addIncomes', 'addWallets', 'addExpenses']),

            submitForm(formName) {
                 this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isBalance();
                        // Incomes
                        if (this.ruleForm.category === 'Доход'){
                            this.addIncomes({
                                    name: this.ruleForm.name,
                                    icon_id: this.ruleForm.choose
                                }
                            );
                        }
                        // Wallets
                        if (this.ruleForm.category === 'Счета'){
                            this.addWallets({
                                    name: this.ruleForm.name,
                                    amount: this.ruleForm.amount,
                                    include: this.ruleForm.balance,
                                    icon_id: this.ruleForm.choose
                                }
                            );
                        }
                        // Expenses
                        if (this.ruleForm.category === 'Расход'){
                            this.addExpenses({
                                    name: this.ruleForm.name,
                                    max_limit: this.ruleForm.amount,
                                    icon_id: this.ruleForm.choose
                                }
                            );
                        }
                        // End works
                        this.dialogVisible = false
                        this.isSuccessSubmit()

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            isBalance () {
                if (this.ruleForm.category !== 'Счета')
                    this.ruleForm.balance = true
            },
            isSuccessSubmit () {
                this.ruleForm.name = this.ruleForm.choose = ''
                this.ruleForm.amount = 0
            }
        },
    };
</script>

<style lang="scss">
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

</style>
