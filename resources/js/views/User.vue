// resources/js/components/User.vue

<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="cstm-ruleForm">
        <el-form-item label="Ваш никнейм" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Ваш e-mail" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Ваш пароль" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Подтверждение пароля" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    export default {
        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('Введите Ваш никнейм, пожалуйста'));
                }
                setTimeout(() => {
                    //TODO реализовать проверку имени на дубликат из БД (callback())
                    callback();
                }, 1000);
            };
            var checkEmail = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Введите Ваш e-mail, пожалуйста'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkEmail');
                    }
                    //TODO реализовать проверку e-mail из БД (callback())
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Введите пароль, пожалуйста'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    //TODO реализовать проверку пароля из БД (callback())
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Введите пароль повторно, пожалуйста'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('Пароли не совпадают!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    pass: '',
                    checkPass: '',
                    name: '',
                    email: ''
                },
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    name: [
                        { validator: checkName, trigger: 'blur' }
                    ],
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
<style lang="scss">
    .cstm-ruleForm {
        margin: 0 auto;
        max-width: 600px;
        label {
            color: white;
        }
        .el-form-item:hover, .el-form-item:focus-within {
            label {
                color: rgb(255, 208, 75);
            }
        }
    }


</style>
