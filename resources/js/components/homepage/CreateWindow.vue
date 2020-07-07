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
            <Calendar />
            <div class="cstm-select-double cstm-mrgn-top-20">
              <SelectCustom :points="pointsFrom" :id="transactionData.fromID" />
              <i class="el-icon-right"></i>
              <SelectCustom :points="pointsTo" :id="transactionData.toID" />
            </div>
            <el-input placeholder="Сумма" class="cstm-input cstm-mrgn-top-20" v-model="amount"></el-input>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Комментарий"
              class="cstm-input cstm-mrgn-top-20"
              v-model="textarea">
            </el-input>
          </div>
        </el-drawer>
    </div>
</template>

<script>
import SelectCustom from "../homepage/SelectCustom";
import Calendar from "../homepage/Calendar";

  export default {
    props: ['transactionData', 'incomes', 'wallets', 'expenses'],
    components: {
      SelectCustom, Calendar
    },
    data() {
      return {
        amount: '',
        direction: 'rtl',
        // ltr > left to right
        // rtl > right to left
        // ttb > top to bottom
        // btt > bottom to top
      };
    },

    computed: {
        drawer() {
              return this.transactionData.state_window
        },
        pointsFrom() {
            return (this.transactionData.fromType === 'income') ? this.incomes : this.wallets
        }, 
        pointsTo() {
            return (this.transactionData.toType === 'wallet') ? this.wallets : this.expenses
        }, 
    },
    methods: {
      handleClose(done) {
        this.$emit('closeCreateWindow')
      }
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

</style>

<style scoped>
  .cstm-body-window {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cstm-select-double {
    margin-top: 20px;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
.cstm-input {
  width: 90%;
}

</style>
