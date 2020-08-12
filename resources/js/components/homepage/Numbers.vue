<template>
    <div class="cstm-numbers-component">
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 1)">1</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 2)">2</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 3)">3</el-button>
        </div>
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 4)">4</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 5)">5</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 6)">6</el-button>
        </div>
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 7)">7</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 8)">8</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 9)">9</el-button>
        </div>
        <div class="cstm-row-number">
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 'delete')"><i class="el-icon-delete-solid"></i></el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 0)">0</el-button>
          <el-button class="cstm-button-numbers" type="info" @click="$emit('click-number', 'back')"><i class="el-icon-back"></i></el-button>
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
    .cstm-numbers-component{
        margin-top: 13px;
    }
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