<template>
    <div>
        <!-- Модальное окно  -->
        <el-drawer
        title="транзакция"
        :visible.sync="drawer"
        :direction="direction"
        size="40%"
        :before-close="handleClose">
          <div class="cstm-body-window">
            <Calendar @changeDate="(newDate) => { date = newDate }" />
            <div class="cstm-select-box cstm-mrgn-top-20">
              <SelectCustom :points="pointsFrom" :id="transaction.fromID" @changeSelect="(fromID) => { transaction.fromID = fromID }" />
              <i class="el-icon-right"></i>
              <SelectCustom :points="pointsTo" :id="transaction.toID"  @changeSelect="(toID) => { transaction.toID = toID }"/>
            </div>
            <div  v-if="transaction.toType == 'expense'" class="cstm-select-box cstm-mrgn-top-20">
                <span class="cstm-label">Подкатегория:</span> 
                <SelectCustom :points="tags" :id="1"  @changeSelect="(tagID) => { tag = tagID }"/>
            </div>
            <el-input placeholder="Сумма" class="cstm-input cstm-mrgn-top-20" v-model="amount"></el-input>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Комментарий"
              class="cstm-input cstm-mrgn-top-20"
              v-model="comment">
            </el-input>
            <el-button class="cstm-create-button cstm-mrgn-top-20" type="success" @click="submitTransaction">Записать</el-button>
          </div>
        </el-drawer>
    </div>
</template>

<script>
import SelectCustom from "../homepage/SelectCustom"
import Calendar from "../homepage/Calendar"

  export default {
    props: ['transactionData', 'incomesData', 'walletsData', 'expensesData'],
    components: {
      SelectCustom, Calendar
    },
    data() {
      return {
        transaction: this.transactionData,
        amount: null,
        comment: null,
        tag: null,
        date: Date.now(),
        direction: 'rtl',
        errors: [],
        tags: [
          { id: 1, name: "Подкатегория1" },
          { id: 2, name: "Подкатегория2" },
          { id: 3, name: "Подкатегория3" },
          { id: 4, name: "Подкатегория4" }
        ]
      };
    },

    computed: {
        drawer() {
              return this.transaction.state_window
        },
        incomes() {
              return this.incomesData
        },
        wallets() {
              return this.walletsData
        },
        expenses() {
              return this.expensesData
        },
        pointsFrom() {
            return (this.transaction.fromType === 'income') ? this.incomes : this.wallets
        }, 
        pointsTo() {
            return (this.transaction.toType === 'wallet') ? this.wallets : this.expenses
        }, 
    },
    watch: {
      transactionData(newValue) {
        this.transaction = newValue
      },
    },
    methods: {
      handleClose() {
        this.$emit('closeCreateWindow')
      },

      checkForm() {
        if (this.amount && this.date) return true;
        this.errors = []

        if (!this.amount) {
          this.errors.push('Не указана сумма');
        }
        
        if (!this.date) {
          this.errors.push('Не указана дата');
        }
        return false;
      },

      MessageError(message) {
        this.$message.error(message);
      },

      MessageSuccess(message) {
        this.$message({
          message: message,
          type: 'success'
        });
      },

      submitTransaction() {
        this.transaction.tag = this.tag
        this.transaction.amount = this.amount
        this.transaction.comment = this.comment
        this.transaction.date = this.date
        if (this.checkForm()) {
          console.log( this.transaction )
          this.getCategoryNames()
          this.MessageSuccess('Новая транзакция на сумму ' + this.amount + ' из ' + this.transaction.nameFrom + ' в ' + this.transaction.nameTo)
          this.amount = this.comment = this.tag = null
          this.handleClose()
        } else {
           this.errors.forEach((error, i) => {
              setTimeout(() => {
                  this.MessageError(error);
              }, 100 * ++i)
            });
        }
      },
      getCategoryNames() {
        this.pointsFrom.forEach((point) => {
          if (point.id == this.transaction.fromID) {
            this.transaction.nameFrom = point.name
          }
        })
        this.pointsTo.forEach((point) => {
          if (point.id == this.transaction.toID) {
            this.transaction.nameTo = point.name
          }
        })
      },
    },
  };
</script>

<style>
  .el-drawer:focus {
    outline: none;
    border: none;
  }
  .el-drawer__header {
    background-color: #5f6068;
    color: #ffffff;
    margin: 0;
    padding: 0;
  }

  .el-drawer__header span {
    text-transform: uppercase;
    font-size: 20px;
    display: flex;
    justify-content: center;
    outline: none;
    line-height: 60px;

  }

  .el-input__inner:focus{
    border-color: #ffffff;
  }

  .el-drawer__body {
    background-color: #3d3e48;
  }

  .el-icon-right{
    color: #ffffff;
    font-size: 20px;
  }

  .cstm-mrgn-top-20 {
    margin-top: 20px;
  }

  .el-textarea__inner{
    border: none;
    width: 100%;
  }

.cstm-input,
.cstm-input textarea{
    background: #2c2e38;
    color: #ffffff;
    border-radius: 0%;
    font-size: 16px;
  }

.cstm-input textarea {
  font-style: italic;
  border: 1px #5f6068 solid;
}

.cstm-input textarea:focus {
  border-color: #ffffff;
}


</style>

<style scoped>
  .cstm-create-button{
    border-radius: 0;
    width: 90%;
    font-size: 20px;
    transition: .2s;
  }

  .cstm-create-button:hover {
    filter: brightness(110%);
    transition: .2s;
  }

  .cstm-body-window {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cstm-select-box {
    margin-top: 20px;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
.cstm-input {
  width: 90%;
}

.cstm-label {
  width: 50%;
  text-align: right;
  color: #ffffff;
}

</style>
