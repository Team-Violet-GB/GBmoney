<template>
  <div>
    <el-container class="cstm-container">
      <el-container class="is-vertical">
        <el-main class="cstm-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar'
import {mapGetters} from "vuex";

export default {
  name: 'empty-layout',
  components: {
    Navbar
  },
    computed: {
        ...mapGetters([
            'isAuth'
        ]),
        isAuthenticated() {
            if (this.isAuth) this.$router.push('/')
            return true
        }
    }
}
</script>

