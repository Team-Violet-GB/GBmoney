<template>
  <div class="block">
    <span class="demonstration"></span>
    <el-date-picker
      v-model="date"
      @change="$emit('changeDate',date)"
      type="date"
      format="dd-MM-yyyy"
      placeholder="Дата">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        date: Date.now(),
      };
    }
  };
</script>
