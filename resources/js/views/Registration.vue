<template>
    <div>
        <el-dialog
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="() => true"
        class="cstm-registr">
        <div>
            <div class="cstm-logo">
                <el-image class="cstm-logo-img" :src="url"></el-image>GBmoney
            </div>
            <div class="cstm-auth-header">Регистрация</div>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="cstm-ruleForm">
                    <el-form-item label="E-mail" prop="email">
                        <el-input v-model="ruleForm.email" id="email"></el-input>
                    </el-form-item>
                    <el-form-item label="Придумайте пароль" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password id="pass"></el-input>
                    </el-form-item>
                    <el-form-item label="Повторите пароль" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password
                                id="checkPass"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="() => this.$router.push('/login')">У меня есть аккаунт</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">Регистрация</el-button>
                    </el-form-item>
                </el-form>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
  export default {
    data() {
        var accordancePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Введите пароль повторно'))
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('Пароли не совпадают!'))
            } else {
                callback()
            }
        };

        var sizePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Введите пароль'))
            } else if (value.length < 6) {
                callback(new Error('Пароль должен состоять не менее чем из 6 символов'))
            } else {
                callback()
            }
        };

        return {
            dialogVisible: true,
            url: '../images/gm-money-logo.jpg',
            ruleForm: {
                email: '',
                pass: '',
                checkPass: '',
            },
            rules: {
                email: [
                    { required: true, message: 'Введите e-mail', trigger: 'blur' },
                    { type: 'email', message: 'Введен некорректрный e-mail ', trigger: 'blur' }
                ],
                pass: [
                    { required: true, validator: sizePass, trigger: 'blur' },
                ],
                checkPass: [
                    { required: true, validator: accordancePass, trigger: ['blur', 'change'] }
                ],
            },
        }
    },
    methods: {
        ...mapMutations([
            'setUserEmail',
        ]),
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios.post('api/register' , {
                        email: this.ruleForm.email,
                        password: this.ruleForm.pass
                    })
                    .then(response => {
                        let email = response.data.user.email
                        this.MessageSuccess('Пользователь ' + email + ' успешно зарегистрирован')
                        this.$store.commit('setUserEmail', email)
                        this.$router.push('/login')
                    })
                    .catch((error) => {
                        console.log(error)
                        var errors = error.response.data.errors
                        for (var err in errors) {
                            errors[err].forEach((e, i) => {
                                setTimeout(() => {
                                    this.MessageError(e)
                                }, 100 * ++i)
                            });
                        }
                    })
                    this.clearPass()
                } else {
                    this.MessageError('Проверьте правильность заполнения полей')
                    this.clearPass()
                    return false
                }
            });
        },
        MessageError(message) {
            this.$message.error(message)
        },
        MessageSuccess(message) {
            this.$message({
                message: message,
                type: 'success'
            })
        },
        MessageArrayErrors(errors) {
            errors.forEach((error, i) => {
            setTimeout(() => {
                this.$message.error(error);
            }, 100 * ++i)
            });
        },
        clearPass() {
            this.ruleForm.pass = ''
            this.ruleForm.checkPass = ''
        }
    }
  }
</script>

<style lang="scss">

%cstm-color-background-dark {
  background-color: #2c2e38;
}

%cstm-color-background-body {
  background-color: #3d3e48;
}

%cstm-color-background-header {
  background-color: #5f6068;
}

%cstm-color-text {
  color: #ffffff;
}
    .cstm-registr {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body,
        .el-form-item__label {
            @extend %cstm-color-text;
        }

        .el-dialog__body {
            @extend %cstm-color-background-header;
            padding: 10px 10px;
            div {
                display: flex;
                justify-content: space-around;
                align-content: center;
            }
        }

        .el-form {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .el-form-item {
                margin: 13px 0;
            }
        }

        .el-button {
            border-radius: 0;
        }

        .cstm-logo {
            position: relative;
            line-height: 50px;
            font-size: 24px;
            font-weight: 400;
            @extend %cstm-color-text;
            @extend %cstm-color-background-header;
        }

        .cstm-logo-img {
            position: absolute;
            top: 6px;
            left: -45px;
            height: 40px;
            width: 40px;
            border-radius: 30%;
        }

        .cstm-auth-header {
            line-height: 50px;
            font-size: 18px;
            font-weight: 400;
        }
    }
</style>
