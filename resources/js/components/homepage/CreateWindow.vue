<template>
    <div>
        <!-- Модальное окно  -->
        <el-drawer
        :title="transactionData.from + ' -> ' + transactionData.to"
        :visible.sync="drawer"
        :direction="direction"
        size="50%"
        :before-close="handleClose">
        <span>Hi, there!</span>
        </el-drawer>
    </div>
</template>

<script>
  export default {
    props: ['transactionData'],
    data() {
      return {
        direction: 'btt',
      };
    },

    computed: {
        drawer() {
              return this.transactionData.state_window
        }
    },
    methods: {
      handleClose(done) {
        this.$emit('closeCreateWindow')
      }
    },
  };
</script>