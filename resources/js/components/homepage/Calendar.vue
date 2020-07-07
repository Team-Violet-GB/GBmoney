<template>
  <div class="block">
    <span class="demonstration"></span>
    <el-date-picker
      v-model="value"
      type="date"
      placeholder="Дата">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: Date.now(),
      };
    }
  };
</script>

<style>
 .el-date-editor {
     margin-top: 20px;
     position: relative;
 }
 .el-date-picker {  
     background-color: #2c2e38;
     color: #ffffff;
     border: none;
 }

 .el-date-picker__header button {
     color: #ffffff;
 }

</style>