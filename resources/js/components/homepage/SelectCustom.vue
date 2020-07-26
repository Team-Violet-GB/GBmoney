<template>
  <el-select v-model="selectedID" @change="$emit('changeSelect', Number(selectedID))">
    <el-option
      v-if="withEmptySelect"
      label="Нет"
      :value="null"
      
      class = "cstm-select-item">
    </el-option>
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
    props: ['list', 'idSelected', 'withEmptySelect'],
    data() {
      return {
        selectedID: this.idSelected,
        poinList: this.list
      }
    },
    watch: {
      idSelected(id) {
        this.selectedID = id
      },
      list(list) {
        this.poinList = list
      }
    },
  }
</script>


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