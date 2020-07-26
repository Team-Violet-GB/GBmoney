<template>
  <el-header class="cstm-header-right">
    <span class='cstm-email'>{{ email }}</span>
    <i @click="out" class="el-icon-upload2 cstm-logout"></i>
  </el-header>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'user',
    ]),

    email() {
        return this.user.email
    }
  },
    methods: {
    ...mapActions([
        'logout',
    ]),

    out() {
      this.logout({this: this})
        this.$router.push('/login')
    },
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 40px;
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

.cstm-email{
  margin-right: 15px;
}

.cstm-logout {
  transform: rotate(90deg);
  cursor: pointer;
  font-size: 20px;
  height: 20px;
}
</style>
