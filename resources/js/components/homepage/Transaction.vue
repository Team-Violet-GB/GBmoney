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
            <Calendar 
              :date="transaction.date"
              @changeDate="(newDate) => { 
              newDate ? (transaction.date = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 10)): transaction.date = null 
              }" />
            <div class="cstm-select-box cstm-mrgn-top-20">
              <SelectCustom :list="pointsFrom" :idSelected="transaction.fromID" @changeSelect="(fromID) => { transaction.fromID = fromID }" />
              <i class="el-icon-right"></i>
              <SelectCustom :list="pointsTo" :idSelected="transaction.toID" @changeSelect="(toID) =>  { changePointsTo(toID) }"/>
            </div>
            <div  v-if="transaction.type == 3" class="cstm-select-box cstm-tags cstm-mrgn-top-20">
                <span class="cstm-label">Подкатегория: </span> 
                <SelectCustom 
                  :list="tagsFromCategory" 
                  :idSelected="transaction.tag" 
                  :withEmptySelect="true" 
                  @changeSelect="(tagID) => { transaction.tag = tagID }
                "/>
                <div class="cstm-buttons-tags">                
                  <i class="el-icon-plus cstm-edit"></i>
                  <i class="el-icon-edit cstm-edit"></i>
                  <i class="el-icon-delete cstm-edit"></i>
                </div>
            </div>
            <el-input placeholder="Сумма" class="cstm-input cstm-mrgn-top-20" type="number" v-model="transaction.amount"></el-input>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Комментарий"
              class="cstm-input cstm-mrgn-top-20"
              v-model="transaction.comment">
            </el-input>
            <el-button class="cstm-create-button cstm-mrgn-top-20" type="success" @click="checkTransaction">Записать</el-button>
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
    props: ['newTransaction'],
    data() {
      return {
        transaction: this.newTransaction,
        direction: 'rtl',
        errors: [],
      };
    },

    watch: {
      newTransaction(newValue) {
        this.transaction = newValue
      },
    },

    computed: {
        ...mapGetters([
            'incomes',
            'wallets',
            'expenses',
            'tags',
        ]),

        tagsFromCategory() {
          var tags = []
          for (var tag in this.tags){
              if (this.tags[tag].expense_id == this.transaction.toID) {
                tags.push(this.tags[tag])
            }
          }
          return tags
        },

        drawer() {
          return this.transaction.state_window
        },

        pointsFrom() {
          return (this.transaction.type == 1) ? this.incomes : this.wallets
        }, 
        pointsTo() {
          return (this.transaction.type == 3) ? this.expenses : this.wallets
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
        if (this.transaction.amount && this.transaction.date) return true;
        this.errors = []
        if (!this.transaction.amount) this.errors.push('Не указана сумма')
        if (!this.transaction.date) this.errors.push('Не указана дата')
        return false;
      },

      changePointsTo(toID){
         this.transaction.toID = toID
         this.transaction.tag = null
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

      checkTransaction() {
        if (this.checkForm()) {
          this.sendTransaction()
        } else {
           this.errors.forEach((error, i) => {
              setTimeout(() => {
                  this.MessageError(error);
              }, 100 * ++i)
            });
        }
      },

      sendTransaction() {
        this.axios.post('/api/transactions' , {
          "from_id": this.transaction.fromID,
          "to_id": this.transaction.toID,
          "date": this.transaction.date,
          "tag_id": this.transaction.tag,
          "type": this.transaction.type,
          "amount": this.transaction.amount,
          "comment": this.transaction.comment, 
        })
        .then(response => {
          let pointsNames = this.getPointsNames(response.data.data)
          this.MessageSuccess('Новая транзакция на сумму ' + response.data.data.amount + ' из ' + pointsNames.nameFrom + ' в ' + pointsNames.nameTo)
          this.transaction.amount = this.transaction.comment =  null
          this.handleClose()
        })
        .catch((error) => {
          this.MessageError(error.response.data.errors) 
        })
      },

      getPointsNames(response) {
          if (response.type == 1) {
            var nameFrom = this.incomes[response.income_id].name
            var nameTo = this.wallets[response.wallet_id_to].name
          } else if (response.type == 2) {
            var nameFrom = this.wallets[response.wallet_id_from].name
            var nameTo = this.wallets[response.wallet_id_to].name
          } else {
            var nameFrom = this.wallets[response.wallet_id_from].name
            var nameTo = this.expenses[response.expense_id].name
          }
          return {nameFrom, nameTo}
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

.cstm-tags {
  justify-content: space-around;
}
.cstm-buttons-tags{
  display: flex;

}

.cstm-input {
  width: 90%;
}

.cstm-label {

  color: #ffffff;
  
}

.cstm-edit {
  font-size: 20px;
  color: #ffffff;
}


</style>
