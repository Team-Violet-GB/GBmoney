<template>
  <div class="cstm-point">
    <div class="cstm-head-point" @click="dialogVisible = true">Добавить</div>
      <el-button
          type="el-icon-search"
          icon="el-icon-plus"
          circle
          class="cstm-icon-point cstm-icon-point-add"
          @click="dialogVisible = true"
      ></el-button>
      <el-dialog
          title="Добавить"
          :visible.sync="dialogVisible"
          width="30%"
          >
          <el-input placeholder="Введите название" v-model="name"></el-input>
          <br><br>
          <div align="center">
              <el-radio-group v-model="choose">

                  <el-radio-button
                      class="cstm-radio-gap"
                      :label="elem"
                      v-for="elem in element"
                      :key="elem"
                  >
                      <i :class="elem"></i>
                  </el-radio-button>

              </el-radio-group>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Отмена</el-button>
            <el-button type="primary" @click="[dialogVisible = false, send()]">Подтвердить</el-button>
          </span>
      </el-dialog>
  </div>
</template>


<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                name: '',
                element: [
                    'el-icon-phone-outline',
                    'el-icon-star-off',
                    'el-icon-goods',
                    'el-icon-camera',
                    'el-icon-s-order',
                    'el-icon-s-platform',
                    'el-icon-s-promotion',
                    'el-icon-s-home',
                    'el-icon-s-ticket',
                    'el-icon-s-open',
                    'el-icon-s-shop',
                    'el-icon-s-marketing',
                    'el-icon-s-comment',
                    'el-icon-s-finance',
                    'el-icon-s-custom',
                    'el-icon-s-opportunity',
                    'el-icon-date',
                    'el-icon-edit',
                    'el-icon-tickets',
                    'el-icon-printer',
                    'el-icon-paperclip',
                    'el-icon-monitor',
                    'el-icon-mobile',
                    'el-icon-mouse',
                    'el-icon-collection',
                    'el-icon-notebook-1',
                    'el-icon-school',
                    'el-icon-table-lamp',
                    'el-icon-house',
                    'el-icon-shopping-cart-full',
                    'el-icon-sell',
                    'el-icon-present',
                    'el-icon-box',
                    'el-icon-bank-card',
                    'el-icon-money',
                    'el-icon-wallet',
                    'el-icon-discount',
                    'el-icon-bangzhu',
                    'el-icon-first-aid-kit',
                    'el-icon-discover',
                    'el-icon-watch',
                    'el-icon-service',
                    'el-icon-mobile-phone',
                    'el-icon-bicycle',
                    'el-icon-basketball',
                    'el-icon-food',
                    'el-icon-chicken',
                    'el-icon-knife-fork',
                    'el-icon-coffee',
                    'el-icon-ice-tea'
                ],
                choose: ''
            };
        },
        methods: {
            send () {
              alert('Название ' + this.name + ' выбрана картинка ' + this.choose )
            },
            renderImage(className) {
                return `<i class="${className}"></i>`
            }
        }
    };
</script>

<style scoped>
.cstm-point {
  margin-bottom: 10px;
  flex-basis: 15%;
  position: relative;
  margin-right: 0.72%;
  margin-left: 0.72%;
}

.cstm-head-point {
  color: #ffffff;
  text-align: center;
  padding-bottom: 4px;
  font-weight: 300;
}

.cstm-icon-point {
  font-size: 50px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  cursor: grab;
}

.cstm-icon-point-add {
  background-color: #3d3e48;
  color: #ffffff;
}

.cstm-radio-gap {
    margin: 2px;
    border-left: 1px solid #e6e6e6;
}

.cstm-radio-gap:first-child {
    border-left: none;
}
</style>
