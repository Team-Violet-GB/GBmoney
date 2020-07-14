<template>
  <el-header class="cstm-header-right">
    <el-dropdown>
      <i class="el-icon-user-solid"></i>
      <el-dropdown-menu slot="dropdown" class="cstm-dropdown">
        <el-dropdown-item>Настройки</el-dropdown-item>
        <el-dropdown-item><span @click="logout">Выйти</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span>{{ email }}</span>
  </el-header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$router.push('/auth')
    }
  },
  computed: {
    email() {
        return this.$store.getters['user/user'].email;
    }
  },
  mounted() {
      this.$store.dispatch('user/setUserData');
  }
}
</script>

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
