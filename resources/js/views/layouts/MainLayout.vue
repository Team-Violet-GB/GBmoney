<template>
  <div v-if="isAuthenticated">
    <el-container class="cstm-container">
      <Sidebar />
      <el-container class="is-vertical">
        <Navbar />
        <el-main class="cstm-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import {mapGetters} from 'vuex'

export default {
  name: 'main-layout',
  components: {
    Navbar, Sidebar
  },
  computed: {
      ...mapGetters([
         'isAuth'
      ]),
      isAuthenticated() {
          if (!this.isAuth) this.$router.push('/login')
          return true
      }
  }
}
</script>
