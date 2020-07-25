<template>
    <div v-if="isNotAuth">
        <el-dialog
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="() => true"
        class="cstm-auth">
        <div>
            <div class="cstm-logo">
                <el-image class="cstm-logo-img" :src="url"></el-image>GBmoney
            </div>
            <div class="cstm-auth-header">Вход в личный кабинет</div>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="200px" class="cstm-ruleForm">
                    <el-form-item label="E-mail" prop="email">
                        <el-input v-model="ruleForm.email" id="email"></el-input>
                    </el-form-item>
                    <el-form-item label="Пароль" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password id="pass"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="() => this.$router.push('/registration')">Регистрация</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">Войти</el-button>
                    </el-form-item>
                </el-form>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

  export default {
    data() {
        return {
            dialogVisible: true,
            url: '../images/gm-money-logo.jpg',
            ruleForm: {
                pass: '',
                email: this.$store.getters.user.email,
            },
            rules: {
                pass: [
                    { required: true, message: 'Введите пароль', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: 'Введите e-mail', trigger: 'blur' },
                    { type: 'email', message: 'Введен некорректрный e-mail  ', trigger: 'blur'}
                ],
            }
        }
    },
    computed: {
        isNotAuthenticated() {
            return this.isNotAuthenticated()
        },
        ...mapGetters([
            'isAuth',
            'user',
            'isNotAuth',
        ])
    },
    methods: {
        ...mapActions([
            'login'
        ]),
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.login({
                        email: this.ruleForm.email,
                        password: this.ruleForm.pass,
                        this: this
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

    }
  };
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
    .cstm-auth {
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
