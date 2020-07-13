<template>
  <div>
    <el-container class="cstm-container">
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

export default {
  name: 'empty-layout',
  components: {
    Navbar
  }
}
</script>

