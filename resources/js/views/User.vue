<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="cstm-ruleForm">
        <div class="clearfix cstm-form-text">
            <span>Изменение данных пользователя</span>
        </div>
        <el-form-item label="Ваш e-mail" prop="email">
            <el-input v-model="ruleForm.email" id="email"></el-input>
        </el-form-item>
        <el-form-item label="Ваш пароль" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password id="pass"></el-input>
        </el-form-item>
        <el-form-item label="Новый пароль" prop="newpass">
            <el-input type="password" v-model="ruleForm.newpass" autocomplete="off" show-password
                      id="newpass"></el-input>
        </el-form-item>
        <el-form-item label="Подтверждение пароля" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password
                      id="checkPass"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Изменить</el-button>
            <el-button @click="open">Удалить</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import {mapMutations, mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            var checkEmail = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Введите Ваш e-mail, пожалуйста'));
                } else {
                    this.$refs.ruleForm.validateField('checkEmail');
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Введите пароль, пожалуйста'));
                } else {
                    this.$refs.ruleForm.validateField('checkPass');
                    callback();
                }
            };
            var validateNewPass = (rule, value, callback) => {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                    callback();
                }
                callback();
            };
            var validatePass2 = (rule, value, callback) => {
                if (value !== this.ruleForm.newpass) {
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
                    email: this.$store.getters.email,
                },
                rules: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    newpass: [
                        {validator: validateNewPass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                },
                ...mapMutations([
                    'setUserEmail',
                    'clearUserData'
                ]),
            };
        },
        methods: {
            ...mapGetters([
                'email',
                'isAuth',
            ]),
            ...mapActions([
                'logout'
            ]),
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/api/user/user', {
                            _method: "PATCH",
                            email: this.ruleForm.email,
                            password: this.ruleForm.pass,
                            newpass: this.ruleForm.newpass,
                        })
                            .then(response => {
                                let email = response.data.user.email
                                this.MessageSuccess('Пользователь ' + email + ' успешно изменен')
                                this.$store.commit('setUserEmail', email)
                            })
                            .catch((error) => {
                                if (error.response.data.errors) {
                                    let errors = error.response.data.errors
                                    for (var err in errors) {
                                        errors[err].forEach((e, i) => {
                                            setTimeout(() => {
                                                this.MessageError(e)
                                            }, 100 * ++i)
                                        });
                                    }
                                } else {
                                    let err = error.response.data.message
                                    this.MessageError(err)
                                }
                            })

                    } else {
                        this.MessageError('Проверьте правильность заполнения полей')
                        return false
                    }
                });
            },

            submitFormDelete(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post('/api/user/user', {
                            _method: "DELETE",
                            email: this.ruleForm.email,
                            password: this.ruleForm.pass,
                        })
                            .then(() => {
                                this.MessageSuccess('Пользователь успешно удалён')
                                localStorage.removeItem('user-token');
                                localStorage.removeItem('user');
                                this.$store.commit('clearUserData')
                                this.$router.push('/login')
                            })
                            .catch((error) => {
                                if (error.response.data.errors) {
                                    let errors = error.response.data.errors
                                    for (var err in errors) {
                                        errors[err].forEach((e, i) => {
                                            setTimeout(() => {
                                                this.MessageError(e)
                                            }, 100 * ++i)
                                        });
                                    }
                                } else {
                                    let err = error.response.data.message
                                    this.MessageError(err)
                                }
                            })
                    } else {
                        this.MessageError('Проверьте правильность заполнения полей')
                        return false
                    }
                });
            },

            open() {
                this.$confirm('Вы уверены, что хотите удалить пользователя навсегда?', 'ВНИМАНИЕ!', {
                    confirmButtonText: 'Уверен',
                    cancelButtonText: 'Отменить',
                    type: 'warning'
                }).then(() => {
                    this.submitFormDelete('ruleForm')
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Удаление отменено'
                    });
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

    .el-message-box {
        background-color: #5f6068;
        border: 1px solid white;
        color: white;

        .el-message-box__title,
        .el-message-box__message {
            color: white;
        }
    }
</style>
<style lang="scss" scoped>
    .cstm-form-text {
        color: #ffffff;
        text-align: center;
        padding-bottom: 4px;
        margin-bottom: 1em;
        font-size: 25px;
        font-weight: 700;
    }

    .el-button--default {
        background-color: #f56c6c;
        color: white;
    }

</style>
