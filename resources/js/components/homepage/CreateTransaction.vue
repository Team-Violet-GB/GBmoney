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
                <SelectCustom :points="tags" @changeSelect="(tagID) => { tag = tagID }"/>
            </div>
            <el-input placeholder="Сумма" class="cstm-input cstm-mrgn-top-20" type="number" v-model="amount"></el-input>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Комментарий"
              class="cstm-input cstm-mrgn-top-20"
              v-model="comment">
            </el-input>
            <el-button class="cstm-create-button cstm-mrgn-top-20" type="success" @click="prepareTransaction">Записать</el-button>
          </div>
        </el-drawer>
    </div>
</template>

<script>
  import SelectCustom from "../homepage/SelectCustom"
  import Calendar from "../homepage/Calendar"
  import { mapGetters, mapActions } from "vuex"

  export default {
    components: {
      SelectCustom, Calendar
    },
    data() {
      return {
        amount: null,
        comment: null,
        tag: null,
        date: Date.now(),
        direction: 'rtl',
        errors: [],
      };
    },

    computed: {
        ...mapGetters([
            'incomes',
            'wallets',
            'expenses',
            'tags',
            'transaction'
        ]),

        drawer() {
            return this.transaction.state_window
        },
        pointsFrom() {
            return (this.transaction.fromType === 'income') ? this.incomes : this.wallets
        }, 
        pointsTo() {
            return (this.transaction.toType === 'wallet') ? this.wallets : this.expenses
        }, 
    },
    
    mounted() {
        this.fetchTags()
    },

    methods: 
    {
      ...mapActions(['fetchTags']),

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

      prepareTransaction() {
        this.transaction.tag = this.tag
        this.transaction.amount = this.amount
        this.transaction.comment = this.comment
        this.transaction.date = this.date
        if (this.checkForm()) {
          this.sendTransaction(this.transaction)
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
      sendTransaction() {
        //console.log( this.transaction ) //отправка формы
      },
      getCategoryNames() {
        for (var point in this.pointsFrom) {
          if (this.pointsFrom[point].id == this.transaction.fromID) {
            this.transaction.nameFrom = this.pointsFrom[point].name
          }
        }
        for (var point in this.pointsTo) {
          if (this.pointsTo[point].id == this.transaction.toID) {
            this.transaction.nameTo = this.pointsTo[point].name
          }
        }
      },
    },
  };
</script>

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
