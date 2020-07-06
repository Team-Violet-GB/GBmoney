<template>
  <el-header class="cstm-header-right">
    <el-dropdown>
      <i class="el-icon-user-solid"></i>
      <el-dropdown-menu slot="dropdown" class="cstm-dropdown">
        <el-dropdown-item>Настройки</el-dropdown-item>
        <el-dropdown-item>Выйти</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span>money@gb.ru</span>
  </el-header>
</template>

<style scoped>
.el-header {
  background-color: #4b4c55;
  color: #ffffff;
  line-height: 60px;
}
.cstm-header-right {
  text-align: right;
  font-size: 15px;
}

.el-icon-user-solid {
  margin-right: 10px;
  color: #ffffff;
}

.el-icon-setting {
  margin-right: 15px;
}

.cstm-dropdown {
  background: #4b4c55;
}
</style>
