<template>
  <el-select v-model="selectedID" placeholder="Категория" @change="$emit('changeSelect', Number(selectedID))">
    <el-option
      v-for="item in poinList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      class = "cstm-select-item">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props: ['points', 'id'],
    data() {
      return {
        selectedID: this.id,
        poinList: this.points
      }
    },
    watch: {
      id(id) {
        this.selectedID = id
      },
      points(list) {
        this.poinList = list
      }
    },
  }
</script>

<style>
.el-input__inner, .el-scrollbar {
    background: #2c2e38;
    color: #ffffff;
    border-radius: 0%;
    border-color: #5f6068;
    font-weight: 100;
    font-size: 16px;
}

.el-select .el-input.is-focus .el-input__inner, 
.el-select .el-input__inner:focus {
    border-color: #ffffff !important; 
}

.el-scrollbar,
.el-select-dropdown {
    border: none;
}

</style>

<style scoped>
  .cstm-select-item {
    background: #2c2e38;
    color: #ffffff;
    border-radius: 0%;
    font-size: 16px;
  }

  .hover {
    color: rgb(255, 208, 75) !important;
    background-color: rgb(49, 50, 58);
  }

  .selected {
    color: rgb(255, 208, 75) !important;
  }
</style>