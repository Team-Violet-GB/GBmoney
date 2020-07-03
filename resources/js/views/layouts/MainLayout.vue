<template>
  <div>
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
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default {
  name: 'main-layout',
  components: {
    Navbar, Sidebar
  }
}
</script>

<style>
html {
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-weight: normal;
}

body {
  margin: 0;
}

.cstm-container {
  height: 100vh;
}

.cstm-main {
  background-color: #2c2e38;
  padding: 30px 80px;
}
</style>
