<template>
  <div>
    <!-- Модальное окно  -->
    <Transaction
      :newTransaction="newTransaction"
      @closeCreateWindow="newTransaction.state_window = false"
    />
    <!-- ДОХОДЫ -->
    <div class="cstm-box-card" v-loading="incomesLoading" element-loading-background="#3d3e48">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Доходы</span>
          <span>{{ Number(incomesSumm).toLocaleString() }} &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>{{ dateNowString }}</span>
          <span>Получено</span>
        </div>
      </div>
      <!-- тело -->
      <transition-group name="list" tag="div" class="cstm-body-card">
        <div v-for="point in incomes" :key="point.id" :id="point.id" class="cstm-point">
          <div class="cstm-head-point">{{ point.name }}</div>
          <drag :data="{ id: point.id, type: 'income'}">
            <drop :accepts-data="() => false">
              <el-button
                type="primary"
                :icon="point.icon_name"
                circle
                class="cstm-icon-point"
                @click="$router.push(`/income/${point.id}`)">
              </el-button>
            </drop>
          </drag>
          <div class="cstm-money-point cstm-blue">{{ Number(point.amount).toLocaleString('ru') }} &#8381;</div>
          <EditButton :key="'edit'" :data="{name: point.name, choose: point.icon_name}"/>
        </div>
        <Addbutton :key="'add'" category="Доход"/>
      </transition-group>
    </div>
    <!-- СЧЕТА -->
    <div class="cstm-box-card" v-loading="walletsLoading" element-loading-background="#3d3e48">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Счета</span>
          <span type="text">{{ Number(walletsSumm).toLocaleString() }} &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>{{ dateNowString }}</span>
          <span>В наличии</span>
        </div>
      </div>
      <!-- тело -->
      <transition-group name="list" tag="div" class="cstm-body-card">
        <div v-for="point in wallets" :key="point.id" :id="point.id" class="cstm-point">
          <div class="cstm-head-point">{{ point.name }}</div>
            <drop
              @drop="transactionWallet"
              :accepts-data="(data) => (data.type == 'income') || data.type == 'wallet'"
            >
              <drag :data="{ id: point.id, type: 'wallet'}">
                <el-button
                  type="warning"
                  :icon="point.icon_name"
                  circle
                  class="cstm-icon-point"
                  @click="$router.push(`/wallet/${point.id}`)" >
                </el-button>
                </drag>
            </drop>
          <div class="cstm-money-point cstm-yellow">{{ Number(point.amount).toLocaleString() }} &#8381;</div>
            <EditButton :key="'edit'" :data="{name: point.name, choose: point.icon_name}"/>
        </div>
        <Addbutton :key="'add'" category="Счета"/>
      </transition-group>
    </div>
    <!-- Расходы -->
    <div class="cstm-box-card" v-loading="expensesLoading" element-loading-background="#3d3e48">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Расходы</span>
          <span>{{ Number(expensesSumm).toLocaleString() }} &#8381;</span>
          <span>{{ Number(expensesLimit).toLocaleString() }} &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>{{ dateNowString }}</span>
          <span>Потрачено</span>
          <span>В планах</span>
        </div>
      </div>
      <!-- тело -->
      <transition-group name="list" tag="div" class="cstm-body-card">
        <div v-for="point in expenses" :key="point.id" :id="point.id" class="cstm-point">
          <div class="cstm-head-point">{{ point.name }}</div>
          <drop @drop="transactionExpense" :accepts-data="(data) => (data.type == 'wallet')">
            <el-button
              :type="(Number(point.amount) > Number(point.max_limit))? 'danger' : 'success'"
              :icon="point.icon_name"
              circle
              class="cstm-icon-point cstm-expense"
              @click="$router.push(`/expense/${point.id}`)"
            ></el-button>
          </drop>
          <div
            class="cstm-money-point"
            :class="(Number(point.amount) > Number(point.max_limit))? 'cstm-red' : 'cstm-green'"
          >{{ Number(point.amount).toLocaleString() }} &#8381;</div>
          <div  v-if="point.max_limit" class="cstm-plan">{{ Number(point.max_limit).toLocaleString() }} &#8381;</div>
            <EditButton :key="'edit'" :data="{name: point.name, choose: point.icon_name}"/>
        </div>
        <Addbutton :key="'add'" category="Расход"/>
      </transition-group>
    </div>
  </div>
