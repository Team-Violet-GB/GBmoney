<template>
  <div class="cstm-point">
    <div class="cstm-head-point">Добавить</div>
    <el-button
      type="el-icon-search"
      icon="el-icon-plus"
      circle
      class="cstm-icon-point cstm-icon-point-add"
    ></el-button>
  </div>
</template>

<style scoped>
.cstm-point {
  margin-bottom: 10px;
  flex-basis: 15%;
  position: relative;
  margin-right: 0.72%;
  margin-left: 0.72%;
}

.cstm-head-point {
  color: #ffffff;
  text-align: center;
  padding-bottom: 4px;
  font-weight: 300;
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
</style>