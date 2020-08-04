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
            <!-- Календарь -->
            <Calendar 
              :date="transaction.date"
              @changeDate="(newDate) => newDate ? transaction.date = newDate : transaction.date = null " />
            <!-- Блок Откуда -> Куда  будет производиться транзакция -->
            <div class="cstm-select-box cstm-mrgn-top-20">
              <SelectCustom :list="pointsFrom" :idSelected="transaction.fromID" @changeSelect="(fromID) => { transaction.fromID = fromID }" />
              <i class="el-icon-right"></i>
              <SelectCustom :list="pointsTo" :idSelected="transaction.toID" @changeSelect="(toID) =>  { changePointsTo(toID) }"/>
            </div>
            <!-- Выбор подкатегории -->
            <div v-if="transaction.type == 3" class="cstm-select-box cstm-tags cstm-mrgn-top-20">
                <span class="cstm-label">Подкатегория: </span> 
                <SelectCustom 
                  v-if="!isAddingTag && !isEditingTag"
                  :list="tagsFromCategory" 
                  :idSelected="transaction.tag" 
                  :withEmptySelect="true" 
                  @changeSelect="(id) =>  { changeTags(id) }
                "/>
                <!-- Редактирование/Создание подкатегорий -->
                <el-input 
                  v-if="isAddingTag || isEditingTag" 
                  type=text 
                  class="cstm-input-tag" 
                  :placeholder="placeholderTag"
                  v-model="changeTag" >
                </el-input>
                <div class="cstm-buttons-tags">
                  <!-- Кнопки Подтвердить или отменить изменинея/создание подкатегории -->
                  <i v-if="isAddingTag || isEditingTag" @click="() => { approveTag() } " class="el-icon-check cstm-button"></i>
                  <i v-if="isAddingTag || isEditingTag" @click="() => { cancelTag() } " class="el-icon-close cstm-button"></i>
                  <!-- Кнопки Редактировать, Добавить, Удалить Подкатегорию -->
                  <i v-if="!isAddingTag && !isEditingTag" @click="() => { addTag() } " class="el-icon-plus cstm-button"></i>
                  <i v-if="!isAddingTag && !isEditingTag && transaction.tag" @click="() => { editTag() } " class="el-icon-edit cstm-button"></i>        
                  <i v-if="!isAddingTag && !isEditingTag && transaction.tag" @click="() => { deleteTag() } " class="el-icon-delete cstm-button"></i>
                </div>
            </div>
            <!-- Введите сумму -->
            <el-input placeholder="Сумма" class="cstm-input cstm-mrgn-top-20" type="number" v-model="transaction.amount"></el-input>
            <Numbers @clickNumber="(number) => addNumber(number)" />  
            <!-- Введите комментарий -->
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Комментарий"
              class="cstm-input cstm-mrgn-top-20"
              v-model="transaction.comment">
            </el-input>
            <!-- Кнопка Записать -->
            <el-button v-if="!isAddingTag && !isEditingTag" class="cstm-create-button cstm-mrgn-top-20" type="success" @click="checkTransaction">Записать</el-button>
          </div>
        </el-drawer>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectCustom from '../homepage/SelectCustom'