</template>
<script>
    import { Drag, Drop } from "vue-easy-dnd"
    import { mapGetters, mapActions, mapMutations } from "vuex"
    import Addbutton from "../components/homepage/Addbutton"
    import Transaction from "../components/homepage/Transaction"
    import EditButton from "../components/homepage/EditButton";

    export default {
        name: "App",
        components: {
            EditButton,
            Drag,
            Drop,
            Addbutton,
            Transaction,
        },
        data() {
          return {
            newTransaction: { state_window: false },
            loadingIncomes: true,
          }
        },
        computed: {
          ...mapGetters([
              'incomes',
              'wallets',
              'expenses',
              'incomesSumm',
              'walletsSumm',
              'expensesSumm',
              'expensesLimit',
              'incomesLoading',
              'walletsLoading',
              'expensesLoading',
              'intervalMonth',
              ]),

              dateNowString() {
                return new Date().toLocaleString('ru', {month: 'long', year: 'numeric'})
              },
        },

       mounted() {
            this.fetchWallets()
            this.fetchAmountsByMonth({
              dateFrom: this.intervalMonth.dateFrom,
              dateTo: this.intervalMonth.dateTo,
              type: 1
            })
            this.fetchAmountsByMonth({
              dateFrom: this.intervalMonth.dateFrom,
              dateTo: this.intervalMonth.dateTo,
              type: 3
            })

        },

        methods: {
            ...mapActions([
              'fetchWallets',
              'fetchAmountsByMonth',
            ]),

            transactionWallet (event) {
                let fromID = Number(event.data.id)
                let toID = Number(event.top.$el.parentElement.id)
                if ((fromID == toID) && (event.data.type == 'wallet')) {
                    return
                }
                this.newTransaction = {
                    state_window: true,
                    fromID: fromID,
                    toID: toID,
                    type: (event.data.type == 'income') ? 1 : 2,
                    tag: null,
                    date: this.dateNow(),
                    amount: null,
                    comment: null,
                }
            },
            transactionExpense (event) { // drag & drop  работает через раз, если указать одинаковые имена функций у разных групп
                this.newTransaction = {
                    state_window: true,
                    fromID: Number(event.data.id),
                    toID: Number(event.top.$el.parentElement.id),
                    type: 3,
                    tag: null,
                    date: this.dateNow(),
                    amount: null,
                    comment: null,
                }
            },
            dateNow() {
              let date = new Date()
              return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            },
        },
    };
</script>

<style lang="scss" scoped>

%cstm-color-background-body {
  background-color: #3d3e48;
}
%cstm-color-background-header {
  background-color: #5f6068;
}
%cstm-color-text {
  color: #ffffff;
}

.cstm-box-card {
  border-radius: 0;
  border: none;
  margin-bottom: 30px;
}
.cstm-header-card {
  @extend %cstm-color-background-header;
  padding: 10px 30px;
}
.cstm-body-card {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  @extend %cstm-color-background-body;
}
.cstm-point {
  margin-bottom: 10px;
  flex-basis: 15%;
  position: relative;
  margin-right: 0.72%;
  margin-left: 0.72%;
}
.cstm-up-text {
  @extend %cstm-color-text;
  text-transform: uppercase;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}
.cstm-down-text {
  text-transform: lowercase;
  font-size: 12px;
  color: #9a9898;
  display: flex;
  justify-content: space-between;
}
.cstm-right-text {
  float: right;
  padding: 3px 0;
}
.cstm-icon-point {
  font-size: 50px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  cursor: grab;
}
.cstm-icon-point-add {
  @extend %cstm-color-background-body;
  @extend %cstm-color-text;
}
.cstm-head-point {
  @extend %cstm-color-text;
  text-align: center;
  padding-bottom: 4px;
  font-weight: 300;
}
.cstm-money-point {
  text-align: center;
  padding-top: 4px;
  font-weight: 500;
}
.cstm-plan {
  text-align: center;
  margin-top: -7px;
  font-size: 11px;
  color: #9a9898;
  font-weight: 200;
}
.cstm-expense {
  cursor: pointer;
}
.cstm-point:hover .cstm-edit {
  display: block;
  cursor: pointer;
}
.cstm-edit {
  color: #9a9898;
  position: absolute;
  top: 17%;
  right: 23%;
  font-size: 15px;
  display: none;
  transition: 0.3s;
}
.cstm-edit:hover {
  color: #67c23a;
}

/* при наведении взятого элемента на ячейку */
.drop-in button {
  background: grey;
  color: grey;
  transition: 0.15s;
  border: none;
  /* border: 1px grey solid; */
}
/* элементы, доступные для транзакции */
.drop-allowed button {
  filter: brightness(130%);
  transition: 0.15s;
}

/* элементы, НЕдоступные для транзакции */
.drop-forbidden button {
  filter: brightness(60%);
  transition: 0.15s;
}
</style>
