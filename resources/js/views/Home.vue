<template>
  <div>
    <!-- Модальное окно  -->
    <CreateWindow :transactionData="transactionData" @closeCreateWindow="transactionData.state_window = false" />
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
          <drag :data="'incomes'+ point.id">
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
              :accepts-data="(data) => data.includes('incomes') || data.includes('wallets')"
            >
              <drag :data="'wallets'+ point.id">
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
          <drop @drop="transactionExpense" :accepts-data="(data) => data.includes('wallets')">
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
import CreateWindow from "../components/homepage/CreateWindow";

export default {
  name: "App",
  components: {
    Drag,
    Drop,
    Addbutton,
    CreateWindow,
  },
  data: function() {
    return {
      transactionData: { state_window: false, from: '', to: '' },
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
      let from = event.data
      let to = 'wallet' +  event.top.$el.parentElement.id
      this.transactionData = { state_window: true, from: from, to: to }
    },
    transactionExpense (event) {
      let from = event.data
      let to = 'expense' + event.top.$el.parentElement.id
      this.transactionData = { state_window: true, from: from, to: to }
    },
  },
};
</script>

<style scoped>
.cstm-box-card {
  border-radius: 0%;
  border: none;
  margin-bottom: 30px;
}

.cstm-header-card {
  background-color: #5f6068;
  padding: 10px 30px;
}

.cstm-body-card {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  background-color: #3d3e48;
}


.cstm-point {
  margin-bottom: 10px;
  flex-basis: 15%;
  position: relative;
  margin-right: 0.72%;
  margin-left: 0.72%;
}

.cstm-up-text {
  text-transform: uppercase;
  font-size: 20px;
  color: #ffffff;
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
  background-color: #3d3e48;
  color: #ffffff;
}

.cstm-head-point {
  color: #ffffff;
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
