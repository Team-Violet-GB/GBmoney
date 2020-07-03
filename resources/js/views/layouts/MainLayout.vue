<template>
  <div>
    <el-container class="cstm-container">
      <el-aside>
        <el-row class="tac">
          <el-col :span="24">
            <h5 class="cstm-logo">
                <el-image class="cstm-img"
                  :src="url"
                  >
                </el-image>
                GBmoney</h5>
            <el-menu
              default-active="2"
              class="cstm-menu el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#3D3E48"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <el-menu-item index="1">
                <i class="el-icon-user-solid"></i>
                <span>Профиль</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span>Лента</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-s-goods"></i>
                <span>Отчет по дням</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-date"></i>
                <span>Отчет по месяцам</span>
              </el-menu-item>
              <el-menu-item index="5">
                <i class="el-icon-s-data"></i>
                <span>История</span>
              </el-menu-item>
              <el-menu-item index="6">
                <i class="el-icon-s-tools"></i>
                <span>Настройки</span>
              </el-menu-item>
<!-- ЗАБЛОКИРОВАННЫЙ ПУНКТ МЕНЮ -->
              <!-- <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <span>Navigator Three</span>
              </el-menu-item> -->
<!-- ВЫПАДАЮЩИЙ ПУНКТ МЕНЮ -->
              <!-- <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>Navigator One</span>
                </template>
                <el-menu-item-group title="Group One">
                  <el-menu-item index="1-1">item one</el-menu-item>
                  <el-menu-item index="1-2">item one</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                  <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">item four</template>
                  <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-submenu>
              </el-submenu> -->
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>

      <el-container>
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

        <el-main class="cstm-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://oknanews.info/wp-content/uploads/2020/05/Coin-keeper.jpg'
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style>
html {
  line-height: 1.5;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  font-weight: normal;
}

body {
    margin: 0;
}

.cstm-container {
  height: 100vh;
}
.el-header {
  background-color: #4b4c55;
  color: #ffffff;
  line-height: 60px;
}
.cstm-header-right {
  text-align: right;
  font-size: 15px;
}

.el-icon-user-solid{
  margin-right: 10px;
  color: #ffffff;
}

.el-icon-setting {
  margin-right: 15px;
}

.el-aside {
  color: #333;
  background-color: #3D3E48;
  width: 100px;
}

.cstm-logo {
  margin: 0 auto;
  line-height: 60px;
  text-align: center;
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  background-color: #4b4c55;
}

.cstm-menu {
  border-right: solid 1px #3D3E48;
}

.cstm-main {
  background-color: #2C2E38;
  padding: 30px 80px;
}

.cstm-img {
  position: absolute;
  top: 10px;
  left: 17%;
  height: 40px;
  width: 40px;
  border-radius: 30%;
}

.cstm-dropdown {
  background: #4b4c55;
}

</style>
