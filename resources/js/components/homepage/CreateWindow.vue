<template>
    <div>
        <!-- Модальное окно  -->
        <el-drawer
        title="транзакция"
        :visible.sync="drawer"
        :direction="direction"
        size="40%"
        :before-close="handleClose">
          <div>{{ transactionData.fromType }} {{ transactionData.fromID }} -> {{ transactionData.toType }} {{ transactionData.toID }}</div>
          <div> <SelectCustom :points="pointsFrom" :id="transactionData.fromID" /> -> <SelectCustom :points="pointsTo" :id="transactionData.toID" /></div>
        </el-drawer>
    </div>
</template>

<script>
import SelectCustom from "../homepage/SelectCustom";

  export default {
    props: ['transactionData'],
    components: {
      SelectCustom
    },
    data() {
      return {
        direction: 'rtl',
        // ltr > left to right
        // rtl > right to left
        // ttb > top to bottom
        // btt > bottom to top
      pointsFrom: [
        { id: 1, name: "Зарплата", icon: "el-icon-money", money: 20000 },
        { id: 2, name: "Депозит", icon: "el-icon-s-data", money: 1000 },
        { id: 3, name: "Кэшбэк", icon: "el-icon-coin", money: 500 },
        { id: 4, name: "Подарки", icon: "el-icon-present", money: 5000 }
      ],
      pointsTo: [
        { id: 1, name: "Наличные", icon: "el-icon-wallet", money: 20000 },
        { id: 2, name: "Карта Такая", icon: "el-icon-bank-card", money: 15000 },
        { id: 3, name: "Карта Сякая", icon: "el-icon-bank-card", money: 100000 }
      ],};
    },

    computed: {
        drawer() {
              return this.transactionData.state_window
        }
    },
    methods: {
      handleClose(done) {
        this.$emit('closeCreateWindow')
      }
    },
  };
</script>

<style>
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

  .el-drawer__body {
  background-color: #3d3e48;
  }

</style>