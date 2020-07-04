<template>
  <el-aside>
    <el-row class="tac">
      <el-col :span="24">
        <h5 class="cstm-logo">
          <el-image class="cstm-img" :src="url"></el-image>GBmoney
        </h5>
        <el-menu
          default-active="2"
          class="cstm-menu el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#3D3E48"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <router-link
            v-for="(link, index) in links"
            :key="index"
            :to=link.url
            tag="el-menu-item"
            active-class="is-active"
            exact
          >
            <i :class=link.class></i>
            <span>{{ link.title }}</span>
          </router-link>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://oknanews.info/wp-content/uploads/2020/05/Coin-keeper.jpg',
      links: [
        { title: 'Главная', url: '/', class: 'el-icon-star-on' },
        { title: 'Профиль', url: '/user', class: 'el-icon-user-solid' },
        { title: 'Лента', url: '/2', class: 'el-icon-menu' },
        { title: 'Отчет по дням', url: '/3', class: 'el-icon-s-goods' },
        { title: 'Отчет по месяцам', url: '/4', class: 'el-icon-date' },
        { title: 'История', url: '/5', class: 'el-icon-s-data' },
        { title: 'Настройки', url: '/6', class: 'el-icon-s-tools' }
      ]
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

<style scoped>
.el-aside {
  color: #333;
  background-color: #3d3e48;
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
  border-right: solid 1px #3d3e48;
}

.cstm-img {
  position: absolute;
  top: 10px;
  left: 17%;
  height: 40px;
  width: 40px;
  border-radius: 30%;
}

.is-active {
  color: rgb(255, 208, 75) !important;
  background-color: rgb(49, 50, 58) !important;
}

</style>
