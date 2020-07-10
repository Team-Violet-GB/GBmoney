<template>
  <div>
    <!-- Модальное окно  -->
    <CreateTransaction
      :transactionData="transactionData"
      :incomesData="incomes"
      :walletsData="wallets"
      :expensesData="expenses"
      @closeCreateWindow="transactionData.state_window = false"  
    />
    <!-- ДОХОДЫ -->
    <div class="cstm-box-card">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Доходы</span>
          <span>50 000,99 &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>Июль 2020</span>
          <span>Получено</span>
        </div>
      </div>
      <!-- тело -->
      <transition-group name="list" tag="div" class="cstm-body-card">
        <div v-for="point in incomes" :key="point.id" :id="point.id" class="cstm-point">
          <div class="cstm-head-point">{{ point.name }}</div>
          <drag :data="{ id: point.id, type: 'income'}">
            <drop :accepts-data="() => false">
              <el-button type="primary" :icon="point.icon" circle class="cstm-icon-point"></el-button>
            </drop>
          </drag>
          <div class="cstm-money-point cstm-blue">{{ point.money }} &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <Addbutton :key="'add'" />
      </transition-group>
    </div>
    <!-- СЧЕТА -->
    <div class="cstm-box-card">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Счета</span>
          <span type="text">550 000,99 &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>Июль 2020</span>
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
                <el-button type="warning" :icon="point.icon" circle class="cstm-icon-point"></el-button>
                </drag>
            </drop>
          <div class="cstm-money-point cstm-yellow">{{ point.money }} &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <Addbutton :key="'add'" />
      </transition-group>
    </div>
    <!-- Расходы -->
    <div class="cstm-box-card">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Расходы</span>
          <span>50 000,99 &#8381;</span>
          <span>10 000,99 &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>Июль 2020</span>
          <span>В наличии</span>
          <span>В планах</span>
        </div>
      </div>
      <!-- тело -->
      <transition-group name="list" tag="div" class="cstm-body-card">
        <div v-for="point in expenses" :key="point.id" :id="point.id" class="cstm-point">
          <div class="cstm-head-point">{{ point.name }}</div>
          <drop @drop="transactionExpense" :accepts-data="(data) => (data.type == 'wallet')">
            <el-button
              :type="(point.money > point.plan)? 'danger' : 'success'"
              :icon="point.icon"
              circle
              class="cstm-icon-point cstm-expense"
            ></el-button>
          </drop>
          <div
            class="cstm-money-point"
            :class="(point.money > point.plan)? 'cstm-red' : 'cstm-green'"
          >{{ point.money }} &#8381;</div>
          <div class="cstm-plan">{{ point.plan }} &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <Addbutton :key="'add'" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { Drag, Drop } from "vue-easy-dnd";
import Addbutton from "../components/homepage/Addbutton";
import CreateTransaction from "../components/homepage/CreateTransaction";

export default {
  name: "App",
  components: {
    Drag,
    Drop,
    Addbutton,
    CreateTransaction,
  },
  data() {
    return {
       transactionData: { state_window: false },
      incomes: [
        { id: 1, name: "Зарплата", icon: "el-icon-money", money: 20000 },
        { id: 2, name: "Депозит", icon: "el-icon-s-data", money: 1000 },
        { id: 3, name: "Кэшбэк", icon: "el-icon-coin", money: 500 },
        { id: 4, name: "Подарки", icon: "el-icon-present", money: 5000 }
      ],
      wallets: [
        { id: 1, name: "Наличные", icon: "el-icon-wallet", money: 20000 },
        { id: 2, name: "Карта Такая", icon: "el-icon-bank-card", money: 15000 },
        { id: 3, name: "Карта Сякая", icon: "el-icon-bank-card", money: 100000 }
      ],
      expenses: [
        { id: 1, name: "Бензин", icon: "el-icon-tableware", money: 20000, plan: 5000 },
        { id: 2, name: "Еда", icon: "el-icon-truck", money: 15000, plan: 5000 },
        { id: 3, name: "Связь", icon: "el-icon-present", money: 5000, plan: 5000  },
        { id: 4, name: "Развлечения", icon: "el-icon-tableware", money: 5000, plan: 5000 },
        { id: 5, name: "Вещи", icon: "el-icon-truck", money: 4000, plan: 5000 },
        { id: 6, name: "Автомобиль", icon: "el-icon-present", money: 1000, plan: 5000 },
        { id: 7, name: "Дорога", icon: "el-icon-tableware", money: 500, plan: 5000 },
        { id: 8, name: "Ребенок", icon: "el-icon-truck", money: 300, plan: 5000 },
        { id: 9, name: "Другое", icon: "el-icon-present", money: 3300, plan: 5000 },
        { id: 10, name: "Здоровье", icon: "el-icon-tableware", money: 15000, plan: 5000 },
        { id: 11, name: "Ипотека", icon: "el-icon-truck", money: 4500, plan: 5000 },
        { id: 12, name: "Квартира", icon: "el-icon-present", money: 6000, plan: 5000 },
        { id: 13, name: "Учеба", icon: "el-icon-tableware", money: 15000, plan: 5000 },
      ],
    };
  },

  methods: {
    transactionWallet (event) {
        let fromID = Number(event.data.id)
        let toID = Number(event.top.$el.parentElement.id)
        if ((fromID == toID) && (event.data.type == 'wallet')) {
          return
        }
        this.transactionData = { 
          state_window: true,
          fromID: fromID, 
          toID: toID, 
          fromType: event.data.type, 
          toType: 'wallet',
          }
    },
    transactionExpense (event) {
      this.transactionData = { 
        state_window: true, 
        fromID: Number(event.data.id), 
        toID: Number(event.top.$el.parentElement.id), 
        fromType: event.data.type, 
        toType: 'expense',
        }
    },
  },
};
</script>

<style lang="scss">

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
  border-radius: 0%;
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

.cstm-blue {
  color: #0a93d1;
}
.cstm-yellow {
  color: #e6a23c;
}

.cstm-green {
  color: #67c23a;
}

.cstm-red {
  color: #f56c6c;
}

.cstm-grey {
  color: #909399;
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
