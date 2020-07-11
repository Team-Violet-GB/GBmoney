<template>
  <el-header class="cstm-header-right">
    <el-dropdown>
      <i class="el-icon-user-solid"></i>
      <el-dropdown-menu slot="dropdown" class="cstm-dropdown">
        <el-dropdown-item>Настройки</el-dropdown-item>
        <el-dropdown-item @click="logout"><span>Выйти</span></el-dropdown-item>
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
  data() {
    return {
      email: '',
  }},
  mounted() {
      this.axios
          .get('/api/getUser')
          .then(response => {this.email = response.data})
          //Проверку на null в данном случае не делаю, т.к. если вернет null - поле останется пустым
          .catch(error => console.log(error))
          .finally(() => (console.log('finished')));
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
