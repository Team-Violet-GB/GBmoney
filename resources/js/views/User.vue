<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="cstm-ruleForm">
        <el-form-item label="Ваш e-mail" prop="email">
            <el-input v-model="ruleForm.email" id="email"></el-input>
        </el-form-item>
        <el-form-item label="Ваш пароль" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password id="pass"></el-input>
        </el-form-item>
        <el-form-item label="Новый пароль" prop="newpass">
            <el-input type="password" v-model="ruleForm.newpass" autocomplete="off" show-password id="newpass"></el-input>
        </el-form-item>
        <el-form-item label="Подтверждение пароля" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password id="checkPass"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Изменить</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    export default {
        data() {
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
            var validateNewPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Введите новый пароль, пожалуйста'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    //TODO реализовать проверку корректности пароля в бэке (callback())
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Введите пароль повторно, пожалуйста'));
                } else if (value !== this.ruleForm.newpass) {
                    callback(new Error('Пароли не совпадают!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    pass: '',
                    newpass: '',
                    checkPass: '',
                    email: 'money@gb.ru' //TODO вставка имейла текущего пользователя
                },
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    newpass: [
                        { validator: validateNewPass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    email: [
                        { validator: checkEmail, trigger: 'blur' }
                    ]
                },
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
        input {
            background-color: #4b4c55;
            color: white;
            &:hover, &:focus {
                color: rgb(255, 208, 75);
            }
        }
    }
</style>