import Calendar from '../Calendar'
import LoginVue from '../../views/Login.vue'
import Numbers from './Numbers.vue'

  export default {
    components: {
      SelectCustom, 
      Calendar, 
      Numbers
    },
    props: ['newTransaction'],
    data() {
      return {
        transaction: this.newTransaction,
        direction: 'rtl',
        errors: [],
        isAddingTag: false,
        isEditingTag: false,
        placeholderTag: null,
        changeTag: null
      };
    },

    watch: {
      newTransaction(newValue) {
        this.transaction = newValue
      },
    },

    mounted() {
      if (!this.tags) this.fetchTags()
    },

    computed: {
        ...mapGetters([
            'incomes',
            'wallets',
            'expenses',
            'tags',
        ]),

        tagsFromCategory() {
          console.log(this.tags)
          var tags = []
          for (var tag in this.tags){
              if (this.tags[tag].expense_id == this.transaction.toID && !this.tags[tag].deleted) {
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

    methods: {
      ...mapActions([
        'fetchTags',
        'fetchIncomes',
        'fetchWallets',
        'fetchExpenses',
      ]),

      
      handleClose() {
        this.$emit('closeCreateWindow')
        this.isAddingTag = false
        this.isEditingTag = false
      },
      
      checkForm() {
        this.errors = []
        if (!this.transaction.amount) this.errors.push('Не указана сумма')
        if (!this.transaction.date) this.errors.push('Не указана дата')
        if (parseFloat(this.transaction.amount) > 999999999999.99) this.errors.push('Сумма транзакции в нашем приложении ограничена максимальным пределом 999 999 999 999.99')
        if (this.errors.length) return false;
        return true;
      },

      changePointsTo(toID){
         this.transaction.toID = toID
         this.transaction.tag = null
         this.isAddingTag = false
         this.isEditingTag = false
      },

      changeTags(id){
        if (id) this.transaction.tag = id
        else this.transaction.tag = null
      },

      addTag() {
        this.isAddingTag = true
        this.isEditingTag = false
        this.placeholderTag = 'Добавить подкатегорию'
        this.changeTag = null
      },

      editTag() {
        if (this.transaction.tag) {
          this.isEditingTag = true
          this.isAddingTag = false
          this.placeholderTag = 'Изменить подкатегорию'
          this.changeTag = this.tags[this.transaction.tag].name
        }
      },

      deleteTag() {
        this.$confirm(`Хотите удалить подкатегорию ${this.tags[this.transaction.tag].name}? Она останется видна старых отчётах, но её нельзя будет использовать в дальнейшем.`, {
          confirmButtonText: 'Удалить',
          cancelButtonText: 'Отмена',
          type: 'error',
        })
        .then(() => {
          this.axios.delete(`api/tags/${this.transaction.tag}`)
          .then(response => {
            if (response.status == 200) {
                this.MessageSuccess(`Подкатегория ${this.tags[this.transaction.tag].name} удалена`)
                this.fetchTags()
                this.transaction.tag = null
            }
          })
        })
        .catch(() => {});
      },

      approveTag() {
        if (this.checkChangeTag()) {
          if (this.isAddingTag) {
            this.axios.post('api/tags', {
              "name": this.changeTag,
              "expense_id": this.transaction.toID
            })
            .then(response => {
                if (response.status == 200) {
                    this.MessageSuccess(`Создана новая подкатегория ${response.data.data.name}`)
                    this.fetchTags()
                    return response.data.data.id
                }
            })
            .then(id => {
              this.transaction.tag = id
              this.isAddingTag  = false
            })
            .catch(errors => this.MessageArrayErrors(errors.response.data.errors.name))

          } else if (this.isEditingTag) {
            this.axios.put(`api/tags/${this.transaction.tag}`, {
              "name": this.changeTag,
              "expense_id": this.transaction.toID
            })
            .then(response => {
                if (response.status == 200) {
                    this.MessageSuccess(`Подкатегория переименована на ${response.data.data.name}`)
                    this.fetchTags()
                    this.transaction.tag = this.tags[response.data.data.id].id
                    this.isEditingTag  = false
                }
            })
            .catch(error => this.MessageError(error.response.data.errors.name))
          }
        } else return false
      },

      cancelTag() {
        this.isEditingTag  = false
        this.isAddingTag  = false
      },

      checkChangeTag() {
        if (this.changeTag) return true
        this.MessageError('Не указано имя покатегории')
        return false;
      },

      checkTransaction() {
        if (this.checkForm()) this.sendTransaction()
        else this.MessageArrayErrors(this.errors)
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
          this.getNewPoints(this.transaction.type)
          this.transaction.amount = this.transaction.comment =  null
          this.handleClose()
        })
        .catch((error) => {
          this.MessageError(error.response.data.errors) 
        })
      },

      getNewPoints(type) {
        if (type == 1) {
          this.fetchIncomes()
          this.fetchWallets()
        } else if (type == 3) {
          this.fetchWallets()
          this.fetchExpenses()
        } else {
          this.fetchWallets()
        }
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

      addNumber(number) {
        var amount = this.transaction.amount
        if (!isNaN(number)) {
          amount ? (this.transaction.amount = amount + '' + number) : this.transaction.amount =  number 
        } else {
          if (number == 'delete') this.transaction.amount = null
          else amount ? this.transaction.amount = amount.substring(0, amount.length - 1) : ''
        }
        console.log(this.transaction.amount)
      },

      MessageError(message) {
        this.$message.error(message);
      },

      MessageArrayErrors(errors) {
        errors.forEach((error, i) => {
          setTimeout(() => {
              this.$message.error(error);
          }, 100 * ++i)
        });
      },

      MessageSuccess(message) {
        this.$message({
          message: message,
          type: 'success'
        });
      },
    },
  };
</script>

<style scoped lang="scss">
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
  justify-content: space-between;
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

.cstm-input-tag {
  width: 45%;
}

.cstm-button {
  font-size: 20px;
  color: #ffffff;
  margin: 0 7px;
  cursor: pointer;
  transition: .2s;
}

.el-icon-plus:hover {
  color: #0a93d1;
}

.el-icon-edit:hover {
  color: #e6a23c;
}

.el-icon-delete:hover,
.el-icon-close:hover {
  color: #f56c6c;
}

.el-icon-check:hover {
  color: #67c23a;
}

</style>
