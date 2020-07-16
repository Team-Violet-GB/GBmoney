<template>
    <div>
        <el-row id="transaction.id" type="flex" justify="center">
            <el-col :span="18">
                <el-row :gutter="10" class="tran-row-data">
                    <el-col :span="8">
                        <div>{{ from }}</div>
                    </el-col>
                    <el-col :span="8">
                        <div>{{ transaction.money }} &#8381</div>
                    </el-col>
                    <el-col :span="8">
                        <div>{{ to }}</div>
                    </el-col>
                </el-row>
                <el-row class="editor-comment">
                    <el-col :span="24" class="tran-comment">
                        <div>{{ transaction.comment }}</div>
                    </el-col>
                </el-row>
            </el-col>

            <!--                    кнопачки операций над транзакцией-->
            <el-col :span="6" class="tran-opps">
                <el-button-group>
                    <el-button v-if="getEditorShowStatus" @click="updateTransaction('editorForm')" type="success" size="small"
                               icon="el-icon-check"></el-button>
                    <el-button @click="edit(transaction)"
                               type="primary" size="small" icon="el-icon-edit"></el-button>
                    <el-button @click="deleteTransaction(transaction.id)" type="danger" size="small"
                               icon="el-icon-delete"></el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <transactionEditor
            :transactionEditorId="Number(transaction.id)"
        />
    </div>
</template>

<script>
    import constants from './constants';
    import transactionEditor from './TransactionEditor';
    import rules from './feedValidationRules';
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "transaction",
        components: {
            transactionEditor
        },
        data() {
            return {
                constants: constants,
                rules: rules,
                showInput: false,
            }
        },
        props: {
            transaction: {
                type: Object
            },
        },
        computed: {
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags',
                'getEditorShowStatus',
                'getTransaction'
            ]),
            from() {
                if (this.transaction['type_id'] === this.constants.FROM_INCOME) {
                    return this.incomes.find(item => item.id === this.transaction.income_id).name;
                } else {
                    return this.wallets.find(item => item.id === this.transaction.wallet_id_from).name;
                }
            },
            to() {
                if (this.transaction['type_id'] === this.constants.FROM_WALLET) {
                    return this.expenses.find(item => item.id === this.transaction.tag_id).name;
                } else {
                    return this.wallets.find(item => item.id === this.transaction.wallet_id_to).name;
                }
            },
        },
        methods: {
            ...mapMutations([
                'setEditorShowStatus',
                'setTransaction'
            ]),
            edit(transaction) {
                this.setTransaction(transaction);
                this.setEditorShowStatus(true)
            },
            deleteTransaction(id) {
                // this.$confirm('Подтверждение удаления транзакции', 'Внимание!', {
                //     confirmButtonText: 'Удалить',
                //     confirmButtonClass: 'danger',
                //     showCancelButton: false,
                //     iconClass: 'el-icon-delete',
                //     type: 'warning',
                // }).then(() => {
                //     this.showInput = false;
                //     if (this.transactions[this.transaction.index].length > 1) {
                //         this.transactions[this.editor.index].splice(this.transaction.indexx, 1);
                //     } else {
                //         delete this.transactions[this.transaction.index];
                //     }
                //     !Object.keys(this.transactions).length ? this.error = true : '';
                //     this.$message({
                //         type: 'success',
                //         message: `<h2>axios.delete('/api/delete/${this.transaction.id}')</h2>`
                //     });
                // });

                // axios
                //     .delete(`/api/del/${this.transaction.id}`)
                //     .then(response => {
                //         if (response.status === 200) {
                //             if (this.transactions[this.transaction.index].length > 1) {
                //                 this.transactions[this.transaction.index].splice(this.transaction.indexx, 1);
                //             } else {
                //                 delete this.transactions[this.transaction.index];
                //             }
                //         }
                //         !Object.keys(this.transactions).length ? this.error = true : '';
                //     })
                //     .catch(error => console.log(error));
            }
        },
        mounted() {
            // this.current = Object.assign({}, this.transaction);
        }
    }
</script>

<style scoped>
    .el-card {
        margin-top: 15px;
    }

    .tran-row-data div {
        color: #acdaff;
        font-size: large;
        font-weight: 600;
    }

    .tran-comment div {
        color: #0abda4d1;
        font-weight: bold;
        margin-top: 10px;
    }

    .tran-opps {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .editor {
        margin-top: 15px;
        padding-top: 5px;
        padding-bottom: 10px;
        padding-right: 17px;
        padding-left: 17px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .2), 0 0 6px rgba(0, 0, 0, .07);
    }

    /*.editor-comment {*/
    /*    margin-top: 10px;*/
    /*}*/
</style>
