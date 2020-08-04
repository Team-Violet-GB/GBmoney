<template>
    <div>
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 1)">1</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 2)">2</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 3)">3</el-button>
        </div>
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 4)">4</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 5)">5</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 6)">6</el-button>
        </div>
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 7)">7</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 8)">8</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 9)">9</el-button>
        </div>
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 'delete')"><i class="el-icon-delete-solid"></i></el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 0)">0</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('clickNumber', 'back')"><i class="el-icon-back"></i></el-button>
        </div>
    </div>
</template>

<script>
  export default {
    props: ['list', 'idSelected', 'withEmptySelect'],
    data() {
      return {
        selectedID: this.idSelected,
        poinList: this.list
      }
    },
    watch: {
      idSelected(id) {
        this.selectedID = id
      },
      list(list) {
        this.poinList = list
      }
    },
  }
</script>


<style scoped lang="scss">
    .cstm-row-number {
        display: flex;
        .cstm-button-numbers {
            border-radius: 0;
            font-size: 20px;
            margin-top: 7px;
            width: 100px;
            text-align: center;
            background-color: #5f6068;
            &:hover { 
            filter: brightness(120%);
            }
        }
    }
</style>