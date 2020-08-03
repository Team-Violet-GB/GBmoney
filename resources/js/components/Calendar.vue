<template>
  <div class="options">
    <span class="demonstration"></span>
    <el-date-picker
      v-model="dateSelect"
      @change="$emit('changeDate', dateSelect)"
      type="date"
      format="dd-MM-yyyy"
      value-format="yyyy-MM-dd"
      placeholder="Дата">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    props: ['date'],
    data() {
      return {
        dateSelect: this.date,
      }
    },

    watch: {
      date(newDate) {
        this.dateSelect = newDate
      }
    }
  }
</script>
